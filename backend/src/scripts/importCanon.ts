// scripts/importCanon.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { exiftool, Tags } from 'exiftool-vendored';

import { connectDB } from '../config/db';
import { CANON_MEDIA_URL, PHOTO_ARCHIVE_PATH } from '../config';
import { getMediaItemModel } from '../models/getMediaItemModel';
import { connection } from '../config';
import { PhotoState } from '@shared/types/enums';
import type { CreateMediaItemInput } from '../domain/mediaItem.types';
import type { MediaItemPropertiesFromExif } from '@shared/types/mediaItem';
import * as mediaItemRepo from '../repositories/mediaItem.repo';
import { findAlbumNodeByNameStrict, findOrCreateAlbumNodeUnderParent } from '../controllers/dbInterface';
import { getLastModifiedUTCISO } from '../utilities';
import { pickCity, pickState, reverseGeocode, toIsoString } from '../utilities/exifUtils';
import { parse } from 'csv-parse/sync';

type CliArgs = {
  runDir: string;
  albumNodeId?: string;
  albumName?: string;
  parentAlbumNodeName?: string;
  googleAlbumName?: string;
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

  const runDir = (args.runDir as string) || '';
  const albumNodeId = (args.albumNodeId as string | undefined) || undefined;
  const albumName = (args.albumName as string | undefined) || undefined;
  const parentAlbumNodeName = (args.parentAlbumNodeName as string | undefined) || undefined;
  const googleAlbumName = (args.googleAlbumName as string | undefined) || undefined;
  const dryRun = Boolean(args.dryRun);
  const limit = args.limit ? Number(args.limit) : undefined;
  const since = args.since ? new Date(String(args.since)) : undefined;
  const noGeocode = Boolean(args.noGeocode);

  if (albumNodeId && (albumName || parentAlbumNodeName)) {
    throw new Error('Use either --albumNodeId OR --albumName + --parentAlbumNodeName (not both)');
  }
  if ((albumName && !parentAlbumNodeName) || (!albumName && parentAlbumNodeName)) {
    throw new Error('Both --albumName and --parentAlbumNodeName are required together');
  }
  if (!runDir) {
    throw new Error('Missing required --runDir');
  }
  if (limit !== undefined && Number.isNaN(limit)) {
    throw new Error('Invalid --limit');
  }
  if (since && Number.isNaN(since.getTime())) {
    throw new Error('Invalid --since (expected ISO date string)');
  }

  return {
    runDir,
    albumNodeId,
    albumName,
    parentAlbumNodeName,
    googleAlbumName,
    dryRun,
    limit,
    since,
    noGeocode,
  };
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

  const manifestDir = path.join(PHOTO_ARCHIVE_PATH, 'MANIFESTS', args.runDir);
  const manifestPath = path.join(manifestDir, 'dedup_plan__unique.csv');
  const manifestRaw = await fs.readFile(manifestPath, 'utf8').catch(() => null);
  if (!manifestRaw) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  let finalAlbumNodeId: string | undefined;
  let albumMode = 'none (default local)';

  if (args.albumNodeId) {
    finalAlbumNodeId = args.albumNodeId;
    albumMode = `existing albumNodeId=${args.albumNodeId}`;
  } else if (args.albumName && args.parentAlbumNodeName) {
    const parent = await findAlbumNodeByNameStrict(args.parentAlbumNodeName);
    const resolved = await findOrCreateAlbumNodeUnderParent({
      albumName: args.albumName,
      parentAlbumNodeId: parent.albumNodeId,
    });
    finalAlbumNodeId = resolved.albumNodeId;
    albumMode = `findParentByName("${args.parentAlbumNodeName.trim()}") + findOrCreateChild("${args.albumName.trim()}")`;
  }

  const googleAlbumNameFinal = args.googleAlbumName?.trim();
  const googleAlbumNameForItems = googleAlbumNameFinal ? googleAlbumNameFinal : null;

  const records = parse(manifestRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<Record<string, string>>;

  const deduped: Array<Record<string, string>> = [];
  const seen = new Set<string>();

  for (const row of records) {
    const runLabel = row.runLabel?.trim();
    if (runLabel !== args.runDir) {
      throw new Error(`Manifest runLabel mismatch. Expected ${args.runDir}, got ${runLabel}`);
    }
    const sha = row.sha256?.trim();
    const ext = row.ext?.trim();
    if (!sha || !ext) continue;
    const key = `${sha}${ext}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }

  console.log(`Run dir: ${args.runDir}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Rows: ${records.length}; Deduped: ${deduped.length}`);
  console.log(
    `Album attachment: ${albumMode}; googleAlbumName: ${googleAlbumNameForItems ?? '(none)'}`
  );

  let scanned = 0;
  let imported = 0;
  let skippedExisting = 0;
  let updatedExisting = 0;
  let missingSidecar = 0;
  let missingCanonical = 0;
  let alreadyImported = 0;
  let exifErrors = 0;
  let geocodeSkipped = 0;
  let geocodeErrors = 0;
  let errors = 0;

  for (const row of deduped) {
    if (args.limit !== undefined && scanned >= args.limit) break;

    scanned += 1;

    const shaLower = row.sha256?.trim().toLowerCase();
    const extRaw = row.ext?.trim();
    if (!shaLower || !extRaw) continue;
    const ext = extRaw.startsWith('.') ? extRaw : `.${extRaw}`;
    const canonFileName = `${shaLower}${ext}`;
    const canonicalPath = path.join(PHOTO_ARCHIVE_PATH, 'CANONICAL/by-hash', canonFileName);
    const absPath = row.absPath?.trim();

    try {
      const stat = await fs.stat(canonicalPath).catch(() => null);
      if (!stat) {
        missingCanonical += 1;
        console.warn(`Missing canonical: ${canonFileName} canonicalPath=${canonicalPath} absPath=${absPath ?? ''}`);
        continue;
      }
      if (args.since && stat.mtime <= args.since) {
        continue;
      }

      const existing = await MediaItemModel.findOne({ contentHash: shaLower }).lean().exec();
      if (existing) {
        const updates: Record<string, unknown> = {};

        if (!existing.url) updates.url = toCanonUrl(canonFileName);
        if (!existing.filePath) updates.filePath = canonicalPath;

        const sidecar = await readSidecar(canonicalPath);
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

      const existingByPath = await MediaItemModel.findOne({ filePath: canonicalPath }).lean().exec();
      if (existingByPath) {
        alreadyImported += 1;
        console.log(`SKIP already imported filePath ${canonicalPath}`);
        continue;
      }

      const sidecar = await readSidecar(canonicalPath);
      if (!sidecar) missingSidecar += 1;

      const people: string[] = Array.isArray(sidecar?.people)
        ? sidecar.people.filter((p: unknown) => typeof p === 'string')
        : [];

      const fileName = sidecar?.original?.filename || canonFileName;
      const url = toCanonUrl(canonFileName);

      let tags: Tags | null = null;
      try {
        tags = await exiftool.read(canonicalPath);
      } catch (err) {
        exifErrors += 1;
        console.error(`EXIF read failed for ${canonicalPath}:`, err);
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
          console.error(`Geocode failed for ${canonicalPath}:`, err);
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
        googleAlbumName: googleAlbumNameForItems,
        filePath: canonicalPath,
        url,
        mimeType: (tags?.MIMEType as string | undefined) ?? undefined,
        creationTime,
        lastModified: getLastModifiedUTCISO(canonicalPath),
        importRun: args.runDir,
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
        albumNodeId: finalAlbumNodeId ?? 'local',
      };

      if (create.source === 'canon') {
        if (!create.googleMediaItemId.startsWith('canon:')) {
          throw new Error(`Invalid canon googleMediaItemId for ${canonicalPath}`);
        }
        if (create.googleAlbumId !== null) {
          throw new Error(`Canon items must have null googleAlbumId for ${canonicalPath}`);
        }
      }

      if (args.dryRun) {
        imported += 1;
        console.log(`DRY RUN import contentHash ${shaLower} file=${canonFileName}`);
        continue;
      }

      await mediaItemRepo.insert(create, { includeExif: false });
      imported += 1;
      console.log(`IMPORTED contentHash ${shaLower} file=${canonFileName}`);
    } catch (err) {
      errors += 1;
      console.error(`ERROR importing ${canonicalPath}:`, err);
    }
  }

  console.log('--- Canon import summary ---');
  console.log(`Scanned: ${scanned}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped existing: ${skippedExisting}`);
  console.log(`Updated existing: ${updatedExisting}`);
  console.log(`Missing sidecar: ${missingSidecar}`);
  console.log(`Missing canonical: ${missingCanonical}`);
  console.log(`Already imported: ${alreadyImported}`);
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
