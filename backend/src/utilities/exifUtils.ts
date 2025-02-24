import { DateTime } from 'luxon';
import { execFileSync } from "child_process";
import { GeoData } from "entities";

import {
  ExifDateTime,
  exiftool,
  Tags
} from 'exiftool-vendored';

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
      // If CreateDate is an ExifDateTime object, use its properties directly and set to UTC
      const dateTime = DateTime.fromObject({
        year: createDate.year,
        month: createDate.month,
        day: createDate.day,
        hour: createDate.hour,
        minute: createDate.minute,
        second: createDate.second,
        millisecond: createDate.millisecond,
        zone: 'utc'
      });
      isoDateString = dateTime.toISO();
    } else {
      // If CreateDate is a string, parse and format it using Luxon and set to UTC
      // Assuming the string format is "yyyy:MM:dd HH:mm:ss"
      const parsedDate = DateTime.fromFormat(createDate, 'yyyy:MM:dd HH:mm:ss', { zone: 'utc' });
      isoDateString = parsedDate.toISO();
    }

    return isoDateString;
  } catch (err) {
    console.error('Error converting CreateDate to ISO format:', err);
    return null;
  }
}

export async function extractGeoData(tags: Tags): Promise<GeoData | null> {
  try {
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const geoData: GeoData = {
        latitude: tags.GPSLatitude,
        longitude: tags.GPSLongitude,
        altitude: tags.GPSAltitude || 0, // Default to 0 if altitude is not available
        latitudeSpan: 0, // Adjust based on your needs
        longitudeSpan: 0, // Adjust based on your needs
      };
      return geoData;
    } else {
      console.error('No GPS data found in EXIF tags');
      return null;
    }
  } catch (err) {
    console.error('Error reading EXIF data:', err);
    return null;
  }
}

