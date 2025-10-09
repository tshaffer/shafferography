import axios from "axios";
import { setViewVariant } from "../models";
import { getServerUrl, apiUrlFragment, ViewVariant } from "../types";

export const persistPreferredVariant = (
  mediaItemId: string,
  payload: { kind: 'original' } | { kind: 'derivative'; derivativeId: string }
) => async (dispatch: any, getState: any) => {
  console.log("Persisting preferred variant:", mediaItemId, payload);

  const variant: ViewVariant = payload.kind === 'original'
    ? 'original'
    : { kind: 'derivative', id: payload.derivativeId };
  dispatch(setViewVariant(mediaItemId, variant));

  const derivativeId = payload.kind === 'derivative' ? payload.derivativeId : mediaItemId;
  const path = getServerUrl() + apiUrlFragment + mediaItemId + "/preferred/" + derivativeId;

  return axios.put(path)
    .then((response: any) => {
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });

};