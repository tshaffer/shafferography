import { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db'; // ✅ Import DB connection
import { Album } from '../types';

export interface IAlbum extends Album, Document { }

const AlbumSchema = new Schema<IAlbum>({
  albumId: { type: String, required: true, unique: true },
  albumName: { type: String, required: true, unique: true },
});

// ✅ Ensure connection is initialized before defining the model
let AlbumModel: Model<IAlbum>;

const initializeModel = async () => {
  const connection = await connectDB();
  AlbumModel = connection.model<IAlbum>('album', AlbumSchema);
};

initializeModel();

export { AlbumModel };
