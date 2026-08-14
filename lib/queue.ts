import { Queue } from 'bullmq';
import Redis from 'ioredis';

// ioredis is required by BullMQ
const createRedisConnection = () => {
  if (!process.env.REDIS_URL) return null;
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: () => null, // don't infinitely retry if Redis is unreachable
  });
};

const connection = createRedisConnection();

export const defaultQueue = connection
  ? new Queue('default', { connection: connection as any })
  : ({
      add: async () => ({ id: 'mock-job-id' }),
    } as unknown as Queue);

 