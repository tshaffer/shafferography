import { PhotoLayout, PhotoViewSpec, PhotoState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PHOTO_LAYOUT = 'SET_PHOTO_LAYOUT';
export const SET_ZOOM_FACTOR = 'SET_ZOOM_FACTOR';
export const SET_LOUPE_VIEW_MEDIA_ITEM_ID = 'SET_LOUPE_VIEW_MEDIA_ITEM_ID';
export const SET_FOCUSED_SURVEY_VIEW_MEDIA_ITEM_ID = 'SET_FOCUSED_SURVEY_VIEW_MEDIA_ITEM_ID';
export const SET_DISPLAY_METADATA = 'SET_DISPLAY_METADATA';
export const SET_SURVEY_MODE_ZOOM_FACTOR = 'SET_SURVEY_MODE_ZOOM_FACTOR';
export const SET_SCROLL_POSITION = 'SET_SCROLL_POSITION';
export const SET_FULL_SCREEN_MODE = 'SET_FULL_SCREEN_MODE';
export const SET_MEDIA_ITEM_ZOOM_FACTOR = 'SET_MEDIA_ITEM_ZOOM_FACTOR';
export const SET_DISPLAYED_ALBUM_NODE_IDS = 'SET_DISPLAYED_ALBUM_NODE_IDS';
export const SET_DISPLAYED_REVIEW_LEVELS = 'SET_DISPLAYED_REVIEW_LEVELS';
export const SET_GROUP_UNDECIDED_PHOTOS = 'SET_GROUP_UNDECIDED_PHOTOS';
export const SET_DISPLAYED_UNDECIDED_GROUP_IDS = 'SET_DISPLAYED_UNDECIDED_GROUP_IDS';

// ------------------------------------
// Actions
// ------------------------------------

interface SetPhotoLayoutPayload {
  photoLayout: PhotoLayout,
}

export const setPhotoLayoutRedux = (photoLayout: PhotoLayout): any => {
  return {
    type: SET_PHOTO_LAYOUT,
    payload: {
      photoLayout,
    },
  };
};

interface SetNumGridColumnsPayload {
  numGridColumns: number,
}

export const setNumGridColumnsRedux = (numGridColumns: number): any => {
  return {
    type: SET_ZOOM_FACTOR,
    payload: {
      numGridColumns,
    },
  };
};

interface SetLoupeViewMediaItemIdPayload {
  loupeViewMediaItemId: string,
}

export const setLoupeViewMediaItemIdRedux = (loupeViewMediaItemId: string): any => {
  return {
    type: SET_LOUPE_VIEW_MEDIA_ITEM_ID,
    payload: {
      loupeViewMediaItemId,
    },
  };
};

interface SetFocusedSurveyViewMediaItemIdPayload {
  focusedSurveyViewMediaItemId: string,
}

export const setFocusedSurveyViewMediaItemId = (focusedSurveyViewMediaItemId: string): any => {
  return {
    type: SET_FOCUSED_SURVEY_VIEW_MEDIA_ITEM_ID,
    payload: {
      focusedSurveyViewMediaItemId,
    },
  };
};

interface SetDisplayMetadata {
  displayMetadata: boolean,
}

export const setDisplayMetadata = (displayMetadata: boolean): any => {
  return {
    type: SET_DISPLAY_METADATA,
    payload: {
      displayMetadata,
    },
  };
};

interface SetSurveyModeZoomFactorPayload {
  surveyModeZoomFactor: number,
}

export const setSurveyModeZoomFactorRedux = (surveyModeZoomFactor: number): any => {
  return {
    type: SET_SURVEY_MODE_ZOOM_FACTOR,
    payload: {
      surveyModeZoomFactor,
    },
  };
};

interface SetScrollPositionPayload {
  scrollPosition: number,
}

export const setScrollPositionRedux = (scrollPosition: number): any => {
  // console.log('setScrollPositionRedux:', scrollPosition);
  // const now = new Date();
  // const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // const msSinceMidnight = now.getTime() - midnight.getTime();
  // console.log(msSinceMidnight);
  return {
    type: SET_SCROLL_POSITION,
    payload: {
      scrollPosition,
    },
  };
};

interface SetFullScreenModePayload {
  fullScreenMode: boolean,
}

export const setFullScreenMode = (fullScreenMode: boolean): any => {
  return {
    type: SET_FULL_SCREEN_MODE,
    payload: {
      fullScreenMode,
    },
  };
};

interface SetMediaItemZoomFactorPayload {
  mediaItemId: string,
  zoomFactor: number,
}

export const setMediaItemZoomFactor = (mediaItemId: string, zoomFactor: number): any => {
  return {
    type: SET_MEDIA_ITEM_ZOOM_FACTOR,
    payload: {
      mediaItemId,
      zoomFactor,
    },
  };
};

interface SetDisplayedAlbumNodeIdsPayload {
  displayedAlbumNodeIds: string[],
}

export const setDisplayedAlbumNodeIds = (displayedAlbumNodeIds: string[]): any => {
  return {
    type: SET_DISPLAYED_ALBUM_NODE_IDS,
    payload: {
      displayedAlbumNodeIds,
    },
  };
};

interface SetDisplayedPhotoStatesPayload {
  displayedPhotoStates: PhotoState[],
}

export const setDisplayedPhotoStates = (displayedPhotoStates: PhotoState[]): any => {
  return {
    type: SET_DISPLAYED_REVIEW_LEVELS,
    payload: {
      displayedPhotoStates,
    },
  };
};

interface SetGroupUndecidedPhotosPayload {
  groupUndecidedPhotos: boolean,
}

export const setGroupUndecidedPhotos = (groupUndecidedPhotos: boolean): any => {
  return {
    type: SET_GROUP_UNDECIDED_PHOTOS,
    payload: {
      groupUndecidedPhotos,
    },
  };
};


interface SetDisplayedUndecidedGroupIdsPayload {
  displayedUndecidedGroupIds: string[],
}

export const setDisplayedUndecidedGroupIds = (displayedUndecidedGroupIds: string[]): any => {
  return {
    type: SET_DISPLAYED_UNDECIDED_GROUP_IDS,
    payload: {
      displayedUndecidedGroupIds,
    },
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PhotoViewSpec = {
  photoLayout: PhotoLayout.Grid,
  numGridColumns: 5,
  loupeViewMediaItemId: '',
  focusedSurveyViewMediaItemId: '',
  displayMetadata: false,
  surveyModeZoomFactor: 1,
  scrollPosition: 0,
  fullScreenMode: false,
  mediaItemZoomFactorById: {},
  displayedAlbumNodeIds: [],
  displayedPhotoStates: [PhotoState.ReadyForUpload, PhotoState.Unreviewed, PhotoState.Undecided, PhotoState.Uploaded],
  groupUndecidedPhotos: false,
  displayedUndecidedGroupIds: [],
};

export const photoViewSpecReducer = (
  state: PhotoViewSpec = initialState,
  action: TedTaggerModelBaseAction<SetPhotoLayoutPayload & SetNumGridColumnsPayload & SetSurveyModeZoomFactorPayload & SetLoupeViewMediaItemIdPayload & SetFocusedSurveyViewMediaItemIdPayload & SetDisplayMetadata & SetScrollPositionPayload & SetFullScreenModePayload & SetMediaItemZoomFactorPayload & SetDisplayedAlbumNodeIdsPayload & SetDisplayedPhotoStatesPayload & SetGroupUndecidedPhotosPayload & SetDisplayedUndecidedGroupIdsPayload>
): PhotoViewSpec => {
  switch (action.type) {
    case SET_PHOTO_LAYOUT:
      return {
        ...state,
        photoLayout: action.payload.photoLayout,
      };
    case SET_ZOOM_FACTOR:
      return {
        ...state,
        numGridColumns: action.payload.numGridColumns,
      };
    case SET_LOUPE_VIEW_MEDIA_ITEM_ID:
      return {
        ...state,
        loupeViewMediaItemId: action.payload.loupeViewMediaItemId,
      };
    case SET_FOCUSED_SURVEY_VIEW_MEDIA_ITEM_ID:
      return {
        ...state,
        focusedSurveyViewMediaItemId: action.payload.focusedSurveyViewMediaItemId,
      };
    case SET_DISPLAYED_ALBUM_NODE_IDS:
      return {
        ...state,
        displayedAlbumNodeIds: action.payload.displayedAlbumNodeIds,
      };
    case SET_DISPLAYED_REVIEW_LEVELS:
      return {
        ...state,
        displayedPhotoStates: action.payload.displayedPhotoStates,
      };
    case SET_FULL_SCREEN_MODE:
      return {
        ...state,
        fullScreenMode: action.payload.fullScreenMode,
      };
    case SET_DISPLAYED_UNDECIDED_GROUP_IDS:
      return {
        ...state,
        displayedUndecidedGroupIds: action.payload.displayedUndecidedGroupIds,
      };
    case SET_DISPLAY_METADATA:
      return {
        ...state,
        displayMetadata: action.payload.displayMetadata,
      };
    case SET_SURVEY_MODE_ZOOM_FACTOR:
      return {
        ...state,
        surveyModeZoomFactor: action.payload.surveyModeZoomFactor,
      };
    case SET_SCROLL_POSITION:
      return {
        ...state,
        scrollPosition: action.payload.scrollPosition,
      };
    case SET_GROUP_UNDECIDED_PHOTOS:
      return {
        ...state,
        groupUndecidedPhotos: action.payload.groupUndecidedPhotos,
      };
    case SET_MEDIA_ITEM_ZOOM_FACTOR:
      return {
        ...state,
        mediaItemZoomFactorById: {
          ...state.mediaItemZoomFactorById,
          [action.payload.mediaItemId]: action.payload.zoomFactor,
        },
      };
    default:
      return state;
  }
};
