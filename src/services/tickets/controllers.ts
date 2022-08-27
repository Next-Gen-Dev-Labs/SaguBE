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

  /**
   *
   * async getTicketByName
   *
   */

  async getTicketByName(req: Request, res: Response, next: NextFunction) {
    try {
      const name = <string>req.params.name;
      const data = await services.getTicketByName({ name });

      apiResponse({ res, status: 200, message: 'Ticket', data });
    } catch (error) {
      next(error);
    }
  },

  /**
   *
   * store minted ticket
   *
   */

  async mintedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const creatorId = <string>req.decoded?.id;
      const payload = { ...req.body, creatorId };

      const data = await services.storeMintedData(payload);
      apiResponse({
        res,
        status: 201,
        message: 'Minted data for ticket stored.',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   *
   * Get minted tickets by user
   *
   */

  async getMintedTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const username = <string>req.query.username;
      const data = await services.getMintedTicket({ username });

      apiResponse({
        res,
        status: 200,
        message: 'tickets data for this user',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   *
   * List minted ticket data
   *
   */

  async listMintedTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.query;
      const data = await services.listMintedTickets(payload);

      apiResponse({
        res,
        status: 200,
        message: 'tickets data',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
