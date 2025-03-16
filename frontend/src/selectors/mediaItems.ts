import { createSelector } from 'reselect';

import {
  MediaItem,
  TedTaggerState
} from '../types';

export const getMediaItems = (state: TedTaggerState): MediaItem[] => {
  return state.mediaItemsState.mediaItems;
};

export const getMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.mediaItems.map((mediaItem: MediaItem) => mediaItem.uniqueId);
};

export const getMediaItemById = (state: TedTaggerState, uniqueId: string): MediaItem | null => {

  for (const mediaItem of state.mediaItemsState.mediaItems) {
    if (mediaItem.uniqueId === uniqueId) {
      return mediaItem;
    }
  }

  return null;
};

export const getLoupeViewMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.loupeViewMediaItemIds;
};


// Select raw media items from the state
const selectAllMediaItems = (state: any): MediaItem[] => {
  return state.mediaItemsState.mediaItems || [];
}

// Create a selector that only includes properties that affect rendering
export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): Pick<MediaItem, 'uniqueId' | 'fileName'>[] => {
    if (!mediaItems || mediaItems.length === 0) {
      return [];
    }
    debugger;
    return mediaItems.map(({ uniqueId, fileName }) => ({ uniqueId, fileName })); // Exclude photoState
  }
);

