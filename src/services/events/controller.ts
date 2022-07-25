import services from './services';
import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../../commons';

export default {
  /**
   *
   * Create
   *
   */

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = <string>req.decoded?.id;
      const payload = { ...req.body, orgId };

      const data = await services.create(payload);
      apiResponse({
        res,
        status: 201,
        message: 'Event successfully created',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   *
   * list all events
   *
   */

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const data = await services.getEvents(query);

      apiResponse({
        res,
        status: 200,
        message: 'List of events',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
