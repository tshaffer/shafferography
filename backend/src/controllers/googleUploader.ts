import axios from 'axios';
import * as fse from 'fs-extra';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { GooglePhotoAPIs } from "./googlePhotos";
import { BatchCreateGoogleMediaItem, CreateGoogleAlbumResponse, CreateMediaItemsResponse, MediaItem, NewMediaItemResult, UploadToGoogleResults } from '../types';
import { isNil } from 'lodash';
import { getMediaItemFromDb, updateMediaItemFieldsInDb } from './dbInterface';
import path from 'path';
import { TypedResponse } from '../types';

// A function to upload a media file
export const uploadMediaItem = async (googleAccessToken: string, filePath: string, fileName: string): Promise<string> => {

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
export const createMediaItem = async (googleAccessToken: string, uploadToken: string, description: string): Promise<CreateMediaItemsResponse> => {
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

export const createGoogleAlbum = async (googleAccessToken: string, albumName: string): Promise<CreateGoogleAlbumResponse> => {

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

export const addMediaItemsToAlbum = async (
  googleAccessToken: string,
  albumId: string,
  mediaItemIds: string[]
): Promise<any> => {

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
  const mediaItemIds: string[] = request.body.mediaItemIds;
  console.log('uploadToGoogleEndpoint: ');
  console.log('googleAccessToken: ', googleAccessToken);
  console.log('albumName: ', albumName);
  console.log('mediaItemIds: ', request.body.mediaItemIds);

  console.log('uploadToGoogle: ');
  console.log('googleAccessToken: ', googleAccessToken);
  console.log('albumName: ', albumName);
  console.log('mediaItemIds: ', mediaItemIds);

  try {

    const uploadId = uuidv4();

    const mediaItems: MediaItem[] = await Promise.all(
      mediaItemIds.map(async (mediaItemId: string) => getMediaItemFromDb(mediaItemId))
    );
    
    processingStatuses[uploadId] = {
      files: mediaItems.map((mediaItem) => ({
        filename: mediaItem.fileName,
        status: "processing",
      })),
    };

    response.json({ uploadId });

    // Upload Media Items
    const createdMediaItemIds: string[] = [];
    const createdMediaItems: BatchCreateGoogleMediaItem[] = [];
    for (const mediaItem of mediaItems) {

      if (isNil(mediaItem)) {
        console.error('Media item not found in db');
        throw new Error('Media item not found in db');
      }

      let mediaItemFilePath = mediaItem.filePath;
      let mediaItemFileName = mediaItem.fileName;
      const preConvertedFileName = mediaItem.fileName;

      // if the media item is a converted file, substitute the original file
      const fileExtension = path.extname(mediaItem.filePath);
      if (fileExtension.toLowerCase() === '.jpg') {
        const dirname = path.dirname(mediaItem.filePath); // Extracts the directory path
        const fileName = path.basename(mediaItem.filePath, fileExtension) + ".heic";
        const heicFilePath = path.join(dirname, fileName);
        if (fse.existsSync(heicFilePath)) {
          mediaItemFilePath = heicFilePath;
          mediaItemFileName = path.parse(mediaItem.fileName).name + ".heic";
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

    // Create Album
    const googleAlbumResponse: CreateGoogleAlbumResponse = await createGoogleAlbum(googleAccessToken, albumName);
    console.log('googleAlbumResponse: ', googleAlbumResponse);
    const albumId = googleAlbumResponse.id;

    // Add Media Items to Album
    await addMediaItemsToAlbum(googleAccessToken, albumId, createdMediaItemIds);
    console.log('successful uploadToGoogle: ');

    if (mediaItemIds.length !== createdMediaItems.length) {
      throw new Error('mediaItemIds and createdMediaItems are not the same length');
    }

    for (let i = 0; i < mediaItemIds.length; i++) {
      const mediaItemId = mediaItemIds[i];
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
