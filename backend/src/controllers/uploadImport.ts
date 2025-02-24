

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileToImport, GeoData, MediaItem, ReviewLevel } from '../types';
import { Tags } from 'exiftool-vendored';
import { isNil } from 'lodash';
import { convertCreateDateToISO, convertHEICFileToJPEGWithEXIF, extractGeoData, isImageFile, retrieveExifData, valueOrNull } from '../utilities';
import { addMediaItemToMediaItemsDBTable } from './dbInterface';
import { BASE_MEDIA_PATH } from '../config';

async function getLocalStorageMediaItems(baseDirectory: string, photoSetId: string, fileNames: string[]): Promise<MediaItem[]> {

  const mediaItems: MediaItem[] = await Promise.all(fileNames.map(async (fileName) => {
    const mediaItem: MediaItem = await getLocalStorageMediaItem(baseDirectory, photoSetId, fileName);
    return mediaItem;
  }));

  return mediaItems;
}

async function getLocalStorageMediaItem(baseDirectory: string, photoSetId: string, fileName: string): Promise<MediaItem> {

  const filePath = path.join(baseDirectory, fileName);
  console.log('filePath:', filePath);
  const exifData: Tags = await retrieveExifData(filePath);
  console.log('exifData:', exifData);
  const isoCreateDate: string | null = await convertCreateDateToISO(exifData);
  const geoData: GeoData | null = await extractGeoData(exifData);

  const relativePath = filePath.replace(BASE_MEDIA_PATH, "");

  const mediaItem: MediaItem = {
    uniqueId: uuidv4(),
    googleMediaItemId: '',
    fileName,
    albumId: '',
    albumName: '',
    filePath,
    productUrl: `http://localhost:8080/shafferographyMedia/${relativePath}`,
    baseUrl: null,
    mimeType: valueOrNull(exifData.MIMEType),
    creationTime: isoCreateDate,
    width: exifData.ImageWidth, // or ExifImageWidth?
    height: exifData.ImageHeight, // or ExifImageHeight?
    orientation: isNil(exifData) ? null : valueOrNull(exifData.Orientation),
    // description from exifData or from takeoutMetadata? - I'm not sure that what's below makes sense.
    // description: isNil(exifData) ? null : valueOrNull(takeoutMetadata.description),
    description: null,
    geoData,
    people: null,
    peopleRetrievedFromGoogle: false,
    keywordNodeIds: [],
    reviewLevel: ReviewLevel.Unreviewed,
    photoSetId,
  }

  return mediaItem;
}

const addMediaItemsFromLocalStorage = async (mediaItems: MediaItem[]): Promise<any> => {

  for (let index = 0; index < mediaItems.length; index++) {
    const mediaItem = mediaItems[index];
    const mediaItemFileName = mediaItem.fileName;
    if (isImageFile(mediaItemFileName)) {
      await addMediaItemToMediaItemsDBTable(mediaItem);
    }
  }

  return [];
}

export const importFiles = async (baseDirectory: string, photoSetId: string, files: FileToImport[]): Promise<any> => {

  const fileNames: string[] = files.map((file) => file.name);

  // convert HEIC files to JPEG
  const updatedFileNames: string[] = await convertFilesToJpeg(baseDirectory, fileNames);

  const localStorageMediaItems: MediaItem[] = await getLocalStorageMediaItems(baseDirectory, photoSetId, updatedFileNames);

  // skip step that checks for image file existence in db

  // add the mediaItems to the db
  await addMediaItemsFromLocalStorage(localStorageMediaItems);

  console.log('localStorageMediaItems:', localStorageMediaItems.length);

  return Promise.resolve();
}

const convertFilesToJpeg = async (baseDirectory: string, fileNames: string[]): Promise<string[]> => {

  const updatedFileNames: string[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(baseDirectory, fileName);
    const fileExtension = path.extname(filePath);
    if (fileExtension.toLowerCase() === '.heic' || fileExtension.toLowerCase() === '.heif') {
      const inputFilePath = filePath;
      const dirname = path.dirname(inputFilePath); // Extracts the directory path
      const newFilename = path.basename(inputFilePath, fileExtension) + ".jpg"; // Replaces .heic with .jpg
      const outputFilePath = path.join(dirname, newFilename); // Combines directory with new filename
      console.log('convertFilesToJpeg:', inputFilePath, outputFilePath);
      await convertHEICFileToJPEGWithEXIF(inputFilePath, outputFilePath);
      updatedFileNames.push(newFilename);
    } else {
      updatedFileNames.push(fileName);
    }
  }
  
  return Promise.resolve(updatedFileNames);
}