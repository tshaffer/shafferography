import {
  AlbumNode,
  TedTaggerState
} from '../types';

export const getAlbumTree = (state: TedTaggerState): AlbumNode[] => {
  return state.albumTreeState.nodes;
};

export const getSelectedAlbumNodeIds = (state: TedTaggerState): Set<string> => {
  return state.albumTreeState.selectedNodeIds;
};

