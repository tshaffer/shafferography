// src/image/meta-io.ts
import { exiftool } from 'exiftool-vendored';
import path from 'path';
import fs from 'fs-extra';

export async function copyExifAndNormalizeOrientation(
  source: string,
  dest: string
): Promise<void> {
  await exiftool.write(dest, {}, ['-TagsFromFile', source, '-all:all>all:all']);
  await exiftool.write(dest, { Orientation: 1 });
}

export function timestampSlug(d = new Date()) {
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

export async function ensureParentDir(p: string) {
  await fs.mkdirp(path.dirname(p));
}
