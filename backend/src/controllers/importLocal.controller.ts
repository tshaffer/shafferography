// controllers/importLocal.controller.ts
import { Request, Response, NextFunction } from 'express';

import {
  importLocalFile,
  startDirectoryImport,
  getImportStatus,
  reimportOneMediaItem,
  FileStatus,
} from '../services/importLocal.service';
import { MediaItemStored } from '../models/mediaItem.model';
import { MediaItemDTO } from '../../../shared/types/mediaItem';

// POST /api/import/local-file
// body: { absPath: string, albumNodeId?: string }
export async function importLocalFileEndpoint(req: Request, res: Response, next: NextFunction) {
  try {
    const { absPath, albumNodeId } = req.body;
    const result: MediaItemDTO = await importLocalFile(absPath, albumNodeId ?? 'local');
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/import/local-directory
// body: { baseDirectory: string, albumNodeId: string, files: FileToImport[] }
export async function importPhotosEndpoint(req: Request, res: Response, next: NextFunction) {
  try {
    const { baseDirectory, albumNodeId, files } = req.body;

    // start the task without blocking response (returns { importId })
    const payload: { importId: string } = await startDirectoryImport({
      baseDirectory,
      albumNodeId,
      files,
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

// GET /api/import/status/:importId
export async function getPerFileImportPhotosStatus(req: Request, res: Response) {
  const { importId } = req.params;
  const importStatus: FileStatus[] = getImportStatus(importId);
  res.json(importStatus);
}

// POST /api/import/reimport
// body: { mediaItemIds: string[] }  // matches your old request body; we use the first ID
export async function reimportPhotosEndpoint(req: Request, res: Response, next: NextFunction) {
  try {
    const { mediaItemIds } = req.body as { mediaItemIds: string[] };
    if (!mediaItemIds?.length) return res.status(400).json({ error: 'mediaItemIds required' });

    const uniqueId = mediaItemIds[0];
    const updated: MediaItemStored = await reimportOneMediaItem({ uniqueId });
    if (!updated) return res.status(404).json({ error: 'Media item not found' });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
