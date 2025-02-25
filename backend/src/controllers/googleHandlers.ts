import { Request, Response } from 'express';

import { getAlbumNamesWherePeopleNotRetrieved } from './dbInterface';
import { TypedResponse } from '../types';

export const getAlbumNamesWherePeopleNotRetrievedEndpoint = async (request: Request, response: TypedResponse<string[]>, next: any) => {
  try {
    const albumNames = await getAlbumNamesWherePeopleNotRetrieved();
    response.status(200).json(albumNames); 
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}