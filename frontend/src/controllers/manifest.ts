import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState } from "../types";
import { TedTaggerDispatch } from "../models";

export const fetchManifest = async (mediaItemId: string): Promise<any> => {

  return (dispatch: TedTaggerDispatch) => {

    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/manifest";

    return axios.get(path).then((response: any) => {
      debugger;
      return response.data;
    });
  }
}