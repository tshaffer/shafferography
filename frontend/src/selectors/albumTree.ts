import {
  AlbumNode,
  TedTaggerState
} from '../types';

export const getAlbumTree = (state: TedTaggerState): AlbumNode[] => {
  return state.albumTreeState.nodes;
};
