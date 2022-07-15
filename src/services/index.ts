import { Router } from 'express';
import { authRouter } from './auth';
import { miscRouter } from './misc';

export const services: Router = Router();

services.use('/auth', authRouter);
services.use('/misc', miscRouter);
