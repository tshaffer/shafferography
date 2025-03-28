import { TedTaggerModelBaseAction } from './baseAction';
import { MediaItemCountByUndecidedGroupPerAlbum, MediaItemsCountState, StringToNumberLUT } from '../types';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_MEDIA_ITEM_COUNTS = 'SET_MEDIA_ITEM_COUNTS';
export const SET_MEDIA_ITEM_COUNTS_BY_ALBUM = 'SET_MEDIA_ITEM_COUNTS_BY_ALBUM';
export const SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE = 'SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE';
export const SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM = 'SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM';

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

interface SetMediaItemCountByAlbumPayload {
  mediaItemCountByAlbum: StringToNumberLUT;
}

export const setMediaItemCountByAlbum = (
  mediaItemCountByAlbum: StringToNumberLUT,
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS_BY_ALBUM,
    payload: {
      mediaItemCountByAlbum
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

interface SetMediaItemCountByUndecidedGroupPerAlbumPayload {
  mediaItemCountByUndecidedGroupPerAlbum: MediaItemCountByUndecidedGroupPerAlbum[];
}

export const setMediaItemCountByUndecidedGroupPerAlbum = (
  mediaItemCountByUndecidedGroupPerAlbum: MediaItemCountByUndecidedGroupPerAlbum[],
): any => {
  return {
    type: SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM,
    payload: {
      mediaItemCountByUndecidedGroupPerAlbum
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MediaItemsCountState =
{
  mediaItemCountByAlbum: {},
  mediaItemCountByPhotoState: {},
  mediaItemCountByUndecidedGroupPerAlbum: []
};

export const mediaItemsCountStateReducer = (
  state: MediaItemsCountState = initialState,
  action: TedTaggerModelBaseAction<
    MediaItemsCountState &
    SetMediaItemCountByPhotoStatePayload &
    SetMediaItemCountByAlbumPayload &
    SetMediaItemCountByUndecidedGroupPerAlbumPayload
  >
): MediaItemsCountState => {
  switch (action.type) {
    case SET_MEDIA_ITEM_COUNTS: {
      return action.payload;
    }
    case SET_MEDIA_ITEM_COUNTS_BY_ALBUM: {
      return {
        ...state,
        mediaItemCountByAlbum: action.payload.mediaItemCountByAlbum,
      };
    }
    case SET_MEDIA_ITEM_COUNTS_BY_PHOTO_STATE: {
      return {
        ...state,
        mediaItemCountByPhotoState: action.payload.mediaItemCountByPhotoState,
      };
    }
    case SET_MEDIA_ITEM_COUNTS_BY_UNDECIDED_GROUP_PER_ALBUM: {
      return {
        ...state,
        mediaItemCountByUndecidedGroupPerAlbum: action.payload.mediaItemCountByUndecidedGroupPerAlbum,
      };
    }
    default:
      return state;
  }
};
