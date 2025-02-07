import { cloneDeep } from 'lodash';

import { SelectedMediaItemsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SELECT_MEDIA_ITEM = 'SELECT_MEDIA_ITEM';
export const SELECT_MEDIA_ITEMS = 'SELECT_MEDIA_ITEMS';
export const DESELECT_MEDIA_ITEM = 'DESELECT_MEDIA_ITEM';
export const DESELECT_MEDIA_ITEM_SELECTION_ALL = 'DESELECT_MEDIA_ITEM_SELECTION_ALL';
export const SET_LAST_CLICKED_ID = 'SET_LAST_CLICKED_ID';

// ------------------------------------
// Actions
// ------------------------------------

interface SelectMediaItemsPayload {
  uniqueIds: string[];
}

export const selectMediaItems = (
  uniqueIds: string[],
): any => {
  return {
    type: SELECT_MEDIA_ITEMS,
    payload: {
      uniqueIds
    }
  };
};

interface SelectMediaItemPayload {
  uniqueId: string;
}

export const selectMediaItem = (
  uniqueId: string,
): any => {
  return {
    type: SELECT_MEDIA_ITEM,
    payload: {
      uniqueId
    }
  };
};

interface DeselectMediaItemPayload {
  uniqueId: string;
}

export const deselectMediaItem = (
  uniqueId: string,
): any => {
  return {
    type: DESELECT_MEDIA_ITEM,
    payload: {
      uniqueId
    }
  };
};


export const clearSelectedMediaItems = (
): any => {
  return {
    type: DESELECT_MEDIA_ITEM_SELECTION_ALL,
  };
};

export const clearMediaItemSelection = (
): any => {
  return {
    type: DESELECT_MEDIA_ITEM_SELECTION_ALL,
  };
};

interface SetLastClickedIdPayload {
  uniqueId: string | null;
}

export const setLastClickedId = (
  uniqueId: string | null,
): any => {
  return {
    type: SET_LAST_CLICKED_ID,
    payload: {
      uniqueId
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SelectedMediaItemsState =
{
  selectedMediaItemIds: [],
  lastClickedId: null,
};

export const selectedMediaItemsStateReducer = (
  state: SelectedMediaItemsState = initialState,
  action: TedTaggerModelBaseAction<
    SetLastClickedIdPayload & SelectMediaItemPayload & DeselectMediaItemPayload & SelectMediaItemsPayload
  >
): SelectedMediaItemsState => {
  switch (action.type) {
    case SET_LAST_CLICKED_ID: {
      return {
        ...state,
        lastClickedId: (action.payload as SetLastClickedIdPayload).uniqueId,
      };
    }
    case "SELECT_MEDIA_ITEM":
      if (state.selectedMediaItemIds.includes(action.payload.uniqueId)) {
        return state; // ✅ Prevents unnecessary re-renders by returning the same object
      }
      return {
        ...state,
        selectedMediaItemIds: [...state.selectedMediaItemIds, action.payload.uniqueId], // 🔥 This should only create a new array when necessary
      };
    case DESELECT_MEDIA_ITEM:
      if (!state.selectedMediaItemIds.includes(action.payload.uniqueId)) {
        return state;
      }
      return {
        ...state,
        selectedMediaItemIds: state.selectedMediaItemIds.filter((id) => id !== action.payload.uniqueId),
      };
    case DESELECT_MEDIA_ITEM_SELECTION_ALL:
      if (state.selectedMediaItemIds.length === 0) {
        return state;
      }
      return {
        ...state,
        selectedMediaItemIds: [],
      };
    case SELECT_MEDIA_ITEMS: {
      const newState = cloneDeep(state) as SelectedMediaItemsState;
      newState.selectedMediaItemIds = [...newState.selectedMediaItemIds, ...(action.payload as SelectMediaItemsPayload).uniqueIds];
      return newState;
    }
    case DESELECT_MEDIA_ITEM: {
      const newState = cloneDeep(state) as SelectedMediaItemsState;
      newState.selectedMediaItemIds = newState.selectedMediaItemIds.filter((selectedId) => selectedId !== (action.payload as SelectMediaItemPayload).uniqueId);
      return newState;
    }
    default:
      return state;
  }
};

