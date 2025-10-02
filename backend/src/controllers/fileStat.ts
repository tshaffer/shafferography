import { MediaItem } from 'entities';
import { Request, Response } from 'express';

import * as fse from 'fs-extra';
import path from "path";
import { getMediaItemFromDb } from './dbInterface';

export const fileStat = async (req: Request, res: Response, next: any) => {

  try {

    const mediaItemId = req.query.mediaItemId as string | undefined;
    if (!mediaItemId) return res.status(400).json({ error: "mediaItemId is required" });

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return res.status(404).json({ error: 'Media item not found' });
    }

    console.log('mediaItem:', mediaItem);

    let mediaFilePath: string = mediaItem.filePath;
    const fileExtension = path.extname(mediaFilePath);
    const dirname = path.dirname(mediaFilePath); // Extracts the directory path
    const heicFileName = path.basename(mediaFilePath, fileExtension) + ".heic";
    const heicFilePath = path.join(dirname, heicFileName);
    if (fse.existsSync(heicFilePath)) {
      console.log('HEIC file exists:', heicFilePath);
      mediaFilePath = heicFilePath;
    }
    const stat = await fse.stat(mediaFilePath);
    // mtimeMs is perfect for change detection
    res.json({ mtimeMs: stat.mtimeMs, size: stat.size });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "stat failed" });
  }
};
