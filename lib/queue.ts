import { Queue } from 'bullmq';
import Redis from 'ioredis';

// ioredis is required by BullMQ
const connection = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null,
});

export const defaultQueue = new Queue('default', { connection: connection as any });
