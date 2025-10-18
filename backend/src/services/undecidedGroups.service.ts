import mongoose from 'mongoose';
import * as mediaRepo from '../repositories/mediaItem.repo';
import * as ugRepo from '../repositories/undecidedGroup.repo';

export async function deleteUndecidedGroup(undecidedGroupId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(undecidedGroupId)) {
    throw new Error(`Invalid undecidedGroupId: ${undecidedGroupId}`);
  }

  // If you have replica set / transactions set up, you can wrap in a session.
  // For now, do two sequential ops:
  await mediaRepo.clearUndecidedGroupOnItems(undecidedGroupId);
  await ugRepo.deleteById(undecidedGroupId);
}
