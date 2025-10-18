// models/exif.model.ts
import { Schema } from 'mongoose';

export const ExifSchema = new Schema(
  {
    // Timestamps
    takenAt: String,
    exifModifiedAt: String,
    fileModifiedAt: String,

    // Timezone offsets
    offsetTime: String,
    offsetTimeOriginal: String,
    offsetTimeDigitized: String,

    // Dimensions / orientation
    imageWidth: Number,
    imageHeight: Number,
    orientation: { type: Number, default: 0 },

    // Exposure / optics
    fNumber: Number,
    exposureTime: String,     // You can switch to Number seconds later if you prefer
    iso: Number,
    focalLengthMm: Number,
    focalLength35mm: Number,

    // GPS
    gpsLatitude: Number,
    gpsLongitude: Number,
    gpsAltitudeM: Number,
    gpsAltitudeRef: String,
    gpsDateTime: String,
    gpsImgDirectionDeg: Number,
    gpsImgDirectionRef: String,
    gpsSpeed: Number,
    gpsSpeedRef: String,

    // Place naming
    city: String,
    state: String,
    country: String,
  },
  { _id: false }
);

export const ExifMetaSchema = new Schema(
  {
    readAtIso: { type: String, required: true },     // when EXIF was read
    tool: { type: String, required: true },          // e.g., "exiftool-vendored"
    toolVersion: String,
    schemaVersion: { type: Number, required: true }, // bump when you change ExifSchema meaning
    sourcePathHash: String,                          // optional integrity hook
  },
  { _id: false }
);

export interface ExifStored {
  // Timestamps (ISO strings)
  takenAt?: string;
  exifModifiedAt?: string;
  fileModifiedAt?: string;

  // Timezone offsets
  offsetTime?: string;
  offsetTimeOriginal?: string;
  offsetTimeDigitized?: string;

  // Dimensions / orientation
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;

  // Exposure / optics
  fNumber?: number;
  exposureTime?: string; // as stored in schema
  iso?: number;
  focalLengthMm?: number;
  focalLength35mm?: number;

  // GPS
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitudeM?: number;
  gpsAltitudeRef?: string;
  gpsDateTime?: string;
  gpsImgDirectionDeg?: number;
  gpsImgDirectionRef?: string;
  gpsSpeed?: number;
  gpsSpeedRef?: string;

  // Place naming
  city?: string;
  state?: string;
  country?: string;
}

export interface ExifMetaStored {
  readAtIso: string;
  tool: string;
  toolVersion?: string;
  schemaVersion: number;
  sourcePathHash?: string;
}

