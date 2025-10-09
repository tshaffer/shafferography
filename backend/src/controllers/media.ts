import { Request, Response } from "express";
import { getMediaItemFromDb } from "./dbInterface";
import { getMediaitemModel } from "../models";
import { Derivative, MediaItem } from "../types";

import { BASE_MEDIA_PATH, BASE_MEDIA_URL } from '../config';

/**
 * GET /api/media/:id/manifest
 * Returns enough info for the client to render variant choices.
 */

const getDerivatives = (item: MediaItem): Derivative[] => {
  const derivatives: Derivative[] = [];
  for (const d of item.derivatives) {
    const relativePath = d.filePath.replace(BASE_MEDIA_PATH, "");
    const url = `${BASE_MEDIA_URL}/${relativePath}`;
    derivatives.push({
      derivativeId: d.derivativeId.toString(),
      label: d.label,
      width: d.width,
      height: d.height,
      mimeType: d.mimeType,
      filePath: d.filePath,
      url,
      format: d.format,
      createdAt: d.createdAt
    });
  }
  return derivatives;
};

export const getManifest = async (req: Request, res: Response, next: any) => {
  // router.get("/:id/manifest", async (req: Request, res: Response) => {
  const { id } = req.params;
  const mediaItem = await getMediaItemFromDb(id);
  if (!mediaItem) return res.status(404).json({ error: "Not found" });

  res.json({
    mediaItemId: id,
    original: {
      width: mediaItem.width,
      height: mediaItem.height,
      mimeType: mediaItem.mimeType,
    },
    derivatives: getDerivatives(mediaItem),
    preferredDerivativeId: mediaItem.preferredDerivativeId?.toString() ?? null,
  });
};

/**
 * PUT /api/media/:id/preferred/:derivativeId
 * (Optional) update which derivative is preferred (does NOT affect current view selection)
 */
export const putPreferred = async (req: Request, res: Response, next: any) => {
  // router.put("/:id/preferred/:derivativeId", async (req: Request, res: Response) => {
  const { id, derivativeId } = req.params;

  const updated = await getMediaitemModel().findOneAndUpdate(
    { uniqueId: id, "derivatives.derivativeId": derivativeId },
    { $set: { preferredDerivativeId: derivativeId } },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Media or derivative not found" });
  res.json({ ok: true, preferredDerivativeId: derivativeId });
};

