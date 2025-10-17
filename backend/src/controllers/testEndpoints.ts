import { Request, Response } from 'express';

import { MediaItem } from '../types'
import { getAllMediaItemsFromDb } from "./dbInterface";

export const getAllMediaItems = async (request: Request, response: Response) => {
  const mediaItems: MediaItem[] = await getAllMediaItemsFromDb();
  response.json(mediaItems);
};

