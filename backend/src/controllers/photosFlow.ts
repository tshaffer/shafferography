// server/routes/photosFlowRoutes.ts
import { Request, Response } from 'express';
import path from "path";
import { copyToStaging, openInPhotos } from "../utilities";
import { promises as fs } from "fs";
import { dirs, runAppleScript } from "../utilities";
import * as fse from 'fs-extra';
import { MediaItem } from 'entities';
import { getMediaItemFromDb } from './dbInterface';

/**
 * Body: { mediaItemId: string }
 * Returns: { stagedName: string }
 *
 * Copies to staging and opens in Photos. We return stagedName so the client
 * can remember which temp item corresponds to the original.
 */
export const importAndEdit = async (request: Request, response: Response, next: any) => {
  try {

    const { mediaItemId } = request.body as { mediaItemId?: string };
    if (!mediaItemId) return response.status(400).json({ error: "mediaItemId is required" });

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return response.status(404).json({ error: 'Media item not found' });
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

    const { stagedPath, stagedName } = await copyToStaging(mediaFilePath);
    await openInPhotos(stagedPath);
    response.json({ stagedName });
  } catch (e) {
    next(e);
  }
};

/**
 * Body: { originalPath: string }
 * Behavior:
 *  - Ask Photos to export the *currently selected* photo (the user just edited) into FromPhotos.
 *  - We then find the newest file in FromPhotos and overwrite originalPath with it.
 *  - Finally, we return success so your Reimport pass can notice mtime/hash change.
 */
export const exportSelectionBack = async (request: Request, response: Response, next: any) => {
  // export const exportSelectionBack = async (req: Request, res: Response, next: any) => {

  // photosFlowRouter.post("/export-selection-back", async (req, res, next) => {
  try {

    const { mediaItemId } = request.body as { mediaItemId?: string };
    if (!mediaItemId) return response.status(400).json({ error: "mediaItemId is required" });

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return response.status(404).json({ error: 'Media item not found' });
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

    const originalPath: string = mediaFilePath;
    if (!originalPath) return response.status(400).json({ error: "originalPath required" });

    // 1) Export selected item in Photos to FromPhotos directory
    //    We ask Photos for `selection`, take the first item, and export the *edited* version.
    //    AppleScript: Photos’ dictionary supports `export media items ... to alias ... with options`.
    //    Not all fine-grained options are scriptable; this exports the adjusted JPEG (not the original).
    const exportScript = `
  set outFolder to POSIX file "${dirs.fromPhotos}" as alias
  tell application "Photos"
    activate
    if (count of selection) is 0 then error "No photo selected in Photos."
    set selectedItems to selection
    set mediaItems to {}
    repeat with s in selectedItems
      try
        if (class of s) is media item then set end of mediaItems to (contents of s)
      end try
    end repeat
    if (count of mediaItems) is 0 then error "Selection contains no photos."
    export mediaItems to outFolder without using originals
  end tell
  return "OK"
`;
    await runAppleScript(exportScript);

    // 2) Grab the newest file from FromPhotos (the export we just created)
    const files = await fs.readdir(dirs.fromPhotos);
    if (!files.length) throw new Error("No files exported from Photos.");
    const newest = await newestFile(pathJoinAll(dirs.fromPhotos, files));
    const exportedPath = newest;

    // 3) Overwrite the original path
    await fs.copyFile(exportedPath, originalPath);

    response.json({ ok: true, overwritten: originalPath, from: exportedPath });
  } catch (e) {
    next(e);
  }
};

/** Helpers */
function pathJoinAll(dir: string, names: string[]) {
  return names.map((n) => path.join(dir, n));
}
async function newestFile(absPaths: string[]): Promise<string> {
  let newest = absPaths[0];
  let newestMtime = (await fs.stat(newest)).mtimeMs;
  for (const p of absPaths.slice(1)) {
    const m = (await fs.stat(p)).mtimeMs;
    if (m > newestMtime) {
      newestMtime = m;
      newest = p;
    }
  }
  return newest;
}