import {
  AlbumTree,
  TedTaggerState
} from '../types';

export const getAlbumTree = (state: TedTaggerState): AlbumTree => {
  return state.albumTreeState.albumTree;
};
