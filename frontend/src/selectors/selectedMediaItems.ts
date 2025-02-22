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
    if (selectedMediaItemIds.length === 0) return EMPTY_ARRAY; // Return same reference for empty state

    const selectedSet = new Set(selectedMediaItemIds);
    const filteredMediaItems = mediaItems.filter(item => selectedSet.has(item.uniqueId));

    // Memoize result deeply to prevent unnecessary recalculations
    return filteredMediaItems.length === mediaItems.length &&
      filteredMediaItems.every((item, index) => item === mediaItems[index])
      ? mediaItems
      : filteredMediaItems;
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


