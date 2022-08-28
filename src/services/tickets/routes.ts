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

/**
 *
 * get ticket by its name
 *
 */

ticketRouter.get('/get/ticket/:name', controllers.getTicketByName);

/**
 *
 * store minted ticket data route
 *
 */

ticketRouter.post('/minted-data/store', [
  verifyToken,
  middlewares.mintedTicket,
  controllers.mintedTicket,
]);

/**
 *
 * get ticket minted data by user
 *
 */

ticketRouter.get('/get/minted-data', controllers.getMintedTickets);

/**
 *
 * list tickets minted data
 *
 */

ticketRouter.get('/list/minted-data', controllers.listMintedTickets);
//
