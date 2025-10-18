// services/importLocalFile.service.ts
import { exiftool } from 'exiftool-vendored';
import path from 'node:path';
import * as mediaItemRepo from '../repositories/mediaItem.repo';
import { toIsoString } from '../utilities/exifUtils';
import { PhotoState } from '../types';

export async function importLocalFile(absPath: string) {

  const tags = await exiftool.read(absPath);

  // Promoted fields you actively use now
  const creationTime =
    toIsoString(tags.DateTimeOriginal) ??
    toIsoString(tags.CreateDate) ??
    undefined;

  const lastModified = toIsoString(tags.FileModifyDate);

  const create = {
    uniqueId: absPath, // or your hash
    googleMediaItemId: 'local:' + absPath, // if applicable
    fileName: path.basename(absPath),
    googleAlbumId: 'local-import',
    googleAlbumName: 'Local Imports',
    filePath: absPath,
    mimeType: tags.MIMEType,

    creationTime,
    lastModified,

    exif: {
      takenAt: toIsoString(tags.DateTimeOriginal),
      exifModifiedAt: toIsoString(tags.ModifyDate),
      fileModifiedAt: toIsoString(tags.FileModifyDate),
      offsetTime: tags.OffsetTime,
      offsetTimeOriginal: tags.OffsetTimeOriginal,
      offsetTimeDigitized: tags.OffsetTimeDigitized,
      imageWidth: tags.ImageWidth ?? tags.ExifImageWidth,
      imageHeight: tags.ImageHeight ?? tags.ExifImageHeight,
      orientation: typeof tags.Orientation === 'number' ? tags.Orientation : undefined,
      fNumber: tags.FNumber,
      exposureTime: tags.ExposureTime, // keep as string for now
      iso: tags.ISO,
      focalLengthMm: tags.FocalLength,
      focalLength35mm: tags.FocalLengthIn35mmFormat,
      gpsLatitude: tags.GPSLatitude,
      gpsLongitude: tags.GPSLongitude,
      gpsAltitudeM: tags.GPSAltitude,
      gpsAltitudeRef: tags.GPSAltitudeRef,
      gpsDateTime: toIsoString(tags.GPSDateTime),
      gpsImgDirectionDeg: tags.GPSImgDirection,
      gpsImgDirectionRef: tags.GPSImgDirectionRef,
      gpsSpeed: tags.GPSSpeed,
      gpsSpeedRef: tags.GPSSpeedRef,
      city: '',
      state: '',
      country: '',
    },

    exifMeta: {
      readAtIso: new Date().toISOString(),
      tool: 'exiftool-vendored',
      toolVersion: (await exiftool.version()).toString?.(),
      schemaVersion: 1,
      // sourcePathHash: sha1(absPath), // optional
    },

    peopleRetrievedFromGoogle: false,
    people: [] as any[],
    keywordNodeIds: [] as string[],
    photoState: PhotoState.Unreviewed,
    albumNodeId: 'local',
  };

  return mediaItemRepo.insert(create, { includeExif: false });
}
