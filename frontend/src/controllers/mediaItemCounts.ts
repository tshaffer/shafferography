import axios from 'axios';

import { setMediaItemCounts, TedTaggerDispatch } from "../models"
import { getServerUrl, apiUrlFragment, MediaItemsCountState } from "../types";

export const loadMediaItemCounts = (): any => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    let path = getServerUrl() + apiUrlFragment + 'stats/mediaItemCounts';

    return axios.get(path)
      .then((mediaItemCountsResponse: any) => {
        const mediaItemsCount: MediaItemsCountState = mediaItemCountsResponse.data;
        // console.log('mediaItemCounts loaded: ', mediaItemsCount);
        dispatch(setMediaItemCounts(mediaItemsCount));
      });
  }
}