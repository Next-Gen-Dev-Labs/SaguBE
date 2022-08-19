import { Request, Response, NextFunction } from 'express';

export class BaseError extends Error {
  message: string;
  status: number;
  name: string;
  extraDetails: any;

  constructor(params: {
    status: number;
    message: string;
    name?: string;
    extraDetails?: any;
  }) {
    super();
    this.status = params.status;
    this.message = params.message;
    this.name = params.name || 'ClientError';
    this.extraDetails = params.extraDetails || {};
  }
}

export function _404ErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).send({
    status: 'pending',
    message: '404 Not Found',
  });
}

export function expressErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  switch (err.name) {
    case 'ZodError':
      status = 400;
      message = `Missing or improperly formatted reqeust body parameter: ${err.issues[0].message}`;
      break;

    case 'TokenExpiredError':
      status = 401;
      break;

    case 'JsonWebTokenError':
      status = 401;
      break;
  }

  res.status(status).send({
    status: 'error',
    type: err.name,
    message,
    extraDetails: err.extraDetails,
  });
}
