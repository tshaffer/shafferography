import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addAlbumRedux, addAlbums } from '../models';
import { serverUrl, apiUrlFragment, Album, AlbumNode } from '../types';

export const loadAlbumTree = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'album-tree';
    return axios.get(path)
      .then((response: any) => {
        const getAlbumNodes: AlbumNode[] = response.data;
        // dispatch(addAlbums(albums));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

