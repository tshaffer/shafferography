import axios from "axios";
import { setViewVariant } from "../models";
import { getViewVariant } from "../selectors/mediaView";
import { getServerUrl, apiUrlFragment } from "../types";

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

  /*
  
  persistPreferredVariant
    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/derivatives";
    app.put('/api/v1/:id/preferred/:derivativeId', putPreferred);
    // router.put("/:id/preferred/:derivativeId", async (req: Request, res: Response) => {

  cropMediaItem
    const body = { cropData, markPreferred: true };
    const path = getServerUrl() + apiUrlFragment + mediaItemId + "/derivatives";
    app.post('/api/v1/:mediaItemId/derivatives', generateDerivativeEndpoint);

  generateDerivativeEndpoint
    const { mediaItemId } = req.params;
    const body = req.body;
    body.cropData
  
  */
  const derivativeId = payload.kind === 'derivative' ? payload.derivativeId : mediaItemId;
  const path = getServerUrl() + apiUrlFragment + mediaItemId + "/preferred/" + derivativeId;


  // const path = getServerUrl() + apiUrlFragment + 'album-tree';
  // const body = {
  //   mediaItemId,
  //   payload,
  // };
  return axios.put(path)
    .then((response: any) => {
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });

};