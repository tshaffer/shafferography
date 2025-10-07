import { MediaViewState, ViewVariant } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_VIEW_VARIANT = 'SET_VIEW_VARIANT';
export const CLEAR_VIEW_VARIANT = 'CLEAR_VIEW_VARIANT';

// ------------------------------------
// Actions
// ------------------------------------

export const setViewVariant = (mediaId: string, variant: ViewVariant): any => {
  return {
    type: SET_VIEW_VARIANT,
    payload: {
      mediaId,
      variant,
    }
  };
};

export const clearViewVariant = (): any => {
  return {
    type: CLEAR_VIEW_VARIANT,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MediaViewState = {
  byId: {},
};

export const mediaViewReducer = (
  state: MediaViewState = initialState,
  action: TedTaggerModelBaseAction<any>
): MediaViewState => {
  switch (action.type) {
    case SET_VIEW_VARIANT: {
      const { mediaId, variant } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [mediaId]: variant,
        },
      };
    }
    case CLEAR_VIEW_VARIANT: {
      const { mediaId } = action.payload;
      const newById = { ...state.byId };
      delete newById[mediaId];
      return {
        ...state,
        byId: newById,
      };
    }
    default:
      return state;
  }
};
