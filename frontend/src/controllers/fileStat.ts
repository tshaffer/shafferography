import axios from "axios";
import { getServerUrl, apiUrlFragment } from "../types";

export const getFileStat = async (mediaItemId: string): Promise<any> => {

  let path = getServerUrl()
    + apiUrlFragment
    + 'file-stat';

  path += '?mediaItemId=' + mediaItemId;

  return axios.get(path)

    .then((fileStatResponse: any) => {

      console.log('fileStat response', fileStatResponse);
      console.log('fileStat response as json', fileStatResponse.data);
      const mtimeMs = fileStatResponse.data.mtimeMs;
      console.log('mtimeMs', mtimeMs);

      return fileStatResponse.data;
    });
}

