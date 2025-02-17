import { cloneDeep } from 'lodash';

import { PhotoSet, PhotoSetsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PHOTOSET = 'ADD_PHOTOSET';
export const ADD_PHOTOSETS = 'ADD_PHOTOSETS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddPhotoSetPayload {
  photoSet: PhotoSet;
}

export const addPhotoSetRedux = (
  photoSet: PhotoSet,
): any => {
  return {
    type: ADD_PHOTOSET,
    payload: {
      photoSet
    }
  };
};

interface AddPhotoSetsPayload {
  photoSets: PhotoSet[];
}

export const addPhotoSets = (
  photoSets: PhotoSet[],
): any => {
  return {
    type: ADD_PHOTOSETS,
    payload: {
      photoSets
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PhotoSetsState =
{
  photoSets: [],
};

export const photoSetsStateReducer = (
  state: PhotoSetsState = initialState,
  action: TedTaggerModelBaseAction<AddPhotoSetsPayload & AddPhotoSetPayload>
): PhotoSetsState => {
  switch (action.type) {
    case ADD_PHOTOSET: {
      const { photoSet } = action.payload as AddPhotoSetPayload;
      // Prevent duplicates
      if (state.photoSets.some((set) => set.photoSetId === photoSet.photoSetId)) {
        return state; // No changes if duplicate exists
      }
      return {
        ...state,
        photoSets: [...state.photoSets, photoSet], // Append new photoSet
      };
    }
    case ADD_PHOTOSETS: {
      const { photoSets } = action.payload as AddPhotoSetsPayload;
      // Create a set of existing IDs to prevent duplicates
      const existingPhotoSetIds = new Set(state.photoSets.map((set) => set.photoSetId));
      const newPhotoSets = photoSets.filter(
        (set) => !existingPhotoSetIds.has(set.photoSetId) // Exclude duplicates
      );
      return {
        ...state,
        photoSets: [...state.photoSets, ...newPhotoSets], // Merge new unique photoSets
      };
    }
    default:
      return state;
  }
};
