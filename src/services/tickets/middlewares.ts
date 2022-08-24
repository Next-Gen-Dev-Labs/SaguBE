import { Request, Response, NextFunction } from 'express';
import schemas from './schemas';

export default {
  /**
   *
   * create Ticket middleware
   *
   */

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      await schemas.createTicket.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   *
   * minted Ticket miiddleware
   *
   */

  async mintedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      await schemas.mintedTicket.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
};
