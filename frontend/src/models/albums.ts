import { Album, AlbumsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM = 'ADD_ALBUM';
export const ADD_ALBUMS = 'ADD_ALBUMS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddAlbumPayload {
  album: Album;
}

export const addAlbumRedux = (
  album: Album,
): any => {
  console.log('albums.ts: addAlbumRedux', album);
  return {
    type: ADD_ALBUM,
    payload: {
      album
    }
  };
};

interface AddAlbumsPayload {
  albums: Album[];
}

export const addAlbums = (
  albums: Album[],
): any => {
  return {
    type: ADD_ALBUMS,
    payload: {
      albums
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AlbumsState =
{
  albums: [],
};

export const albumsStateReducer = (
  state: AlbumsState = initialState,
  action: TedTaggerModelBaseAction<AddAlbumsPayload & AddAlbumPayload>
): AlbumsState => {
  switch (action.type) {
    case ADD_ALBUM: {
      const { album } = action.payload as AddAlbumPayload;
      // Prevent duplicates
      if (state.albums.some((set) => set.albumId === album.albumId)) {
        return state; // No changes if duplicate exists
      }
      return {
        ...state,
        albums: [...state.albums, album], // Append new album
      };
    }
    case ADD_ALBUMS: {
      const { albums } = action.payload as AddAlbumsPayload;
      // Create a set of existing IDs to prevent duplicates
      const existingAlbumIds = new Set(state.albums.map((set) => set.albumId));
      const newAlbums = albums.filter(
        (set) => !existingAlbumIds.has(set.albumId) // Exclude duplicates
      );
      return {
        ...state,
        albums: [...state.albums, ...newAlbums], // Merge new unique albums
      };
    }
    default:
      return state;
  }
};
