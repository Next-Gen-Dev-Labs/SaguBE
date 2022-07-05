import {
  jwt_secret,
  jwt_refresh,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} from '../config';

import { BaseError } from '../commons';
import jwt from 'jsonwebtoken';

interface IDecoded {
  id: string;
  iat: number;
  exp: number;
}

export async function signToken(params: { id: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      params,
      jwt_secret,
      { expiresIn: JWT_EXPIRATION },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
}

export async function decodeToken(params: {
  token: string;
  type: 'normal' | 'refresh';
}): Promise<IDecoded> {
  let secretToUse: string;
  return new Promise((resolve, reject) => {
    if (params['type'] === 'normal') {
      secretToUse = jwt_secret;
    } else if (params['type'] === 'refresh') {
      secretToUse = jwt_refresh;
    } else {
      reject(
        new BaseError({
          status: 400,
          message: 'Invalid token type',
          name: 'TokenError',
        })
      );
    }

    jwt.verify(params['token'], secretToUse, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as IDecoded);
      }
    });
  });
}
