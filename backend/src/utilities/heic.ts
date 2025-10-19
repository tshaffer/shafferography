// utilities/heic.ts
// Simple wrapper to keep your call sites the same. If you already have
// convertHEICFileToJPEGWithEXIF implemented elsewhere, keep yours and delete this.

import { exiftool } from 'exiftool-vendored';
import fse from 'fs-extra';

/**
 * Convert a .heic/.heif file to a .jpg at outPath, copying EXIF.
 * (Implementation strategy can vary based on your environment; this wrapper
 * assumes you have an external converter available or handle this elsewhere.)
 */
export async function convertHEICFileToJPEGWithEXIF(inPath: string, outPath: string) {
  // If you already have a working converter, use it here.
  // Placeholder: copy file and rely on separate converter in pipeline (replace this).
  // Throw if you want to force real conversion.
  // eslint-disable-next-line no-console
  console.warn('convertHEICFileToJPEGWithEXIF: placeholder copy used. Replace with real HEIC→JPEG conversion.');
  await fse.copy(inPath, outPath, { overwrite: true });

  // Example if you later normalize orientation etc. with exiftool:
  // await exiftool.write(outPath, {}, [
  //   '-overwrite_original',
  //   '-TagsFromFile', inPath,
  //   '-EXIF:all',
  //   '-IPTC:all',
  //   '-XMP:all',
  //   '-IFD0:Orientation=Horizontal (normal)', // your proven-good syntax
  //   '-XMP-tiff:Orientation=',
  // ]);
}
