import { AlbumNode, AlbumTreeState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM_NODE = 'ADD_ALBUM_NODE';

// ------------------------------------
// Actions
// ------------------------------------

interface AddAlbumNodePayload {
  albumNode: AlbumNode;
}

export const addAlbumNodeRedux = (
  albumNode: AlbumNode,
): any => {
  console.log('albums.ts: addAlbumNodeRedux', albumNode);
  return {
    type: ADD_ALBUM_NODE,
    payload: {
      albumNode
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AlbumTreeState =
{
  albumTree: {
    nodes: [],
  }
};

export const albumTreeStateReducer = (
  state: AlbumTreeState = initialState,
  action: TedTaggerModelBaseAction< AddAlbumNodePayload>
): AlbumTreeState => {
  switch (action.type) {
    case ADD_ALBUM_NODE: {
      const { albumNode } = action.payload;
      // Prevent duplicates
      if (state.albumTree.nodes.some((node) => node.id === albumNode.id)) {
        return state; // No changes if duplicate exists
      }
      return {
        ...state,
        albumTree: {
          ...state.albumTree,
          nodes: [...state.albumTree.nodes, albumNode], // Append new album node
        },
      };
    }
    default:
      return state;
  }
};
