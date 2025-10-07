import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState, MediaManifest } from "../types";
import { TedTaggerDispatch } from "../models";
import { setManifest } from "../models/manifest";

// controllers/manifest.ts (or wherever)
export const fetchManifest = (mediaItemId: string) =>
  async (dispatch: any) => {
    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/manifest";

    const getManifestResponse = await axios.get(path);
    const manifest: MediaManifest = getManifestResponse.data;
    dispatch(setManifest(manifest));
    return manifest;
  };

