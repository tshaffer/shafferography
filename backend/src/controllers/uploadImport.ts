import { Request, Response } from 'express';

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileToImport, GeoData, Keyword, KeywordData, KeywordNode, MediaItem, PhotoSet, ReviewLevel, StringToStringLUT } from '../types';
import { Tags } from 'exiftool-vendored';
import { isNil } from 'lodash';
import { convertCreateDateToISO, convertHEICFileToJPEGWithEXIF, extractGeoData, fsLocalFileExists, getJsonFromFile, isImageFile, retrieveExifData, valueOrNull } from '../utilities';
import { addAutoPersonKeywordsToDb, addMediaItemToMediaItemsDBTable, getAutoPersonKeywordNodesFromDb, getKeywordsFromDb, getMediaItemsInNamedAlbumFromDb, getPhotoSetById, updateMediaItemFieldsInDb } from './dbInterface';
import { BASE_MEDIA_PATH } from '../config';
import { getTakeoutMetaDataFilePath } from './app';

async function buildLocalStorageMediaItems(baseDirectory: string, photoSetId: string, fileNames: string[], albumName: string): Promise<MediaItem[]> {

  const mediaItems: MediaItem[] = await Promise.all(fileNames.map(async (fileName) => {
    const mediaItem: MediaItem = await buildLocalStorageMediaItem(baseDirectory, photoSetId, fileName, albumName);
    return mediaItem;
  }));

  return mediaItems;
}

async function buildLocalStorageMediaItem(baseDirectory: string, photoSetId: string, fileName: string, albumName: string): Promise<MediaItem> {

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

const isImportFromTakeout = (dirName: string): boolean => {
  const metadataFilePath: string = path.join(dirName, 'metadata.json');
  return fsLocalFileExists(metadataFilePath);
};

interface FileStatus {
  status: "uploading" | "processing" | "completed";
  filename: string;
}

interface UploadStatus {
  [uploadId: string]: {
    files: FileStatus[];
  };
}

const processingStatuses: UploadStatus = {};

export const uploadAndImportEndpoint = async (request: Request, response: Response, next: any) => {

  try {
    console.log(request.body);

    const uploadId = uuidv4();

    const baseDirectory: string = request.body.baseDirectory;
    const photoSetId: string = request.body.photoSetId;
    const files: FileToImport[] = request.body.files;
    const fileNames: string[] = files.map((file) => file.name);

    console.log('baseDirectory:', baseDirectory);
    console.log('photoSetId:', photoSetId);
    console.log('files:', files);

    const importFromTakeout: boolean = isImportFromTakeout(baseDirectory);

    processingStatuses[uploadId] = {
      files: files.map((file) => ({
        filename: file.name,
        status: file.type === "image/heic" ? "processing" : "completed",
      })),
    };

    response.json({ uploadId });

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

        const fileEntry = processingStatuses[uploadId].files.find((f) => f.filename === fileName);
        if (fileEntry) fileEntry.status = "completed";

      } else {
        updatedFileNames.push(fileName);
      }
    }

    let albumName: string = '';
    if (importFromTakeout) {
      const photoSet: PhotoSet = await getPhotoSetById(photoSetId);
      albumName = photoSet.photoSetName;
    }

    const localStorageMediaItems: MediaItem[] = await buildLocalStorageMediaItems(baseDirectory, photoSetId, updatedFileNames, albumName);

    // skip step that checks for image file existence in db

    // add the mediaItems to the db
    await addMediaItemsFromLocalStorage(localStorageMediaItems);

    if (importFromTakeout) {
      await mergePeople(albumName);
    }

    console.log('localStorageMediaItems:', localStorageMediaItems.length);

  } catch (error) {
    console.error('Error in uploadAndImportEndpoint:', error);
    response.status(500).json(error);
  }
}

const mergePeople = async (albumName: string) => {

  try {

    const mediaItemsInAlbum: MediaItem[] = await getMediaItemsInNamedAlbumFromDb(albumName);

    const personKeywordNames: Set<string> = new Set<string>();

    for (const mediaItemInAlbum of mediaItemsInAlbum) {

      const takeoutMetaDataFilePath: string = getTakeoutMetaDataFilePath(BASE_MEDIA_PATH, albumName, mediaItemInAlbum.fileName);

      // NOTE the current (as of 2/21/2025 file naming convention)
      const encodedFilePath = takeoutMetaDataFilePath.replace(/&/g, "&amp_");
      const takeoutMetadata: any = await getJsonFromFile(encodedFilePath);
      if (!isNil(takeoutMetadata.people)) {
        takeoutMetadata.people.forEach((person: any) => {
          personKeywordNames.add(person.name);
        });
      }
    }

    let addedKeywordData: KeywordData = null;
    const addedMediaItems: MediaItem[] = [];

    if (personKeywordNames.size > 0) {
      addedKeywordData = await (addAutoPersonKeywordsToDb(personKeywordNames));
    }

    const keywords: Keyword[] = await getKeywordsFromDb();

    const autoPersonKeywordNodes: KeywordNode[] = await getAutoPersonKeywordNodesFromDb();

    const personNameToAutoPersonKeywordNodeId: StringToStringLUT = {};
    personKeywordNames.forEach((personName: string) => {
      autoPersonKeywordNodes.forEach((autoPersonKeywordNode: KeywordNode) => {
        const autoPersonKeywordId: string = autoPersonKeywordNode.keywordId;
        const keyword: Keyword = keywords.find((keyword: Keyword) => keyword.keywordId === autoPersonKeywordId);
        if (keyword.label === personName) {
          personNameToAutoPersonKeywordNodeId[personName] = autoPersonKeywordNode.nodeId;
        }
      });
    });

    const keywordIdByKeywordLabel: StringToStringLUT = {};
    keywords.forEach((keyword: Keyword) => {
      keywordIdByKeywordLabel[keyword.label] = keyword.keywordId;
    })

    for (const mediaItemInAlbum of mediaItemsInAlbum) {
      const takeoutMetaDataFilePath: string = getTakeoutMetaDataFilePath(BASE_MEDIA_PATH, albumName, mediaItemInAlbum.fileName);
      const encodedFilePath = takeoutMetaDataFilePath.replace(/&/g, "&amp_");
      const takeoutMetadata: any = await getJsonFromFile(encodedFilePath);

      const keywordNodeIds: string[] = [];

      if (!isNil(takeoutMetadata.people)) {
        takeoutMetadata.people.forEach((person: any) => {
          const name: string = person.name;
          keywordNodeIds.push(personNameToAutoPersonKeywordNodeId[name]);
        })
      }

      const people: string[] | null = takeoutMetadata.people ? takeoutMetadata.people : null;

      const updates: Partial<MediaItem> = {
        people,
        keywordNodeIds,
        peopleRetrievedFromGoogle: true,
      };
      await updateMediaItemFieldsInDb(mediaItemInAlbum.uniqueId, updates);
    }

  } catch (error) {
    console.error('Error in uploadPeopleTakeoutsEndpoint:', error);
  }

}
export const getPerFileUploadStatus = async (req: Request, res: Response, next: any) => {
  const { uploadId } = req.params;
  res.json(processingStatuses[uploadId] || { files: [] });
}
