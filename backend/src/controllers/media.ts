import path from "node:path";
import fs from "node:fs/promises";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { getMediaItemFromDb } from "./dbInterface";
import { getMediaitemModel } from "../models";

/**
 * GET /api/media/:id/manifest
 * Returns enough info for the client to render variant choices.
 */
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
    derivatives: item.derivatives.map(d => ({
      id: d._id.toString(),
      label: d.label,
      width: d.width,
      height: d.height,
      mimeType: d.mimeType,
    })),
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
      item.derivatives.find(d => d.markPreferred)?. _id ??
      item.derivatives[0]?._id;

    if (prefId) {
      const d = item.derivatives.find(x => x._id.toString() === prefId.toString());
      if (d) {
        absPath = d.absPath;
        mimeType = d.mimeType;
      }
    }
  } else {
    // assume variant is a derivativeId
    const d = item.derivatives.find(x => x._id.toString() === variant);
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
  const _id = new Types.ObjectId(derivativeId);

  const updated = await getMediaitemModel().findOneAndUpdate(
    { _id: id, "derivatives._id": _id },
    { $set: { preferredDerivativeId: _id } },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Media or derivative not found" });
  res.json({ ok: true, preferredDerivativeId: _id.toString() });
};

