import { v4 as uuidv4 } from 'uuid';
import { MediaContentNode, MediaContentTreeState, MediaContentNodeType } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';
import { cloneDeep } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ALBUM_NODE = 'ADD_ALBUM_NODE';
export const ADD_GROUP_NODE = 'ADD_GROUP_NODE';
export const MOVE_NODE = 'MOVE_NODE';
export const DELETE_NODES = 'DELETE_NODES';
export const RENAME_NODE = 'RENAME_NODE';
export const SET_MEDIA_CONTENT_NODES = 'SET_MEDIA_CONTENT_NODES';
export const SET_SELECTED_MEDIA_CONTENT_NODE_IDS = 'SET_SELECTED_MEDIA_CONTENT_NODE_IDS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddAlbumToTreePayload {
  mediaContentNode: MediaContentNode;
  // name: string;
  parentId?: string;
}

export const addAlbumToTreeRedux = (
  // name: string,
  mediaContentNode: MediaContentNode,
  parentId?: string
): any => {
  return {
    type: ADD_ALBUM_NODE,
    payload: {
      mediaContentNode, 
      // name,
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
    type: 'MOVE_NODE',
    payload: {
      nodeId,
      newParentId,
    }
  };
};

interface SetAlbumNodesPayload {
  albumNodes: MediaContentNode[];
}

export const setAlbumNodesRedux = (
  albumNodes: MediaContentNode[],
): any => {
  console.log('albums.ts: setAlbumNodesRedux', albumNodes);
  return {
    type: SET_MEDIA_CONTENT_NODES,
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
    type: SET_SELECTED_MEDIA_CONTENT_NODE_IDS,
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
export const deepCloneTree = (nodes: MediaContentNode[]): MediaContentNode[] => {
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
  nodes: MediaContentNode[],
  parentId: string | undefined,
  newNode: MediaContentNode
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
  nodes: MediaContentNode[],
  nodeId: string,
  newParentId: string
): MediaContentNode[] => {
  const sourceTree = deepCloneTree(nodes);

  const [movedNode, remainingTree] = (function findAndRemove(
    nodes: MediaContentNode[]
  ): [MediaContentNode | null, MediaContentNode[]] {
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
    nodes: MediaContentNode[]
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

const initialState: MediaContentTreeState =
{
  nodes: [],
  selectedNodeIds: new Set(),
};

export const albumTreeStateReducer = (
  state: MediaContentTreeState = initialState,
  action: TedTaggerModelBaseAction<AddAlbumToTreePayload & AddGroupToTreePayload & SetAlbumNodesPayload & SetSelectedAlbumNodeIdsPayload & MoveNodePayload & DeleteNodesPayload & RenameNodePayload>
): MediaContentTreeState => {
  switch (action.type) {
    case SET_MEDIA_CONTENT_NODES: {
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
      // const newAlbum: MediaContentNode = {
      //   id: uuidv4(),
      //   name: action.payload.name,
      //   type: MediaContentNodeType.Album,
      // };
      const newAlbum: MediaContentNode = action.payload.mediaContentNode;
      const newState = cloneDeep(state);
      const added = insertNode(newState.nodes, action.payload.parentId, newAlbum);
      if (!added) newState.nodes.push(newAlbum);
      return newState;
    }
    case ADD_GROUP_NODE: {
      const newGroup: MediaContentNode = {
        id: uuidv4(),
        name: action.payload.name,
        type: MediaContentNodeType.Group,
        children: [],
      };
      const newState = cloneDeep(state);
      const added = insertNode(newState.nodes, action.payload.parentId, newGroup);
      if (!added) newState.nodes.push(newGroup);
      return newState;
    }
    case MOVE_NODE: {
      const { nodeId, newParentId } = action.payload;
      const newNodes = moveNodeInTreeHelper(state.nodes, nodeId, newParentId);
      return {
        ...state,
        nodes: newNodes,
      };
    }
    case RENAME_NODE: {
      const rename = (nodes: MediaContentNode[]): boolean => {
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

      const filterTree = (nodes: MediaContentNode[]): MediaContentNode[] => {
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
    case SET_SELECTED_MEDIA_CONTENT_NODE_IDS: {
      return {
        ...state,
        selectedNodeIds: action.payload.selectedNodeIds,
      };
    }
    default:
      return state;
  }
};
