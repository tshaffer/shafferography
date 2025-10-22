import {
  TedTaggerState
} from '../types';
import { MediaItem } from '@shared/types/mediaItem';

import { getMediaItemById } from './mediaItems';

import { createSelector } from 'reselect';

const EMPTY_ARRAY: string[] = [];

export const getSelectedMediaItemsCount = (state: TedTaggerState): number => {
  return state.selectionsState.selectedMediaItemIds.length;
};

export const getSelectedMediaItems = (state: TedTaggerState): MediaItem[] => {
  const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
  const selectedMediaItems: MediaItem[] = [];
  for (const selectedMediaItemId of selectedMediaItemIds) {
    const selectedMediaItem = getMediaItemById(state, selectedMediaItemId);
    if (selectedMediaItem) {
      selectedMediaItems.push(selectedMediaItem);
    }
  }
  return selectedMediaItems;
};

export const getLastClickedId = (state: TedTaggerState): string | null => {
  return state.selectionsState.lastClickedId;
};

export const getSelectedMediaItemIds = createSelector(
  (state: TedTaggerState) => state.selectionsState?.selectedMediaItemIds || EMPTY_ARRAY,
  (selectedMediaItemIds) => selectedMediaItemIds
);

export const isMediaItemSelected = createSelector(
  [getSelectedMediaItemIds, (state, mediaItem) => mediaItem.uniqueId],
  (selectedMediaItemIds, mediaItemId) => {
    const result = selectedMediaItemIds.includes(mediaItemId);
    return result;
  }
);

