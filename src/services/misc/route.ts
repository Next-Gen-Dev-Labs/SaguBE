import { Router } from 'express';
import { verifyToken } from '../../commons';
import controller from './controller';

export const miscRouter: Router = Router();

/**
 *
 * Get Socials
 *
 */

miscRouter.get('/users/socials', [verifyToken, controller.socialLinks]);
