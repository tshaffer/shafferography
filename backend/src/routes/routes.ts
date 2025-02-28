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
  deleteMediaItems,
  getDeletedMediaItems,
  clearDeletedMediaItems,
  removeDeletedMediaItem,
  uploadToGoogleEndpoint,
  getAlbumNamesWherePeopleNotRetrievedEndpoint,
  updateReviewLevelEndpoint,
  getMediaItemsByReviewLevels,
  getPhotoSets,
  addPhotoSet,
  getMediaItemsByPhotoSet,
  mergePeopleTakeoutEndpoint,
  importPhotosEndpoint,
  getPerFileImportPhotosStatus,
  getPerFileUploadToGoogleStatus,
} from '../controllers';

export const createRoutes = (app: express.Application) => {
  app.get('/api/v1/version', getVersion);
  app.get('/api/v1/mediaItemsToDisplay', getMediaItemsToDisplay);
  app.get('/api/v1/mediaItemsByPhotoSet', getMediaItemsByPhotoSet);
  app.get('/api/v1/mediaItemsByReviewLevels', getMediaItemsByReviewLevels);
  app.get('/api/v1/mediaItemsToDisplayFromSearchSpec', getMediaItemsToDisplayFromSearchSpec);
  app.get('/api/v1/allKeywordData', getAllKeywordData);
  app.get('/api/v1/deletedMediaItems', getDeletedMediaItems);
  app.get('/api/v1/photoSets', getPhotoSets);

  app.get('/api/v1/import-photos-status/:importId', getPerFileImportPhotosStatus);
  app.get('/api/v1/upload-to-google-status/:uploadId', getPerFileUploadToGoogleStatus);

  app.post('/api/v1/deleteMediaItems', deleteMediaItems);
  app.post('/api/v1/clearDeletedMediaItems', clearDeletedMediaItems);
  app.post('/api/v1/removeDeletedMediaItem', removeDeletedMediaItem);

  app.post('/api/v1/photoSet', addPhotoSet);

  app.post('/api/v1/addKeyword', addKeyword);
  app.post('/api/v1/addKeywordNode', addKeywordNode);
  app.post('/api/v1/updateKeywordNode', updateKeywordNode);
  app.post('/api/v1/setRootKeywordNode', setRootKeywordNode);
  app.post('/api/v1/initializeKeywordTree', initializeKeywordTree);

  app.get('/api/v1/albumNamesWherePeopleNotRetrieved', getAlbumNamesWherePeopleNotRetrievedEndpoint);
  app.post('/api/v1/importPhotos', importPhotosEndpoint);
  app.post('/api/v1/uploadToGoogle', uploadToGoogleEndpoint);
  app.post('/api/v1/mergePeopleTakeout', mergePeopleTakeoutEndpoint);

  app.post('/api/v1/updateReviewLevel', updateReviewLevelEndpoint);
};

