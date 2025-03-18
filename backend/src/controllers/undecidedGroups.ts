import { Request, Response } from 'express';
import { addUndecidedGroupToDb, assignMediaItemsToUndecidedGroupDb, deleteUndecidedGroupFromDb, getAllUndecidedGroupsFromDb } from './dbInterface';
import { UndecidedGroup } from 'entities';

export const getUndecidedGroups = async (request: Request, response: Response, next: any) => {
  const undecidedGroups: UndecidedGroup[] = await getAllUndecidedGroupsFromDb();
  response.json(undecidedGroups);
};

export const addUndecidedGroup = async (req: Request, res: Response, next: any) => {
  const { albumIds, name } = req.body;
  try {
    const newGroup: UndecidedGroup = await addUndecidedGroupToDb(albumIds, name);
    res.status(200).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const assignMediaItemsToUndecidedGroup = async (request: Request, response: Response, next: any) => {
  const { undecidedGroupId, mediaItemIds } = request.body;
  await assignMediaItemsToUndecidedGroupDb(undecidedGroupId, mediaItemIds);
  response.json({ success: true });
}

export const fetchUndecidedGroupsForAlbums = async (request: Request, response: Response, next: any) => {
  response.json([]);
};

export const deleteUndecidedGroup = async (request: Request, response: Response, next: any) => {
  const undecidedGroupId = request.params.groupId;
  await deleteUndecidedGroupFromDb(undecidedGroupId);
  response.json({ success: true });
}

