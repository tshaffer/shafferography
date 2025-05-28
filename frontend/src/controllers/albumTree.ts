import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch } from '../models';
import { serverUrl, apiUrlFragment, MediaContentNode } from '../types';
import { addAlbumToTreeRedux, addGroupToTreeRedux, deleteNodesRedux, moveNodeInTreeRedux, renameNodeRedux, setAlbumNodesRedux } from '../models/albumTree';
import { getAlbumTree } from '../selectors';

export const loadAlbumTree = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'album-tree';
    return axios.get(path)
      .then((response: any) => {
        const albumNodes: MediaContentNode[] = response.data[0].nodes;
        dispatch(setAlbumNodesRedux(albumNodes));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

const saveAlbumNodesToBackend = (state: any): Promise<string | void> => {

  const nodes: MediaContentNode[] = getAlbumTree(state);

  const path = serverUrl + apiUrlFragment + 'album-tree';
  const nodesBody = {
    nodes: nodes,
  };
  return axios.put(path, nodesBody)
    .then((response: any) => {
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
}

export const addGroupToTree = (name: string, parentId?: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(addGroupToTreeRedux(name, parentId));
    const state = getState();
    return saveAlbumNodesToBackend(state);
  }
};

export const addAlbumToTree = (name: string, parentId?: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    debugger;
    dispatch(addAlbumToTreeRedux(name, parentId));
    return Promise.resolve();
  }
};

export const moveNodeInTree = (nodeId: string, newParentId: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(moveNodeInTreeRedux(nodeId, newParentId));
    const state = getState();
    return saveAlbumNodesToBackend(state);
  }
}

export const deleteNodes = (nodeIds: string[]): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(deleteNodesRedux(nodeIds));
    const state = getState();
    return saveAlbumNodesToBackend(state);
  }
}

export const renameNode = (nodeId: string, newName: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(renameNodeRedux(nodeId, newName));
    const state = getState();
    return saveAlbumNodesToBackend(state);
  }
}
