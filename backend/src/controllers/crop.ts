// backend/src/routes/crop.ts
import { Request, Response } from 'express';
import sharp, { Sharp } from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import * as fse from 'fs-extra';
import { constants as FS_CONSTANTS } from 'fs';
import { exiftool } from 'exiftool-vendored';
// import {
//   saveVariantForMediaItem,
//   updateMediaItemAfterOverwrite,
// } from '../services/mediaItems';
import { getMediaItemFromDb, saveVariantForMediaItem, updateMediaItemAfterOverwrite } from './dbInterface';
import { MediaItem } from '../types';

/** Crop types shared with frontend */
type AspectRatio = number | 'free';
export type CropData = {
  x: number; y: number; width: number; height: number;
  rotate: number; scaleX: number; scaleY: number;
  naturalWidth: number; naturalHeight: number;
  aspectRatio?: AspectRatio;
};

type CropPayload = {
  mediaItemId: string;
  cropData: CropData;
  /** true => create sibling variant; false => OVERWRITE original (destructive) */
  createVariant: boolean;
  /** when overwriting, also write a .bak copy of the original next to it */
  backupOriginal?: boolean;
};

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'heif';

function canWriteHeic(): boolean {
  return !!sharp.format.heif?.output?.file;
}

function pickOutFormatFromExt(extLower: string): OutputFormat {
  if (extLower === 'jpg' || extLower === 'jpeg') return 'jpeg';
  if (extLower === 'png') return 'png';
  if (extLower === 'webp') return 'webp';
  if (extLower === 'heic' || extLower === 'heif') return 'heif';
  return 'jpeg';
}

function outExtensionForFormat(fmt: OutputFormat): string {
  return fmt === 'heif' ? 'heic' : fmt;
}

function safeBox(
  x: number, y: number, w: number, h: number, natW: number, natH: number,
): { left: number; top: number; width: number; height: number } {
  const left = Math.max(0, Math.round(x));
  const top = Math.max(0, Math.round(y));
  const width = Math.max(1, Math.min(Math.round(w), natW - left));
  const height = Math.max(1, Math.min(Math.round(h), natH - top));
  return { left, top, width, height };
}

async function encodeToFile(p: Sharp, fmt: OutputFormat, filePath: string): Promise<void> {
  switch (fmt) {
    case 'jpeg':
      await p.jpeg({ quality: 92 }).toFile(filePath);
      break;
    case 'png':
      await p.png().toFile(filePath);
      break;
    case 'webp':
      await p.webp({ quality: 90 }).toFile(filePath);
      break;
    case 'heif':
      // HEIC (HEVC), requires libheif in libvips/sharp
      await p.toFormat('heif', { compression: 'hevc', quality: 90 }).toFile(filePath);
      break;
  }
}

/**
 * Copy metadata from input -> output using exiftool.
 * We copy EXIF/IPTC/XMP where supported by the target container and force Orientation=1 at the end.
 * exiftool will silently ignore unsupported groups for a given format (e.g., IPTC for WebP).
 */
async function copyMetadataWithExiftool(mediaFilePath: string, outputPath: string): Promise<void> {
  await exiftool.write(outputPath, {}, [
    '-overwrite_original',
    '-TagsFromFile', mediaFilePath,
    '-EXIF:all',
    '-IPTC:all',
    '-XMP:all',
    '-EXIF:Orientation=1',
  ]);
}

export const crop = async (req: Request, res: Response, next: any) => {
  try {
    const {
      mediaItemId,
      cropData,
      createVariant,
      backupOriginal = false,
    } = req.body as CropPayload;

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) return res.status(404).json({ error: 'Media item not found' });

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

    // const mediaFilePath: string = mediaItem.filePath; // absolute path to the original file
    await fs.access(mediaFilePath, FS_CONSTANTS.R_OK | FS_CONSTANTS.W_OK);

    const ext = (path.extname(mediaFilePath) || '').toLowerCase().slice(1);
    const outFormat: OutputFormat = pickOutFormatFromExt(ext);

    // If overwriting a HEIC but encoder is not available, fail fast.
    if (!createVariant && outFormat === 'heif' && !canWriteHeic()) {
      return res.status(409).json({
        error:
          'HEIC encode unsupported in this build. Enable libheif or use "Save as Variant" instead.',
      });
    }

    // Build processing pipeline
    const {
      x, y, width, height, rotate, scaleX, scaleY, naturalWidth, naturalHeight,
    } = cropData;

    const box = safeBox(x, y, width, height, naturalWidth, naturalHeight);

    let pipeline = sharp(mediaFilePath, { failOn: 'none' }).rotate(); // honor EXIF orientation
    if (rotate) pipeline = pipeline.rotate(rotate);
    if (scaleX === -1) pipeline = pipeline.flop();
    if (scaleY === -1) pipeline = pipeline.flip();
    pipeline = pipeline.extract({ left: box.left, top: box.top, width: box.width, height: box.height });

    // Only set orientation via withMetadata; other metadata is handled by exiftool afterwards
    const withMeta = pipeline.withMetadata({ orientation: 1 });

    const dir = path.dirname(mediaFilePath);
    const base = path.basename(mediaFilePath, path.extname(mediaFilePath));
    const outExt = outExtensionForFormat(outFormat);

    if (createVariant) {
      // ---------- NON-DESTRUCTIVE: create a sibling variant ----------
      const variantName = `${base}__cropped_${Date.now()}.${outExt}`;
      const variantPath = path.join(dir, variantName);

      await encodeToFile(withMeta, outFormat, variantPath);
      await copyMetadataWithExiftool(mediaFilePath, variantPath);

      const updated = await saveVariantForMediaItem(mediaItemId, {
        filePath: variantPath,
        source: 'crop',
        createdAt: new Date().toISOString(),
        meta: { cropData },
      });

      // return res.json(updated);
      return res.json({ message: 'Variant saving not implemented in this snippet.' });
    } else {
      // ---------- DESTRUCTIVE: OVERWRITE ORIGINAL ----------
      const tmpName = `${base}__tmp_${Date.now()}.${outExt}`;
      const tmpPath = path.join(dir, tmpName);

      // Encode into tmp
      await encodeToFile(withMeta, outFormat, tmpPath);

      // Copy metadata from input -> tmp and force Orientation=1
      await copyMetadataWithExiftool(mediaFilePath, tmpPath);

      // Optional backup of original
      if (backupOriginal) {
        const bakName = `${base}.bak-${Date.now()}${path.extname(mediaFilePath)}`;
        const bakPath = path.join(dir, bakName);
        await fs.copyFile(mediaFilePath, bakPath);
      }

      // Atomic replace (same directory to keep rename atomic)
      await fs.rename(tmpPath, mediaFilePath);

      // Refresh file info for DB
      const outMeta = await sharp(mediaFilePath).metadata();
      const outStats = await fs.stat(mediaFilePath);

      const updated = await updateMediaItemAfterOverwrite(mediaItemId, {
        fileSize: outStats.size,
        width: outMeta.width ?? box.width,
        height: outMeta.height ?? box.height,
        lastModified: outStats.mtime.toISOString(),
        editLogEntry: {
          kind: 'crop-overwrite',
          at: new Date().toISOString(),
          cropData,
        },
      });

      // return res.json(updated);
      return res.json({ message: 'Overwrite saving not implemented in this snippet.' });
    }
  } catch (err) {
    next(err);
  }
};

