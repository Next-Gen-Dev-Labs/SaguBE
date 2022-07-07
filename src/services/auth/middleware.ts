import { Request, Response, NextFunction } from 'express';
import {
  signupSchema,
  handshakeSchema,
  nativeSigninSchema,
  web3SigninSchema,
  miscellanous,
} from './schema';
const { setPasswordSchema } = miscellanous;

export async function signupValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await signupSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function handshakeValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await handshakeSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function nativeSigninValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await nativeSigninSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function web3SigninValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await web3SigninSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function setPasswordValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await setPasswordSchema.parseAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
}