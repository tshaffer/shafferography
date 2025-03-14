import { Request, Response } from 'express';

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileToImport, GeoData, GoogleAlbum, MediaItem, PhotoSet, PhotoState } from '../types';
import { Tags } from 'exiftool-vendored';
import { isNil } from 'lodash';
import { convertCreateDateToISO, convertHEICFileToJPEGWithEXIF, extractGeoData, fsLocalFileExists, isImageFile, retrieveExifData, valueOrNull } from '../utilities';
import { addMediaItemToMediaItemsDBTable, getPhotoSetById } from './dbInterface';
import { BASE_MEDIA_PATH } from '../config';
import { mergePeople } from './peopleMerger';
import { getGoogleAlbumsByName } from './googlePhotos';

async function buildLocalStorageMediaItems(baseDirectory: string, photoSetId: string, fileNames: string[], albumName: string, albumId: string): Promise<MediaItem[]> {

  const mediaItems: MediaItem[] = await Promise.all(fileNames.map(async (fileName) => {
    const mediaItem: MediaItem = await buildLocalStorageMediaItem(baseDirectory, photoSetId, fileName, albumName, albumId);
    return mediaItem;
  }));

  return mediaItems;
}

async function buildLocalStorageMediaItem(baseDirectory: string, photoSetId: string, fileName: string, albumName: string, albumId: string): Promise<MediaItem> {

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
    albumId,
    albumName,
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
    photoState: PhotoState.Unreviewed,
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

const isImportFromTakeout = (dirName: string): boolean => {
  const metadataFilePath: string = path.join(dirName, 'metadata.json');
  return fsLocalFileExists(metadataFilePath);
};

interface FileStatus {
  status: "processing" | "completed";
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
    const photoSetId: string = request.body.photoSetId;
    const files: FileToImport[] = request.body.files;
    const fileNames: string[] = files.map((file) => file.name);

    console.log('baseDirectory:', baseDirectory);
    console.log('photoSetId:', photoSetId);
    console.log('files:', files);

    const importFromTakeout: boolean = isImportFromTakeout(baseDirectory);

    processingStatuses[importId] = {
      files: files.map((file) => ({
        filename: file.name,
        status: file.type === "image/heic" ? "processing" : "completed",
      })),
    };

    response.json({ importId });

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

        const fileEntry = processingStatuses[importId].files.find((f) => f.filename === fileName);
        if (fileEntry) fileEntry.status = "completed";

      } else {
        updatedFileNames.push(fileName);
      }
    }

    let albumName: string = '';
    let albumId: string = '';
    if (importFromTakeout) {
      const photoSet: PhotoSet = await getPhotoSetById(photoSetId);
      albumName = photoSet.photoSetName;
      const googleAlbums: GoogleAlbum[] = await getGoogleAlbumsByName(request.body.googleAccessToken, albumName);
      if (googleAlbums.length > 0) {
        albumId = googleAlbums[0].id;
      }
    }

    const localStorageMediaItems: MediaItem[] = await buildLocalStorageMediaItems(baseDirectory, photoSetId, updatedFileNames, albumName, albumId);

    // skip step that checks for image file existence in db

    // add the mediaItems to the db
    await addMediaItemsFromLocalStorage(localStorageMediaItems);

    if (importFromTakeout) {
      await mergePeople(BASE_MEDIA_PATH, albumName);
    }

    console.log('localStorageMediaItems:', localStorageMediaItems.length);

  } catch (error) {
    console.error('Error in importPhotosEndpoint:', error);
    response.status(500).json(error);
  }
}

export const getPerFileImportPhotosStatus = async (req: Request, res: Response, next: any) => {
  const { importId } = req.params;
  res.json(processingStatuses[importId] || { files: [] });
}
