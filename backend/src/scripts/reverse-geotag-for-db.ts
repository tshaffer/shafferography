// standalone usage: ts-node reverse-geotag-for-db.ts /path/to/photo1.heic [/path/to/photo2.jpg...]
// output: logs a JSON array of per-file update payloads for your DB

import { Tags } from "exiftool-vendored";

// ---------------- Types that match your schema slice ----------------

type GeoData = {
  altitude?: number;
  latitude?: number;
  latitudeSpan?: number;
  longitude?: number;
  longitudeSpan?: number;
};

type ExifSubdoc = {
  // timestamps
  takenAt?: string;
  exifModifiedAt?: string;
  fileModifiedAt?: string;

  // timezone offsets
  offsetTime?: string;
  offsetTimeOriginal?: string;
  offsetTimeDigitized?: string;

  // dimensions
  imageWidth?: number;
  imageHeight?: number;

  // optics
  fNumber?: number;
  exposureTime?: string;
  iso?: number;
  focalLengthMm?: number;
  focalLength35mm?: number;

  // GPS
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitudeM?: number;
  gpsAltitudeRef?: string;
  gpsDateTime?: string;         // ideally ISO 8601 UTC if available
  gpsImgDirectionDeg?: number;
  gpsImgDirectionRef?: string;
  gpsSpeed?: number;
  gpsSpeedRef?: string;

  // human-place
  city?: string;
  state?: string;
  country?: string;
};

export type DbUpdatePayload = {
  // The fields you’ll $set into your Mediaitem document:
  geoData: GeoData;
  exif: ExifSubdoc;
};

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

async function reverseGeocode(lat: number, lon: number): Promise<NominatimAddr | null> {
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
  const json = (await res.json()) as any;
  return json?.address ?? null;
}

function pickCity(addr: NominatimAddr): string | undefined {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.neighbourhood ||
    addr.suburb
  );
}

function pickState(addr: NominatimAddr): string | undefined {
  return addr.state || addr.state_district || addr.region || addr.county;
}

// ---------------- EXIF → DB mapping ----------------

function buildDbUpdateFromExif(
  tags: any,
  humanPlace?: { city?: string; state?: string; country?: string }
): DbUpdatePayload {
  const gpsLat = typeof tags.GPSLatitude === "number" ? tags.GPSLatitude : undefined;
  const gpsLon = typeof tags.GPSLongitude === "number" ? tags.GPSLongitude : undefined;
  const gpsAlt =
    typeof tags.GPSAltitude === "number" ? tags.GPSAltitude : undefined;

  // Some ExifTool builds expose GPSDateTime as a string in UTC, sometimes only GPSTimeStamp+GPSDateStamp.
  // We’ll prefer GPSDateTime if present; otherwise leave it undefined.
  const gpsDateTime: string | undefined =
    typeof tags.GPSDateTime === "string" ? tags.GPSDateTime : undefined;

  return {
    geoData: {
      latitude: gpsLat,
      longitude: gpsLon,
      altitude: gpsAlt,
      // spans usually not present; keep undefined
      latitudeSpan: undefined,
      longitudeSpan: undefined,
    },
    exif: {
      // Only the GPS and human-place fields needed now. You can add more later.
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

// ---------------- Main per-file processing ----------------

export async function reverseGeotagExif(tags: Tags): Promise<DbUpdatePayload | null> {
  const lat = tags.GPSLatitude as number | undefined;
  const lon = tags.GPSLongitude as number | undefined;

  // If no GPS, we still return a payload with just source info (you can skip later if you want)
  if (typeof lat !== "number" || typeof lon !== "number") {
    return buildDbUpdateFromExif(tags, undefined);
  }

  // Get human place without writing to the file
  const addr = await reverseGeocode(lat, lon);
  const city = addr ? pickCity(addr) : undefined;
  const state = addr ? pickState(addr) : undefined;
  const country = addr?.country;

  // Build DB update object
  return buildDbUpdateFromExif(tags, { city, state, country });
}

// async function processFile(absPath: string): Promise<DbUpdatePayload | null> {
//   if (!fs.existsSync(absPath)) {
//     console.error(`File not found: ${absPath}`);
//     return null;
//   }

//   const tags = await exiftool.read(absPath);

//   const lat = tags.GPSLatitude as number | undefined;
//   const lon = tags.GPSLongitude as number | undefined;

//   // If no GPS, we still return a payload with just source info (you can skip later if you want)
//   if (typeof lat !== "number" || typeof lon !== "number") {
//     return buildDbUpdateFromExif(absPath, tags, undefined);
//   }

//   // Get human place without writing to the file
//   const addr = await reverseGeocode(lat, lon);
//   const city = addr ? pickCity(addr) : undefined;
//   const state = addr ? pickState(addr) : undefined;
//   const country = addr?.country;

//   // Build DB update object
//   return buildDbUpdateFromExif(absPath, tags, { city, state, country });
// }

// // ---------------- CLI entry ----------------

// async function main() {
//   const files = process.argv.slice(2);
//   if (files.length === 0) {
//     console.error("Usage: ts-node reverse-geotag-for-db.ts <file1> [file2 ...]");
//     process.exit(1);
//   }

//   const results: DbUpdatePayload[] = [];
//   try {
//     for (const f of files) {
//       const abs = path.resolve(f);
//       const payload = await processFile(abs);
//       if (payload) results.push(payload);
//       // Be gentle to Nominatim
//       await new Promise((r) => setTimeout(r, 1100));
//     }
//   } finally {
//     await exiftool.end();
//   }

//   // Print JSON so you can pipe it into whatever persists to Mongo
//   console.log(JSON.stringify(results, null, 2));
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
