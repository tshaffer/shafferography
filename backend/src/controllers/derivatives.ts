import { MediaItem } from '../types';
import { CreateDerivativeRequestBody, DerivativeRecord } from '../types/crop-types';

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateDerivativeFromCrop } from './generate-derivative';
import { bodySchema, OutFormat } from '../types';
import { getMediaItemFromDb } from './dbInterface';
import { getMediaitemModel } from '../models';
import path from 'path';

import { BASE_MEDIA_PATH, BASE_MEDIA_URL } from '../config';

// ---- replace with your real DB accessors ----}
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
// Small runtime guard (kept lightweight on purpose)

function isValidBody(b: any): b is CreateDerivativeRequestBody {
  return (
    b &&
    typeof b === "object" &&
    b.cropData &&
    typeof b.cropData.x === "number" &&
    typeof b.cropData.y === "number" &&
    typeof b.cropData.width === "number" &&
    typeof b.cropData.height === "number"
  );
}

export const generateDerivativeEndpoint = async (req: Request, res: Response, next: any) => {

  try {
    const { mediaItemId } = req.params;
    const body = req.body;

    if (!isValidBody(body)) {
      return res.status(400).json({ ok: false, error: "Invalid body: cropData is required" });
    }

    // 1) Load the media item (to get the original filePath)
    const item: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!item) return res.status(404).json({ ok: false, error: "Media item not found" });

    const originalAbsPath = item.filePath;
    if (!originalAbsPath) {
      return res.status(409).json({ ok: false, error: "Media item has no original.filePath" });
    }

    // 2) Generate the derivative file using your existing code
    const { outputPath, width, height, mimeType } = await generateDerivativeFromCrop(
      originalAbsPath,
      body.cropData,
      {
        format: body.format,                // 'heic' | 'jpeg' | 'jpg' | 'png' | undefined
        quality: body.quality,             // 1..100 | undefined
        heifCompression: body.heifCompression, // 'av1' | 'hevc' | undefined
      }
    );

    // 3) Build the subdocument to push into `derivatives[]`
    const ext = path.extname(outputPath).replace(".", "").toLowerCase() as OutFormat;
    const format: OutFormat = (body.format ?? ext) as OutFormat;

    const derivativeId = uuidv4();
    const now = new Date();

    // Simple, deterministic label. Customize as you like.
    const label = `Crop ${width}×${height} ${format.toUpperCase()}`;

    const relativePath = outputPath.replace(BASE_MEDIA_PATH, "");
    const url = `${BASE_MEDIA_URL}/${relativePath}`;

    const derivativeSubdoc = {
      derivativeId,
      label,
      format,                // 'heic' | 'jpeg' | 'jpg' | 'png'
      width,
      height,
      mimeType,              // from generator
      filePath: outputPath,   // absolute path to the created derivative
      url,                   // public URL to the created derivative
      createdAt: now,
      markPreferred: !!body.markPreferred,
    };

    // 4) Persist: push derivative; optionally set preferredDerivativeId
    const update: any = {
      $push: { derivatives: derivativeSubdoc },
    };
    if (body.markPreferred) {
      update.$set = { preferredDerivativeId: derivativeId };
    }

    const updated = await getMediaitemModel().findOneAndUpdate(
      { uniqueId: item.uniqueId },
      update,
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(500).json({ ok: false, error: "Failed to update media item" });
    }
    ''
    return res.status(201).json({
      ok: true,
      mediaItemId,
      derivative: {
        id: derivativeId.toString(),
        label,
        format,
        width,
        height,
        mimeType,
        filePath: outputPath,
        url,
        createdAt: now.toISOString(),
        markPreferred: !!body.markPreferred,
      },
      preferredDerivativeId: body.markPreferred ? derivativeId.toString() : (updated.preferredDerivativeId?.toString() ?? null),
    });
  } catch (err: any) {
    console.error("POST /api/photos/:mediaItemId/derivatives failed:", err);
    return res.status(400).json({ ok: false, error: err?.message ?? "Failed to create derivative" });
  }
};

