import { Router } from 'express';
import { verifyToken } from '../../commons';
import controllers from './controllers';
import middlewares from './middlewares';

export const ticketRouter = Router();

/**
 *
 * create ticket route
 *
 */

ticketRouter.post('/create', [
  verifyToken,
  middlewares.createTicket,
  controllers.createTicket,
]);
