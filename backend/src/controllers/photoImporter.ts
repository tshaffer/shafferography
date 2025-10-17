import { Request, Response } from 'express';

import path from 'path';
import fs from 'fs';
import * as fse from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import {
  FileToImport, MediaItem,
  MediaItemPropertiesFromExif,
  PhotoState
} from '../types';
import { Tags } from 'exiftool-vendored';
import { isNil } from 'lodash';
import { convertCreateDateToISO, convertHEICFileToJPEGWithEXIF, fsLocalFileExists, isImageFile, mapExifToMediaItem, retrieveExifData, valueOrNull } from '../utilities';
import {
  addMediaItemToMediaItemsDBTable,
  getMediaItemFromDb,
  // updateSingleMediaItemFieldsInDb,
} from './dbInterface';
import { BASE_MEDIA_PATH, BASE_MEDIA_URL } from '../config';
import { mergePeople } from './peopleMerger';
import { DateTime } from 'luxon';

async function buildLocalStorageMediaItem(baseDirectory: string, albumNodeId: string, fileName: string, isoLastModified: string, googleAlbumName: string, googleAlbumId: string): Promise<MediaItem> {

  const filePath = path.join(baseDirectory, fileName);
  console.log('filePath:', filePath);
  const exifData: Tags = await retrieveExifData(filePath);
  console.log('exifData:', exifData);

  const mappedExif: MediaItemPropertiesFromExif = await mapExifToMediaItem(exifData);

  const relativePath = filePath.replace(BASE_MEDIA_PATH, "");

  const mediaItem: MediaItem = {
    uniqueId: uuidv4(),
    googleMediaItemId: '',
    fileName,
    googleAlbumId,
    googleAlbumName,
    filePath,
    url: `${BASE_MEDIA_URL}/${relativePath}`,
    mimeType: valueOrNull(exifData.MIMEType),
    exif: mappedExif,
    people: null,
    peopleRetrievedFromGoogle: false,
    keywordNodeIds: [],
    photoState: PhotoState.Unreviewed,
    albumNodeId,
    width: 0,
    height: 0,
    orientation: 0,
    takenAt: null,
    fileModifiedAt: isoLastModified,
    exifModifiedAt: null,
    undecidedGroupId: null,
    notes: null,
  }

  return mediaItem;
}

export const addMediaItemsFromLocalStorage = async (mediaItems: MediaItem[]): Promise<any> => {

  for (let index = 0; index < mediaItems.length; index++) {
    const mediaItem = mediaItems[index];
    const mediaItemFileName = mediaItem.fileName;
    if (isImageFile(mediaItemFileName)) {
      await addMediaItemToMediaItemsDBTable(mediaItem);
    }
  }

  return [];
}

const isImportFromTakeout = (dirName: string): boolean => {
  const metadataFilePath: string = path.join(dirName, 'metadata.json');
  return fsLocalFileExists(metadataFilePath);
};

interface FileStatus {
  status: "processing" | "completed" | "conversion failed";
  filename: string;
}

interface ImportStatus {
  [importId: string]: {
    files: FileStatus[];
  };
}

const processingStatuses: ImportStatus = {};

export const importPhotosEndpoint = async (request: Request, response: Response, next: any) => {

  try {
    console.log(request.body);

    const importId = uuidv4();

    const baseDirectory: string = request.body.baseDirectory;
    const albumNodeId: string = request.body.albumNodeId;
    const files: FileToImport[] = request.body.files;

    const filesData: any[] = files.map((file) => ({
      fileName: file.name,
      lastModified: file.lastModified,
    }));

    const importFromTakeout: boolean = isImportFromTakeout(baseDirectory);

    processingStatuses[importId] = {
      files: files.map((file) => ({
        filename: file.name,
        status: file.type === "image/heic" ? "processing" : "completed",
      })),
    };

    response.json({ importId });

    // retrieve google album if it exists
    let googleAlbumName: string = '';
    let metadataAlbumName: string = '';
    let googleAlbumId: string = '';
    if (importFromTakeout) {
      // const album: Album = await getAlbumById(albumNodeId);
      // metadataAlbumName = album.albumName;
      // const googleAlbums: GoogleAlbum[] = await getGoogleAlbumsByName(request.body.googleAccessToken, album.albumName);
      // if (googleAlbums.length > 0) {
      //   googleAlbumId = googleAlbums[0].id;
      //   googleAlbumName = album.albumName;
      // }
    }

    for (const fileData of filesData) {
      const fileName = fileData.fileName;
      const isoLastModified = DateTime.fromMillis(fileData.lastModified, { zone: 'utc' }).toISO();
      let updatedFileName: string = '';
      const filePath = path.join(baseDirectory, fileName);
      const fileExtension = path.extname(filePath);
      if (fileExtension.toLowerCase() === '.heic' || fileExtension.toLowerCase() === '.heif') {
        const inputFilePath = filePath;
        const dirname = path.dirname(inputFilePath); // Extracts the directory path
        const newFilename = path.basename(inputFilePath, fileExtension) + ".jpg"; // Replaces .heic with .jpg
        const outputFilePath = path.join(dirname, newFilename); // Combines directory with new filename
        console.log('convertFilesToJpeg:', inputFilePath, outputFilePath);

        const fileEntry: FileStatus = processingStatuses[importId].files.find((f) => f.filename === fileName);

        try {
          await convertHEICFileToJPEGWithEXIF(inputFilePath, outputFilePath);
          updatedFileName = newFilename;
          if (fileEntry) fileEntry.status = "completed";
        } catch (error) {
          if (fileEntry) fileEntry.status = "conversion failed";
          console.error('Error in convertFilesToJpeg:', error);
          continue;
        }

      } else {
        updatedFileName = fileName;
      }

      const mediaItem: MediaItem = await buildLocalStorageMediaItem(baseDirectory, albumNodeId, updatedFileName, isoLastModified, googleAlbumName, googleAlbumId);
      await addMediaItemsFromLocalStorage([mediaItem]);

    }

    if (importFromTakeout) {
      await mergePeople(BASE_MEDIA_PATH, metadataAlbumName);
    }

  } catch (error) {
    console.error('Error in importPhotosEndpoint:', error);
    response.status(500).json(error);
  }
}

export const getPerFileImportPhotosStatus = async (req: Request, res: Response, next: any) => {
  const { importId } = req.params;
  res.json(processingStatuses[importId] || { files: [] });
}

export function getLastModifiedUTCISO(filePath: string): string {
  const stats = fs.statSync(filePath);
  const mtime = stats.mtime; // JS Date object (local time interpreted)
  return DateTime.fromJSDate(mtime).toUTC().toISO();
}

// async function rebuildLocalStorageMediaItem(id: string, filePath: string): Promise<MediaItem | null> {

//   const exifData: Tags = await retrieveExifData(filePath);
//   const mappedExif: MediaItemPropertiesFromExif = await mapExifToMediaItem(exifData);

//   const isoCreateDate: string | null = await convertCreateDateToISO(exifData);
//   const geoData: GeoData | null = await extractGeoData(exifData);

//   const updates: Partial<MediaItem> = {
//     width: exifData.ImageWidth,
//     height: exifData.ImageHeight,
//     takenAt: isoCreateDate,
//     lastModified: getLastModifiedUTCISO(filePath),
//     // geoData,
//     orientation: isNil(exifData) ? null : valueOrNull(exifData.Orientation),
//   };

//   const updatedItem = await updateSingleMediaItemFieldsInDb(id, updates);
//   return updatedItem;
// }

export const reimportPhotosEndpoint = async (request: Request, response: Response, next: any) => {

  try {
    console.log(request.body);

    const mediaItemIds: string[] = request.body.mediaItemIds;
    const mediaItemId: string = mediaItemIds[0];

    const mediaItem: MediaItem | undefined = await getMediaItemFromDb(mediaItemId);
    if (!mediaItem) {
      console.error('Media item not found for ID:', mediaItemId);
      return response.status(404).json({ error: 'Media item not found' });
    }

    console.log('mediaItem:', mediaItem);

    const mediaFilePath: string = mediaItem.filePath;
    const fileExtension = path.extname(mediaFilePath);
    const dirname = path.dirname(mediaFilePath); // Extracts the directory path
    const heicFileName = path.basename(mediaFilePath, fileExtension) + ".heic";
    const heicFilePath = path.join(dirname, heicFileName);
    if (fse.existsSync(heicFilePath)) {
      console.log('HEIC file exists:', heicFilePath);
      console.log('convertFilesToJpeg:', heicFilePath, mediaFilePath);
      try {
        await convertHEICFileToJPEGWithEXIF(heicFilePath, mediaFilePath);
      } catch (error) {
        console.error('Error in convertFilesToJpeg:', error);
      }
    } else {
      console.error('HEIC file does not exist:', heicFilePath);
    }
    // const updatedItem: MediaItem | null = await rebuildLocalStorageMediaItem(mediaItem.uniqueId, mediaFilePath);
    const updatedItem: MediaItem | null = null;
    if (!updatedItem) {
      console.error('Failed to update media item:', mediaItem.uniqueId);
      return response.status(500).json({ error: 'Failed to update media item' });
    } else {
      console.log('Updated media item:', updatedItem);
      return response.json(updatedItem);
    }
  } catch (error) {
    console.error('Error in response:', error);
    return response.status(500).json(error);
  }
}