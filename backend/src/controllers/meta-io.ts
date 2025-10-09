// src/image/meta-io.ts
import { exiftool } from 'exiftool-vendored';
import path from 'path';

export async function copyExifAndNormalizeOrientation(source: string, dest: string) {
  await exiftool.write(dest, {}, [
    '-overwrite_original',
    '-TagsFromFile', source,
    '-EXIF:all',
    '-IPTC:all',
    '-XMP:all',

    // remove any copied Orientation in XMP, then set EXIF (IFD0) explicitly
    '-XMP-tiff:Orientation=',
    '-IFD0:Orientation=Horizontal (normal)',  // same as “1”
  ]);
}

function timestampSlug(d = new Date()) {
  return d.toISOString().replace(/[:.]/g, '-'); // safe for filenames
}

/**
 * e.g. IMG_0001.heic -> IMG_0001.crop-2025-10-05_06-31-04.heic
 */
export function buildDerivativePath(originalAbsPath: string, outExt: string): string {
  const dir = path.dirname(originalAbsPath);
  const { name } = path.parse(originalAbsPath);
  const stamp = timestampSlug();
  return path.join(dir, `${name}.crop-${stamp}.${outExt.replace(/^\./, '')}`);
}
