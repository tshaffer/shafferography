import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addAlbumRedux, addAlbums } from '../models';
import { serverUrl, apiUrlFragment, Album } from '../types';

export const loadAlbums = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'albums';
    return axios.get(path)
      .then((response: any) => {
        const albums: Album[] = response.data;
        dispatch(addAlbums(albums));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const addAlbum = (album: Album): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'album';
    return axios.post(path, album)
      .then((response: any) => {
        dispatch(addAlbumRedux(album));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
}
