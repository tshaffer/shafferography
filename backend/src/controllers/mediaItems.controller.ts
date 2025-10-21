import { Request, Response, NextFunction } from 'express';
import * as mediaItemsService from '../services/mediaItems.service';
import * as mediaRepo from '../repositories/mediaItem.repo';
import { PhotoState } from '@shared/types/enums';
import { MediaItemDTO } from '@shared/types/mediaItem';

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;                   // /api/mediaitems/:id
    const includeExif = String(req.query.includeExif) === 'true';
    const includeExifMeta = String(req.query.includeExifMeta) === 'true';

    const item = await mediaItemsService.getMediaItem(id, {
      includeExif,
      includeExifMeta,
    });

    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function listByAlbum(req: Request, res: Response, next: NextFunction) {
  try {
    const { albumNodeId } = req.params;             // /api/albums/:albumNodeId/mediaitems
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 100);
    const includeExif = req.query.includeExif === 'true';
    const items = await mediaItemsService.getByAlbum(albumNodeId, page, pageSize, includeExif);
    res.json(items);
  } catch (err) { next(err); }
}


export async function getMediaItemsForPhotoState(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const photoStates: PhotoState[] = JSON.parse(String(req.query.photoStates ?? '[]'));
    const albumNodeIds: string[] = String(req.query.albumNodeIds ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const groupUndecidedPhotos = String(req.query.groupUndecidedPhotos) === 'true';
    const undecidedGroupIds: string[] = String(req.query.undecidedGroupIds ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const items: MediaItemDTO[] = await mediaItemsService.getMediaItemsForPhotoState(
      albumNodeIds,
      photoStates,
      groupUndecidedPhotos,
      undecidedGroupIds
    );

    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function updateOne(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await mediaRepo.updateMediaItemFieldsInDb(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function updateMany(req: Request, res: Response, next: NextFunction) {
  try {
    const { uniqueIds, updates } = req.body as { uniqueIds: string[]; updates: Partial<any> };
    const result = await mediaRepo.updateMediaItemsFieldsInDb(uniqueIds, updates);
    res.json(result);
  } catch (e) { next(e); }
}

export async function getAlbumNamesWherePeopleNotRetrieved(_req: Request, res: Response, next: NextFunction) {
  try {
    const names = await mediaRepo.getGoogleAlbumNamesWherePeopleNotRetrieved();
    res.json(names);
  } catch (e) { next(e); }
}

export async function assignMediaItemsToUndecidedGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { undecidedGroupId, mediaItemIds } = req.body as { undecidedGroupId: string, mediaItemIds: string[] };
    await mediaRepo.assignToUndecidedGroup(undecidedGroupId, mediaItemIds);
    res.status(204).end();
  } catch (e) { next(e); }
}
