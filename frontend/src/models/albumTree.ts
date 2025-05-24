import { v4 as uuidv4 } from 'uuid';
import { AlbumNode, AlbumTreeState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';
import { cloneDeep } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM_NODE = 'ADD_ALBUM_NODE';
export const ADD_GROUP_NODE = 'ADD_GROUP_NODE';
export const MOVE_NODE_IN_TREE = 'MOVE_NODE_IN_TREE';
export const DELETE_NODES = 'DELETE_NODES';
export const RENAME_NODE = 'RENAME_NODE';
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

interface DeleteNodesPayload {
  nodeIds: string[];
}
export const deleteNodesRedux = (
  nodeIds: string[]
): any => {
  return {
    type: 'DELETE_NODES',
    payload: {
      nodeIds,
    }
  };
};

interface RenameNodePayload {
  nodeId: string;
  newName: string;
}

export const renameNodeRedux = (
  nodeId: string,
  newName: string
): any => {
  return {
    type: 'RENAME_NODE',
    payload: {
      nodeId,
      newName,
    }
  };
};

interface MoveNodePayload {
  nodeId: string;
  newParentId: string;
}

export const moveNodeInTreeRedux = (
  nodeId: string,
  newParentId: string
): any => {
  return {
    type: 'MOVE_NODE_IN_TREE',
    payload: {
      nodeId,
      newParentId,
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
 * Deep clone a tree of AlbumNode objects.
 */
export const deepCloneTree = (nodes: AlbumNode[]): AlbumNode[] => {
  return nodes.map(node => {
    if (node.type === 'group') {
      return {
        ...node,
        children: deepCloneTree(node.children),
      };
    } else {
      return { ...node };
    }
  });
};

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

export const moveNodeInTreeHelper = (
  nodes: AlbumNode[],
  nodeId: string,
  newParentId: string
): AlbumNode[] => {
  const sourceTree = deepCloneTree(nodes);

  const [movedNode, remainingTree] = (function findAndRemove(
    nodes: AlbumNode[]
  ): [AlbumNode | null, AlbumNode[]] {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === nodeId) {
        return [node, [...nodes.slice(0, i), ...nodes.slice(i + 1)]];
      }
      if (node.type === 'group') {
        const [found, updatedChildren] = findAndRemove(node.children);
        if (found) {
          return [found, [
            ...nodes.slice(0, i),
            { ...node, children: updatedChildren },
            ...nodes.slice(i + 1),
          ]];
        }
      }
    }
    return [null, nodes];
  })(sourceTree);

  if (!movedNode) return nodes;

  const didInsert = (function insert(
    nodes: AlbumNode[]
  ): boolean {
    for (const node of nodes) {
      if (node.type === 'group' && node.id === newParentId) {
        node.children.push(movedNode);
        return true;
      }
      if (node.type === 'group' && insert(node.children)) {
        return true;
      }
    }
    return false;
  })(remainingTree);

  return didInsert ? remainingTree : nodes;
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
  action: TedTaggerModelBaseAction<AddAlbumToTreePayload & AddGroupToTreePayload & SetAlbumNodesPayload & SetSelectedAlbumNodeIdsPayload & MoveNodePayload & DeleteNodesPayload & RenameNodePayload>
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
    case MOVE_NODE_IN_TREE: {
      const { nodeId, newParentId } = action.payload;
      const newNodes = moveNodeInTreeHelper(state.nodes, nodeId, newParentId);
      return {
        ...state,
        nodes: newNodes,
      };
    }
    case RENAME_NODE: {
      const rename = (nodes: AlbumNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === action.payload.nodeId) {
            node.name = action.payload.newName;
            return true;
          }
          if (node.type === 'group') {
            if (rename(node.children)) return true;
          }
        }
        return false;
      };
      const newState = cloneDeep(state);
      rename(newState.nodes);
      return newState;
    }
    case DELETE_NODES: {
      const idsToDelete = new Set(action.payload.nodeIds);

      const filterTree = (nodes: AlbumNode[]): AlbumNode[] => {
        return nodes
          .filter(node => !idsToDelete.has(node.id))
          .map(node =>
            node.type === 'group'
              ? { ...node, children: filterTree(node.children) }
              : node
          );
      };

      return {
        ...state,
        nodes: filterTree(state.nodes),
      };
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
