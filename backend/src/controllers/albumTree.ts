import { AlbumNode } from 'entities';
import { Request, Response } from 'express';
import { getAlbumNodesFromDb, moveAlbumNodeInDb, saveAlbumTreeToDb } from './dbInterface';

export const getAlbumNodes = async (request: Request, response: Response) => {
  const albumNodes: AlbumNode[] = await getAlbumNodesFromDb();
  response.json(albumNodes);
}

export const saveAlbumNodes = async (request: Request, response: Response) => {
  const { nodes }: { nodes: AlbumNode[] } = request.body;
  await saveAlbumTreeToDb(nodes);
  response.sendStatus(204);
};

export const moveAlbumNode = async (request: Request, response: Response) => {
  const { nodeId, newParentId }: { nodeId: string; newParentId: string } = request.body;
  await moveAlbumNodeInDb(nodeId, newParentId);
  response.send({ success: true });
}

