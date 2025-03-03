import { Request, Response } from 'express';

import * as fs from 'fs';
import * as fse from 'fs-extra';
import { promisify } from 'util';

import { version } from '../version';
import {
  getMediaItemsToDisplayFromDb,
  getAllKeywordDataFromDb,
  createKeywordDocument,
  createKeywordNodeDocument,
  setRootKeywordNodeDb,
  getMediaItemsToDisplayFromDbUsingSearchSpec,
  updateKeywordNodeDb,
  deleteMediaItemsFromDb,
  getMediaItemFromDb,
  addMediaItemToDeletedMediaItemsDBTable,
  getDeletedMediaItemsFromDb,
  removeDeleteMediaItemFromDb,
  clearDeletedMediaItemsDb,
  updateMediaItemsFieldsInDb,
  getMediaItemsFromDbByReviewLevels,
  getAllPhotoSetsFromDb,
  addPhotoSetToDb,
  getMediaItemsByPhotoSetFromDb
} from './dbInterface';
import { Keyword, KeywordData, KeywordNode, MediaItem, SearchRule, SearchSpec } from '../types';
import {
  deleteDirectory,
  fsDeleteFiles} from '../utilities';
import { MatchRule, ReviewLevel } from 'enums';
import path from 'path';
import { IPhotoSet } from '../models';
import { BASE_MEDIA_PATH } from '../config';
import { mergePeople } from './peopleMerger';

export const getVersion = (request: Request, response: Response, next: any) => {
  const data: any = {
    serverVersion: version,
  };
  response.json(data);
};

export const getMediaItemsByPhotoSet = async (request: Request, response: Response) => {
  const photoSetId: string | null = request.query.photoSetId ? request.query.photoSetId as string : null;
  if (!photoSetId) {
    response.status(400).send('photoSetId is required');
    return;
  }
  const mediaItems: MediaItem[] = await getMediaItemsByPhotoSetFromDb(photoSetId);
  response.json(mediaItems);
}

export const getMediaItemsToDisplay = async (request: Request, response: Response) => {

  const specifyDateRange: boolean = JSON.parse(request.query.specifyDateRange as string);
  const startDate: string | null = request.query.startDate ? request.query.startDate as string : null;
  const endDate: string | null = request.query.endDate ? request.query.endDate as string : null;

  const mediaItems: MediaItem[] = await getMediaItemsToDisplayFromDb(
    specifyDateRange,
    startDate,
    endDate,
  );
  response.json(mediaItems);
};

export const getMediaItemsByReviewLevels = async (request: Request, response: Response) => {
  const reviewLevels: ReviewLevel[] = JSON.parse(request.query.reviewLevels as string);
  const mediaItems: MediaItem[] = await getMediaItemsFromDbByReviewLevels(reviewLevels);
  response.json(mediaItems);
}

export const getMediaItemsToDisplayFromSearchSpec = async (request: Request, response: Response) => {

  /*
    path += '?matchRule=' + matchRule;
    path += '&searchRules=' + JSON.stringify(searchRules);
  */

  const matchRule: MatchRule = request.query.matchRule as MatchRule;
  const searchRules: SearchRule[] = JSON.parse(request.query.searchRules as string) as SearchRule[];

  const searchSpec: SearchSpec = {
    matchRule,
    searchRules,
  };

  const mediaItems: MediaItem[] = await getMediaItemsToDisplayFromDbUsingSearchSpec(searchSpec);
  response.json(mediaItems);
};

export const getAllKeywordData = async (request: Request, response: Response, next: any) => {
  const keywordData: KeywordData = await getAllKeywordDataFromDb();
  response.json(keywordData);
};

export const addKeyword = async (request: Request, response: Response, next: any) => {
  const { keywordId, label, type } = request.body;
  const keyword: Keyword = { keywordId, label, type };
  const keywordIdFromDb: string = await createKeywordDocument(keyword);
  response.json(keywordIdFromDb);
}

export const addKeywordNode = async (request: Request, response: Response, next: any) => {
  const { nodeId, keywordId, parentNodeId, childrenNodeIds } = request.body;
  const keywordNode: KeywordNode = { nodeId, keywordId, parentNodeId, childrenNodeIds };
  const keywordNodeIdFromDb: string = await createKeywordNodeDocument(keywordNode);
  response.json(keywordNodeIdFromDb);
}

export const updateKeywordNode = async (request: Request, response: Response, next: any) => {
  const { nodeId, keywordId, parentNodeId, childrenNodeIds } = request.body;
  const keywordNode: KeywordNode = { nodeId, keywordId, parentNodeId, childrenNodeIds };
  await updateKeywordNodeDb(keywordNode);
  response.json(keywordNode);
}

export const initializeKeywordTree = async (request: Request, response: Response, next: any) => {

  const rootKeyword: Keyword = {
    keywordId: 'rootKeywordId',
    label: 'All',
    type: 'tbd'
  };
  const rootKeywordId: string = await createKeywordDocument(rootKeyword);

  const rootKeywordNode: KeywordNode = {
    nodeId: 'rootKeywordNodeId',
    keywordId: rootKeywordId,
    parentNodeId: '',
    childrenNodeIds: []
  };
  await createKeywordNodeDocument(rootKeywordNode);

  const peopleKeyword: Keyword = {
    keywordId: 'peopleKeywordId',
    label: 'People',
    type: 'tbd'
  };
  const peopleKeywordId: string = await createKeywordDocument(peopleKeyword);

  const peopleKeywordNode: KeywordNode = {
    nodeId: 'peopleKeywordNodeId',
    keywordId: peopleKeywordId,
    parentNodeId: rootKeywordNode.nodeId,
    childrenNodeIds: []
  };
  await createKeywordNodeDocument(peopleKeywordNode);

  rootKeywordNode.childrenNodeIds.push(peopleKeywordNode.nodeId);
  await updateKeywordNodeDb(rootKeywordNode);

  response.status(200).send();
}

export const setRootKeywordNode = async (request: Request, response: Response, next: any) => {
  const { rootNodeId } = request.body;
  await setRootKeywordNodeDb(rootNodeId);
  response.status(200).send();
}

export const updateReviewLevelEndpoint = async (request: Request, response: Response, next: any) => {
  const { mediaItemIds, reviewLevel } = request.body;
  const updates: Partial<MediaItem> = {
    reviewLevel
  };

  await updateMediaItemsFieldsInDb(mediaItemIds, updates);
  response.sendStatus(200);
}

export const deleteMediaItems = async (request: Request, response: Response, next: any) => {

  const { mediaItemIds } = request.body;

  const filePaths: string[] = await Promise.all(mediaItemIds.map(async (iterator: string) => {
    const mediaItem: MediaItem = await getMediaItemFromDb(iterator);
    await addMediaItemToDeletedMediaItemsDBTable(mediaItem);
    return mediaItem.filePath;
  }));

  await deleteMediaItemsFromDb(mediaItemIds);
  await fsDeleteFiles(filePaths);

  response.sendStatus(200);
}

export const getDeletedMediaItems = async (request: Request, response: Response, next: any) => {
  const deletedMediaItems: any = await getDeletedMediaItemsFromDb();
  response.json(deletedMediaItems);
};

export const clearDeletedMediaItems = async (request: Request, response: Response, next: any) => {
  await clearDeletedMediaItemsDb();
  response.sendStatus(200);
}

export const removeDeletedMediaItem = async (request: Request, response: Response, next: any) => {
  const { mediaItemId } = request.body;
  await removeDeleteMediaItemFromDb(mediaItemId);
  response.sendStatus(200);
}

const realpath = promisify(fs.realpath);

export const getSubdirectoriesFromFs = async (dirPath: string): Promise<string[]> => {
  try {
    const realDirPath = await realpath(dirPath);
    const dirents: fs.Dirent[] = await fs.promises.readdir(realDirPath, { withFileTypes: true });
    const files = dirents
      .filter(dirent => dirent.isDirectory())
      // .map(dirent => path.join(realDirPath, dirent.name));
      .map(dirent => dirent.name);
    return files;
  } catch (err) {
    if (err.code === 'EACCES') {
      console.error('Permission denied:', err.path);
    } else if (err.code === 'ENOENT') {
      console.error('Directory does not exist:', err.path);
    } else if (err.code === 'EPERM') {
      console.error('Operation not permitted:', err.path);
    } else {
      console.error('Error reading directory:', err);
    }
    throw err;
  }
}

export const getTakeoutMetaDataFilePath = (baseDirectory: string, albumName: string, fileName: string): string => {

  const peopleTakeoutFilesDir: string = path.join(baseDirectory, albumName);

  let takeoutMetaDataFilePath: string = path.join(peopleTakeoutFilesDir, fileName + '.supplemental-metadata.json');

  const mediaFilePath: string = path.join(peopleTakeoutFilesDir, fileName);

  // if the media item is a converted file, substitute the original file
  const fileExtension = path.extname(mediaFilePath);
  if (fileExtension.toLowerCase() === '.jpg') {
    const dirname = path.dirname(mediaFilePath); // Extracts the directory path
    const fileName = path.basename(mediaFilePath, fileExtension) + ".heic.supplemental-metadata.json";
    const heicFilePath = path.join(dirname, fileName);
    if (fse.existsSync(heicFilePath)) {
      takeoutMetaDataFilePath = heicFilePath;
    }
  }

  return takeoutMetaDataFilePath;
}

export const mergePeopleTakeoutEndpoint = async (request: Request, response: Response, next: any) => {

  console.log('mergePeopleTakeoutEndpoint', request.body.albumName);

  const albumName: string = request.body.albumName;

  const peopleTakeoutFilesDir: string = path.join(BASE_MEDIA_PATH, albumName);
  const metadataFilePath: string = path.join(peopleTakeoutFilesDir, 'metadata.json');
  const metadataFileContents: string = fs.readFileSync(metadataFilePath, 'utf8');
  const metadata = JSON.parse(metadataFileContents);
  // metadata.title should be the same as request.body.albumName
  // verify this and throw error if not true

  console.log('mergePeopleTakeoutEndpoint', metadata);

  try {
    await mergePeople(BASE_MEDIA_PATH, albumName);
    await deleteDirectory(peopleTakeoutFilesDir);

    response.sendStatus(200);

  } catch (error) {
    console.error('Error in uploadPeopleTakeoutsEndpoint:', error);
    response.status(500).json(error);
  }
}

export const getPhotoSets = async (request: Request, response: Response, next: any) => {
  const photoSets: any = await getAllPhotoSetsFromDb();
  response.json(photoSets);
};

export const addPhotoSet = async (request: Request, response: Response, next: any) => {
  const newPhotoSet: IPhotoSet = await addPhotoSetToDb(request.body);
  response.json(newPhotoSet);
}

