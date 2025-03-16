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


/*
// Create a selector that only includes properties that affect rendering
export const wgetFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): Pick<MediaItem, 'uniqueId' | 'fileName'>[] => {
    // if (!mediaItems || mediaItems.length === 0) {
    //   return [];
    // }
    // debugger;
    return mediaItems.map(({ uniqueId, fileName }) => ({ uniqueId, fileName })); // Exclude photoState
  }
);
*/

// Create a selector that only includes properties that affect rendering
// export const sgetFilteredMediaItems = createSelector(
//   [selectAllMediaItems],
//   (mediaItems: MediaItem[]): Pick<MediaItem, 'uniqueId' | 'fileName'>[] => {
//     return mediaItems.map(({ uniqueId, fileName }): Pick<MediaItem, 'uniqueId' | 'fileName'> => ({ uniqueId, fileName })); // Exclude photoState
//   }
// );

// export const zgetFilteredMediaItems = createSelector(
//   [selectAllMediaItems],
//   (mediaItems: MediaItem[]): Pick<MediaItem, "uniqueId" | "fileName">[] => {
//     const filteredItems = mediaItems.map(({ uniqueId, fileName }) => ({
//       uniqueId,
//       fileName,
//     }));
//     console.log("getFilteredMediaItems computed new array:", filteredItems);
//     return filteredItems;
//   }
// );

// Select raw media items from the state
/*
const selectAllMediaItems = (state: any): MediaItem[] =>
  state.mediaItemsState.mediaItems || [];

export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): Pick<MediaItem, "uniqueId" | "fileName">[] => {
    const newFilteredItems = mediaItems.map(({ uniqueId, fileName }) => ({
      uniqueId,
      fileName,
    }));

    const prevFilteredItems = getFilteredMediaItems.lastResult;

    if (
      prevFilteredItems &&
      prevFilteredItems.length === newFilteredItems.length &&
      prevFilteredItems.every((item, index) =>
        item.uniqueId === newFilteredItems[index].uniqueId &&
        item.fileName === newFilteredItems[index].fileName
      )
    ) {
      return prevFilteredItems; // Return previous array reference to prevent re-renders
    }

    getFilteredMediaItems.lastResult = newFilteredItems;
    return newFilteredItems;
  }
);
getFilteredMediaItems.lastResult = [] as Pick<
  MediaItem,
  "uniqueId" | "fileName"
>[];
*/

// Select raw media items from the state
const selectAllMediaItems = (state: any): MediaItem[] =>
  state.mediaItemsState.mediaItems || [];

const lastResult: Pick<MediaItem, "uniqueId" | "fileName">[] = [];

// Memoized selector that only recalculates if uniqueId or fileName changes
export const getFilteredMediaItems = createSelector(
  [selectAllMediaItems],
  (mediaItems: MediaItem[]): Pick<MediaItem, "uniqueId" | "fileName">[] => {
    const newFilteredItems = mediaItems.map(({ uniqueId, fileName }) => ({
      uniqueId,
      fileName,
    }));

    if (
      lastResult.length === newFilteredItems.length &&
      lastResult.every((item, index) =>
        item.uniqueId === newFilteredItems[index].uniqueId &&
        item.fileName === newFilteredItems[index].fileName
      )
    ) {
      return lastResult; // Return previous array reference to prevent re-renders
    }

    lastResult.length = 0; // Clear old array
    lastResult.push(...newFilteredItems); // Update array reference
    return lastResult;
  }
);
