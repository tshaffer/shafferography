import axios from 'axios';
import { serverUrl, apiUrlFragment } from '../types';

export const getAlbumNamesWherePeopleNotRetrieved = async (): Promise<string[]> => {

  const path = serverUrl + apiUrlFragment + 'albumNamesWherePeopleNotRetrieved';

  return axios.get(path)
    .then((response: any) => {
      const albumNames: string[] = response.data;
      return Promise.resolve(albumNames);
    }).catch((error) => {
      console.log('error');
      console.log(error);
      throw new Error(error);
    });
};

