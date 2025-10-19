import { Schema, model, Types } from 'mongoose';
import { ExifSchema, ExifMetaSchema, ExifMetaStored, ExifStored } from './exif.model';
import { PhotoState } from '../types';

export const MediaitemSchema = new Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    googleMediaItemId: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, default: '' },
    url: { type: String },
    mimeType: { type: String },
    googleAlbumId: { type: String, required: true },
    googleAlbumName: { type: String, required: true },

    // Promoted, query-friendly fields (fast filters/sorts)
    creationTime: { type: String },  // canonical, derived from EXIF/FS
    lastModified: { type: String },  // canonical, usually FS mtime

    // Subdocuments
    exif: { type: ExifSchema, required: false },
    exifMeta: { type: ExifMetaSchema, required: false },

    peopleRetrievedFromGoogle: { type: Boolean, required: true },
    people: [{ name: { type: String, default: '' } }],
    keywordNodeIds: { type: [String], required: true, default: [] },
    photoState: {
      type: String,
      required: true,
      enum: [
        PhotoState.Unreviewed,
        PhotoState.Undecided,
        PhotoState.ReadyForUpload,
        PhotoState.Uploaded,
        PhotoState.Deleted,
        PhotoState.PendingEdits,
      ],
    },
    albumNodeId: { type: String, required: true },
    undecidedGroupId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// ---- Stored doc type that matches the schema ----
export interface MediaItemStored {
  _id: Types.ObjectId;

  uniqueId: string;
  googleMediaItemId: string;
  fileName: string;
  filePath: string;         // default '' if not provided
  url?: string;
  mimeType?: string;
  googleAlbumId: string;
  googleAlbumName: string;

  creationTime?: string;
  lastModified?: string;

  exif?: ExifStored;
  exifMeta?: ExifMetaStored;

  peopleRetrievedFromGoogle: boolean;
  people: { name: string }[];
  keywordNodeIds: string[];
  photoState: PhotoState;
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;

  createdAt?: Date;         // added by { timestamps: true }
  updatedAt?: Date;         // added by { timestamps: true }
}

export const MediaItemModel = model<MediaItemStored>('mediaitems', MediaitemSchema);
