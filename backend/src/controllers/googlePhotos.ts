import { Request } from 'express';

import { GoogleAlbum, GoogleMediaItem } from "../types";
import { isArray, isNil } from 'lodash';
import { getGoogleRequest, postGoogleRequest } from './googleUtils';
import { getAlbumNamesWherePeopleNotRetrieved } from './dbInterface';
import { TypedResponse } from '../types';

export const GooglePhotoAPIs = {
  mediaItem: 'https://photoslibrary.googleapis.com/v1/mediaItems/',
  mediaItems: 'https://photoslibrary.googleapis.com/v1/mediaItems',
  albums: 'https://photoslibrary.googleapis.com/v1/albums',
  album: 'https://photoslibrary.googleapis.com/v1/albums/',
  mediaItemsSearch: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
  uploadMediaItem: 'https://photoslibrary.googleapis.com/v1/uploads',
  batchCreate: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
  BATCH_GET_LIMIT: 49
};

export const getAlbumNamesWherePeopleNotRetrievedEndpoint = async (request: Request, response: TypedResponse<string[]>, next: any) => {
  try {
    const albumNames = await getAlbumNamesWherePeopleNotRetrieved();
    response.status(200).json(albumNames); 
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}
export const getAlbumMediaItemsFromGoogle = async (googleAccessToken: string, albumId: string, nextPageToken: any = null): Promise<GoogleMediaItem[]> => {

  const googleMediaItems: GoogleMediaItem[] = [];

  let url = GooglePhotoAPIs.mediaItemsSearch;

  do {

    try {

      let postData: any = {
        albumId
      };
      if (nextPageToken !== null) {
        postData = {
          albumId,
          pageToken: nextPageToken
        };
      }
      const response: any = await postGoogleRequest(googleAccessToken, url, postData);

      if (!isNil(response)) {
        if (isArray(response.mediaItems)) {
          response.mediaItems.forEach((mediaItem: GoogleMediaItem) => {
            googleMediaItems.push(mediaItem);
          });
        }
        else {
          console.log('response.mediaItems is not array');
        }
        nextPageToken = response.nextPageToken;
      }
      else {
        console.log('response is nil');
      }

    } catch (err) {
      nextPageToken = null;
    }

  } while (nextPageToken != null);

  return googleMediaItems;
}

export const getGoogleAlbumsByName = async (googleAccessToken: string, albumName: string): Promise<GoogleAlbum[]> => {
  const googleAlbums: GoogleAlbum[] = await getAllGoogleAlbums(googleAccessToken);
  const matchingGoogleAlbums: GoogleAlbum[] = googleAlbums.filter((googleAlbum) => googleAlbum.title === albumName);
  return matchingGoogleAlbums;
}

export const getAllGoogleAlbums = async (googleAccessToken: string, nextPageToken: any = null): Promise<GoogleAlbum[]> => {

  const googleAlbums: GoogleAlbum[] = [];

  let url = GooglePhotoAPIs.albums;

  do {

    if (nextPageToken != null) {
      url = `${GooglePhotoAPIs.albums}?pageToken=${nextPageToken}`;
    }

    try {

      const response: any = await getGoogleRequest(googleAccessToken, url);
      if (!isNil(response)) {
        if (isArray(response.albums)) {
          response.albums.forEach((album: any) => {
            googleAlbums.push(album);
          });
        }
        else {
          console.log('response.albums is not array');
        }
        nextPageToken = response.nextPageToken;
      }
      else {
        console.log('response is nil');
      }

    } catch (err) {
      nextPageToken = null;
    }
  } while (nextPageToken != null);

  return googleAlbums;
};

