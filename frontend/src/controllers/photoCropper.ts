import axios from "axios";
import { getServerUrl, apiUrlFragment, TedTaggerState } from "../types";

/*
      mediaItemId,
      cropData,
      createVariant,
*/

export const cropMediaItem = async (mediaItemId: string, cropData: any, createVariant: boolean): Promise<any> => {

  const body = { cropData, markPreferred: true };
  const path = getServerUrl() + apiUrlFragment + mediaItemId + "/derivatives";

  try {
    const response = await axios.post(path, body);
    if (response.status !== 200) {
      throw new Error(`Crop failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Crop failed", error);
  }

}
