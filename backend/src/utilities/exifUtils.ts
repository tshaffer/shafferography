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

export function mapExifToMediaItem(tags: Tags): MediaItemPropertiesFromExif {
  // ---- timestamps
  const takenSource = (tags.DateTimeOriginal ?? tags.CreateDate) as ExifDateTime | string | undefined;
  const takenAt = toIsoString(takenSource);

  const fileModifiedAt = toIsoString(tags.FileModifyDate as ExifDateTime | string | undefined);
  const exifModifiedAt  = toIsoString(tags.ModifyDate      as ExifDateTime | string | undefined);

  // ---- dimensions (current vs original)
  const width  = toNumber(tags.ImageWidth);
  const height = toNumber(tags.ImageHeight);
  const originalWidth  = toNumber(tags.ExifImageWidth);
  const originalHeight = toNumber(tags.ExifImageHeight);

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

  // ---- human place (note the dashed key)
  const city = (tags.City as string | undefined)?.trim();
  const provinceState = ((tags as Record<string, unknown>)["Province-State"] as string | undefined)?.trim();
  const state = provinceState ?? (tags.State as string | undefined)?.trim();
  const country = (tags.Country as string | undefined)?.trim();

  // ---- GPS
  const gpsLatitude       = toNumber(tags.GPSLatitude);
  const gpsLongitude      = toNumber(tags.GPSLongitude);
  const gpsAltitudeM      = toNumber(tags.GPSAltitude);
  const gpsImgDirectionDeg = toNumber(tags.GPSImgDirection);

  return {
    // timestamps
    takenAt,
    fileModifiedAt,
    exifModifiedAt,

    // dimensions
    width,
    height,
    originalWidth,
    originalHeight,

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

