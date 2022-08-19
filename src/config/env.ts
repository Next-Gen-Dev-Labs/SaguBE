import dotenv from 'dotenv';
dotenv.config();

export const env = <string>process.env.NODE_ENV;

export const db_url = <string>(
  (env === 'production' ? process.env.DB_PROD : process.env.DB_DEV)
);

export const port = +(<string>(
  (env === 'production' ? process.env.PORT : process.env.DEV_PORT)
));

export const redis_url = <string>(
  (env === 'production' ? process.env.REDIS_PROD : process.env.REDIS_DEV)
);

export const morgan_mode = <string>(env === 'production' ? 'combined' : 'dev');

export const jwt_secret = <string>process.env.JWT_SECRET;

export const jwt_refresh = <string>process.env.JWT_REFRESH;

export const pinata_jwt = <string>process.env.PINATA_JWT;
