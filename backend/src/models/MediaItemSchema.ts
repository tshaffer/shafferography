import * as mongoose from 'mongoose';
import { PhotoState } from '../types';

const Schema = mongoose.Schema;

const MediaitemSchema = new Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    googleMediaItemId: { type: String, required: true },
    fileName: { type: String, required: true },
    googleAlbumId: { type: String, required: true },
    googleAlbumName: { type: String, required: true },
    filePath: { type: String, default: '' },
    url: { type: String },
    mimeType: { type: String },

    // EXIF subdocument (all EXIF/metadata-related fields live here)
    exif: {
      // Timestamps (ISO 8601 strings)
      takenAt: { type: String },             // DateTimeOriginal or CreateDate
      exifModifiedAt: { type: String },      // ModifyDate

      // Timezone offsets (verbatim EXIF values, if present)
      offsetTime: { type: String },          // OffsetTime
      offsetTimeOriginal: { type: String },  // OffsetTimeOriginal
      offsetTimeDigitized: { type: String }, // OffsetTimeDigitized

      // Dimensions (current vs original)
      imageWidth: { type: Number },          // ImageWidth (current/visible)
      imageHeight: { type: Number },         // ImageHeight (current/visible)
      exifImageWidth: { type: Number },      // ExifImageWidth (original)
      exifImageHeight: { type: Number },     // ExifImageHeight (original)
      orientation: { type: Number, default: 0 },

      // Exposure / optics
      fNumber: { type: Number },             // FNumber (e.g., 2.2)
      exposureTime: { type: String },        // ExposureTime (e.g., "1/203" or "0.005s")
      iso: { type: Number },                 // ISO
      focalLengthMm: { type: Number },       // FocalLength in mm (numeric)
      focalLength35mm: { type: Number },     // FocalLengthIn35mmFormat (numeric)

      // GPS (decimal degrees / meters, plus refs)
      gpsLatitude: { type: Number },         // GPSLatitude
      gpsLongitude: { type: Number },        // GPSLongitude
      gpsAltitudeM: { type: Number },        // GPSAltitude (meters)
      gpsAltitudeRef: { type: String },      // "Above Sea Level" / "Below Sea Level"
      gpsDateTime: { type: String },         // GPSDateTime (ISO 8601 UTC if normalized)
      gpsImgDirectionDeg: { type: Number },  // GPSImgDirection (bearing degrees)
      gpsImgDirectionRef: { type: String },  // "Magnetic North" / "True North"
      gpsSpeed: { type: Number },            // GPSSpeed (numeric)
      gpsSpeedRef: { type: String },         // "km/h", "m/s", "mph"

      // Human-readable place name (if embedded)
      city: { type: String },                // IPTC/XMP City
      state: { type: String },               // ProvinceState/State
      country: { type: String },             // Country or CountryCode (your choice to store)
    },

    peopleRetrievedFromGoogle: { type: Boolean, required: true },
    people: [
      {
        name: String, default: ''
      },
    ],
    keywordNodeIds: { type: [String], required: true, default: [] },
    photoState: { type: String, required: true, enum: [PhotoState.Unreviewed, PhotoState.Undecided, PhotoState.ReadyForUpload, PhotoState.Uploaded, PhotoState.Deleted, PhotoState.PendingEdits] },
    albumNodeId: { type: String, required: true },
    undecidedGroupId: { type: String },
    notes: { type: String },
  }
);

export default MediaitemSchema;
