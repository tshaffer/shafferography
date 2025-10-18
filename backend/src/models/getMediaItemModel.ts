// models/getMediaItemModel.ts
import type { Connection, Model } from 'mongoose';
import { MediaitemSchema } from './mediaItem.model'; // export the schema from there too
import type { MediaItemStored } from './mediaItem.model';

export function getMediaItemModel(conn: Connection): Model<MediaItemStored> {
  return (conn.models.mediaitems as Model<MediaItemStored>) ??
         conn.model<MediaItemStored>('mediaitems', MediaitemSchema);
}

