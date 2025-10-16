// src/models/MediaItem.ts
import { Schema, model, Document } from "mongoose";
import { MediaItemStored } from "../types";
import { connection } from '../config';

// const MediaitemSchema = new Schema<MediaItemStored>({ /* fields */ });
import MediaitemSchema from './MediaItemSchema';

export const getMediaitemModel = () => {
  // return model<MediaItemStored>("mediaitems", MediaitemSchema)
  const mediaItemModel = connection.model('mediaitem', MediaitemSchema);
  return mediaItemModel;
}

export const MediaItemModel = model<MediaItemStored>("mediaitems", MediaitemSchema);


// import MediaitemSchema from './MediaItemSchema';

