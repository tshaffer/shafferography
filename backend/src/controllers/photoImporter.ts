import { Request, Response } from 'express';

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileToImport, GeoData, GoogleAlbum, MediaItem, Album, PhotoState } from '../types';
import { Tags } from 'exiftool-vendored';
import { isNil } from 'lodash';
import { convertCreateDateToISO, convertHEICFileToJPEGWithEXIF, extractGeoData, fsLocalFileExists, isImageFile, retrieveExifData, valueOrNull } from '../utilities';
import { addMediaItemToMediaItemsDBTable, getAlbumById } from './dbInterface';
import { BASE_MEDIA_PATH } from '../config';
import { mergePeople } from './peopleMerger';
import { getGoogleAlbumsByName } from './googlePhotos';

async function buildLocalStorageMediaItem(baseDirectory: string, albumId: string, fileName: string, googleAlbumName: string, googleAlbumId: string): Promise<MediaItem> {

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
    googleAlbumId,
    googleAlbumName,
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
    albumId: albumId,
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
    const albumId: string = request.body.albumId;
    const files: FileToImport[] = request.body.files;
    const fileNames: string[] = files.map((file) => file.name);

    console.log('baseDirectory:', baseDirectory);
    console.log('albumId:', albumId);
    console.log('files:', files);

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
      const album: Album = await getAlbumById(albumId);
      metadataAlbumName = album.albumName;
      const googleAlbums: GoogleAlbum[] = await getGoogleAlbumsByName(request.body.googleAccessToken, album.albumName);
      if (googleAlbums.length > 0) {
        googleAlbumId = googleAlbums[0].id;
        googleAlbumName = album.albumName;
      }
    }

    for (const fileName of fileNames) {
      let updatedFileName: string = '';
      const filePath = path.join(baseDirectory, fileName);
      const fileExtension = path.extname(filePath);
      if (fileExtension.toLowerCase() === '.heic' || fileExtension.toLowerCase() === '.heif') {
        const inputFilePath = filePath;
        const dirname = path.dirname(inputFilePath); // Extracts the directory path
        const newFilename = path.basename(inputFilePath, fileExtension) + ".jpg"; // Replaces .heic with .jpg
        const outputFilePath = path.join(dirname, newFilename); // Combines directory with new filename
        console.log('convertFilesToJpeg:', inputFilePath, outputFilePath);
        
        const fileEntry = processingStatuses[importId].files.find((f) => f.filename === fileName);

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

      const mediaItem: MediaItem = await buildLocalStorageMediaItem(baseDirectory, albumId, updatedFileName, googleAlbumName, googleAlbumId);
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
