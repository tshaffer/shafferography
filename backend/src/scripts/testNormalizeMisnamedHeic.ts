import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { normalizeMisnamedHeic } from '../utilities';

async function main() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'shaferro-'));
  const heicPath = path.join(tempDir, 'fake.heic');
  const sidecarPath = `${heicPath}.shafferography.json`;

  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00]);
  await fs.writeFile(heicPath, jpegHeader);
  await fs.writeFile(sidecarPath, JSON.stringify({ people: ['Test Person'] }, null, 2));

  const result = await normalizeMisnamedHeic(heicPath, { allowRename: true });

  const expectedJpg = path.join(tempDir, 'fake.jpg');
  const expectedSidecar = `${expectedJpg}.shafferography.json`;

  const [jpgExists, sidecarExists] = await Promise.all([
    fs.access(expectedJpg).then(() => true).catch(() => false),
    fs.access(expectedSidecar).then(() => true).catch(() => false),
  ]);

  if (!jpgExists) {
    throw new Error(`Expected renamed JPEG at ${expectedJpg}`);
  }
  if (!sidecarExists) {
    throw new Error(`Expected sidecar renamed to ${expectedSidecar}`);
  }

  console.log('normalizeMisnamedHeic OK', result);
}

main().catch((err) => {
  console.error('testNormalizeMisnamedHeic failed:', err);
  process.exit(1);
});
