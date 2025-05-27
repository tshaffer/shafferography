import { TedTaggerState, StringToNumberLUT, MediaItemCountByPhotoStateByAlbumNodeId, MediaItemCountByUndecidedGroupPerAlbumNode } from '../types';

export const getMediaItemCountByAlbumNode = (state: TedTaggerState): StringToNumberLUT => {
  const mediaItemCountByAlbumNode: StringToNumberLUT = state.mediaItemsCountState.mediaItemCountByAlbumNode;
  return mediaItemCountByAlbumNode;
}

export const getMediaItemCountByPhotoState = (state: TedTaggerState): StringToNumberLUT => {
  const mediaItemCountByPhotoState: StringToNumberLUT = state.mediaItemsCountState.mediaItemCountByPhotoState;
  return mediaItemCountByPhotoState;
}

export const getMediaItemCountByPhotoStateByAlbumNodeId = (state: TedTaggerState): MediaItemCountByPhotoStateByAlbumNodeId => {
  const mediaItemCountByPhotoStateByAlbumNodeId: MediaItemCountByPhotoStateByAlbumNodeId = state.mediaItemsCountState.mediaItemCountByPhotoStateByAlbumNodeId;
  return mediaItemCountByPhotoStateByAlbumNodeId;
}

export const getMediaItemCountByUndecidedGroupPerAlbumNode = (state: TedTaggerState): MediaItemCountByUndecidedGroupPerAlbumNode[] => {
  const mediaItemCountByUndecidedGroupPerAlbumNode: MediaItemCountByUndecidedGroupPerAlbumNode[] = state.mediaItemsCountState.mediaItemCountByUndecidedGroupPerAlbumNode;
  return mediaItemCountByUndecidedGroupPerAlbumNode;
}