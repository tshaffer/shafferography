import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, addPhotoSetRedux, addPhotoSets } from '../models';
import { serverUrl, apiUrlFragment, PhotoSet } from '../types';

export const loadPhotoSets = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'photoSets';
    return axios.get(path)
      .then((response: any) => {
        const photoSets: PhotoSet[] = response.data;
        dispatch(addPhotoSets(photoSets));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const addPhotoSet = (photoSet: PhotoSet): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'photoSet';
    return axios.post(path, photoSet)
      .then((response: any) => {
        dispatch(addPhotoSetRedux(photoSet));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
}
