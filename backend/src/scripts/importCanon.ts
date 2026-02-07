// scripts/importCanon.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

import { connectDB } from '../config/db';
import { CANON_MEDIA_PATH, CANON_MEDIA_URL } from '../config';
import { getMediaItemModel } from '../models/getMediaItemModel';
import { connection } from '../config';
import { PhotoState } from '@shared/types/enums';
import type { CreateMediaItemInput } from '../domain/mediaItem.types';
import * as mediaItemRepo from '../repositories/mediaItem.repo';

const HASHED_FILENAME_RE = /^([0-9a-fA-F]{64})\.([^./\\]+)$/;

type CliArgs = {
  canonDir: string;
  albumNodeId: string;
  googleAlbumId: string;
  googleAlbumName: string;
  dryRun: boolean;
  limit?: number;
  since?: Date;
};

function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i];
    if (!raw.startsWith('--')) continue;
    const key = raw.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }

  const canonDir = (args.canonDir as string) || CANON_MEDIA_PATH;
  const albumNodeId = (args.albumNodeId as string) || '';
  const googleAlbumId = (args.googleAlbumId as string) || '';
  const googleAlbumName = (args.googleAlbumName as string) || '';
  const dryRun = Boolean(args.dryRun);
  const limit = args.limit ? Number(args.limit) : undefined;
  const since = args.since ? new Date(String(args.since)) : undefined;

  if (!albumNodeId) {
    throw new Error('Missing required --albumNodeId');
  }
  if (limit !== undefined && Number.isNaN(limit)) {
    throw new Error('Invalid --limit');
  }
  if (since && Number.isNaN(since.getTime())) {
    throw new Error('Invalid --since (expected ISO date string)');
  }

  return {
    canonDir,
    albumNodeId,
    googleAlbumId,
    googleAlbumName,
    dryRun,
    limit,
    since,
  };
}

async function walkDir(root: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

function toCanonUrl(filename: string): string {
  return `${CANON_MEDIA_URL.replace(/\/$/, '')}/${filename}`;
}

async function readSidecar(filePath: string): Promise<any | null> {
  const sidecarPath = `${filePath}.shafferography.json`;
  try {
    const raw = await fs.readFile(sidecarPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  await connectDB();
  const MediaItemModel = getMediaItemModel(connection);

  const files = await walkDir(args.canonDir);
  const mediaFiles = files.filter((file) => {
    const base = path.basename(file);
    if (base.endsWith('.shafferography.json')) return false;
    return HASHED_FILENAME_RE.test(base);
  });

  let scanned = 0;
  let imported = 0;
  let skipped = 0;
  let missingSidecar = 0;
  let errors = 0;

  for (const filePath of mediaFiles) {
    if (args.limit !== undefined && scanned >= args.limit) break;

    scanned += 1;

    const base = path.basename(filePath);
    const match = base.match(HASHED_FILENAME_RE);
    if (!match) continue;

    const shaLower = match[1].toLowerCase();

    try {
      const stat = await fs.stat(filePath);
      if (args.since && stat.mtime <= args.since) {
        continue;
      }

      const existing = await MediaItemModel.findOne({ contentHash: shaLower }).lean().exec();
      if (existing) {
        skipped += 1;
        console.log(`SKIP existing contentHash ${shaLower} uniqueId=${existing.uniqueId}`);
        continue;
      }

      const sidecar = await readSidecar(filePath);
      if (!sidecar) missingSidecar += 1;

      const people: string[] = Array.isArray(sidecar?.people)
        ? sidecar.people.filter((p: unknown) => typeof p === 'string')
        : [];

      const fileName = sidecar?.original?.filename || base;
      const url = toCanonUrl(base);

      const create: CreateMediaItemInput = {
        uniqueId: uuidv4(),
        contentHash: shaLower,
        googleMediaItemId: '',
        fileName,
        googleAlbumId: args.googleAlbumId,
        googleAlbumName: args.googleAlbumName,
        filePath,
        url,
        creationTime: undefined,
        lastModified: new Date(stat.mtimeMs).toISOString(),
        peopleRetrievedFromGoogle: true,
        people,
        keywordNodeIds: [],
        photoState: PhotoState.Unreviewed,
        albumNodeId: args.albumNodeId,
      };

      if (args.dryRun) {
        imported += 1;
        console.log(`DRY RUN import contentHash ${shaLower} file=${base}`);
        continue;
      }

      await mediaItemRepo.insert(create, { includeExif: false });
      imported += 1;
      console.log(`IMPORTED contentHash ${shaLower} file=${base}`);
    } catch (err) {
      errors += 1;
      console.error(`ERROR importing ${filePath}:`, err);
    }
  }

  console.log('--- Canon import summary ---');
  console.log(`Scanned: ${scanned}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Missing sidecar: ${missingSidecar}`);
  console.log(`Errors: ${errors}`);

  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
