import 'dotenv/config';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from './db';

const connection = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null,
});

export const defaultWorker = new Worker('default', async job => {
  console.log(`[Worker] Processing job ${job.id} with data:`, job.data);
  // Add background processing logic here
}, { connection: connection as any });

defaultWorker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

defaultWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});

async function startWorker() {
  console.log('🚀 Starting standalone BullMQ Worker...');
  try {
    // await prisma.$queryRaw`SELECT 1`;
    // console.log('✅ Connected to PostgreSQL via Prisma');
    
    const redisStatus = await connection.ping();
    if (redisStatus === 'PONG') {
      console.log('✅ Connected to Redis');
    }
    
    console.log(`👷 Worker [${defaultWorker.name}] is listening for jobs on Redis...`);
  } catch (error: any) {
    console.error('❌ Failed to start worker:', error.message);
    process.exit(1);
  }
}

// Only execute startWorker if this file is run directly (not imported)
if (require.main === module) {
  startWorker();
}
