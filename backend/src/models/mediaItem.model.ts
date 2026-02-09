import { Schema, model, Types } from 'mongoose';
import { ExifSchema, ExifMetaSchema, ExifMetaStored, ExifStored } from './exif.model';
import { PhotoState } from '@shared/types/enums';

// DEBUG — verify what file is being loaded and what it exports
// eslint-disable-next-line @typescript-eslint/no-var-requires
console.log('Resolved @shared/types/enums =', require.resolve('@shared/types/enums'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
console.log('Module exports =', require('@shared/types/enums'));

export const MediaitemSchema = new Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    source: {
      type: String,
      required: true,
      enum: ['canon', 'google', 'local'],
      default: 'local',
    },
    contentHash: { type: String },
    googleMediaItemId: { type: String, default: '' },
    fileName: { type: String, required: true },
    filePath: { type: String, default: '' },
    url: { type: String },
    mimeType: { type: String },
    googleAlbumId: {
      type: String,
      default: null,
      set: (v: unknown) => (v == null ? null : (typeof v === 'boolean' ? null : String(v))),
    },
    googleAlbumName: {
      type: String,
      default: null,
      set: (v: unknown) => (v == null ? null : (typeof v === 'boolean' ? null : String(v))),
    },

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
    importRun: { type: String },
  },
  { timestamps: true }
);

MediaitemSchema.index({ importRun: 1 });

// ---- Stored doc type that matches the schema ----
export interface MediaItemStored {
  _id: Types.ObjectId;

  uniqueId: string;
  source: 'canon' | 'google' | 'local';
  contentHash?: string;
  googleMediaItemId: string;
  fileName: string;
  filePath: string;         // default '' if not provided
  url?: string;
  mimeType?: string;
  googleAlbumId: string | null;
  googleAlbumName: string | null;

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
  importRun?: string;

  createdAt?: Date;         // added by { timestamps: true }
  updatedAt?: Date;         // added by { timestamps: true }
}

export const MediaItemModel = model<MediaItemStored>('mediaitems', MediaitemSchema);
