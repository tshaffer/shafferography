import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState, MediaItem } from "../types";
import { replaceMediaItemRedux, TedTaggerDispatch } from "../models";
import { getSelectedMediaItemIds } from "../selectors";

export const reimportPhotosFromDrive = (): any => {

  return async (dispatch: TedTaggerDispatch, getState: any) => {

    const state: TedTaggerState = getState();
    const mediaItemIds: string[] = getSelectedMediaItemIds(state);

    const uploadUrl = getServerUrl() + apiUrlFragment + 'reimportPhotos';

    const uploadBody = {
      mediaItemIds,
    };

    try {
      const response = await axios.post(uploadUrl, uploadBody);
      if (response.status !== 200) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      const updatedMediaItem: MediaItem = response.data;
      dispatch(replaceMediaItemRedux(updatedMediaItem));
      // dispatch(reloadMediaItemsByViewSpec());
    } catch (error) {
      console.error("Upload failed", error);
    }
  }
};

