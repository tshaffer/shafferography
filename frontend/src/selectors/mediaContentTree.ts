import {
  MediaContentNode,
  TedTaggerState
} from '../types';

export const getMediaContentTree = (state: TedTaggerState): MediaContentNode[] => {
  return state.mediaContentTreeState.nodes;
};

export const getSelectedMediaContentNodeIds = (state: TedTaggerState): Set<string> => {
  return state.mediaContentTreeState.selectedNodeIds;
};

