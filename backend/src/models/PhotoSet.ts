import { Schema, Document, Model } from 'mongoose';
import { connectDB } from '../config/db'; // ✅ Import DB connection
import { PhotoSet } from '../types';

export interface IPhotoSet extends PhotoSet, Document {}

const PhotoSetSchema = new Schema<IPhotoSet>({
  photoSetId: { type: String, required: true, unique: true },
  photoSetName: { type: String, required: true, unique: true },
});


// ✅ Ensure connection is initialized before defining the model
let PhotoSetModel: Model<IPhotoSet>;

const initializeModel = async () => {
  const connection = await connectDB();
  PhotoSetModel = connection.model<IPhotoSet>('photoset', PhotoSetSchema);
};

initializeModel();

export { PhotoSetModel };
