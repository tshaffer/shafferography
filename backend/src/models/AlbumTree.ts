import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { connection } from '../config';

const AlbumNodeSchema = new Schema({
  id: String,
  name: String,
  type: { type: String, enum: ['album', 'group'] },
  mediaCount: Number,
  children: [mongoose.Schema.Types.Mixed], // placeholder, will assign below
}, { _id: false });

// Now define children as recursive
AlbumNodeSchema.add({
  children: [AlbumNodeSchema]
});

const AlbumTreeSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  nodes: [AlbumNodeSchema],
});

export const getAlbumTreeModel = () => {
  const albumTreeModel = connection.model('albumtree', AlbumTreeSchema);
  return albumTreeModel;
}

export default AlbumTreeSchema;
