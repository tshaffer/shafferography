import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { connection } from '../config';

const MediaContentNodeSchema = new Schema({
  id: String,
  name: String,
  type: { type: String, enum: ['album', 'group'] },
  children: [mongoose.Schema.Types.Mixed], // placeholder, will assign below
}, { _id: false });

// Now define children as recursive
MediaContentNodeSchema.add({
  children: [MediaContentNodeSchema]
});

const MediaContentTree = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  nodes: [MediaContentNodeSchema],
});

export const getMediaContentTreeModel = async () => {

  const mediaContentTreeModel = connection.models.MediaContentTree || connection.model('MediaContentTree', MediaContentTree, 'mediacontenttree');
  return mediaContentTreeModel
};

export default MediaContentTree;
