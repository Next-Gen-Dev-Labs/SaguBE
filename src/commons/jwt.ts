import { jwt_secret, JWT_EXPIRATION } from '../config';
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
}): Promise<IDecoded> {
  return new Promise((resolve, reject) => {
    jwt.verify(params['token'], jwt_secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as IDecoded);
      }
    });
  });
}
