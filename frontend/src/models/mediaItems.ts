import { cloneDeep, isNil } from 'lodash';

import { MediaItem, MediaItemsState, PhotoState } from '../types';
import { TedTaggerAction, TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const REPLACE_MEDIA_ITEMS = 'REPLACE_MEDIA_ITEMS';
export const ADD_MEDIA_ITEMS = 'ADD_MEDIA_ITEMS';
export const DELETE_MEDIA_ITEMS = 'DELETE_MEDIA_ITEMS';
export const CLEAR_MEDIA_ITEMS = 'CLEAR_MEDIA_ITEMS';
export const REPLACE_MEDIA_ITEM = 'REPLACE_MEDIA_ITEM';
export const UPDATE_MEDIA_ITEMS = 'UPDATE_MEDIA_ITEMS';

export const ADD_KEYWORD_TO_MEDIA_ITEM_IDS = 'ADD_KEYWORD_TO_MEDIA_ITEM_IDS';
export const REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS = 'REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS';
export const ADD_KEYWORD_TO_MEDIA_ITEMS = 'ADD_KEYWORD_TO_MEDIA_ITEMS';

export const SET_LOUPE_VIEW_MEDIA_ITEM_IDS = 'SET_LOUPE_VIEW_MEDIA_ITEM_IDS';
export const REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID = 'REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID';

export const SET_SURVEY_VIEW_MEDIA_ITEM_IDS = 'SET_SURVEY_VIEW_MEDIA_ITEM_IDS';
export const REMOVE_SURVEY_VIEW_MEDIA_ITEM_ID = 'REMOVE_SURVEY_VIEW_MEDIA_ITEM_ID';

export const SET_PHOTO_STATE = 'SET_PHOTO_STATE';

export const REMOVE_UNDECIDED_GROUP_ID_FROM_MEDIA_ITEMS = 'REMOVE_UNDECIDED_GROUP_ID_FROM_MEDIA_ITEMS';

export const SET_MEDIA_ITEM_NOTES = 'SET_MEDIA_ITEM_NOTES';

// ------------------------------------
// Actions
// ------------------------------------

interface MediaItemIdsPayload {
  mediaItemIds: string[];
}

interface SetPhotoStatePayload {
  mediaItemIds: string[];
  photoState: PhotoState;
}

export const setPhotoStateRedux = (
  mediaItemIds: string[],
  photoState: PhotoState,
): any => {
  return {
    type: SET_PHOTO_STATE,
    payload: { mediaItemIds, photoState }
  };
};

interface SetMediaItemsPayload {
  mediaItems: MediaItem[];
}

interface ReplaceMediaItemPayload {
  mediaItem: MediaItem;
}

export const replaceMediaItemRedux = (
  mediaItem: MediaItem,
): any => {
  return {
    type: REPLACE_MEDIA_ITEM,
    payload: { mediaItem }
  };
};

export const updateMediaItemsRedux = (mediaItems: MediaItem[]): any => {
  return {
    type: UPDATE_MEDIA_ITEMS, // A new action type
    payload: { mediaItems }
  };
};

export const addMediaItems = (
  mediaItems: MediaItem[],
): any => {
  return {
    type: ADD_MEDIA_ITEMS,
    payload: {
      mediaItems
    }
  };
};

export const deleteMediaItemsRedux = (
  mediaItemIds: string[],
) => {
  return {
    type: DELETE_MEDIA_ITEMS,
    payload: {
      mediaItemIds,
    }
  };
};

export const removeUndecidedGroupIdFromMediaItems = (
  mediaItemIds: string[],
): any => {
  return {
    type: 'REMOVE_UNDECIDED_GROUP_ID_FROM_MEDIA_ITEMS',
    payload: {
      mediaItemIds
    }
  };
};
export const clearMediaItems = (): TedTaggerAction<any> => ({
  type: 'CLEAR_MEDIA_ITEMS',
  payload: {},
});

interface AddOrRemoveKeywordToMediaItemIdsPayload {
  mediaItemIds: string[];
  keywordNodeId: string;
}

export const addKeywordToMediaItemIdsRedux = (
  mediaItemIds: string[],
  keywordNodeId: string,
): any => {
  return {
    type: ADD_KEYWORD_TO_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds,
      keywordNodeId,
    }
  };
};

export const removeKeywordFromMediaItemIdsRedux = (
  mediaItemIds: string[],
  keywordNodeId: string,
): any => {
  return {
    type: REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds,
      keywordNodeId,
    }
  };
};

interface AddKeywordToMediaItemsPayload {
  mediaItem: MediaItem[];
  keywordNodeId: string;
}

export const addKeywordToMediaItemsRedux = (
  mediaItems: MediaItem[],
  keywordNodeId: string,
): any => {
  return {
    type: ADD_KEYWORD_TO_MEDIA_ITEMS,
    payload: {
      mediaItems,
      keywordNodeId,
    }
  };
};

export const setLoupeViewMediaItemIds = (
  mediaItemIds: string[],
): any => {
  return {
    type: SET_LOUPE_VIEW_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds
    }
  };
};

interface RemoveLoupeViewMediaIdPayload {
  mediaItemId: string;
};

export const removeLoupeViewMediaItemId = (
  mediaItemId: string,
): any => {
  return {
    type: REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID,
    payload: {
      mediaItemId
    }
  };
};

export const setSurveyViewMediaItemIds = (
  mediaItemIds: string[],
): any => {
  return {
    type: SET_SURVEY_VIEW_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds
    }
  };
};

interface RemoveSurveyViewMediaIdPayload {
  mediaItemId: string;
};

export const removeSurveyViewMediaItemId = (
  mediaItemId: string,
): any => {
  return {
    type: REMOVE_SURVEY_VIEW_MEDIA_ITEM_ID,
    payload: {
      mediaItemId
    }
  };
};

interface SetMediaItemNotesPayload {
  mediaItemId: string;
  notes: string;
};

export const setMediaItemNotesRedux = (
  mediaItemId: string,
  notes: string,
): any => {
  return {
    type: SET_MEDIA_ITEM_NOTES,
    payload: {
      mediaItemId,
      notes,
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MediaItemsState =
{
  mediaItems: [],
  loupeViewMediaItemIds: [],
  surveyViewMediaItemIds: [],
};

export const mediaItemsStateReducer = (
  state: MediaItemsState = initialState,
  action: TedTaggerModelBaseAction<ReplaceMediaItemPayload & SetMediaItemsPayload & AddKeywordToMediaItemsPayload & AddOrRemoveKeywordToMediaItemIdsPayload & MediaItemIdsPayload & RemoveLoupeViewMediaIdPayload & RemoveSurveyViewMediaIdPayload & SetPhotoStatePayload & SetPhotoStatePayload & SetMediaItemNotesPayload>
): MediaItemsState => {
  switch (action.type) {
    case UPDATE_MEDIA_ITEMS: {
      const newMediaItems = cloneDeep(action.payload.mediaItems);

      // If the array hasn't changed, return the existing state to avoid unnecessary re-renders
      if (newMediaItems.length === state.mediaItems.length &&
        newMediaItems.every((item, index) => item === state.mediaItems[index])) {
        return state;
      }

      return {
        ...state,
        mediaItems: newMediaItems
      };
    }
    case REPLACE_MEDIA_ITEM: {
      const mediaItem = action.payload.mediaItem;
      const updatedMediaItems = state.mediaItems.map(item =>
        item.uniqueId === mediaItem.uniqueId ? mediaItem : item
      );

      return {
        ...state,
        mediaItems: updatedMediaItems
      };
    }
    case REPLACE_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: action.payload.mediaItems
      };
    }
    case ADD_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: state.mediaItems.concat(action.payload.mediaItems)
      };
    }
    case CLEAR_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: []
      };
    }
    case DELETE_MEDIA_ITEMS: {
      let updatedMediaItems = cloneDeep(state.mediaItems);
      updatedMediaItems = updatedMediaItems.filter(item => !(action.payload.mediaItemIds.includes(item.uniqueId)));
      return {
        ...state,
        mediaItems: updatedMediaItems,
      };
    }
    case ADD_KEYWORD_TO_MEDIA_ITEM_IDS: {
      const newState = cloneDeep(state) as MediaItemsState;

      // newState.mediaItems is all media items
      // action.payload.mediaItemIds is the media items that are selected

      // iterate through each media item
      newState.mediaItems.forEach((mediaItem) => {

        // is the current media item in the list of selected media items?
        const matchingInputItem = action.payload.mediaItemIds.find((inputItemId) => inputItemId === mediaItem.uniqueId);
        if (matchingInputItem) {
          // if yes, add the keyword to the media item's list of assigned keywords (if it doesn't already exist)
          if (isNil(mediaItem.keywordNodeIds)) {
            // mediaItem.keywordNodeIds may be undefined unless I regenerate the data (keywordNodeIds was added later)
            mediaItem.keywordNodeIds = [action.payload.keywordNodeId];
          } else {
            const keywordNodeIndex = mediaItem.keywordNodeIds.indexOf(action.payload.keywordNodeId);
            // only push if it's not already there
            if (keywordNodeIndex === -1) {
              mediaItem.keywordNodeIds.push(action.payload.keywordNodeId);
            }
          }
        }
      });
      return newState;
    }
    case REMOVE_UNDECIDED_GROUP_ID_FROM_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: state.mediaItems.map((mediaItem) =>
          action.payload.mediaItemIds.includes(mediaItem.uniqueId)
            ? { ...mediaItem, undecidedGroupId: undefined }
            : mediaItem
        ),
      };
    }
    case REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS: {
      const newState = cloneDeep(state) as MediaItemsState;
      newState.mediaItems.forEach((mediaItem) => {
        const matchingInputItem = action.payload.mediaItemIds.find((inputItemId) => inputItemId === mediaItem.uniqueId);
        if (matchingInputItem) {
          if (!isNil(mediaItem.keywordNodeIds)) {
            const keywordNodeIndex = mediaItem.keywordNodeIds.indexOf(action.payload.keywordNodeId);
            if (keywordNodeIndex !== -1) {
              mediaItem.keywordNodeIds.splice(keywordNodeIndex, 1);
            }
          }
        }
      });
      return newState;
    }
    case ADD_KEYWORD_TO_MEDIA_ITEMS: {
      const newState = cloneDeep(state) as MediaItemsState;
      newState.mediaItems.forEach((item) => {
        const matchingInputItem = action.payload.mediaItems.find((inputItem) => inputItem.uniqueId === item.uniqueId);
        if (matchingInputItem) {
          const keywordNodeIndex = item.keywordNodeIds.indexOf(action.payload.keywordNodeId);
          if (keywordNodeIndex === -1) {
            item.keywordNodeIds.push(action.payload.keywordNodeId);
          }
        }
      });
      return newState;
    }
    case SET_LOUPE_VIEW_MEDIA_ITEM_IDS: {
      return {
        ...state,
        loupeViewMediaItemIds: action.payload.mediaItemIds
      };
    }
    case REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID: {
      const loupeViewMediaItemIds: string[] = state.loupeViewMediaItemIds.filter(item => item !== action.payload.mediaItemId);
      return {
        ...state,
        loupeViewMediaItemIds,
      };
    }
    case SET_SURVEY_VIEW_MEDIA_ITEM_IDS: {
      return {
        ...state,
        surveyViewMediaItemIds: action.payload.mediaItemIds
      };
    }
    case REMOVE_SURVEY_VIEW_MEDIA_ITEM_ID: {
      const surveyViewMediaItemIds: string[] = state.surveyViewMediaItemIds.filter(item => item !== action.payload.mediaItemId);
      return {
        ...state,
        surveyViewMediaItemIds,
      };
    }
    case SET_PHOTO_STATE: {
      const { mediaItemIds, photoState } = action.payload;

      // Convert state to a Map for fast lookups
      const mediaItemsMap = new Map(state.mediaItems.map(item => [item.uniqueId, item]));

      let hasChanges = false;

      for (const mediaItemId of mediaItemIds) {
        const mediaItem = mediaItemsMap.get(mediaItemId);

        if (mediaItem && mediaItem.photoState !== photoState) {
          mediaItemsMap.set(mediaItemId, { ...mediaItem, photoState }); // Only update changed items
          hasChanges = true;
        }
      }

      // Only return a new state if changes were made
      if (!hasChanges) {
        return state;
      }

      return {
        ...state,
        mediaItems: Array.from(mediaItemsMap.values()) // Convert Map back to array
      };
    }
    case SET_MEDIA_ITEM_NOTES: {
      const { mediaItemId, notes } = action.payload;

      // Convert state to a Map for fast lookups
      const mediaItemsMap = new Map(state.mediaItems.map(item => [item.uniqueId, item]));

      const mediaItem = mediaItemsMap.get(mediaItemId);

      if (mediaItem) {
        mediaItemsMap.set(mediaItemId, { ...mediaItem, notes });
      }

      return {
        ...state,
        mediaItems: Array.from(mediaItemsMap.values()) // Convert Map back to array
      };
    }
    default:
      return state;
  }
};
