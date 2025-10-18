import * as mediaRepo from '../repositories/mediaItem.repo';
import * as ugRepo from '../repositories/undecidedGroup.repo';
import type {
  MediaItemCounts,
} from '../domain/stats.types';

export async function getMediaItemCounts(): Promise<MediaItemCounts> {
  // Run in parallel for speed
  const [
    mediaItemCountByAlbumNode,
    mediaItemCountByPhotoState,
    mediaItemCountByPhotoStateByAlbumNodeId,
    mediaItemCountByUndecidedGroupPerAlbumNode,
  ] = await Promise.all([
    mediaRepo.countByAlbumNode(),
    mediaRepo.countByPhotoState(),
    mediaRepo.countByPhotoStateByAlbumNode(),
    ugRepo.countUndecidedByAlbumPerGroup(),
  ]);

  return {
    mediaItemCountByAlbumNode,
    mediaItemCountByPhotoState,
    mediaItemCountByPhotoStateByAlbumNodeId,
    mediaItemCountByUndecidedGroupPerAlbumNode,
  };
}
