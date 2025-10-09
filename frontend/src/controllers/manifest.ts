import axios from "axios";
import { getServerUrl, apiUrlFragment, MediaManifest } from "../types";
import { setViewVariant, TedTaggerDispatch } from "../models";
import { setManifest } from "../models/manifest";
import { getViewVariant } from "../selectors/mediaView";

export const fetchManifest = (mediaItemId: string) =>
  async (dispatch: TedTaggerDispatch) => {
    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/manifest";
    const getManifestResponse = await axios.get(path);
    const manifest: MediaManifest = getManifestResponse.data;
    dispatch(setManifest(manifest));
    return manifest;
  };

// controllers/index.ts
export const persistPreferredVariant = (
  mediaItemId: string,
  payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
) => async (dispatch: any, getState: any) => {
  console.log("Persisting preferred variant:", mediaItemId, payload);

  const state = getState();
  const viewVariant = getViewVariant(state, mediaItemId);
  dispatch(setViewVariant(mediaItemId, viewVariant!)); // Update Redux state immediately
  // 1) Call backend:
  //    - if kind === 'original' → set preferredDerivativeId = null
  //    - if derivative → set preferredDerivativeId = payload.derivativeId
  // 2) Dispatch a Redux action to update the media item in state (so UI reflects the change immediately).
};
