import {
  MediaContentNode,
  TedTaggerState
} from '../types';

export const getMediaContentTree = (state: TedTaggerState): MediaContentNode[] => {
  return state.mediaContentTreeState.nodes;
};

