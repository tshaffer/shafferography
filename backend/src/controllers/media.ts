import { Request, Response } from "express";
import { getMediaitemModel } from "../models";


/**
 * PUT /api/media/:id/preferred/:derivativeId
 * (Optional) update which derivative is preferred (does NOT affect current view selection)
 */
export const putPreferred = async (req: Request, res: Response, next: any) => {
  // router.put("/:id/preferred/:derivativeId", async (req: Request, res: Response) => {
  const { mediaItemId, preferredId } = req.params;

  const updated = await getMediaitemModel().findOneAndUpdate(
    { uniqueId: mediaItemId },
    { $set: { preferredDerivativeId: preferredId } },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Media or derivative not found" });
  res.json({ ok: true, preferredId });
};

