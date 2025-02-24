import { serverUrl, apiUrlFragment } from '../types';
import axios from 'axios';

export const mergePeopleTakeout = async (albumName: string): Promise<any> => {
  
  const mergePeopleTakeoutUrl = serverUrl + apiUrlFragment + 'mergePeopleTakeout';

  const mergePeopleTakeoutBody = {
    albumName,
  };

  return axios.post(
    mergePeopleTakeoutUrl,
    mergePeopleTakeoutBody
  ).then((response) => {
    console.log('mergePeopleTakeout response', response);
    return Promise.resolve(response);
  }).catch((error) => {
    console.log('error');
    console.log(error);
    return '';
  });
};
