import { Router } from 'express';
import { authRouter } from './auth';

export const services: Router = Router();

services.use('/auth', authRouter);
