import { TedTaggerState, MediaItemCountByUndecidedGroupPerAlbum, StringToNumberLUT } from '../types';

export const getMediaItemCountByAlbum = (state: TedTaggerState): StringToNumberLUT => {
  const mediaItemCountByAlbum: StringToNumberLUT = state.mediaItemsCountState.mediaItemCountByAlbum;
  return mediaItemCountByAlbum;
}

export const getMediaItemCountByPhotoState = (state: TedTaggerState): StringToNumberLUT => {
  const mediaItemCountByPhotoState: StringToNumberLUT = state.mediaItemsCountState.mediaItemCountByPhotoState;
  return mediaItemCountByPhotoState;
}

export const getMediaItemCountByUndecidedGroupPerAlbum = (state: TedTaggerState): MediaItemCountByUndecidedGroupPerAlbum[] => {
  const mediaItemCountByUndecidedGroupPerAlbum: MediaItemCountByUndecidedGroupPerAlbum[] = state.mediaItemsCountState.mediaItemCountByUndecidedGroupPerAlbum;
  return mediaItemCountByUndecidedGroupPerAlbum;
}