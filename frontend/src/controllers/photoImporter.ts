import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState } from "../types";
import { TedTaggerDispatch } from "../models";
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
      const response = await axios.post(uploadUrl, uploadBody, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
        },
      });

      console.log("Upload started:", response.data);

      console.log("Processing is fully complete!");

    } catch (error) {
      console.error("Upload failed", error);
    }
  }
};

