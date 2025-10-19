// utilities/fileUtils.ts
import fs from 'node:fs';
import { DateTime } from 'luxon';
import path from 'node:path';

export function getLastModifiedUTCISO(filePath: string): string {
  const stats = fs.statSync(filePath);
  return DateTime.fromJSDate(stats.mtime).toUTC().toISO();
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tif', '.tiff', '.bmp', '.heic', '.heif']);

export function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTS.has(ext);
}
