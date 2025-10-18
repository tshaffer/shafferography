import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/stats.service';

export const getMediaItemCounts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const counts = await statsService.getMediaItemCounts();
    res.json(counts);
  } catch (err) {
    next(err);
  }
};
