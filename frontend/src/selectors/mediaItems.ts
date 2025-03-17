import { createSelector } from 'reselect';

import {
  FILTERED_MEDIA_ITEM_KEYS,
  FilteredMediaItemPicker,
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

// const selectAllMediaItems = (state: any): MediaItem[] =>
//   state.mediaItemsState.mediaItems || [];

const selectAllMediaItems = (state: TedTaggerState): MediaItem[] =>
  [...state.mediaItemsState.mediaItems]; // Ensures a new array reference

// Persistent cache for memoization
let previousMediaItems: FilteredMediaItemPicker[] = [];

const old_mediaItemsUnchanged = (previousMediaItems: FilteredMediaItemPicker[], mediaItems: MediaItem[]): boolean => {
  if (
    previousMediaItems.every((mediaItem, index) =>
      FILTERED_MEDIA_ITEM_KEYS.every(
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

export const old_getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): FilteredMediaItemPicker[] => {

    console.log("getFilteredMediaItems called");

    // If length is the same, check if items have actually changed
    if (
      previousMediaItems.length === mediaItems.length &&
      mediaItemsUnchanged(previousMediaItems, mediaItems)
    ) {
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


const not_as_old_mediaItemUnchanged = (previousMediaItem: FilteredMediaItemPicker, mediaItem: MediaItem): boolean => {
  return FILTERED_MEDIA_ITEM_KEYS.every(
    (mediaItemProperty) => previousMediaItem[mediaItemProperty] === mediaItem[mediaItemProperty as keyof MediaItem]
  );
}

const visibilityOfMediaItemChanged = (previousMediaItem: FilteredMediaItemPicker, mediaItem: MediaItem): boolean => {
  if (previousMediaItem['photoState'] === mediaItem['photoState']) {
    return false;
  };
  return true;
}

const mediaItemUnchanged = (previousMediaItem: FilteredMediaItemPicker, mediaItem: MediaItem): boolean => {
  return previousMediaItem['photoState'] === mediaItem['photoState'];
}

const mediaItemsUnchanged = (previousMediaItems: FilteredMediaItemPicker[], mediaItems: MediaItem[]): boolean => {
  if (
    previousMediaItems.every((mediaItem, index) =>
      mediaItemUnchanged(mediaItem, mediaItems[index])
    )
  ) {
    // console.log("getFilteredMediaItems unchanged");
    return true; // Return previous reference if unchanged
  } else {
    // console.log("getFilteredMediaItems changed");
    return false;
  }
}

export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): FilteredMediaItemPicker[] => {

    console.log("getFilteredMediaItems called");

    // If length is the same, no other property changes effect visibility
    if (previousMediaItems.length === mediaItems.length) {
      // console.log('length is the same');
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

    // console.log("getFilteredMediaItems recomputed");
    // console.log(newFilteredItems);

    console.log('previousMediaItems updated');
    previousMediaItems = newFilteredItems; // Update cache
    return newFilteredItems;
  }
);
