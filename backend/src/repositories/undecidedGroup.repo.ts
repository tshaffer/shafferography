import { PhotoState } from '@shared/types/enums';
import { getUndecidedGroupModel } from '../models';
import { MediaItemCountByUndecidedGroupPerAlbumNode } from '../types';

/**
 * For each undecided group and each albumNodeId it belongs to,
 * count mediaitems that are (a) in that album, (b) photoState === 'Undecided',
 * and (c) have undecidedGroupId equal to the group _id.
 */
export async function countUndecidedByAlbumPerGroup(): Promise<MediaItemCountByUndecidedGroupPerAlbumNode[]> {
  const results: MediaItemCountByUndecidedGroupPerAlbumNode[] = await getUndecidedGroupModel().aggregate([
    { $unwind: '$albumNodeIds' },
    {
      $lookup: {
        from: 'mediaitems',
        let: { albumNodeId: '$albumNodeIds', groupId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$albumNodeId', '$$albumNodeId'] },
                  { $eq: ['$photoState', PhotoState.Undecided] },
                  { $eq: ['$undecidedGroupId', { $toString: '$$groupId' }] },
                ],
              },
            },
          },
          { $project: { _id: 1 } }, // keep it light; we only need the count
        ],
        as: 'mediaItems',
      },
    },
    {
      $project: {
        _id: 0,
        undecidedGroupId: { $toString: '$_id' },
        albumNodeId: '$albumNodeIds',
        count: { $size: '$mediaItems' },
      },
    },
  ]).exec();

  return results;
}

/** Delete undecided group document by id. */
export async function deleteById(undecidedGroupId: string): Promise<void> {
  await getUndecidedGroupModel().deleteOne({ _id: undecidedGroupId }).exec();
}