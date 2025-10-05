import * as mongoose from 'mongoose';

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
    people: [{ name: String, default: '' }],
    keywordNodeIds: [String],
    photoState: { type: String, required: true },
    albumNodeId: { type: String, required: true },
    undecidedGroupId: { type: String },
    notes: { type: String },

    // Grouping
    familyRootId: { type: Schema.Types.ObjectId, required: true, index: true },
    derivedFrom: { type: Schema.Types.ObjectId, ref: 'MediaItem' },
    isOriginal: { type: Boolean, required: true, default: true },

    // Preferred selector
    isPreferred: { type: Boolean, required: true, default: true },
  }
);

MediaitemSchema.index(
  { familyRootId: 1, isPreferred: 1 },
  { unique: true, partialFilterExpression: { isPreferred: true } }
);

export default MediaitemSchema;
