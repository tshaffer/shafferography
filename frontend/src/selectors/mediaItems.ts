import { createSelector } from 'reselect';

import {
  FILTERED_MEDIA_ITEM_KEYS,
  FilteredMediaItemPicker,
  FilteredMediaItemPickerPropertyNamesArray,
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

const selectAllMediaItems = (state: any): MediaItem[] =>
  state.mediaItemsState.mediaItems || [];

// Persistent cache for memoization
let previousMediaItems: FilteredMediaItemPicker[] = [];

const mediaItemsUnchanged = (previousMediaItems: FilteredMediaItemPicker[], mediaItems: MediaItem[]): boolean => {
  if (previousMediaItems.length !== mediaItems.length) {
    return false;
  }
  if (
    previousMediaItems.length === mediaItems.length &&
    previousMediaItems.every((mediaItem, index) =>
      FilteredMediaItemPickerPropertyNamesArray.every(
        (mediaItemProperty) => mediaItem[mediaItemProperty] === mediaItems[index][mediaItemProperty as keyof MediaItem]
      )
    )
  ) {
    console.log("getFilteredMediaItems unchanged");
    return true; // Return previous reference if unchanged
  } else {
    console.log("getFilteredMediaItems changed");
    return false;
  }
}

export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): FilteredMediaItemPicker[] => {

    console.log("getFilteredMediaItems called");

    // If length is the same, check if items have actually changed
    if (
      previousMediaItems.length === mediaItems.length &&
      mediaItemsUnchanged(previousMediaItems, mediaItems)
    ) {
      console.log("getFilteredMediaItems unchanged");
      return previousMediaItems; // Return previous reference if unchanged
    }

    // Otherwise, recompute the filtered items
    const newFilteredItems: FilteredMediaItemPicker[] = mediaItems.map((item) => {
      const filteredItem = {} as Record<keyof FilteredMediaItemPicker, any>; // Allow dynamic keys
    
      for (const key of FILTERED_MEDIA_ITEM_KEYS) {
        filteredItem[key] = item[key as keyof MediaItem]; // Explicitly cast `key`
      }
    
      return filteredItem as FilteredMediaItemPicker; // Cast back to the correct type
    });
        
    console.log("getFilteredMediaItems recomputed");
    console.log(newFilteredItems);

    previousMediaItems = newFilteredItems; // Update cache
    return newFilteredItems;
  }
);
