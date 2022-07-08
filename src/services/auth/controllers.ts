import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../../commons';
import { Signup as signup, Signin as signin } from './services';

export default {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await signup.genric({ data: payload });

      apiResponse({
        res,
        status: 201,
        message: 'User signup successfull',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async addSocials(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.body };
      const data = await signup.addSocials(payload);

      apiResponse({
        res,
        status: 201,
        message: 'social links added',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  handshake: {
    async signup(req: Request, res: Response, next: NextFunction) {
      try {
        const payload = req.body;
        const message = await signup.handshake(payload);

        apiResponse({
          res,
          status: 200,
          message,
          data: [],
        });
      } catch (error) {
        next(error);
      }
    },

    async signin(req: Request, res: Response, next: NextFunction) {
      try {
        const payload = req.body;
        const data = await signin.web3.handshake(payload);

        apiResponse({
          res,
          status: 200,
          message: 'Proceed to authenticate.',
          data,
        });
      } catch (error) {
        next(error);
      }
    },
  },

  signin: {
    async web3(req: Request, res: Response, next: NextFunction) {
      try {
        const payload = req.body;
        const data = await signin.web3.authenticate(payload);

        apiResponse({
          res,
          status: 200,
          message: 'signin successful',
          data,
        });
      } catch (error) {
        next(error);
      }
    },
  },
};
