import schema from './schema';
import { Request, Response, NextFunction } from 'express';

export default {
  /**
   *
   * Create
   *
   */

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await schema.create.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
