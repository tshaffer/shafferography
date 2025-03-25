import { TedTaggerState, PhotoViewSpec, PhotoLayout, PhotoState, UndecidedGroup } from '../types';
import { getUndecidedGroup } from './undecidedGroups';

export const getPhotoViewSpec = (state: TedTaggerState): PhotoViewSpec => {
  return state.photoViewSpec;
};

export const getPhotoLayout = (state: TedTaggerState): PhotoLayout => {
  return state.photoViewSpec.photoLayout;
};

export const getNumGridColumns = (state: TedTaggerState): number => {
  return state.photoViewSpec.numGridColumns;
};

export const getLoupeViewMediaItemId = (state: TedTaggerState): string => {
  return state.photoViewSpec.loupeViewMediaItemId;
};

export const getDisplayMetadata = (state: TedTaggerState): boolean => {
  return state.photoViewSpec.displayMetadata;
};

export const getSurveyModeZoomFactor = (state: TedTaggerState): number => {
  return state.photoViewSpec.surveyModeZoomFactor;
};

export const getScrollPosition = (state: TedTaggerState): number => {
  return state.photoViewSpec.scrollPosition;
};

export const getFullScreenMode = (state: TedTaggerState): boolean => {
  return state.photoViewSpec.fullScreenMode;
};

export const getMediaItemZoomFactor = (state: TedTaggerState, mediaItemId: string): number => {
  return state.photoViewSpec.mediaItemZoomFactorById[mediaItemId] || 1;
};

export const getDisplayedAlbumIds = (state: TedTaggerState): string[] => {
  return state.photoViewSpec.displayedAlbumIds;
};

export const getDisplayedPhotoStates = (state: TedTaggerState): PhotoState[] => {
  return state.photoViewSpec.displayedPhotoStates;
};

export const getDisplayedUndecidedGroupIds = (state: TedTaggerState): string[] => {
  return state.photoViewSpec.displayedUndecidedGroupIds;
}

export const getDisplayedUndecidedGroups = (state: TedTaggerState): UndecidedGroup[] => {
  const displayedUndecidedGroups: UndecidedGroup[] = [];
  for (const displayedUndecidedGroupId of state.photoViewSpec.displayedUndecidedGroupIds) {
    const undecidedGroup: UndecidedGroup = getUndecidedGroup(state, displayedUndecidedGroupId)!;
    displayedUndecidedGroups.push(undecidedGroup);
  }
  return displayedUndecidedGroups;
}


export const getGroupUndecidedPhotos = (state: TedTaggerState): boolean => {
  return state.photoViewSpec.groupUndecidedPhotos;
};
