import * as mongoose from 'mongoose';
import { connection } from '../config';

const Schema = mongoose.Schema;

const UndecidedGroupSchema = new Schema({
  albumIds: { 
    type: [String], 
    required: true, 
    validate: {
      validator: function (value: string[]) {
        return value.length > 0; // Ensures at least one albumId is present
      },
      message: 'An UndecidedGroup must be associated with at least one album.'
    }
  },
  name: { type: String, required: true, unique: true }, // Unique per album
  createdAt: { type: String }, // Automatically set timestamp
});

// Ensure unique constraint on name per album
UndecidedGroupSchema.index({ name: 1, albumIds: 1 }, { unique: true });

export const getUndecidedGroupModel = () => {
  const undecidedGroupModel = connection.model('undecidedgroup', UndecidedGroupSchema);
  return undecidedGroupModel;
}

export default UndecidedGroupSchema;
