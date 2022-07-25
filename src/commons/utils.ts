import { isValidAddress } from 'ethereumjs-util';
import { Request, Response, NextFunction } from 'express';
import { Events_Category, Events_Type } from '../models';
import { BaseError } from './errors';
import { decodeToken } from './jwt';

export function parseWalletAddress(val: string) {
  if (!val) return false;
  const valid = isValidAddress(val);

  if (!valid) return false;
  return true;
}

export function parseUsername(val: string) {
  if (!val) return false;
  return /^[a-z][a-z0-9]+$/.test(val);
}

export function apiResponse(params: {
  res: Response;
  status: number;
  message: string;
  data: any;
}) {
  const { res, status, message, data } = params;

  res.status(status).send({
    status: 'success',
    message,
    data: Array.isArray(data) ? data : [data],
  });
}

export function parseUrl(val: string) {
  if (!val) return false;
  try {
    new URL(val);
    return true;
  } catch (error) {
    return false;
  }
}

export function parseFacebook(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'facebook.com' ||
    hostname.toLowerCase() === 'www.facebook.com'
    ? true
    : false;
}

export function parseTwitter(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'twitter.com' ||
    hostname.toLowerCase() === 'www.twitter.com'
    ? true
    : false;
}

export function parseInstagram(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'instagram.com' ||
    hostname.toLowerCase() === 'www.instagram.com'
    ? true
    : false;
}

export function parseLinkedin(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'linkedin.com' ||
    hostname.toLowerCase() === 'www.linkedin.com'
    ? true
    : false;
}

export function parseEventCategory(val: string) {
  if (!val) return false;

  if (val === Events_Category.finance || val === Events_Category.tech)
    return true;

  return false;
}

export function parseEventType(val: string) {
  if (!val) return false;

  if (val === Events_Type.free || val === Events_Type.paid) return true;

  return false;
}

export function parseDate(val: string) {
  if (!val) return false;

  try {
    new Date(val).toISOString();
    return true;
  } catch (error) {
    return false;
  }
}

export function validateContentType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      throw new BaseError({
        status: 400,
        message: 'No content-type header set!',
      });
    }

    if (contentType.toLowerCase() !== 'application/json') {
      throw new BaseError({
        status: 400,
        message: 'Content-Type header is not set to application/json!',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = handleAuthHeader({
      authHeader: { authorization: req.headers['authorization'] },
    });

    const decoded = await decodeToken({ token });
    req.decoded = { id: decoded.id };

    next();
  } catch (error) {
    next(error);
  }
}

function handleAuthHeader(params: {
  authHeader: { authorization: string | undefined } | undefined;
}) {
  const { authHeader } = params;
  if (!authHeader) {
    throw new BaseError({
      status: 400,
      message: 'No authorization header set!',
    });
  }

  if (!authHeader.authorization) {
    throw new BaseError({
      status: 400,
      message: 'Authorization header has no value!',
    });
  }

  return authHeader['authorization'].split(' ')[1];
}

export function refinePaginators(params: { skip: string; limit: string }) {
  const { limit, skip } = params;

  if (Number.parseInt(limit) === NaN) {
    throw new BaseError({
      status: 400,
      message:
        'Invalid value received for limit. limit, if present, must be an integer',
    });
  }

  if (Number.parseInt(skip) === NaN) {
    throw new BaseError({
      status: 400,
      message:
        'Invalid value received for skip. skip, if present, must be an integer',
    });
  }

  return { skip: +skip, limit: +limit };
}
