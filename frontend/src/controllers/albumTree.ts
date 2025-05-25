import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addAlbumRedux, addAlbums } from '../models';
import { serverUrl, apiUrlFragment, AlbumNode } from '../types';
import { addAlbumToTreeRedux, setAlbumNodesRedux } from '../models/albumTree';

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


