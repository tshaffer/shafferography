/* eslint-disable no-console */

import dotenv from 'dotenv';
dotenv.config({
  path: require('path').resolve(__dirname, '../../.env'),
});

import path from 'path';
import * as fse from 'fs-extra';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { getAllMediaItemsFromDb } from '../controllers';

/* ────────────────────────────────────────────────────────────
   CLI args
   ──────────────────────────────────────────────────────────── */
function parseArgs(): { file: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dryRun');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Usage: ts-node generateMediaItemsByUniqueId.ts /path/to/outputFile [--dryRun]');
    process.exit(1);
  }
  return { file: path.resolve(file), dryRun };
}


/* ────────────────────────────────────────────────────────────
   MAIN
   ──────────────────────────────────────────────────────────── */
(async () => {
  const { file, dryRun } = parseArgs();

  console.log('mongo uri is:');
  console.log(process.env.MONGO_URI);

  console.log(`Starting generateMediaItemsByUniqueId. dryRun=${dryRun}, file=${file}`);
  await connectDB();

  console.log('db connected');

  // read existing media items
  const mediaItems = await getAllMediaItemsFromDb();
  console.log(`Found ${mediaItems.length} media items in the database.`);

  const mediaItemsByUniqueId: { [uniqueId: string]: any } = {};
  mediaItems.forEach((item) => {
    if (item.uniqueId) {
      mediaItemsByUniqueId[item.uniqueId] = item;
    }
  });

  console.log(`Indexed ${Object.keys(mediaItemsByUniqueId).length} media items by uniqueId.`);

  // write mediaItemsByUniqueId to file
  const outputFilePath = process.argv[2];
  await fse.writeJSON(outputFilePath, mediaItemsByUniqueId, { spaces: 2 });
  console.log(`Wrote mediaItemsByUniqueId to ${outputFilePath}`);

  console.log('Done.');
  await mongoose.disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('Sync failed:', err);
  try { await mongoose.disconnect(); } catch { }
  process.exit(1);
});
