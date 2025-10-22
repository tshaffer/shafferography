import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch } from '../models';
import { apiUrlFragment, getServerUrl } from '../types';
import { MediaItem } from '@shared/types/mediaItem';

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

