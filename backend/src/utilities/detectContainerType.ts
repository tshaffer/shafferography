import fs from 'node:fs/promises';

export type ContainerType = 'JPEG' | 'PNG' | 'HEIF' | 'UNKNOWN';

const HEIF_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1']);

export async function detectContainerType(filePath: string): Promise<ContainerType> {
  const handle = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(32);
    await handle.read(buffer, 0, buffer.length, 0);

    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'JPEG';
    }

    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'PNG';
    }

    const boxType = buffer.toString('ascii', 4, 8);
    if (boxType === 'ftyp') {
      const brand = buffer.toString('ascii', 8, 12).toLowerCase();
      if (HEIF_BRANDS.has(brand)) {
        return 'HEIF';
      }
    }

    return 'UNKNOWN';
  } finally {
    await handle.close();
  }
}
