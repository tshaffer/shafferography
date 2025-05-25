import { v4 as uuidv4 } from 'uuid';
import { AlbumNode, AlbumTreeState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';
import { cloneDeep } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM_NODE = 'ADD_ALBUM_NODE';
export const ADD_GROUP_NODE = 'ADD_GROUP_NODE';
export const SET_ALBUM_NODES = 'SET_ALBUM_NODES';
export const SET_SELECTED_ALBUM_NODE_IDS = 'SET_SELECTED_ALBUM_NODE_IDS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddAlbumToTreePayload {
  name: string;
  parentId?: string;
}

export const addAlbumToTreeRedux = (
  name: string,
  parentId?: string
): any => {
  return {
    type: ADD_ALBUM_NODE,
    payload: {
      name,
      parentId,
    }
  };
};

interface AddGroupToTreePayload {
  name: string;
  parentId?: string;
}

export const addGroupToTreeRedux = (
  name: string,
  parentId?: string
): any => {
  return {
    type: ADD_GROUP_NODE,
    payload: {
      name,
      parentId,
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

interface SetSelectedAlbumNodeIdsPayload {
  selectedNodeIds: Set<string>;
}
export const setSelectedAlbumNodeIdsRedux = (
  selectedNodeIds: Set<string>
): any => {
  return {
    type: SET_SELECTED_ALBUM_NODE_IDS,
    payload: {
      selectedNodeIds
    }
  };
};

// ------------------------------------
// Utilities
// ------------------------------------

/**
 * Insert a new node under a parent by ID.
 */
const insertNode = (
  nodes: AlbumNode[],
  parentId: string | undefined,
  newNode: AlbumNode
): boolean => {
  for (const node of nodes) {
    if (node.type === 'group' && node.id === parentId) {
      node.children.push(newNode);
      return true;
    }
    if (node.type === 'group') {
      const added = insertNode(node.children, parentId, newNode);
      if (added) return true;
    }
  }
  return false;
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AlbumTreeState =
{
  nodes: [],
  selectedNodeIds:new Set(),
};

export const albumTreeStateReducer = (
  state: AlbumTreeState = initialState,
  action: TedTaggerModelBaseAction<AddAlbumToTreePayload & AddGroupToTreePayload & SetAlbumNodesPayload & SetSelectedAlbumNodeIdsPayload>
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
      const newAlbum: AlbumNode = {
        id: uuidv4(),
        name: action.payload.name,
        type: 'album',
        mediaCount: 0,
      };
      const newState = cloneDeep(state);
      const added = insertNode(newState.nodes, action.payload.parentId, newAlbum);
      if (!added) newState.nodes.push(newAlbum);
      return newState;
    }
    case ADD_GROUP_NODE: {
      const newGroup: AlbumNode = {
        id: uuidv4(),
        name: action.payload.name,
        type: 'group',
        children: [],
      };
      const newState = cloneDeep(state);
      const added = insertNode(newState.nodes, action.payload.parentId, newGroup);
      if (!added) newState.nodes.push(newGroup);
      return newState;
    }
    case SET_SELECTED_ALBUM_NODE_IDS: {
      return {
        ...state,
        selectedNodeIds: action.payload.selectedNodeIds,
      };
    }
    default:
      return state;
  }
};
