import path from "node:path";
import fs from "node:fs/promises";
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
    const relativePath = d.absPath.replace(BASE_MEDIA_PATH, "");
    const url = `${BASE_MEDIA_URL}/${relativePath}`;
    derivatives.push({
      derivativeId: d.derivativeId.toString(),
      label: d.label,
      width: d.width,
      height: d.height,
      mimeType: d.mimeType,
      absPath: d.absPath,
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
  // const item = await MediaItemModel.findById(id).lean();
  const item = await getMediaItemFromDb(id);
  if (!item) return res.status(404).json({ error: "Not found" });

  res.json({
    mediaItemId: id,
    original: {
      width: item.width,
      height: item.height,
      mimeType: item.mimeType,
    },
    derivatives: getDerivatives(item),
    preferredDerivativeId: item.preferredDerivativeId?.toString() ?? null,
  });
};

/**
 * GET /api/media/:id/asset?variant=original|preferred|<derivativeId>
 * Streams the file. Use Content-Type so <img> or <picture> can display directly.
 */
export const getAsset = async (req: Request, res: Response, next: any) => {
  // router.get("/:id/asset", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { variant = "preferred" } = req.query as { variant?: string };

  const item = await getMediaItemFromDb(id);
  if (!item) return res.status(404).send("Not found");

  let absPath = item.filePath;
  let mimeType = item.mimeType;

  if (variant === "original") {
    // keep original
  } else if (variant === "preferred") {
    const prefId =
      item.preferredDerivativeId ??
      item.derivatives.find(d => d.markPreferred)?.derivativeId ??
      item.derivatives[0]?.derivativeId;

    if (prefId) {
      const d = item.derivatives.find(x => x.derivativeId.toString() === prefId.toString());
      if (d) {
        absPath = d.absPath;
        mimeType = d.mimeType;
      }
    }
  } else {
    // assume variant is a derivativeId
    const d = item.derivatives.find(x => x.derivativeId.toString() === variant);
    if (d) {
      absPath = d.absPath;
      mimeType = d.mimeType;
    } else {
      return res.status(404).send("Derivative not found");
    }
  }

  try {
    await fs.access(absPath);
  } catch {
    return res.status(410).send("File missing on disk");
  }

  res.type(mimeType);
  res.sendFile(path.resolve(absPath));
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

