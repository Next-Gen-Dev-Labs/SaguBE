import { Router } from 'express';
import { authRouter } from './auth';
import { eventRouter } from './events';
import { miscRouter } from './misc';

export const services: Router = Router();

services.use('/auth', authRouter);
services.use('/events', eventRouter);
services.use('/misc', miscRouter);
