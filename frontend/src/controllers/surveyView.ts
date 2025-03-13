import { TedTaggerDispatch, setPhotoLayoutRedux } from '../models';
import { getSelectedMediaItemIds } from '../selectors';
import { PhotoLayout, PhotoState, TedTaggerState } from '../types';
import { setPhotoState } from './mediaItems';

export const deleteSurveyViewImageContainerItem = (mediaItemId: string) => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(setPhotoState([mediaItemId], PhotoState.Deleted))
      .then(() => {
        const state: TedTaggerState = getState();
        const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
        if (selectedMediaItemIds.length < 2) {
          dispatch(setPhotoLayoutRedux(PhotoLayout.Grid));
        }
      });
  };
};
