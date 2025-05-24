import { AlbumNode, AlbumTreeState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM_NODE = 'ADD_ALBUM_NODE';
export const SET_ALBUM_NODES = 'SET_ALBUM_NODES';

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

interface SetAlbumNodesPayload {
  albumNodes: AlbumNode[];
}

export const setAlbumNodesRedux = (
  albumNodes: AlbumNode[],
): any => {
  console.log('albums.ts: setAlbumNodesRedux', albumNodes);
  return {
    type: SET_ALBUM_NODES,
    payload: {
      albumNodes
    }
  };
};
// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AlbumTreeState =
{
  nodes: [],
};

export const albumTreeStateReducer = (
  state: AlbumTreeState = initialState,
  action: TedTaggerModelBaseAction<AddAlbumNodePayload & SetAlbumNodesPayload>
): AlbumTreeState => {
  switch (action.type) {
    case SET_ALBUM_NODES: {
      const { albumNodes } = action.payload;
      // Prevent duplicates
      const existingNodeIds = new Set(state.nodes.map(node => node.id));
      const newNodes = albumNodes.filter(node => !existingNodeIds.has(node.id));
      return {
        ...state,
        nodes: [...state.nodes, ...newNodes], // Append new album nodes
      };
    }
    case ADD_ALBUM_NODE: {
      const { albumNode } = action.payload;
      // Prevent duplicates
      if (state.nodes.some((node) => node.id === albumNode.id)) {
        return state; // No changes if duplicate exists
      }
      return {
        ...state,
        nodes: [...state.nodes, albumNode], // Append new album node
      };
    }
    default:
      return state;
  }
};
