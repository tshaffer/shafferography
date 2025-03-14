import axios from 'axios';
import * as fse from 'fs-extra';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getGoogleAlbumsByName, getAlbumMediaItemsFromGoogle, GooglePhotoAPIs } from "./googlePhotos";
import { BatchCreateGoogleMediaItem, CreateGoogleAlbumResponse, CreateMediaItemsResponse, GoogleAlbum, GoogleMediaItem, MediaItem, NewMediaItemResult, UploadToGoogleResults } from '../types';
import { isNil } from 'lodash';
import { getMediaItemFromDb, updateMediaItemFieldsInDb } from './dbInterface';
import path from 'path';
import { TypedResponse } from '../types';

interface MediaItemDifferences {
  mediaItemsToUpload: MediaItem[];
  googleMediaItemIdsToRemove: string[];
  mediaItemsToIgnore: MediaItem[];
}

interface GoogleUploadSpec {
  albumId: string;
  mediaItemDifferences: MediaItemDifferences;
};


// A function to upload a media file
const uploadMediaItem = async (googleAccessToken: string, filePath: string, fileName: string): Promise<string> => {

  try {
    const mediaBuffer = fse.readFileSync(filePath);

    const url = GooglePhotoAPIs.uploadMediaItem;

    const uploadToken: string = await postGoogleRequest(googleAccessToken, url, fileName, mediaBuffer);
    console.log('uploadToken: ', uploadToken);
    return uploadToken;
  } catch (error) {
    console.error('Error uploading media:', error.response ? error.response.data : error);
    throw new Error('Failed to upload media');
  }
}

// A function to create a media item using the upload token
const createMediaItem = async (googleAccessToken: string, uploadToken: string, description: string): Promise<CreateMediaItemsResponse> => {
  try {

    const url = GooglePhotoAPIs.batchCreate;

    const createMediaResponse = await axios.post(
      url,
      {
        newMediaItems: [
          {
            description: description,
            simpleMediaItem: {
              uploadToken: uploadToken,
            },
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const createMediaItemResponse: CreateMediaItemsResponse = createMediaResponse.data;
    return createMediaItemResponse;
  } catch (error) {
    console.error('Error creating media item:', error.response ? error.response.data : error);
    throw new Error('Failed to create media item');
  }
}

const postGoogleRequest = async (googleAccessToken: string, url: string, fileName: string, data: any): Promise<any> => {

  const headers = {
    'Authorization': 'Bearer ' + googleAccessToken,
    'Content-type': 'application/octet-stream',
    'X-Goog-Upload-File-Name': fileName,
    'X-Goog-Upload-Protocol': 'raw',
  };

  return axios.post(
    url,
    data,
    {
      headers,
    })
    .then((response: any) => {
      console.log('uploadResponse: ', response);
      console.log('uploadResponse.data: ', response?.data);
      return Promise.resolve(response.data);
    }).catch((err: Error) => {
      debugger;
      console.log('response to axios post: ');
      console.log('err: ', err);
      return Promise.reject(err);
    });
}

const createGoogleAlbum = async (googleAccessToken: string, albumName: string): Promise<CreateGoogleAlbumResponse> => {

  const url = GooglePhotoAPIs.albums;

  const headers = {
    'Authorization': 'Bearer ' + googleAccessToken,
    'Content-type': 'application/octet-stream',
  };

  const data = {
    album: {
      title: albumName,
    },
  };

  try {
    return axios.post(
      url,
      data,
      {
        headers,
      })
      .then((response: any) => {
        console.log('createGoogleAlbum: ', response);
        console.log('createGoogleAlbum.data: ', response?.data);
        return Promise.resolve(response.data);
      });
  } catch (error) {
    console.error('Error creating album:', error.response ? error.response.data : error);
    throw new Error('Failed to create album');
  }
}

const addMediaItemsToAlbum = async (
  googleAccessToken: string,
  albumId: string,
  mediaItemIds: string[]
): Promise<any> => {

  if (mediaItemIds.length === 0) {
    return;
  }
  
  const url = `https://photoslibrary.googleapis.com/v1/albums/${albumId}:batchAddMediaItems`;

  try {
    const response = await axios.post(
      url,
      {
        mediaItemIds,
      },
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('addMediaItemsToAlbum: ', response);
    console.log('addMediaItemsToAlbum.data: ', response?.data);
    return response.data;
  } catch (error) {
    console.error('Error adding media items to album:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to add media items: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error(`Failed to add media items: ${error}`);
    }
  }
};

const removeMediaItemFromAlbum = async (
  googleAccessToken: string,
  albumId: string,
  mediaItemIds: string[]
): Promise<any> => {

  const url = `https://photoslibrary.googleapis.com/v1/albums/${albumId}:batchRemoveMediaItems`;

  try {
    const response = await axios.post(
      url,
      {
        mediaItemIds,
      },
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('removeMediaItemsToAlbum: ', response);
    console.log('removeMediaItemsToAlbum.data: ', response?.data);
    return response.data;
  } catch (error) {
    console.error('Error adding media items to album:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to add media items: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else {
      throw new Error(`Failed to add media items: ${error}`);
    }
  }
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

// steps
// 1. create album
// 2. upload media items
// 3. add media items to album
// 4. update records in db
export const uploadToGoogleEndpoint = async (request: Request, response: TypedResponse<CreateMediaItemsResponse>, next: any) => {

  const googleAccessToken = request.body.googleAccessToken;
  const albumName = request.body.albumName;
  const mediaItemIdsInAlbum: string[] = request.body.mediaItemIds;
  console.log('uploadToGoogleEndpoint: ');
  console.log('googleAccessToken: ', googleAccessToken);
  console.log('albumName: ', albumName);
  console.log('mediaItemIdsInAlbum: ', mediaItemIdsInAlbum);

  console.log('uploadToGoogle: ');

  try {

    const uploadId = uuidv4();

    const mediaItemsInAlbum: MediaItem[] = await Promise.all(
      mediaItemIdsInAlbum.map(async (mediaItemId: string) => getMediaItemFromDb(mediaItemId))
    );

    // check for existence of specified album on Google
    const googleUploadSpec: GoogleUploadSpec = await getGoogleUploadSpec(googleAccessToken, albumName, mediaItemsInAlbum);
    console.log('googleUploadSpec: ', googleUploadSpec);

    const existingAlbumId = googleUploadSpec.albumId;
    const mediaItemDifferences = googleUploadSpec.mediaItemDifferences;

    const mediaItemsToUpload = mediaItemDifferences.mediaItemsToUpload;
    const googleMediaItemIdsToRemove = mediaItemDifferences.googleMediaItemIdsToRemove;

    const mediaItemsToUploadIds = mediaItemsToUpload.map((mediaItemToUpload) => mediaItemToUpload.uniqueId);

    processingStatuses[uploadId] = {
      files: mediaItemsToUpload.map((mediaItemToUpload) => ({
        filename: mediaItemToUpload.fileName,
        status: "processing",
      })),
    };

    response.json({ uploadId });

    // Upload Media Items
    const createdMediaItemIds: string[] = [];
    const createdMediaItems: BatchCreateGoogleMediaItem[] = [];
    for (const mediaItemToUpload of mediaItemsToUpload) {

      if (isNil(mediaItemToUpload)) {
        console.error('Media item not found in db');
        throw new Error('Media item not found in db');
      }

      let mediaItemFilePath = mediaItemToUpload.filePath;
      let mediaItemFileName = mediaItemToUpload.fileName;
      const preConvertedFileName = mediaItemToUpload.fileName;

      // if the media item is a converted file, substitute the original file
      const fileExtension = path.extname(mediaItemToUpload.filePath);
      if (fileExtension.toLowerCase() === '.jpg') {
        const dirname = path.dirname(mediaItemToUpload.filePath); // Extracts the directory path
        const fileName = path.basename(mediaItemToUpload.filePath, fileExtension) + ".heic";
        const heicFilePath = path.join(dirname, fileName);
        if (fse.existsSync(heicFilePath)) {
          mediaItemFilePath = heicFilePath;
          mediaItemFileName = path.parse(mediaItemToUpload.fileName).name + ".heic";
        }
      }

      const uploadToken: string = await uploadMediaItem(googleAccessToken, mediaItemFilePath, mediaItemFileName);
      console.log('uploadToken: ', uploadToken);

      const googleMediaItem: CreateMediaItemsResponse = await createMediaItem(googleAccessToken, uploadToken, mediaItemFileName);
      console.log('googleMediaItem: ', googleMediaItem);
      const newMediaItemResults: [NewMediaItemResult] = googleMediaItem.newMediaItemResults
      const resultToken = newMediaItemResults[0].uploadToken;
      const status = newMediaItemResults[0].status;
      const createdMediaItem: BatchCreateGoogleMediaItem = newMediaItemResults[0].mediaItem;
      const createdMediaItemId = createdMediaItem.id;
      createdMediaItemIds.push(createdMediaItemId);
      createdMediaItems.push(createdMediaItem);

      const fileEntry = processingStatuses[uploadId].files.find((f) => f.filename === preConvertedFileName);
      if (fileEntry) fileEntry.status = "completed";

    };

    console.log('completed uploading mediaItems');

    // Delete media items
    //    Not supported by google photos api

    // Create Album
    let albumId = '';
    if (existingAlbumId === '') {
      const googleAlbumResponse: CreateGoogleAlbumResponse = await createGoogleAlbum(googleAccessToken, albumName);
      console.log('googleAlbumResponse: ', googleAlbumResponse);
      albumId = googleAlbumResponse.id;
    } else {
      albumId = existingAlbumId;
    }

    // Add Media Items to Album
    await addMediaItemsToAlbum(googleAccessToken, albumId, createdMediaItemIds);
    console.log('successful uploadToGoogle: ');

    if (mediaItemsToUpload.length !== createdMediaItems.length) {
      throw new Error('mediaItemsToUpload and createdMediaItems are not the same length');
    }

    // Remove Media Items from Album
    if (googleMediaItemIdsToRemove.length > 0) {
      console.log('removing media items from album');
      await removeMediaItemFromAlbum(googleAccessToken, albumId, googleMediaItemIdsToRemove);
    }

    // Update Media Items in DB
    for (let i = 0; i < mediaItemsToUploadIds.length; i++) {
      const mediaItemId = mediaItemsToUploadIds[i];
      const createdMediaItem = createdMediaItems[i];
      const updates: Partial<MediaItem> = {
        albumId,
        albumName,
        googleMediaItemId: createdMediaItem.id,
        baseUrl: createdMediaItem.baseUrl,
      };
      await updateMediaItemFieldsInDb(mediaItemId, updates);
    }

    console.log('uploadToGoogle complete');

  } catch (error) {
    throw new Error('Failed to upload media to Google');
  }

}

export const getPerFileUploadToGoogleStatus = async (req: Request, res: Response, next: any) => {
  const { uploadId } = req.params;
  res.json(processingStatuses[uploadId] || { files: [] });
}

const getGoogleUploadSpec = async (googleAccessToken: string, albumName: string, mediaItems: MediaItem[]): Promise<GoogleUploadSpec> => {

  let albumId: string = '';

  // ensure that all media items that are in an album are in the same album
  for (const mediaItem of mediaItems) {
    if (mediaItem.albumId) {
      if (albumId && albumId !== mediaItem.albumId) {
        throw new Error('Media items are in different albums');
      }
      albumId = mediaItem.albumId;
    }
  }

  // if none of the mediaItems have an albumId, check if the album exists
  if (albumId === '') {
    const googleAlbums: GoogleAlbum[] = await getGoogleAlbumsByName(googleAccessToken, albumName);
    if (googleAlbums.length > 1) {
      throw new Error('Multiple google albums with the same name already exist');
    } else if (googleAlbums.length === 1) {
      // album with the same name already exists - use it
      albumId = googleAlbums[0].id;
    } else {
      // album with the same name does not exist - create it
      const googleUploadSpec: GoogleUploadSpec = {
        albumId: '',
        mediaItemDifferences: {
          mediaItemsToUpload: mediaItems,
          googleMediaItemIdsToRemove: [],
          mediaItemsToIgnore: [],
        }
      };
      return googleUploadSpec;
    }
  } else {
    // mediaItems are already in an album; find it.
    const googleAlbums: GoogleAlbum[] = await getGoogleAlbumsByName(googleAccessToken, albumName);
    const matchingGoogleAlbums: GoogleAlbum[] = googleAlbums.filter((googleAlbum) => googleAlbum.id === albumId);
    if (matchingGoogleAlbums.length === 0) {
      throw new Error('Media items are in an album that does not exist');
    } else if (matchingGoogleAlbums.length > 1) {
      throw new Error('Multiple albums with the same id already exist');
    }
  }

  // assert that albumId !== ''

  // get media items in existing album
  //  https://developers.google.com/photos/library/guides/list#listing-album-contents
  const googleMediaItems: GoogleMediaItem[] = await getAlbumMediaItemsFromGoogle(googleAccessToken, albumId);

  const googleUploadSpec: GoogleUploadSpec = {
    albumId,
    mediaItemDifferences: getMediaItemDifferences(mediaItems, googleMediaItems),
  };

  return googleUploadSpec;

}

function getMediaItemDifferences(
  mediaItems: MediaItem[],
  googleMediaItems: GoogleMediaItem[]
): MediaItemDifferences {

  const mediaFileMap: Map<string, MediaItem> = new Map(
    mediaItems
      .filter((item: MediaItem) => item.googleMediaItemId !== '') // Exclude empty googleMediaItemId
      .map((item: MediaItem) => [item.googleMediaItemId as string, item]) // Ensure it's non-empty
  );

  const googleFileMap: Map<string, GoogleMediaItem> = new Map(
    googleMediaItems.map((item: GoogleMediaItem) => [item.id, item])
  );

  const mediaItemsToUpload: MediaItem[] = [
    ...[...mediaFileMap.keys()]
      .filter((googleMediaItemId: string) => !googleFileMap.has(googleMediaItemId))
      .map((googleMediaItemId: string) => mediaFileMap.get(googleMediaItemId) as MediaItem),

    // Append mediaItems with googleMediaItemId === ''
    ...mediaItems.filter((item: MediaItem) => item.googleMediaItemId === ''),
  ];

  const googleMediaItemIdsToRemove: string[] = [...googleFileMap.keys()]
    .filter((googleMediaItemId: string) => !mediaFileMap.has(googleMediaItemId))
    .map((googleMediaItemId: string) => {
      const googleItem: GoogleMediaItem = googleFileMap.get(googleMediaItemId)!;
      return googleItem.id;
    });

  const mediaItemsToIgnore: MediaItem[] = [...mediaFileMap.keys()]
    .filter((googleMediaItemId: string) => googleFileMap.has(googleMediaItemId))
    .map((googleMediaItemId: string) => mediaFileMap.get(googleMediaItemId) as MediaItem);

  if ((googleMediaItems.length + mediaItemsToUpload.length - googleMediaItemIdsToRemove.length) !== mediaItems.length) {
    throw new Error('getMediaItemDifferences: unexpected length mismatch 0');
  }

  // invalid comparison for the following scenario
  //    mediaItems: 4 items
  //    googleMediaItems: 5 items
  //    mediaItemsToIgnore: 4 items
  //    Deleting one of the mediaItems from the existing album

  // if ((mediaItems.length + mediaItemsToIgnore.length) !== googleMediaItems.length) {
  //   throw new Error('getMediaItemDifferences: unexpected length mismatch 1');
  // }

  return {
    mediaItemsToUpload,
    googleMediaItemIdsToRemove,
    mediaItemsToIgnore,
  };
}
