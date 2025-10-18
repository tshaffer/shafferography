import { Request, Response } from 'express';

import { MediaItem } from '../types'
import { getAllMediaItemsFromDb } from '../repositories/mediaItem.repo';

export const getAllMediaItems = async (request: Request, response: Response) => {
  const mediaItems: MediaItem[] = await getAllMediaItemsFromDb();
  response.json(mediaItems);
};

