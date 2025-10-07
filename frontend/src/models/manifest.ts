import { MediaViewState, MediaManifest, ManifestState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ManifestState = {
  byId: {},
  statusById: {},
  errorById: {},
};

export const manifestReducer = (
  state: ManifestState = initialState,
  action: TedTaggerModelBaseAction<any>
): ManifestState => {
  switch (action.type) {
    default:
      return state;
  }
};
