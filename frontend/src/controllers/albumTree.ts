import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addAlbumRedux, addAlbums } from '../models';
import { serverUrl, apiUrlFragment, AlbumNode } from '../types';
import { addAlbumToTreeRedux, addGroupToTreeRedux, deleteNodesRedux, moveNodeInTreeRedux, setAlbumNodesRedux } from '../models/albumTree';

export const loadAlbumTree = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'album-tree';
    return axios.get(path)
      .then((response: any) => {
        const albumNodes: AlbumNode[] = response.data[0].nodes;
        dispatch(setAlbumNodesRedux(albumNodes));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const addGroupToTree = (name: string, parentId?: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(addGroupToTreeRedux(name, parentId));
    return Promise.resolve();
  }
};

export const addAlbumToTree = (name: string, parentId?: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    dispatch(addAlbumToTreeRedux(name, parentId));
    return Promise.resolve();

    //   const path = serverUrl + apiUrlFragment + 'album-tree';
    //   const album: AlbumNode = {
    //     id: '',
    //     name: name,
    //     parentId: parentId,
    //     children: [],
    //     isExpanded: false,
    //     isSelected: false,
    //   };
    //   return axios.post(path, album)
    //     .then((response: any) => {
    //       dispatch(addAlbumToTreeRedux(name, parentId));
    //       return Promise.resolve();
    //     }).catch((error) => {
    //       console.log('error');
    //       console.log(error);
    //       return '';
    //     });
    // };
  }
};

export const moveNodeInTree = (nodeId: string, newParentId: string): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(moveNodeInTreeRedux(nodeId, newParentId));
    return Promise.resolve();

    // const path = serverUrl + apiUrlFragment + 'album-tree/move-node';
    // return axios.post(path, { nodeId, newParentId })
    //   .then((response: any) => {
    //     dispatch(moveNodeInTreeRedux(nodeId, newParentId));
    //     return Promise.resolve();
    //   }).catch((error) => {
    //     console.log('error');
    //     console.log(error);
    //     return '';
    //   });
  };
}

export const deleteNodes = (nodeIds: string[]): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(deleteNodesRedux(nodeIds));
    return Promise.resolve();

    // const path = serverUrl + apiUrlFragment + 'album-tree/delete-nodes';
    // return axios.post(path, { nodeIds })
    //   .then((response: any) => {
    //     dispatch(deleteNodesRedux(nodeIds));
    //     return Promise.resolve();
    //   }).catch((error) => {
    //     console.log('error');
    //     console.log(error);
    //     return '';
    //   });
  };
}