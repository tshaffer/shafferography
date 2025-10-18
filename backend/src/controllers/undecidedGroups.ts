import { Request, Response } from 'express';
import { addUndecidedGroupToDb, getAllUndecidedGroupsFromDb } from './dbInterface';
import { UndecidedGroup } from '../types';

export const getUndecidedGroups = async (request: Request, response: Response, next: any) => {
  const undecidedGroups: UndecidedGroup[] = await getAllUndecidedGroupsFromDb();
  response.json(undecidedGroups);
};

export const addUndecidedGroup = async (req: Request, res: Response, next: any) => {
  const { albumNodeIds, name } = req.body;
  try {
    const newGroup: UndecidedGroup = await addUndecidedGroupToDb(albumNodeIds, name);
    res.status(200).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const fetchUndecidedGroupsForAlbums = async (request: Request, response: Response, next: any) => {
  response.json([]);
};

