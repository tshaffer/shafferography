import { MediaViewState, MediaManifest, ManifestState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_MANIFEST = 'SET_MANIFEST';

// ------------------------------------
// Actions
// ------------------------------------
export const setManifest = (manifest: MediaManifest): any => {
  return {
    type: SET_MANIFEST,
    payload: {
      manifest,
    }
  };
};


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
    case SET_MANIFEST: {
      const { manifest } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [manifest.mediaItemId]: manifest,
        },
        statusById: {
          ...state.statusById,
          [manifest.mediaItemId]: 'loaded',
        },
        errorById: {
          ...state.errorById,
          [manifest.mediaItemId]: null,
        },
      };
    }
    default:
      return state;
  }
};
