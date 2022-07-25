import { Router } from 'express';
import { validateContentType, verifyToken } from '../../commons';
import controller from './controller';
import middleware from './middleware';

export const eventRouter: Router = Router();

/**
 *
 * Unprotected (GET) routes
 *
 */

eventRouter.get('/list', controller.getEvents);

/**
 *
 * General middleware
 *
 */

eventRouter.use(validateContentType);
eventRouter.use(verifyToken);

/**
 *
 * Create
 *
 */
eventRouter.post('/create', [middleware.create, controller.create]);
