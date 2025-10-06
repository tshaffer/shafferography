import { Derivative, MediaItem } from "../types";
import mongoose, { Schema, Types } from "mongoose";

// import * as mongoose from 'mongoose';
// const Schema = mongoose.Schema;

const DerivativeSchema = new Schema<Derivative>({
  label: { type: String, required: true },
  format: { type: String, enum: ["heic", "jpeg", "jpg", "png"], required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  mimeType: { type: String, required: true },
  absPath: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  markPreferred: { type: Boolean, default: false },
});

// export interface MediaItem {
//   _id: Types.ObjectId;
//   original: {
//     absPath: string;
//     width: number;
//     height: number;
//     mimeType: string;
//   };
//   derivatives: Derivative[];
//   preferredDerivativeId?: Types.ObjectId | null;
// }

// const MediaItemSchema = new Schema<MediaItem>({
//   original: {
//     absPath: { type: String, required: true },
//     width: { type: Number, required: true },
//     height: { type: Number, required: true },
//     mimeType: { type: String, required: true },
//   },
//   derivatives: { type: [DerivativeSchema], default: [] },
//   preferredDerivativeId: { type: Schema.Types.ObjectId, default: null },
// });

const MediaitemSchema = new Schema<MediaItem>({
  uniqueId: { type: String, required: true, unique: true },
  googleMediaItemId: { type: String, required: true },
  fileName: { type: String, required: true },
  googleAlbumId: { type: String, required: true },
  googleAlbumName: { type: String, required: true },

  // original version
  filePath: { type: String, default: '' },
  url: { type: String },
  width: { type: Number },
  height: { type: Number },
  mimeType: { type: String },

  creationTime: { type: String },
  lastModified: { type: String },
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
  people: [{ name: String, default: '' }],
  keywordNodeIds: [String],
  photoState: { type: String, required: true },
  albumNodeId: { type: String, required: true },
  undecidedGroupId: { type: String },
  notes: { type: String },

  // support for variants
  derivatives: { type: [DerivativeSchema], default: [] },
  preferredDerivativeId: { type: Schema.Types.ObjectId, default: null },

});

export default MediaitemSchema;
// export const MediaItemModel =
//   mongoose.models.MediaItem || mongoose.model<MediaItem>("MediaItem", MediaitemSchema);