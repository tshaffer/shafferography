// utilities/fileUtils.ts
import fs from 'node:fs';
import { DateTime } from 'luxon';

export function getLastModifiedUTCISO(filePath: string): string {
  const stats = fs.statSync(filePath);
  const mtime = stats.mtime; // JS Date object (local time interpreted)
  return DateTime.fromJSDate(mtime).toUTC().toISO();
}

