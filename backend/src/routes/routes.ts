import express from 'express';
import {
  getVersion,
  getAllKeywordData,
  addKeyword,
  addKeywordNode,
  setRootKeywordNode,
  getMediaItemsToDisplayFromSearchSpec,
  initializeKeywordTree,
  updateKeywordNode,
  uploadToGoogleEndpoint,
  getAlbumNamesWherePeopleNotRetrievedEndpoint,
  setPhotoStateEndpoint,
  mergePeopleTakeoutEndpoint,
  getPerFileUploadToGoogleStatus,
  getUndecidedGroups,
  setMediaItemNotesEndpoint,
  getAlbumNodes,
  saveAlbumNodes,
  moveAlbumNode,
  setAlbumNodeIdEndpoint,
  openInPreview,
  fileStat,
  getAllMediaItems,
} from '../controllers';
import { fetchUndecidedGroupsForAlbums } from '../controllers';
import { addUndecidedGroup } from '../controllers/';

import { getMediaItemCounts } from '../controllers/stats.controller';
import { getMediaItemsForPhotoState as getMediaItemsForPhotoStates, getOne as getMediaItem, assignMediaItemsToUndecidedGroup } from '../controllers/mediaItems.controller';
import { deleteUndecidedGroup } from '../controllers/undecidedGroups.controller';
import { getPerFileImportPhotosStatus, importPhotosEndpoint, reimportPhotosEndpoint } from '../controllers/importLocal.controller';

export const createRoutes = (app: express.Application) => {
  app.get('/api/v1/version', getVersion);
  app.get('/api/v1/mediaItemsToDisplayFromSearchSpec', getMediaItemsToDisplayFromSearchSpec);
  app.get('/api/v1/allKeywordData', getAllKeywordData);

  app.get('/api/v1/import-photos-status/:importId', getPerFileImportPhotosStatus);
  app.get('/api/v1/upload-to-google-status/:uploadId', getPerFileUploadToGoogleStatus);

  app.post('/api/v1/addKeyword', addKeyword);
  app.post('/api/v1/addKeywordNode', addKeywordNode);
  app.post('/api/v1/updateKeywordNode', updateKeywordNode);
  app.post('/api/v1/setRootKeywordNode', setRootKeywordNode);
  app.post('/api/v1/initializeKeywordTree', initializeKeywordTree);

  app.get('/api/v1/albumNamesWherePeopleNotRetrieved', getAlbumNamesWherePeopleNotRetrievedEndpoint);
  app.post('/api/v1/importPhotos', importPhotosEndpoint);
  app.post('/api/v1/reimportPhotos', reimportPhotosEndpoint);
  app.post('/api/v1/uploadToGoogle', uploadToGoogleEndpoint);
  app.post('/api/v1/mergePeopleTakeout', mergePeopleTakeoutEndpoint);

  app.post('/api/v1/setPhotoState', setPhotoStateEndpoint);
  app.post('/api/v1/setAlbumNodeId', setAlbumNodeIdEndpoint);
  app.post('/api/v1/setMediaItemNotes', setMediaItemNotesEndpoint);

  app.get('/api/v1/undecidedGroups', getUndecidedGroups);
  app.post('/api/v1/undecidedGroup', addUndecidedGroup);
  app.put('/api/v1/undecidedGroup/undecided-group', assignMediaItemsToUndecidedGroup);
  app.get('/api/v1/undecidedGroups/:albumNodeId', fetchUndecidedGroupsForAlbums);
  app.delete('/api/v1/undecidedGroups/:groupId', deleteUndecidedGroup);

  app.get('/api/v1/album-tree', getAlbumNodes);
  app.put('/api/v1/album-tree', saveAlbumNodes);
  app.post('/api/v1/album-tree/move-node', moveAlbumNode);

  app.post('/api/v1/open-in-preview', openInPreview);
  app.get('/api/v1/file-stat', fileStat);

  // test endpoints
  app.get('/api/v1/allMediaItems', getAllMediaItems);

  // new architecture
  app.get('/api/v1/stats/mediaItemCounts', getMediaItemCounts);
  app.get('/api/v1/mediaitems/:id', getMediaItem);
  app.get('/api/v1/mediaItemsForPhotoStates', getMediaItemsForPhotoStates);
};

