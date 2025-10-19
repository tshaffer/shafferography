import { execFileSync } from "child_process";

import {
  ExifDateTime,
  exiftool,
  Tags
} from 'exiftool-vendored';


const getExifData = async (filePath: string): Promise<any> => {
  try {
    const tags: Tags = await exiftool.read(filePath);
    return tags;
  } catch (error: any) {
    console.log('getExifData failed on: ', filePath);
    debugger;
  }
};

export const retrieveExifData = async (filePath: string): Promise<Tags> => {
  const exifData: Tags = await getExifData(filePath);
  return exifData;
}

type NominatimAddr = {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state?: string;
  state_district?: string;
  region?: string;
  country?: string;
  country_code?: string;
};

export async function reverseGeocode(lat: number, lon: number): Promise<NominatimAddr | null> {
  // IMPORTANT: Use a real contact in the User-Agent per Nominatim policy.
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&format=jsonv2&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Shafferography/1.0 (contact: shaffer.family@gmail.com)",
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;

  // Be gentle to Nominatim
  await new Promise((r) => setTimeout(r, 1100));

  const json = (await res.json()) as any;
  return json?.address ?? null;
}

export function pickCity(addr: NominatimAddr): string | undefined {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.neighbourhood ||
    addr.suburb
  );
}

export function pickState(addr: NominatimAddr): string | undefined {
  return addr.state || addr.state_district || addr.region || addr.county;
}

export const copyExifTags = async (sourceFile: string, targetFile: string, deleteOrientation: boolean) => {
  try {
    const copyOutput = execFileSync('exiftool', ['-TagsFromFile', sourceFile, targetFile]);
    console.log(`stdout: ${copyOutput.toString()}`);

    if (deleteOrientation) {
      const deleteTagOutput = execFileSync('exiftool', ['-Orientation=', targetFile]);
      console.log(`stdout: ${deleteTagOutput.toString()}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stderr) {
      console.error(`stderr: ${error.stderr.toString()}`);
    }
  }
}

// ── helpers ──────────────────────────────────────────────────────────────

function hasToISOString(x: unknown): x is { toISOString: () => string } {
  return typeof x === "object" && x !== null && typeof (x as any).toISOString === "function";
}

export function toIsoString(val: ExifDateTime | string | undefined): string | undefined {
  if (!val) return undefined;
  if (hasToISOString(val)) return val.toISOString();              // ExifDateTime → ISO
  if (typeof val === "string") {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  return undefined;
}
