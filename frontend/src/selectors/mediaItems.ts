import { createSelector } from 'reselect';

import {
  FilteredMediaItemPicker,
  FilteredTopLevelKey,
  FilteredTopLevelKeys,
  // FilteredMediaItemPicker,
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
let prevSignature = '';

export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): FilteredMediaItemPicker[] => {
    // Build a signature that changes if length/order or exif size changes
    const signature = mediaItems
      .map(mi => `${mi.uniqueId}:${mi.exif?.width ?? 0}x${mi.exif?.height ?? 0}`)
      .join("|");

    if (signature === prevSignature) return previousMediaItems;

    const newFilteredItems: FilteredMediaItemPicker[] = mediaItems.map(item => {
      // copy top-level keys that remain
      const base = {} as Pick<MediaItem, FilteredTopLevelKey>;
      for (const k of FilteredTopLevelKeys) base[k] = item[k] as any;

      return {
        ...base,
        width: item.exif?.width,
        height: item.exif?.height,
      };
    });

    prevSignature = signature;
    previousMediaItems = newFilteredItems;
    return newFilteredItems;
  }
);

