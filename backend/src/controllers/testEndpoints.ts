import { Request, Response } from 'express';

import { getAllMediaItemsFromDb } from '../repositories/mediaItem.repo';
import { MediaItemDTO } from '../domain/mediaItem.types';

export const getAllMediaItems = async (request: Request, response: Response) => {
  const mediaItems: MediaItemDTO[] = await getAllMediaItemsFromDb();
  response.json(mediaItems);
};

