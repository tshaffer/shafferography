// services/importLocal.service.ts
import path from 'path';
import * as fse from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { exiftool, Tags } from 'exiftool-vendored';

import * as mediaItemRepo from '../repositories/mediaItem.repo';
import { pickCity, pickState, reverseGeocode, toIsoString } from '../utilities/exifUtils';
import { BASE_MEDIA_PATH, BASE_MEDIA_URL } from '../config';
import { convertHEICFileToJPEGWithEXIF, getLastModifiedUTCISO, isImageFile } from '../utilities';
import { CreateMediaItemInput } from '../domain/mediaItem.types';
import { MediaItemStored } from '../models/mediaItem.model';
import { MediaItem, MediaItemPropertiesFromExif } from '@shared/types/mediaItem';
import { PhotoState } from '@shared/types/enums';

export interface FileToImport {
  name: string;         // original filename
  type: string;         // mime (e.g., "image/heic")
  lastModified: number; // epoch millis
}

export type FileStatus = {
  status: 'processing' | 'completed' | 'conversion failed';
  filename: string;
}

type ImportStatus = {
  [importId: string]: {
    files: FileStatus[];
  }
};

// ---------- In-memory progress tracker (kept just like before) ----------
const processingStatuses: ImportStatus = {};

// ---------- Helpers ----------
async function buildMediaItemFromLocal(
  filePath: string,
  albumNodeId: string,
  isoLastModified: string,
  googleAlbumName = '',
  googleAlbumId = ''
): Promise<CreateMediaItemInput> {
  // Read Exif
  const tags: Tags = await exiftool.read(filePath);

  // creation time (old logic: DateTimeOriginal/CreateDate)
  const creationTime =
    toIsoString(tags.DateTimeOriginal) ??
    toIsoString(tags.CreateDate) ??
    undefined;

  // human place
  const gpsLatitude = tags.GPSLatitude;
  const gpsLongitude = tags.GPSLongitude;
  const addr = await reverseGeocode(gpsLatitude, gpsLongitude);
  const city = addr ? pickCity(addr) : undefined;
  const state = addr ? pickState(addr) : undefined;
  const country = addr?.country;

  const relativePath = filePath.replace(BASE_MEDIA_PATH, '');
  const url = `${BASE_MEDIA_URL}/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;

  // Width/height: prefer “visible” ImageWidth/ImageHeight, fallback to ExifImage*
  const width = (tags.ImageWidth as number | undefined) ?? (tags.ExifImageWidth as number | undefined);
  const height = (tags.ImageHeight as number | undefined) ?? (tags.ExifImageHeight as number | undefined);

  const create: CreateMediaItemInput = {
    uniqueId: uuidv4(),
    googleMediaItemId: '',
    fileName: path.basename(filePath),
    googleAlbumId,
    googleAlbumName,
    filePath,
    url,
    mimeType: (tags.MIMEType as string | undefined) ?? undefined,
    creationTime,
    lastModified: isoLastModified,
    // width,
    // height,
    // orientation: typeof tags.Orientation === 'number' ? tags.Orientation : undefined,

    // Newer schema fields you’ve adopted:
    exif: <MediaItemPropertiesFromExif>{
      takenAt: toIsoString(tags.DateTimeOriginal),
      exifModifiedAt: toIsoString(tags.ModifyDate),
      fileModifiedAt: toIsoString(tags.FileModifyDate),
      offsetTime: tags.OffsetTime,
      offsetTimeOriginal: tags.OffsetTimeOriginal,
      offsetTimeDigitized: tags.OffsetTimeDigitized,
      imageWidth: width,
      imageHeight: height,
      orientation: typeof tags.Orientation === 'number' ? tags.Orientation : undefined,
      fNumber: tags.FNumber,
      exposureTime: tags.ExposureTime, // string
      iso: tags.ISO,
      focalLengthMm: tags.FocalLength,
      focalLength35mm: tags.FocalLengthIn35mmFormat,
      gpsLatitude: tags.GPSLatitude,
      gpsLongitude: tags.GPSLongitude,
      gpsAltitudeM: tags.GPSAltitude,
      gpsAltitudeRef: tags.GPSAltitudeRef?.toString() ?? "",
      gpsDateTime: toIsoString(tags.GPSDateTime),
      gpsImgDirectionDeg: tags.GPSImgDirection,
      gpsImgDirectionRef: tags.GPSImgDirectionRef,
      gpsSpeed: tags.GPSSpeed,
      gpsSpeedRef: tags.GPSSpeedRef,
      city,
      state,
      country,
    },

    exifMeta: {
      readAtIso: new Date().toISOString(),
      tool: 'exiftool-vendored',
      toolVersion: (await exiftool.version()).toString?.(),
      schemaVersion: 1,
    },

    // legacy fields you still use
    peopleRetrievedFromGoogle: false,
    people: [] as any[],
    keywordNodeIds: [] as string[],
    photoState: PhotoState.Unreviewed,
    albumNodeId,
  };

  return create;
}

// ---------- Public: single-file import (keeps your newer design) ----------
export async function importLocalFile(absPath: string, albumNodeId = 'local'): Promise<MediaItem> {
  const isoLastModified = getLastModifiedUTCISO(absPath);
  const mediaItem: CreateMediaItemInput = await buildMediaItemFromLocal(absPath, albumNodeId, isoLastModified);
  return mediaItemRepo.insert(mediaItem, { includeExif: false });
}

// ---------- Public: folder import with status tracking & HEIC conversion ----------
export async function startDirectoryImport(params: {
  baseDirectory: string;
  albumNodeId: string;
  files: FileToImport[];
  googleAlbumName?: string; // for takeout parity (optional / stub)
  googleAlbumId?: string;   // for takeout parity (optional / stub)
}) {
  const importId = uuidv4();
  const {
    baseDirectory,
    albumNodeId,
    files,
    googleAlbumName = '',
    googleAlbumId = '',
  } = params;

  // Seed status
  processingStatuses[importId] = {
    files: files.map(f => ({
      filename: f.name,
      status: f.type?.toLowerCase?.().includes('heic') ? 'processing' : 'completed',
    })),
  };

  // Kick off the work (don’t await — like your old endpoint)
  (async () => {
    for (const file of files) {
      const fileEntry = processingStatuses[importId]?.files.find(s => s.filename === file.name);
      const inputPath = path.join(baseDirectory, file.name);
      const ext = path.extname(inputPath);

      try {
        let finalPath = inputPath;

        // HEIC/HEIF → JPEG+EXIF
        if (ext.toLowerCase() === '.heic' || ext.toLowerCase() === '.heif') {
          const newName = path.basename(inputPath, ext) + '.jpg';
          const outPath = path.join(path.dirname(inputPath), newName);

          try {
            console.log('importLocal.service.ts: Converting HEIC file:', inputPath, '→', outPath);
            await convertHEICFileToJPEGWithEXIF(inputPath, outPath);
            console.log('importLocal.service.ts: HEIC conversion completed:', outPath);
            finalPath = outPath;
            if (fileEntry) fileEntry.status = 'completed';
          } catch (err) {
            if (fileEntry) fileEntry.status = 'conversion failed';
            // Skip inserting this one
            // eslint-disable-next-line no-console
            console.error('HEIC conversion failed:', inputPath, err);
            continue;
          }
        }

        // Filter to images
        if (!isImageFile(finalPath)) continue;

        const isoLastModified =
          file.lastModified
            ? DateTime.fromMillis(file.lastModified, { zone: 'utc' }).toISO()
            : getLastModifiedUTCISO(finalPath);

        const mediaItem = await buildMediaItemFromLocal(
          finalPath,
          albumNodeId,
          isoLastModified,
          googleAlbumName,
          googleAlbumId
        );

        await mediaItemRepo.insert(mediaItem, { includeExif: false });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Import error for', file.name, err);
      }
    }

    // Optional: run “merge people” step for Google Takeout dirs (kept as a no-op / TODO here)
    // if (isImportFromTakeout(baseDirectory)) {
    //   await mergePeople(BASE_MEDIA_PATH, googleAlbumName);
    // }
  })().catch(err => console.error('startDirectoryImport task error:', err));

  return { importId };
}

export function getImportStatus(importId: string): FileStatus[] {
  const importStatus = processingStatuses[importId] || { files: [] as FileStatus[] };
  return importStatus.files;
}

// ---------- Public: reimport (refresh JPEG from HEIC if present, then refresh DB fields) ----------
export async function reimportOneMediaItem(params: {
  uniqueId: string;
}): Promise<MediaItemStored> {
  const current = await mediaItemRepo.getByUniqueId(params.uniqueId);
  if (!current) return null;

  const mediaFilePath: string = current.filePath;
  const ext = path.extname(mediaFilePath);
  const dir = path.dirname(mediaFilePath);
  const heicPath = path.join(dir, path.basename(mediaFilePath, ext) + '.heic');

  if (fse.existsSync(heicPath)) {
    try {
      await convertHEICFileToJPEGWithEXIF(heicPath, mediaFilePath);
    } catch (err) {
      console.error('Error converting HEIC→JPEG during reimport:', err);
    }
  } else {
    // Not fatal; just proceed to refresh fields
    console.warn('HEIC file does not exist for reimport:', heicPath);
  }

  // Refresh exif-derived fields
  const tags: Tags = await exiftool.read(mediaFilePath);

  const updates: any = {
    width: (tags.ImageWidth as number | undefined) ?? (tags.ExifImageWidth as number | undefined),
    height: (tags.ImageHeight as number | undefined) ?? (tags.ExifImageHeight as number | undefined),
    creationTime: toIsoString(tags.DateTimeOriginal) ?? toIsoString(tags.CreateDate) ?? undefined,
    lastModified: getLastModifiedUTCISO(mediaFilePath),
    orientation: typeof tags.Orientation === 'number' ? tags.Orientation : undefined,
    exif: {
      ...current.exif,
      exifModifiedAt: toIsoString(tags.ModifyDate),
      fileModifiedAt: toIsoString(tags.FileModifyDate),
      imageWidth: (tags.ImageWidth as number | undefined) ?? (tags.ExifImageWidth as number | undefined),
      imageHeight: (tags.ImageHeight as number | undefined) ?? (tags.ExifImageHeight as number | undefined),
    },
  };

  // repo should offer an update-by-uniqueId
  await mediaItemRepo.updateByUniqueId(params.uniqueId, updates);

  // return the refreshed doc
  return mediaItemRepo.getByUniqueId(params.uniqueId);
}
