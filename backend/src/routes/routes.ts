import express from 'express';
import {
  getMediaItemsToDisplay,
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
  getAlbums,
  addAlbum,
  mergePeopleTakeoutEndpoint,
  importPhotosEndpoint,
  getPerFileImportPhotosStatus,
  getPerFileUploadToGoogleStatus,
  getMediaItemsByViewSpec,
  assignMediaItemsToUndecidedGroup,
  deleteUndecidedGroup,
  getUndecidedGroups,
  getMediaItemCountByAlbum,
  getMediaItemCountByPhotoState,
  getMediaItemCounts,
  getMediaItemCountByUndecidedGroupPerAlbum,
  getMediaItemCountByPhotoStateByAlbumId,
  setMediaItemNotesEndpoint,
  getAlbumNodes,
  saveAlbumNodes,
  moveAlbumNode,
} from '../controllers';
import { fetchUndecidedGroupsForAlbums } from '../controllers';
import { addUndecidedGroup } from '../controllers/';

export const createRoutes = (app: express.Application) => {
  app.get('/api/v1/version', getVersion);
  app.get('/api/v1/mediaItemsToDisplay', getMediaItemsToDisplay);
  app.get('/api/v1/mediaItemsByViewSpec', getMediaItemsByViewSpec);
  app.get('/api/v1/mediaItemsToDisplayFromSearchSpec', getMediaItemsToDisplayFromSearchSpec);
  app.get('/api/v1/allKeywordData', getAllKeywordData);
  app.get('/api/v1/albums', getAlbums);

  app.get('/api/v1/import-photos-status/:importId', getPerFileImportPhotosStatus);
  app.get('/api/v1/upload-to-google-status/:uploadId', getPerFileUploadToGoogleStatus);

  app.post('/api/v1/album', addAlbum);

  app.post('/api/v1/addKeyword', addKeyword);
  app.post('/api/v1/addKeywordNode', addKeywordNode);
  app.post('/api/v1/updateKeywordNode', updateKeywordNode);
  app.post('/api/v1/setRootKeywordNode', setRootKeywordNode);
  app.post('/api/v1/initializeKeywordTree', initializeKeywordTree);

  app.get('/api/v1/albumNamesWherePeopleNotRetrieved', getAlbumNamesWherePeopleNotRetrievedEndpoint);
  app.post('/api/v1/importPhotos', importPhotosEndpoint);
  app.post('/api/v1/uploadToGoogle', uploadToGoogleEndpoint);
  app.post('/api/v1/mergePeopleTakeout', mergePeopleTakeoutEndpoint);

  app.post('/api/v1/setPhotoState', setPhotoStateEndpoint);
  app.post('/api/v1/setMediaItemNotes', setMediaItemNotesEndpoint);

  app.get('/api/v1/undecidedGroups', getUndecidedGroups);
  app.post('/api/v1/undecidedGroup', addUndecidedGroup);
  app.put('/api/v1/undecidedGroup/undecided-group', assignMediaItemsToUndecidedGroup);
  app.get('/api/v1/undecidedGroups/:albumId', fetchUndecidedGroupsForAlbums);
  app.delete('/api/v1/undecidedGroups/:groupId', deleteUndecidedGroup);

  app.get('/api/v1/mediaItemCounts', getMediaItemCounts);
  app.get('/api/v1/mediaItemCountByAlbum', getMediaItemCountByAlbum);
  app.get('/api/v1/mediaItemCountByPhotoState', getMediaItemCountByPhotoState);
  app.get('/api/v1/mediaItemCountByUndecidedGroupPerAlbum', getMediaItemCountByUndecidedGroupPerAlbum);
  app.get('/api/v1/mediaItemCountByPhotoStateByAlbumId', getMediaItemCountByPhotoStateByAlbumId);

  app.get('/api/v1/album-tree', getAlbumNodes);
  app.put('/api/v1/album-tree', saveAlbumNodes);
  app.post('/api/v1/album-tree/move-node', moveAlbumNode);
  
};

