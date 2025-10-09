import axios from "axios";
import { getServerUrl, apiUrlFragment, MediaManifest } from "../types";
import { TedTaggerDispatch } from "../models";
import { setManifest } from "../models/manifest";

export const fetchManifest = (mediaItemId: string) =>
  async (dispatch: TedTaggerDispatch) => {
    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/manifest";
    const getManifestResponse = await axios.get(path);
    const manifest: MediaManifest = getManifestResponse.data;
    dispatch(setManifest(manifest));
    return manifest;
  };
