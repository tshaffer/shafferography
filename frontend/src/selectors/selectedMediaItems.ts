import {
  MediaItem,
  TedTaggerState
} from '../types';

import { createSelector } from 'reselect';
import { getMediaItems } from './mediaItems';

const EMPTY_ARRAY: string[] = [];
const EMPTY_MEDIA_ITEMS: MediaItem[] = [];

export const getSelectedMediaItemIds = createSelector(
  (state: TedTaggerState) => state.selectionsState?.selectedMediaItemIds || [],
  (selectedMediaItemIds) => selectedMediaItemIds
);

export const getSelectedMediaItems = createSelector(
  [getSelectedMediaItemIds, getMediaItems],
  (selectedMediaItemIds, mediaItems) => {
    if (selectedMediaItemIds.length === 0) return EMPTY_MEDIA_ITEMS;

    const selectedSet = new Set(selectedMediaItemIds);
    const filteredMediaItems = mediaItems.filter(item => selectedSet.has(item.uniqueId));

    // If the computed array is identical to mediaItems, return the original array.
    if (filteredMediaItems.length === mediaItems.length &&
        filteredMediaItems.every((item, index) => item === mediaItems[index])) {
      return mediaItems;
    }

    return filteredMediaItems;
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


