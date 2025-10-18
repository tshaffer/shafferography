import { Request, Response } from 'express';

import * as fse from 'fs-extra';
import { getOriginalMediaItemFilePath } from '../utilities';
import { MediaItem } from '../types';
import { getMediaItemFromDb } from '../repositories/mediaItem.repo';

export const fileStat = async (req: Request, res: Response, next: any) => {

  try {

    const mediaItemId = req.query.mediaItemId as string | undefined;
    if (!mediaItemId) return res.status(400).json({ error: "mediaItemId is required" });

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return res.status(404).json({ error: 'Media item not found' });
    }

    const mediaFilePath: string = getOriginalMediaItemFilePath(mediaItem);
    
    const stat = await fse.stat(mediaFilePath);
    // mtimeMs is perfect for change detection
    res.json({ mtimeMs: stat.mtimeMs, size: stat.size });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "stat failed" });
  }
};
