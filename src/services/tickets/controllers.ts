import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../../commons';
import services from './services';

export default {
  /**
   *
   * create Ticket
   *
   */

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const creatorId = <string>req.decoded?.id;
      const payload = { ...req.body, creatorId };

      const data = await services.createTicketRecord(payload);
      apiResponse({ res, status: 201, message: 'Ticket created.', data });
    } catch (error) {
      next(error);
    }
  },
};
