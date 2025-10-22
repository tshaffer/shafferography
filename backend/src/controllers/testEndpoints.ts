import { Request, Response } from 'express';

import { getAllMediaItemsFromDb } from '../repositories/mediaItem.repo';
import { MediaItem } from '@shared/types/mediaItem';

export const getAllMediaItems = async (request: Request, response: Response) => {
  const mediaItems: MediaItem[] = await getAllMediaItemsFromDb();
  response.json(mediaItems);
};

