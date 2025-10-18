import { PhotoState } from '../types';
import { MediaItemDTO } from '../domain/mediaItem.types';
import * as repo from '../repositories/mediaItem.repo';
import * as mediaRepo from '../repositories/mediaItem.repo';

export function getMediaItem(
  uniqueId: string,
  opts?: { includeExif?: boolean; includeExifMeta?: boolean }
): Promise<MediaItemDTO | null> {
  return mediaRepo.getMediaItemFromDb(uniqueId, opts);
}

export const getByAlbum = (albumNodeId: string, page = 1, pageSize = 100, includeExif = false): Promise<MediaItemDTO[]> =>
  repo.listByAlbum(albumNodeId, { page, pageSize, includeExif });

export function getMediaItemsForPhotoState(
  albumNodeIds: string[],
  photoStates: PhotoState[],
  groupUndecidedPhotos: boolean,
  undecidedGroupIds: string[]
): Promise<MediaItemDTO[]> {
  return repo.findForPhotoState({ albumNodeIds, photoStates, groupUndecidedPhotos, undecidedGroupIds });
}