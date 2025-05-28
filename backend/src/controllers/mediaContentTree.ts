import { MediaContentNode } from 'entities';
import { Request, Response } from 'express';
import { getMediaContentNodesFromDb, moveAlbumNodeInDb, saveAlbumTreeToDb } from './dbInterface';

export const getAlbumNodes = async (request: Request, response: Response) => {
  const albumNodes: MediaContentNode[] = await getMediaContentNodesFromDb();
  response.json(albumNodes);
}

export const saveAlbumNodes = async (request: Request, response: Response) => {
  const { nodes }: { nodes: MediaContentNode[] } = request.body;
  await saveAlbumTreeToDb(nodes);
  response.sendStatus(204);
};

export const moveAlbumNode = async (request: Request, response: Response) => {
  const { nodeId, newParentId }: { nodeId: string; newParentId: string } = request.body;
  await moveAlbumNodeInDb(nodeId, newParentId);
  response.send({ success: true });
}

