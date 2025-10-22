import * as repo from '../repositories/mediaItem.repo';
import * as mediaRepo from '../repositories/mediaItem.repo';
import { MediaItem, } from '@shared/types/mediaItem';
import { PhotoState } from '@shared/types/enums';

export function getMediaItem(
  uniqueId: string,
  opts?: { includeExif?: boolean; includeExifMeta?: boolean }
): Promise<MediaItem | null> {
  return mediaRepo.getMediaItemFromDb(uniqueId, opts);
}

export const getByAlbum = (albumNodeId: string, page = 1, pageSize = 100, includeExif = false): Promise<MediaItem[]> =>
  repo.listByAlbum(albumNodeId, { page, pageSize, includeExif });

export function getMediaItemsForPhotoState(
  albumNodeIds: string[],
  photoStates: PhotoState[],
  groupUndecidedPhotos: boolean,
  undecidedGroupIds: string[]
): Promise<MediaItem[]> {
  return repo.findForPhotoState({ albumNodeIds, photoStates, groupUndecidedPhotos, undecidedGroupIds });
}