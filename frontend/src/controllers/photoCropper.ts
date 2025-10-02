import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState } from "../types";

export const cropMediaItem = async (mediaItemId: string): Promise<any> => {

  const body = { mediaItemId };
  const path = getServerUrl() + apiUrlFragment + 'open-in-preview';

  try {
    const response = await axios.post(path, body);
    if (response.status !== 200) {
      throw new Error(`Crop failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Crop failed", error);
  }

}
