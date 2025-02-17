import {
  PhotoSet,
  TedTaggerState
} from '../types';

export const getPhotoSets = (state: TedTaggerState): PhotoSet[] => {
  return state.photoSetsState.photoSets;
};

export const getPhotoSet = (state: TedTaggerState, photoSetId: string): PhotoSet | undefined => {
  return getPhotoSets(state).find(photoSet => photoSet.photoSetId === photoSetId);
}
