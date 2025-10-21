import { Request, Response } from 'express';

import { getAllMediaItemsFromDb } from '../repositories/mediaItem.repo';
import { MediaItemDTO } from '../../../shared/types/mediaItem';

export const getAllMediaItems = async (request: Request, response: Response) => {
  const mediaItems: MediaItemDTO[] = await getAllMediaItemsFromDb();
  response.json(mediaItems);
};

