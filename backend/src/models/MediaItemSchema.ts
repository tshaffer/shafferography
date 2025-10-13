import * as mongoose from 'mongoose';
import { PhotoState } from 'src';

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
    creationTime: { type: String },
    lastModified: { type: String },
    width: { type: Number },
    height: { type: Number },
    orientation: { type: Number, default: 0 },
    description: { type: String, default: '' },
    geoData: {
      altitude: { type: Number },
      latitude: { type: Number },
      latitudeSpan: { type: Number },
      longitude: { type: Number },
      longitudeSpan: { type: Number },
    },
    peopleRetrievedFromGoogle: { type: Boolean, required: true },
    people: [
      {
        name: String, default: ''
      },
    ],
    keywordNodeIds: { type: [String], required: true, default: [] },
    photoState: { type: String, required: true, enum: [PhotoState.Unreviewed, PhotoState.ReadyForReview, PhotoState.ReadyForUpload, PhotoState.UploadedToGoogle] },
    albumNodeId: { type: String, required: true },
    undecidedGroupId: { type: String },
    notes: { type: String },
  }
);

export default MediaitemSchema;
