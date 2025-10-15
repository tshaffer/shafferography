/* eslint-disable no-console */

import dotenv from 'dotenv';
dotenv.config({
  path: require('path').resolve(__dirname, '../../.env'),
});

import path from 'path';
import * as fse from 'fs-extra';
import mongoose from 'mongoose';
import {
  Tags
} from 'exiftool-vendored';

import { MediaItem, MediaItemPropertiesFromExif, PersonInPhoto, PhotoState } from '../types';
import { connectDB } from '../config/db';
import { mapExifToMediaItem, retrieveExifData } from '../utilities';
import { addMediaItemsFromLocalStorage } from '../controllers';

export interface LegacyGeoData {
  latitude: number;
  longitude: number;
  altitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
}

export interface LegacyMediaItem {
  uniqueId: string;
  googleMediaItemId: string,
  fileName: string,
  googleAlbumId: string;
  googleAlbumName: string;
  filePath?: string,
  url?: string,
  mimeType?: string,
  creationTime?: string,
  lastModified?: string,
  width?: number,
  height?: number
  orientation?: number,
  description?: string,
  geoData?: LegacyGeoData,
  people?: PersonInPhoto[],
  peopleRetrievedFromGoogle: boolean,
  keywordNodeIds: string[],
  photoState: PhotoState,
  albumNodeId: string;
  undecidedGroupId?: string;
  notes?: string;
}

/* ────────────────────────────────────────────────────────────
   CLI args
   ──────────────────────────────────────────────────────────── */
function parseArgs(): { file: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dryRun');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Usage: ts-node populateMediaItemsFromLocalFiles.ts /path/to/outputFile [--dryRun]');
    process.exit(1);
  }
  return { file: path.resolve(file), dryRun };
}

// ── DB Updater ──────────────────────────────────────────────────────────────

const mergeMediaItems = (legacyMediaItem: LegacyMediaItem, mediaItemPropertiesFromExif: MediaItemPropertiesFromExif): MediaItem => {
  
  const mediaItem: MediaItem = {
    uniqueId: legacyMediaItem.uniqueId,
    googleMediaItemId: legacyMediaItem.googleMediaItemId,
    fileName: legacyMediaItem.fileName,
    googleAlbumId: legacyMediaItem.googleAlbumId,
    googleAlbumName: legacyMediaItem.googleAlbumName,
    filePath: legacyMediaItem.filePath,
    url: legacyMediaItem.url,
    mimeType: legacyMediaItem.mimeType,
    exif: mediaItemPropertiesFromExif,
    people: legacyMediaItem.people,
    peopleRetrievedFromGoogle: legacyMediaItem.peopleRetrievedFromGoogle,
    keywordNodeIds: legacyMediaItem.keywordNodeIds,
    photoState: legacyMediaItem.photoState,
    albumNodeId: legacyMediaItem.albumNodeId,
    undecidedGroupId: legacyMediaItem.undecidedGroupId,
    notes: legacyMediaItem.notes,
  };

  return mediaItem;
}

const populateDb = async (legacyMediaItemsByUniqueId: { [key: string]: LegacyMediaItem }, dryRun: boolean) => {
  let count = 0;
  for (const legacyMediaItem of Object.values(legacyMediaItemsByUniqueId)) {
    const filePath = legacyMediaItem.filePath!;
    const tags: Tags = await retrieveExifData(filePath);
    const mappedExif: MediaItemPropertiesFromExif = await mapExifToMediaItem(tags);
    const mediaItem: MediaItem = mergeMediaItems(legacyMediaItem, mappedExif);
    console.log(mediaItem.exif.city, mediaItem.exif.state, mediaItem.exif.country);
    await addMediaItemsFromLocalStorage([mediaItem]);
    count++;
    if (count % 50 === 0) {
      console.log(`Processed ${count} items...`);
    }
  }
}

/* ────────────────────────────────────────────────────────────
   MAIN
   ──────────────────────────────────────────────────────────── */
(async () => {
  const { file, dryRun } = parseArgs();

  console.log('mongo uri is:');
  console.log(process.env.MONGO_URI);

  console.log(`Starting populateMediaItemsFromLocalFiles. dryRun=${dryRun}, file=${file}`);
  await connectDB();

  console.log('db connected');

  // read legacyMediaItemsByUniqueId from file
  const legacyMediaItemsByUniqueId: { [key: string]: LegacyMediaItem } = await fse.readJSON(file);
  console.log(`Read ${Object.keys(legacyMediaItemsByUniqueId).length} legacy media items from ${file}`);

  await populateDb(legacyMediaItemsByUniqueId, dryRun);

  console.log('Done.');
  await mongoose.disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('Sync failed:', err);
  try { await mongoose.disconnect(); } catch { }
  process.exit(1);
});
