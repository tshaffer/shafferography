import { MediaItem } from '../types';
import { CreateDerivativeRequestBody, DerivativeRecord } from '../types/crop-types';

import { Request, Response } from 'express';
import { generateDerivativeFromCrop } from './generate-derivative';
import { bodySchema } from '../types';

// ---- replace with your real DB accessors ----
async function getMediaItemById(mediaItemId: string): Promise<MediaItem | null> {
  return null; // e.g., await MediaItems.findOne({ uniqueId: mediaItemId })
}
async function insertDerivative(rec: Omit<DerivativeRecord, '_id'>): Promise<DerivativeRecord> {
  // e.g., const doc = await Derivatives.create(rec); return doc.toObject();
  return { _id: 'DERIV123', ...rec };
}
async function markPreferred(mediaItemId: string, derivativeId: string): Promise<void> {
  // e.g., await Derivatives.updateMany({ mediaItemId }, { $set: { isPreferred: false } });
  //       await Derivatives.updateOne({ _id: derivativeId }, { $set: { isPreferred: true } });
}

/**
 * POST /api/photos/:mediaItemId/derivatives
 * Body: {
 *   cropData: CropData,
 *   format?: 'heic'|'jpeg'|'jpg'|'png',
 *   quality?: number,
 *   heifCompression?: 'av1'|'hevc',
 *   markPreferred?: boolean
 * }
 */
export const generateDerivativeEndpoint = async (req: Request, res: Response, next: any) => {
  try {
    const mediaItemId = req.params.mediaItemId;
    const parsed = bodySchema.parse(req.body as CreateDerivativeRequestBody);
    const mediaItem = await getMediaItemById(mediaItemId);
    if (!mediaItem) return res.status(404).json({ error: 'Media item not found' });

    const { outputPath, width, height, mimeType } =
      await generateDerivativeFromCrop(mediaItem.filePath, parsed.cropData, {
        format: parsed.format,
        quality: parsed.quality,
        heifCompression: parsed.heifCompression,
      });

    // Persist derivative record
    const created = await insertDerivative({
      mediaItemId,
      absolutePath: outputPath,
      mimeType,
      width,
      height,
      isPreferred: !!parsed.markPreferred,
      createdAt: new Date().toISOString(),
    });

    if (parsed.markPreferred) {
      await markPreferred(mediaItemId, created._id);
    }

    return res.json({
      ok: true,
      mediaItemId,
      derivative: created,
    });
  } catch (err: any) {
    console.error('create-derivative error', err);
    return res.status(400).json({ ok: false, error: err?.message ?? 'Failed to create derivative' });
  }
};
