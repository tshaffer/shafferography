import { Request, Response, NextFunction } from 'express';
import * as ugService from '../services/undecidedGroups.service';

export async function deleteUndecidedGroup(req: Request, res: Response, next: NextFunction) {
  try {
    await ugService.deleteUndecidedGroup(req.params.groupId);
    res.status(204).end();
  } catch (e) { next(e); }
}
