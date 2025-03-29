import { createSelector } from 'reselect';

import {
  FILTERED_MEDIA_ITEM_KEYS,
  FilteredMediaItemPicker,
  MediaItem,
  StringToNumberLUT,
  TedTaggerState
} from '../types';
import { getMediaItemCountByAlbum } from './mediaItemsCount';

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

export const getMediaItemCountByAlbumFromState = (state: TedTaggerState): StringToNumberLUT => {
  console.log('getMediaItemCountByAlbumFromState entry');

  const oldValue: any = getMediaItemCountByAlbum(state);
  console.log('oldValue:', oldValue);

  let lastAlbumId: string | null = null;

  const mediaItemCountByAlbum: any = {};
  for (const mediaItem of state.mediaItemsState.mediaItems) {
    const albumId = mediaItem.albumId;
    if (albumId) {      
      lastAlbumId = albumId;
      mediaItemCountByAlbum[albumId] = (mediaItemCountByAlbum[albumId] || 0) + 1;
    } 
  }
  console.log('mediaItemCountByAlbum:', mediaItemCountByAlbum);

  const newValue: any = state.mediaItemsState.mediaItems.reduce((acc: StringToNumberLUT, mediaItem: MediaItem) => {
    const albumId = mediaItem.albumId;
    if (albumId) {
      acc[albumId] = (acc[albumId] || 0) + 1;
    }
    return acc;
  }, {});
  console.log('newValue: ', newValue);
  return newValue;
};
