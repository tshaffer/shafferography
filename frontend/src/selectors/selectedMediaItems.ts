import {
  MediaItem,
  TedTaggerState
} from '../types';

import { createSelector } from 'reselect';
import { getMediaItems } from './mediaItems';

const EMPTY_ARRAY: string[] = [];

export const getSelectedMediaItemIds = createSelector(
  (state: TedTaggerState) => state.selectionsState?.selectedMediaItemIds || EMPTY_ARRAY,
  (selectedMediaItemIds) => selectedMediaItemIds
);

export const getSelectedMediaItems = createSelector(
  [getSelectedMediaItemIds, getMediaItems],
  (selectedMediaItemIds, mediaItems) => {
    const selectedSet = new Set(selectedMediaItemIds); // Efficient lookup
    return mediaItems.filter(item => selectedSet.has(item.uniqueId));
  }
);

export const getSelectedMediaItemsCount = (state: TedTaggerState): number => {
  return state.selectionsState.selectedMediaItemIds.length;
};

export const getLastClickedId = (state: TedTaggerState): string | null => {
  return state.selectionsState.lastClickedId;
};

export const isMediaItemSelected = createSelector(
  [getSelectedMediaItemIds, (state, mediaItem) => mediaItem.uniqueId],
  (selectedMediaItemIds, mediaItemId) => {
    const result = selectedMediaItemIds.includes(mediaItemId);
    return result;
  }
);


