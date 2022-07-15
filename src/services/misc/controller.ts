import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../../commons';
import services from './services';

export default {
  async socialLinks(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = <string>req.decoded?.id;
      const data = await services.getSocialLinks({ orgId });

      apiResponse({
        res,
        status: 200,
        message: 'Successfully retrieved social links.',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
