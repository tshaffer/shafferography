import fs from 'node:fs/promises';
import path from 'node:path';
import { exiftool } from 'exiftool-vendored';

import { detectContainerType, type ContainerType } from './detectContainerType';

export type NormalizeHeicResult = {
  normalizedPath: string;
  didRename: boolean;
  actualType: ContainerType;
  mismatchDetected: boolean;
};

type NormalizeHeicOpts = {
  allowRename: boolean;
};

function isHeicExt(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.heic' || ext === '.heif';
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveExistingFileCollision(targetPath: string): Promise<string> {
  if (!(await fileExists(targetPath))) return targetPath;

  const dir = path.dirname(targetPath);
  const base = path.basename(targetPath, path.extname(targetPath));
  const ext = path.extname(targetPath);

  let i = 1;
  while (true) {
    const candidate = path.join(dir, `${base}.dup${i}${ext}`);
    if (!(await fileExists(candidate))) return candidate;
    i += 1;
  }
}

async function renameSidecarIfNeeded(oldPath: string, newPath: string): Promise<void> {
  const oldSidecar = `${oldPath}.shafferography.json`;
  if (!(await fileExists(oldSidecar))) return;

  const newSidecar = `${newPath}.shafferography.json`;
  if (!(await fileExists(newSidecar))) {
    await fs.rename(oldSidecar, newSidecar);
    return;
  }

  const [oldStat, newStat] = await Promise.all([fs.stat(oldSidecar), fs.stat(newSidecar)]);
  if (oldStat.size === newStat.size) {
    await fs.unlink(oldSidecar);
    return;
  }

  const collisionSidecar = await resolveExistingFileCollision(newSidecar);
  await fs.rename(oldSidecar, collisionSidecar);
}

async function detectContainerTypeWithFallback(filePath: string): Promise<ContainerType> {
  const detected = await detectContainerType(filePath);
  if (detected !== 'UNKNOWN') return detected;

  try {
    const tags = await exiftool.read(filePath);
    const fileType = String(tags.FileType ?? '').toUpperCase();
    if (fileType === 'JPEG') return 'JPEG';
    if (fileType === 'PNG') return 'PNG';
    if (fileType === 'HEIC' || fileType === 'HEIF') return 'HEIF';
  } catch {
    // ignore fallback errors
  }

  return 'UNKNOWN';
}

export async function normalizeMisnamedHeic(
  filePath: string,
  opts: NormalizeHeicOpts
): Promise<NormalizeHeicResult> {
  const actualType = await detectContainerTypeWithFallback(filePath);
  const mismatchDetected = isHeicExt(filePath) && actualType === 'JPEG';

  if (!mismatchDetected) {
    return {
      normalizedPath: filePath,
      didRename: false,
      actualType,
      mismatchDetected,
    };
  }

  console.warn(`normalizeMisnamedHeic: mismatch detected ext=.heic/.heif actual=${actualType} path=${filePath}`);

  if (!opts.allowRename) {
    return {
      normalizedPath: filePath,
      didRename: false,
      actualType,
      mismatchDetected,
    };
  }

  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const preferredPath = path.join(dir, `${base}.jpg`);
  const targetPath = await resolveExistingFileCollision(preferredPath);

  if (targetPath !== preferredPath) {
    console.warn(`normalizeMisnamedHeic: target exists, using ${targetPath}`);
  }

  if (await fileExists(preferredPath)) {
    const [oldStat, newStat] = await Promise.all([fs.stat(filePath), fs.stat(preferredPath)]);
    if (oldStat.size === newStat.size) {
      await fs.unlink(filePath);
      await renameSidecarIfNeeded(filePath, preferredPath);
      return {
        normalizedPath: preferredPath,
        didRename: true,
        actualType,
        mismatchDetected,
      };
    }
  }

  await fs.rename(filePath, targetPath);
  await renameSidecarIfNeeded(filePath, targetPath);

  return {
    normalizedPath: targetPath,
    didRename: true,
    actualType,
    mismatchDetected,
  };
}
