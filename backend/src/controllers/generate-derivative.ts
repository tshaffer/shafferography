// src/image/generate-derivative.ts
import sharp from 'sharp';
import path from 'path';
import { copyExifAndNormalizeOrientation, buildDerivativePath } from './meta-io';
import { CropData } from '../types';

type EncodeOptions = {
  format?: 'heic' | 'jpeg' | 'jpg' | 'png';
  quality?: number;
  heifCompression?: 'av1' | 'hevc';
};

function detectDefaultFormatFromExt(ext: string): 'heic' | 'jpeg' | 'png' {
  const e = ext.toLowerCase();
  if (e === '.heic' || e === '.heif') return 'heic';
  if (e === '.png') return 'png';
  return 'jpeg';
}

export async function generateDerivativeFromCrop(
  originalAbsPath: string,
  crop: CropData,
  opts: EncodeOptions = {}
): Promise<{ outputPath: string; width: number; height: number; mimeType: string }> {
  const ext = path.extname(originalAbsPath);
  const requested = (opts.format || '').toLowerCase() as EncodeOptions['format'];
  const targetFormat = (requested || detectDefaultFormatFromExt(ext));
  const quality = opts.quality ?? 92;

  // sharp requires integer region
  const left = Math.max(0, Math.round(crop.x));
  const top = Math.max(0, Math.round(crop.y));
  const width = Math.max(1, Math.round(crop.width));
  const height = Math.max(1, Math.round(crop.height));

  // Destination
  const outExt = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
  const outputPath = buildDerivativePath(originalAbsPath, outExt);

  // Build pipeline (rotate -> flop/flip -> extract -> encode)
  let pipeline = sharp(originalAbsPath, { failOn: 'none' });

  if (crop.rotate) pipeline = pipeline.rotate(crop.rotate);
  if (crop.scaleX < 0) pipeline = pipeline.flop();
  if (crop.scaleY < 0) pipeline = pipeline.flip();
  pipeline = pipeline.extract({ left, top, width, height });

  try {
    switch (outExt) {
      case 'heic':
        pipeline = pipeline.heif({
          quality,
          compression: opts.heifCompression ?? 'hevc', // 'av1' if supported by libvips build
        });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 9 });
        break;
      case 'jpeg':
      default:
        pipeline = pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' });
        break;
    }

    await pipeline.toFile(outputPath);
  } catch (err) {
    // If HEIF encode fails, fall back to JPEG derivative
    if (outExt === 'heic') {
      const fallbackPath = buildDerivativePath(originalAbsPath, 'jpeg');
      await sharp(originalAbsPath)
        .rotate(crop.rotate || 0)
        .flop(crop.scaleX < 0)
        .flip(crop.scaleY < 0)
        .extract({ left, top, width, height })
        .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(fallbackPath);

      await copyExifAndNormalizeOrientation(originalAbsPath, fallbackPath);

      const meta = await sharp(fallbackPath).metadata();
      return {
        outputPath: fallbackPath,
        width: meta.width ?? width,
        height: meta.height ?? height,
        mimeType: 'image/jpeg',
      };
    }
    throw err;
  }

  // Copy EXIF/ICC from original, normalize Orientation=1
  await copyExifAndNormalizeOrientation(originalAbsPath, outputPath);

  // Read final dimensions
  const meta = await sharp(outputPath).metadata();

  // Map ext -> mime
  const mime =
    outExt === 'heic' ? 'image/heic' :
    outExt === 'png' ? 'image/png' : 'image/jpeg';

  return {
    outputPath,
    width: meta.width ?? width,
    height: meta.height ?? height,
    mimeType: mime,
  };
}
