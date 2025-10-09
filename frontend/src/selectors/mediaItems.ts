import { createSelector } from 'reselect';

import {
  FILTERED_MEDIA_ITEM_KEYS,
  FilteredMediaItemPicker,
  MediaItem,
  MediaManifest,
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

export const getMediaItemNotes = (state: TedTaggerState, uniqueId: string): string | undefined => {
  const mediaItem = state.mediaItemsState.mediaItems.find((item: MediaItem) => item.uniqueId === uniqueId);
  return mediaItem?.notes;
};

export const getLoupeViewMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.loupeViewMediaItemIds;
};

export const getSurveyViewMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.surveyViewMediaItemIds;
};

// export const getMediaItemsByUndecidedGroupId = (state: TedTaggerState, undecidedGroupId: string): MediaItem[] => {
//   return state.mediaItemsState.mediaItems.filter((mediaItem: MediaItem) => mediaItem.undecidedGroupId === undecidedGroupId);
// };

export const getMediaItemIdsByUndecidedGroupId = (state: TedTaggerState, undecidedGroupId: string): string[] => {
  return state.mediaItemsState.mediaItems
    .filter((mediaItem: MediaItem) => mediaItem.undecidedGroupId === undecidedGroupId)
    .map((mediaItem: MediaItem) => mediaItem.uniqueId);
};

const selectAllMediaItems = (state: TedTaggerState): MediaItem[] =>
  [...state.mediaItemsState.mediaItems]; // Ensures a new array reference

// Persistent cache for memoization
let previousMediaItems: FilteredMediaItemPicker[] = [];

export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): FilteredMediaItemPicker[] => {

    // If length is the same, no other property changes effect visibility
    if (previousMediaItems.length === mediaItems.length) {
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

    previousMediaItems = newFilteredItems; // Update cache
    return newFilteredItems;
  }
);

export const getMediaManifestById = (state: TedTaggerState, mediaItemId: string): MediaManifest | null => {

  const mediaItem = getMediaItemById(state, mediaItemId);
  if (!mediaItem) return null;

  const mediaManifest: MediaManifest = {
    mediaItemId: mediaItem.uniqueId,
    original: {
      width: mediaItem.width!,
      height: mediaItem.height!,
      mimeType: mediaItem.mimeType!,
    },
    derivatives: mediaItem.derivatives.map(d => ({
      derivativeId: d.derivativeId,
      label: d.label,
      width: d.width,
      height: d.height,
      mimeType: d.mimeType,
      filePath: d.filePath,
      url: d.url!,
      format: d.format,
      createdAt: d.createdAt
    })),
    preferredDerivativeId: mediaItem.preferredDerivativeId || null,
  };

  return mediaManifest;
};