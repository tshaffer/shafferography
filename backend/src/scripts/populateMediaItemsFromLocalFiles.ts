/* eslint-disable no-console */

import dotenv from 'dotenv';
dotenv.config({
  path: require('path').resolve(__dirname, '../../.env'),
});

import path from 'path';
import * as fse from 'fs-extra';
import mongoose from 'mongoose';
import {
  ExifDateTime,
  exiftool,
  Tags
} from 'exiftool-vendored';

import { PersonInPhoto, PhotoState } from '../types';
import { connectDB } from '../config/db';
import { retrieveExifData } from '../utilities/exifUtils';
import { reverseGeotagExif, DbUpdatePayload } from './reverse-geotag-for-db';

export interface LegacyGeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export interface LegacyMediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string,
  url?: string,
  mimeType?: string,
  creationTime?: string,
  lastModified?: string,
  width?: number,
  height?: number
  orientation?: number,
  description?: string,
  geoData?: LegacyGeoData,
  people?: PersonInPhoto[],
  peopleRetrievedFromGoogle: boolean,
  keywordNodeIds: string[],
  photoState: PhotoState,
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;
}

export interface MappedExif {
  // Timestamps (ISO 8601 strings)
  takenAt?: string;         // from DateTimeOriginal/CreateDate
  fileModifiedAt?: string;  // from FileModifyDate (filesystem mtime via exiftool)
  exifModifiedAt?: string;  // from ModifyDate

  // Dimensions
  width?: number;           // ImageWidth (current/visible)
  height?: number;          // ImageHeight (current/visible)
  originalWidth?: number;   // ExifImageWidth (original capture)
  originalHeight?: number;  // ExifImageHeight (original capture)

  // Exposure / optics
  fNumber?: number;         // FNumber (e.g., 2.2)
  exposureTime?: string;    // ExposureTime (e.g., "1/203" or "0.50s")
  iso?: number;             // ISO
  focalLengthMm?: number;   // FocalLength in mm
  focalLength35mm?: number; // FocalLengthIn35mmFormat in mm

  // Human-readable place (if embedded)
  city?: string;            // City
  state?: string;           // Province-State / State
  country?: string;         // Country

  // GPS (decimal degrees / meters / degrees)
  gpsLatitude?: number;         // GPSLatitude
  gpsLongitude?: number;        // GPSLongitude
  gpsAltitudeM?: number;        // GPSAltitude (meters)
  gpsImgDirectionDeg?: number;  // GPSImgDirection (bearing)
}

/* ────────────────────────────────────────────────────────────
   CLI args
   ──────────────────────────────────────────────────────────── */
function parseArgs(): { file: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dryRun');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Usage: ts-node populateMediaItemsFromLocalFiles.ts /path/to/outputFile [--dryRun]');
    process.exit(1);
  }
  return { file: path.resolve(file), dryRun };
}

// ── helpers ──────────────────────────────────────────────────────────────

function hasToISOString(x: unknown): x is { toISOString: () => string } {
  return typeof x === "object" && x !== null && typeof (x as any).toISOString === "function";
}

function toIsoString(val: ExifDateTime | string | undefined): string | undefined {
  if (!val) return undefined;
  if (hasToISOString(val)) return val.toISOString();              // ExifDateTime → ISO
  if (typeof val === "string") {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  return undefined;
}

function toNumber(val: unknown): number | undefined {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export async function mapExifToMediaItem(tags: Tags): Promise<MappedExif> {
  // ---- timestamps
  const takenSource = (tags.DateTimeOriginal ?? tags.CreateDate) as ExifDateTime | string | undefined;
  const takenAt = toIsoString(takenSource);

  const fileModifiedAt = toIsoString(tags.FileModifyDate as ExifDateTime | string | undefined);
  const exifModifiedAt  = toIsoString(tags.ModifyDate      as ExifDateTime | string | undefined);

  // ---- dimensions (current vs original)
  const width  = toNumber(tags.ImageWidth);
  const height = toNumber(tags.ImageHeight);
  const originalWidth  = toNumber(tags.ExifImageWidth);
  const originalHeight = toNumber(tags.ExifImageHeight);

  // ---- exposure / optics
  const fNumber = toNumber(tags.FNumber);

  // ExposureTime can be "1/203" or numeric seconds
  const rawET = tags.ExposureTime as unknown;
  let exposureTime: string | undefined;
  if (typeof rawET === "string") {
    exposureTime = rawET; // already "1/203" etc.
  } else if (typeof rawET === "number") {
    exposureTime = rawET >= 1 ? `${rawET.toFixed(2)}s` : `1/${Math.round(1 / rawET)}`;
  }

  const iso = toNumber(tags.ISO);

  // Focal length
  const focalLengthMm = toNumber(tags.FocalLength); // number or "2.2 mm"
  const focalLength35mm = toNumber((tags as any).FocalLengthIn35mmFormat); // often "14 mm"

  // ---- human place (note the dashed key)
  const city = (tags.City as string | undefined)?.trim();
  const provinceState = ((tags as Record<string, unknown>)["Province-State"] as string | undefined)?.trim();
  const state = provinceState ?? (tags.State as string | undefined)?.trim();
  const country = (tags.Country as string | undefined)?.trim();

  // ---- GPS
  const gpsLatitude       = toNumber(tags.GPSLatitude);
  const gpsLongitude      = toNumber(tags.GPSLongitude);
  const gpsAltitudeM      = toNumber(tags.GPSAltitude);
  const gpsImgDirectionDeg = toNumber(tags.GPSImgDirection);

  const dbUpdatePayload: DbUpdatePayload = await reverseGeotagExif(tags);
  console.log('dbUpdatePayload:', dbUpdatePayload);

  return {
    // timestamps
    takenAt,
    fileModifiedAt,
    exifModifiedAt,

    // dimensions
    width,
    height,
    originalWidth,
    originalHeight,

    // exposure / optics
    fNumber,
    exposureTime,
    iso,
    focalLengthMm,
    focalLength35mm,

    // place
    city,
    state,
    country,

    // gps
    gpsLatitude,
    gpsLongitude,
    gpsAltitudeM,
    gpsImgDirectionDeg,
  };
}

const updateDb = async (legacyMediaItemsByUniqueId: { [key: string]: LegacyMediaItem }, dryRun: boolean) => {

  for (const legacyMediaItem of Object.values(legacyMediaItemsByUniqueId)) {
    const filePath = legacyMediaItem.filePath!;
    const tags: Tags = await retrieveExifData(filePath);
    // console.log('tags:', tags);
    const mappedExif: MappedExif = await mapExifToMediaItem(tags);
    console.log('mappedExif:', mappedExif);
  }
}

/* ────────────────────────────────────────────────────────────
   MAIN
   ──────────────────────────────────────────────────────────── */
(async () => {
  const { file, dryRun } = parseArgs();

  console.log('mongo uri is:');
  console.log(process.env.MONGO_URI);

  console.log(`Starting populateMediaItemsFromLocalFiles. dryRun=${dryRun}, file=${file}`);
  await connectDB();

  console.log('db connected');

  // read legacyMediaItemsByUniqueId from file
  const legacyMediaItemsByUniqueId: { [key: string]: LegacyMediaItem } = await fse.readJSON(file);
  console.log(`Read ${Object.keys(legacyMediaItemsByUniqueId).length} legacy media items from ${file}`);

  await updateDb(legacyMediaItemsByUniqueId, dryRun);

  console.log('Done.');
  await mongoose.disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('Sync failed:', err);
  try { await mongoose.disconnect(); } catch { }
  process.exit(1);
});
