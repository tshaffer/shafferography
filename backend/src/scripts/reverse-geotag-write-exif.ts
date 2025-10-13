// save as reverse-geotag.ts
// usage: ts-node reverse-geotag.ts /path/to/photo1.heic [/path/to/photo2.jpg...]

import { exiftool } from "exiftool-vendored";
import * as fs from "fs";
import * as path from "path";

type ReverseResult = {
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

async function reverseGeocode(lat: number, lon: number): Promise<ReverseResult | null> {
  // IMPORTANT: Nominatim requires a descriptive User-Agent with contact info.
  // Replace the email with yours to comply with their policy.
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

  const json = (await res.json()) as any;
  return json?.address ?? null;
}

function pickCity(addr: ReverseResult): string | undefined {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.neighbourhood ||
    addr.suburb
  );
}

function pickState(addr: ReverseResult): string | undefined {
  return addr.state || addr.state_district || addr.region || addr.county;
}

async function processFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const tags = await exiftool.read(filePath);

  const lat = tags.GPSLatitude;
  const lon = tags.GPSLongitude;

  if (typeof lat !== "number" || typeof lon !== "number") {
    console.warn(`No GPS coords in: ${filePath} — skipping`);
    return;
  }

  // Reverse geocode
  const addr = await reverseGeocode(lat, lon);
  if (!addr) {
    console.warn(`Reverse geocoding failed for: ${filePath}`);
    return;
  }

  const city = pickCity(addr);
  const state = pickState(addr);
  const country = addr.country;
  const countryCode = addr.country_code?.toUpperCase();
  const sublocation = addr.neighbourhood || addr.suburb;

  // Prepare a conservative, cross-tool set of tags (XMP + IPTC).
  // We avoid overwriting GPS fields; only add human-place fields.
  const writeTags: Record<string, string> = {};
  if (city) {
    writeTags["XMP:City"] = city;
    writeTags["IPTC:City"] = city;
  }
  if (state) {
    writeTags["XMP:State"] = state;
    writeTags["IPTC:Province-State"] = state;
  }
  if (country) {
    writeTags["XMP:Country"] = country;
    writeTags["IPTC:Country-PrimaryLocationName"] = country;
  }
  if (countryCode) {
    // IPTC country code (ISO 3166-1 alpha-2) is often expected
    writeTags["IPTC:Country-PrimaryLocationCode"] = countryCode;
  }
  if (sublocation) {
    // Often used for neighborhood/district
    writeTags["XMP:Location"] = sublocation;
    writeTags["IPTC:Sub-location"] = sublocation;
  }

  if (Object.keys(writeTags).length === 0) {
    console.log(`Nothing to write (no city/state/country) for ${filePath}`);
    return;
  }

  // Write back to the file (edit in place).
  // exiftool-vendored automatically adds -overwrite_original
  await exiftool.write(filePath, writeTags);

  console.log(
    `Updated ${path.basename(filePath)} →`,
    JSON.stringify(writeTags, null, 2)
  );
}

export async function reverseGeotag(
  filePath: string,
) {
  await processFile(filePath);
}

// async function main() {
//   const args = process.argv.slice(2);
//   if (args.length === 0) {
//     console.error("Usage: ts-node reverse-geotag.ts <file1> [file2 ...]");
//     process.exit(1);
//   }

//   try {
//     for (const f of args) {
//       await processFile(f);
//       // Be nice to the API: brief pause between requests.
//       await new Promise((r) => setTimeout(r, 1100));
//     }
//   } finally {
//     await exiftool.end();
//   }
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
