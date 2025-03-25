import {
  Album,
  TedTaggerState
} from '../types';

export const getAlbums = (state: TedTaggerState): Album[] => {
  return state.albumsState.albums;
};

export const getAlbum = (state: TedTaggerState, albumId: string): Album | undefined => {
  return getAlbums(state).find(album => album.albumId === albumId);
}
