import { db_url, redis_url } from './env';
import { connect } from 'mongoose';
import * as redis from 'redis';

export const redisClient = redis.createClient({ url: redis_url });
export async function connectDbs() {
  try {
    await connectMongo();
    console.log('MongoDB connected!');

    await connectRedis();
    console.log('Redis connected!');
  } catch (error: any) {
    console.error(`An error was encoutered: ${error.toString()}`);
  }
}

async function connectMongo() {
  await connect(db_url);
}

async function connectRedis() {
  await redisClient.connect();

  redisClient.on('error', (error: any) => {
    console.error(error.toString());
  });
}
