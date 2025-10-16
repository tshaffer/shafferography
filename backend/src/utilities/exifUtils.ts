import { DateTime } from 'luxon';
import { execFileSync } from "child_process";

import {
  ExifDateTime,
  exiftool,
  Tags
} from 'exiftool-vendored';
import { MediaItemPropertiesFromExif } from '../types';


// import { FilePathToExifTags } from '../types';

// export let filePathsToExifTags: FilePathToExifTags = {};

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
  // let exifData: Tags;
  // if (filePathsToExifTags.hasOwnProperty(filePath)) {
  //   exifData = filePathsToExifTags[filePath];
  // } else {
  //   exifData = await getExifData(filePath);
  //   filePathsToExifTags[filePath] = exifData;
  // }
  // return exifData;
}

export async function mapExifToMediaItem(tags: Tags): Promise<MediaItemPropertiesFromExif> {
  // ---- timestamps
  const takenSource = (tags.DateTimeOriginal ?? tags.CreateDate) as ExifDateTime | string | undefined;
  const takenAt = toIsoString(takenSource);

  const fileModifiedAt = toIsoString(tags.FileModifyDate as ExifDateTime | string | undefined);
  const exifModifiedAt = toIsoString(tags.ModifyDate as ExifDateTime | string | undefined);

  // ---- dimensions (current vs original)
  const width = toNumber(tags.ImageWidth);
  const height = toNumber(tags.ImageHeight);
  const orientation = toNumber(tags.Orientation); // 1-8

  // ---- exposure / optics
  const fNumber = toNumber(tags.FNumber);

  // ExposureTime can be "1/203" or numeric seconds
  const rawET = tags.ExposureTime as unknown;
  let exposureTime: string | undefined;
  if (typeof rawET === "string") {
    exposureTime = rawET; // already "1/203" etc.
  } else if (typeof rawET === "number") {
    exposureTime = rawET >= 1 ? `${rawET.toFixed(2)}s` : `1/${Math.round(1 / rawET)}`;
  }

  const iso = toNumber(tags.ISO);

  // Focal length
  const focalLengthMm = toNumber(tags.FocalLength); // number or "2.2 mm"
  const focalLength35mm = toNumber((tags as any).FocalLengthIn35mmFormat); // often "14 mm"

  // ---- GPS
  const gpsLatitude = toNumber(tags.GPSLatitude);
  const gpsLongitude = toNumber(tags.GPSLongitude);
  const gpsAltitudeM = toNumber(tags.GPSAltitude);
  const gpsImgDirectionDeg = toNumber(tags.GPSImgDirection);

  // ---- human place (note the dashed key)
  const addr = await reverseGeocode(gpsLatitude, gpsLongitude);
  const city = addr ? pickCity(addr) : undefined;
  const state = addr ? pickState(addr) : undefined;
  const country = addr?.country;


  return {
    // timestamps
    takenAt,
    fileModifiedAt,
    exifModifiedAt,

    // dimensions
    imageWidth: width,
    imageHeight: height,
    orientation,

    // exposure / optics
    fNumber,
    exposureTime,
    iso,
    focalLengthMm,
    focalLength35mm,

    // place
    city,
    state,
    country,

    // gps
    gpsLatitude,
    gpsLongitude,
    gpsAltitudeM,
    gpsImgDirectionDeg,
  };
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

  // Be gentle to Nominatim
  await new Promise((r) => setTimeout(r, 1100));

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

export async function convertCreateDateToISO(tags: Tags): Promise<string | null> {
  try {
    const createDate = tags.CreateDate; // ExifDateTime | string | undefined
    if (!createDate) {
      throw new Error('CreateDate not found in EXIF tags');
    }

    let isoDateString: string;

    if (createDate instanceof ExifDateTime) {
      // Interpret as local time, then convert to UTC
      const dateTime = DateTime.fromObject({
        year: createDate.year,
        month: createDate.month,
        day: createDate.day,
        hour: createDate.hour,
        minute: createDate.minute,
        second: createDate.second,
        millisecond: createDate.millisecond,
      }).toUTC(); // convert to UTC before formatting
      isoDateString = dateTime.toISO();
    } else {
      // EXIF string format is usually: "yyyy:MM:dd HH:mm:ss"
      const parsedDate = DateTime.fromFormat(createDate, 'yyyy:MM:dd HH:mm:ss', {
        zone: 'local',
      }).toUTC(); // convert to UTC before formatting
      isoDateString = parsedDate.toISO();
    }

    return isoDateString;
  } catch (err) {
    console.error('Error converting CreateDate to ISO format:', err);
    return null;
  }
}

// ── helpers ──────────────────────────────────────────────────────────────

function hasToISOString(x: unknown): x is { toISOString: () => string } {
  return typeof x === "object" && x !== null && typeof (x as any).toISOString === "function";
}

function toIsoString(val: ExifDateTime | string | undefined): string | undefined {
  if (!val) return undefined;
  if (hasToISOString(val)) return val.toISOString();              // ExifDateTime → ISO
  if (typeof val === "string") {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  return undefined;
}

function toNumber(val: unknown): number | undefined {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

