import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addAlbumRedux, addAlbums } from '../models';
import { serverUrl, apiUrlFragment, AlbumNode } from '../types';
import { setAlbumNodesRedux } from '../models/albumTree';

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

