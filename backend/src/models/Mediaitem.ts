// backend/models/MediaItem.ts
import { Model, Connection } from "mongoose";
import { MediaItemStored } from "../types";
import MediaitemSchema from "./MediaItemSchema";

export function getMediaItemModel(conn: Connection): Model<MediaItemStored> {
  return (conn.models.MediaItem as Model<MediaItemStored>) ??
    conn.model<MediaItemStored>("MediaItem", MediaitemSchema);
}
