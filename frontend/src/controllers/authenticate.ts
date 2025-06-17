import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch } from '../models';
import { apiUrlFragment, getServerUrl, MediaItem } from '../types';

export const authenticate = (): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch) => {

    const path = getServerUrl()
      + apiUrlFragment
      + 'authenticate';

    return axios.get(path)
      .then((response: any) => {
        console.log('authenticate response');
        console.log(response);
        console.log(response.data);
        return Promise.resolve();
      });
  };
};

