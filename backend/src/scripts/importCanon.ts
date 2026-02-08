// scripts/importCanon.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { exiftool, Tags } from 'exiftool-vendored';

import { connectDB } from '../config/db';
import { CANON_MEDIA_PATH, CANON_MEDIA_URL } from '../config';
import { getMediaItemModel } from '../models/getMediaItemModel';
import { connection } from '../config';
import { PhotoState } from '@shared/types/enums';
import type { CreateMediaItemInput } from '../domain/mediaItem.types';
import type { MediaItemPropertiesFromExif } from '@shared/types/mediaItem';
import * as mediaItemRepo from '../repositories/mediaItem.repo';
import { getLastModifiedUTCISO } from '../utilities';
import { pickCity, pickState, reverseGeocode, toIsoString } from '../utilities/exifUtils';

const HASHED_FILENAME_RE = /^([0-9a-fA-F]{64})\.([^./\\]+)$/;

type CliArgs = {
  canonDir: string;
  albumNodeId: string;
  googleAlbumId: string;
  googleAlbumName: string;
  dryRun: boolean;
  limit?: number;
  since?: Date;
  noGeocode: boolean;
};

function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i];
    if (!raw.startsWith('--')) continue;
    const key = raw.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }

  const canonDir = (args.canonDir as string) || CANON_MEDIA_PATH;
  const albumNodeId = (args.albumNodeId as string) || '';
  const googleAlbumId = (args.googleAlbumId as string) || '';
  const googleAlbumName = (args.googleAlbumName as string) || '';
  const dryRun = Boolean(args.dryRun);
  const limit = args.limit ? Number(args.limit) : undefined;
  const since = args.since ? new Date(String(args.since)) : undefined;
  const noGeocode = Boolean(args.noGeocode);

  if (!albumNodeId) {
    throw new Error('Missing required --albumNodeId');
  }
  if (limit !== undefined && Number.isNaN(limit)) {
    throw new Error('Invalid --limit');
  }
  if (since && Number.isNaN(since.getTime())) {
    throw new Error('Invalid --since (expected ISO date string)');
  }

  return {
    canonDir,
    albumNodeId,
    googleAlbumId,
    googleAlbumName,
    dryRun,
    limit,
    since,
    noGeocode,
  };
}

async function walkDir(root: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

function toCanonUrl(filename: string): string {
  return `${CANON_MEDIA_URL.replace(/\/$/, '')}/${filename}`;
}

async function readSidecar(filePath: string): Promise<any | null> {
  const sidecarPath = `${filePath}.shafferography.json`;
  try {
    const raw = await fs.readFile(sidecarPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  await connectDB();
  const MediaItemModel = getMediaItemModel(connection);

  const files = await walkDir(args.canonDir);
  const mediaFiles = files.filter((file) => {
    const base = path.basename(file);
    if (base.endsWith('.shafferography.json')) return false;
    return HASHED_FILENAME_RE.test(base);
  });

  let scanned = 0;
  let imported = 0;
  let skippedExisting = 0;
  let updatedExisting = 0;
  let missingSidecar = 0;
  let exifErrors = 0;
  let geocodeSkipped = 0;
  let geocodeErrors = 0;
  let errors = 0;

  for (const filePath of mediaFiles) {
    if (args.limit !== undefined && scanned >= args.limit) break;

    scanned += 1;

    const base = path.basename(filePath);
    const match = base.match(HASHED_FILENAME_RE);
    if (!match) continue;

    const shaLower = match[1].toLowerCase();
    const ext = path.extname(base);
    const canonFileName = `${shaLower}${ext}`;

    try {
      const stat = await fs.stat(filePath);
      if (args.since && stat.mtime <= args.since) {
        continue;
      }

      const existing = await MediaItemModel.findOne({ contentHash: shaLower }).lean().exec();
      if (existing) {
        const updates: Record<string, unknown> = {};

        if (!existing.url) updates.url = toCanonUrl(canonFileName);
        if (!existing.filePath) updates.filePath = filePath;

        const sidecar = await readSidecar(filePath);
        if (!sidecar) missingSidecar += 1;

        const people: string[] = Array.isArray(sidecar?.people)
          ? sidecar.people.filter((p: unknown) => typeof p === 'string')
          : [];

        if (people.length > 0 && existing.peopleRetrievedFromGoogle === false) {
          updates.peopleRetrievedFromGoogle = true;
          updates.people = people.map((name) => ({ name }));
        }

        if (Object.keys(updates).length > 0) {
          if (args.dryRun) {
            updatedExisting += 1;
            console.log(`DRY RUN update existing contentHash ${shaLower} uniqueId=${existing.uniqueId}`);
          } else {
            await MediaItemModel.updateOne({ _id: existing._id }, { $set: updates }).exec();
            updatedExisting += 1;
            console.log(`UPDATED existing contentHash ${shaLower} uniqueId=${existing.uniqueId}`);
          }
        } else {
          skippedExisting += 1;
          console.log(`SKIP existing contentHash ${shaLower} uniqueId=${existing.uniqueId}`);
        }

        continue;
      }

      const sidecar = await readSidecar(filePath);
      if (!sidecar) missingSidecar += 1;

      const people: string[] = Array.isArray(sidecar?.people)
        ? sidecar.people.filter((p: unknown) => typeof p === 'string')
        : [];

      const fileName = sidecar?.original?.filename || canonFileName;
      const url = toCanonUrl(canonFileName);

      let tags: Tags | null = null;
      try {
        tags = await exiftool.read(filePath);
      } catch (err) {
        exifErrors += 1;
        console.error(`EXIF read failed for ${filePath}:`, err);
      }

      const creationTime =
        toIsoString(tags?.DateTimeOriginal) ??
        toIsoString(tags?.CreateDate) ??
        undefined;

      const width = (tags?.ImageWidth as number | undefined) ?? (tags?.ExifImageWidth as number | undefined);
      const height = (tags?.ImageHeight as number | undefined) ?? (tags?.ExifImageHeight as number | undefined);

      let city: string | undefined;
      let state: string | undefined;
      let country: string | undefined;

      const gpsLatitude = tags?.GPSLatitude as number | undefined;
      const gpsLongitude = tags?.GPSLongitude as number | undefined;

      if (args.noGeocode) {
        if (gpsLatitude != null && gpsLongitude != null) geocodeSkipped += 1;
      } else if (gpsLatitude != null && gpsLongitude != null) {
        try {
          const addr = await reverseGeocode(gpsLatitude, gpsLongitude);
          city = addr ? pickCity(addr) : undefined;
          state = addr ? pickState(addr) : undefined;
          country = addr?.country;
        } catch (err) {
          geocodeErrors += 1;
          console.error(`Geocode failed for ${filePath}:`, err);
        }
      }

      const exif: MediaItemPropertiesFromExif | undefined = tags
        ? {
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
          exposureTime: tags.ExposureTime,
          iso: tags.ISO,
          focalLengthMm: tags.FocalLength,
          focalLength35mm: tags.FocalLengthIn35mmFormat,
          gpsLatitude: tags.GPSLatitude,
          gpsLongitude: tags.GPSLongitude,
          gpsAltitudeM: tags.GPSAltitude,
          gpsAltitudeRef: tags.GPSAltitudeRef?.toString() ?? '',
          gpsDateTime: toIsoString(tags.GPSDateTime),
          gpsImgDirectionDeg: tags.GPSImgDirection,
          gpsImgDirectionRef: tags.GPSImgDirectionRef,
          gpsSpeed: tags.GPSSpeed,
          gpsSpeedRef: tags.GPSSpeedRef,
          city,
          state,
          country,
        }
        : undefined;

      const create: CreateMediaItemInput = {
        uniqueId: uuidv4(),
        source: 'canon',
        contentHash: shaLower,
        googleMediaItemId: `canon:${shaLower}`,
        fileName,
        googleAlbumId: null,
        googleAlbumName: null,
        filePath,
        url,
        mimeType: (tags?.MIMEType as string | undefined) ?? undefined,
        creationTime,
        lastModified: getLastModifiedUTCISO(filePath),
        exif,
        exifMeta: tags
          ? {
            readAtIso: new Date().toISOString(),
            tool: 'exiftool-vendored',
            toolVersion: (await exiftool.version()).toString?.(),
            schemaVersion: 1,
          }
          : undefined,
        peopleRetrievedFromGoogle: people.length > 0,
        people,
        keywordNodeIds: [],
        photoState: PhotoState.Unreviewed,
        albumNodeId: args.albumNodeId,
      };

      if (create.source === 'canon') {
        if (!create.googleMediaItemId.startsWith('canon:')) {
          throw new Error(`Invalid canon googleMediaItemId for ${filePath}`);
        }
        if (create.googleAlbumId !== null || create.googleAlbumName !== null) {
          throw new Error(`Canon items must have null googleAlbumId/googleAlbumName for ${filePath}`);
        }
      }

      if (args.dryRun) {
        imported += 1;
        console.log(`DRY RUN import contentHash ${shaLower} file=${base}`);
        continue;
      }

      await mediaItemRepo.insert(create, { includeExif: false });
      imported += 1;
      console.log(`IMPORTED contentHash ${shaLower} file=${base}`);
    } catch (err) {
      errors += 1;
      console.error(`ERROR importing ${filePath}:`, err);
    }
  }

  console.log('--- Canon import summary ---');
  console.log(`Scanned: ${scanned}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped existing: ${skippedExisting}`);
  console.log(`Updated existing: ${updatedExisting}`);
  console.log(`Missing sidecar: ${missingSidecar}`);
  console.log(`EXIF errors: ${exifErrors}`);
  console.log(`Geocode skipped: ${geocodeSkipped}`);
  console.log(`Geocode errors: ${geocodeErrors}`);
  console.log(`Errors: ${errors}`);

  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
