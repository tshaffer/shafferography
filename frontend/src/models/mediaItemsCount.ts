import { TedTaggerModelBaseAction } from './baseAction';
import { MediaItemCountByUndecidedGroupPerAlbumNode, MediaItemsCountState, StringToNumberLUT } from '../types';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_MEDIA_ITEM_COUNTS = 'SET_MEDIA_ITEM_COUNTS';
export const SET_MEDIA_ITEM_COUNTS_BY_ALBUM_NODE = 'SET_MEDIA_ITEM_COUNTS_BY_ALBUM_NODE';
export const SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE = 'SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE';
export const SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM_NODE = 'SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM_NODE';

// ------------------------------------
// Actions
// ------------------------------------

export const setMediaItemCounts = (
  mediaItemCounts: MediaItemsCountState,
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS,
    payload: mediaItemCounts
  };
};

interface SetMediaItemCountByAlbumNodePayload {
  mediaItemCountByAlbumNode: StringToNumberLUT;
}

export const setMediaItemCountByAlbumNode = (
  mediaItemCountByAlbumNode: StringToNumberLUT,
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS_BY_ALBUM_NODE,
    payload: {
      mediaItemCountByAlbumNode
    }
  };
};

interface SetMediaItemCountByPhotoStatePayload {
  mediaItemCountByPhotoState: StringToNumberLUT;
}

export const setMediaItemCountByPhotoState = (
  mediaItemCountByPhotoState: StringToNumberLUT,
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE,
    payload: {
      mediaItemCountByPhotoState
    }
  };
};

interface SetMediaItemCountByUndecidedGroupPerAlbumNodePayload {
  mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[];
}

export const setMediaItemCountByUndecidedGroupPerAlbumNode = (
  mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[],
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM_NODE,
    payload: {
      mediaItemCountByUndecidedGroupPerAlbumNode
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MediaItemsCountState =
{
  mediaItemCountByAlbumNode: {},
  mediaItemCountByPhotoState: {},
  mediaItemCountByPhotoStateByAlbumNodeId: {},
  mediaItemCountByUndecidedGroupPerAlbumNode: []
};

export const mediaItemsCountStateReducer = (
  state: MediaItemsCountState = initialState,
  action: TedTaggerModelBaseAction<
    MediaItemsCountState &
    SetMediaItemCountByPhotoStatePayload &
    SetMediaItemCountByAlbumNodePayload &
    SetMediaItemCountByUndecidedGroupPerAlbumNodePayload
  >
): MediaItemsCountState => {
  switch (action.type) {
    case SET_MEDIA_ITEM_COUNTS: {
      return action.payload;
    }
    case SET_MEDIA_ITEM_COUNTS_BY_ALBUM_NODE: {
      return {
        ...state,
        mediaItemCountByAlbumNode: action.payload.mediaItemCountByAlbumNode,
      };
    }
    case SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE: {
      return {
        ...state,
        mediaItemCountByPhotoState: action.payload.mediaItemCountByPhotoState,
      };
    }
    case SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM_NODE: {
      return {
        ...state,
        mediaItemCountByUndecidedGroupPerAlbumNode: action.payload.mediaItemCountByUndecidedGroupPerAlbumNode,
      };
    }
    default:
      return state;
  }
};
