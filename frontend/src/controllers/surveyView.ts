import { TedTaggerDispatch, setPhotoLayoutRedux } from '../models';
import { getSelectedMediaItemIds } from '../selectors';
import { PhotoLayout, PhotoState, TedTaggerState } from '../types';
import { setPhotoState } from './mediaItems';
import { deselectMediaItems } from './selectMediaItem';

export const deleteSurveyViewImageContainerItem = (mediaItemId: string) => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    return dispatch(setPhotoState([mediaItemId], PhotoState.Deleted))
      .then(() => {
        dispatch(deselectMediaItems([mediaItemId]));
        const state: TedTaggerState = getState();
        const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
        if (selectedMediaItemIds.length < 2) {
          dispatch(setPhotoLayoutRedux(PhotoLayout.Grid));
        }
      });
  };
};
