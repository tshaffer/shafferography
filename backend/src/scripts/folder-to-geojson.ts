// usage:
//   ts-node folder-to-geojson.ts /path/to/folder \
//     [--ext heic,jpg,jpeg,png] \
//     [--out /path/to/output.json] \
//     [--nominatim-contact you@example.com]
//
// Notes:
// - Respect Nominatim policy: provide a real contact email via --nominatim-contact.
// - Throttling: 1100ms delay per UNIQUE coordinate (cached across files with same rounded lat/lon).
// - Output: always prints the final JSON array to stdout; if --out is given, also writes that file.

import { exiftool } from "exiftool-vendored";
import * as fs from "fs";
import * as path from "path";

// ---------------- Types that match your schema slice ----------------

type GeoData = {
  altitude?: number;
  latitude?: number;
  latitudeSpan?: number;
  longitude?: number;
  longitudeSpan?: number;
};

type ExifSubdoc = {
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitudeM?: number;
  gpsAltitudeRef?: string;
  gpsDateTime?: string;
  city?: string;
  state?: string;
  country?: string;
};

type DbUpdatePayload = {
  sourceFile: string;
  fileName: string;
  geoData: GeoData;
  exif: ExifSubdoc;
};

// ---------------- Simple CLI args ----------------

type CliArgs = {
  root: string;
  exts: Set<string>;
  outPath?: string;
  nominatimContact?: string;
};

function parseArgs(argv: string[]): CliArgs {
  if (argv.length < 3) {
    console.error(
      "Usage: ts-node folder-to-geojson.ts <folder> [--ext heic,jpg,jpeg,png] [--out out.json] [--nominatim-contact you@example.com]"
    );
    process.exit(1);
  }
  const root = path.resolve(argv[2]);

  let exts = new Set(["heic", "jpg", "jpeg", "png"]);
  let outPath: string | undefined;
  let nominatimContact: string | undefined;

  for (let i = 3; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ext" && argv[i + 1]) {
      exts = new Set(
        argv[++i]
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      );
    } else if (a === "--out" && argv[i + 1]) {
      outPath = path.resolve(argv[++i]);
    } else if (a === "--nominatim-contact" && argv[i + 1]) {
      nominatimContact = argv[++i];
    }
  }

  return { root, exts, outPath, nominatimContact };
}

// ---------------- FS recursion ----------------

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      yield full;
    }
  }
}

// ---------------- Reverse-geocoding helpers ----------------

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

// cache keyed by rounded coords to reduce API calls
const revGeoCache = new Map<string, { city?: string; state?: string; country?: string }>();

function roundCoord(n: number, places = 5): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

async function reverseGeocode(
  lat: number,
  lon: number,
  contactEmail?: string
): Promise<{ city?: string; state?: string; country?: string } | null> {
  const key = `${roundCoord(lat)},${roundCoord(lon)}`;
  const cached = revGeoCache.get(key);
  if (cached) return cached;

  const uaContact = contactEmail ?? "no-contact-provided@example.com"; // please override
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&format=jsonv2&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": `Shafferography/1.0 (contact: ${uaContact})`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as any;
  const addr = (json?.address ?? {}) as NominatimAddr;

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.neighbourhood ||
    addr.suburb;
  const state = addr.state || addr.state_district || addr.region || addr.county;
  const country = addr.country;

  const result = { city, state, country };
  revGeoCache.set(key, result);

  // polite delay for each new coordinate hit
  await new Promise((r) => setTimeout(r, 1100));
  return result;
}

// ---------------- EXIF → DB mapping ----------------

function buildDbUpdateFromExif(
  sourceFile: string,
  tags: any,
  humanPlace?: { city?: string; state?: string; country?: string }
): DbUpdatePayload {
  const gpsLat = typeof tags.GPSLatitude === "number" ? tags.GPSLatitude : undefined;
  const gpsLon = typeof tags.GPSLongitude === "number" ? tags.GPSLongitude : undefined;
  const gpsAlt = typeof tags.GPSAltitude === "number" ? tags.GPSAltitude : undefined;

  const gpsDateTime: string | undefined =
    typeof tags.GPSDateTime === "string" ? tags.GPSDateTime : undefined;

  return {
    sourceFile,
    fileName: path.basename(sourceFile),
    geoData: {
      latitude: gpsLat,
      longitude: gpsLon,
      altitude: gpsAlt,
      latitudeSpan: undefined,
      longitudeSpan: undefined,
    },
    exif: {
      gpsLatitude: gpsLat,
      gpsLongitude: gpsLon,
      gpsAltitudeM: gpsAlt,
      gpsAltitudeRef:
        typeof tags.GPSAltitudeRef === "string" ? tags.GPSAltitudeRef : undefined,
      gpsDateTime,
      city: humanPlace?.city,
      state: humanPlace?.state,
      country: humanPlace?.country,
    },
  };
}

// ---------------- Per-file processing ----------------

async function processFile(
  absPath: string,
  contactEmail?: string
): Promise<DbUpdatePayload | null> {
  try {
    const tags = await exiftool.read(absPath);

    const lat = tags.GPSLatitude as number | undefined;
    const lon = tags.GPSLongitude as number | undefined;

    if (typeof lat === "number" && typeof lon === "number") {
      const place = await reverseGeocode(lat, lon, contactEmail);
      return buildDbUpdateFromExif(absPath, tags, place ?? undefined);
    } else {
      // no GPS: still return a shell payload (lets you decide how to handle)
      return buildDbUpdateFromExif(absPath, tags, undefined);
    }
  } catch (err) {
    console.error(`Error reading EXIF for ${absPath}:`, (err as Error).message);
    return null;
  }
}

// ---------------- Main ----------------

async function main() {
  const { root, exts, outPath, nominatimContact } = parseArgs(process.argv);

  // gather files
  const files: string[] = [];
  for await (const f of walk(root)) {
    const ext = path.extname(f).slice(1).toLowerCase();
    if (exts.has(ext)) files.push(f);
  }

  if (files.length === 0) {
    console.error("No matching files found.");
    process.exit(2);
  }

  const results: DbUpdatePayload[] = [];
  try {
    for (const f of files) {
      const payload = await processFile(path.resolve(f), nominatimContact);
      if (payload) results.push(payload);
    }
  } finally {
    await exiftool.end();
  }

  // Print to stdout
  const json = JSON.stringify(results, null, 2);
  process.stdout.write(json + "\n");

  // Optionally write to file too
  if (outPath) {
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, json, "utf8");
    console.error(`Wrote ${results.length} records → ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
