import {
  MediaContentNode,
  TedTaggerState
} from '../types';

export const getAlbumTree = (state: TedTaggerState): MediaContentNode[] => {
  return state.albumTreeState.nodes;
};

export const getSelectedAlbumNodeIds = (state: TedTaggerState): Set<string> => {
  return state.albumTreeState.selectedNodeIds;
};

