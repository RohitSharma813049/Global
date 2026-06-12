import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { defaultQueue } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test Database Connection
    await prisma.$queryRaw`SELECT 1`;

    // Enqueue a background job to BullMQ
    const job = await defaultQueue.add('test-job', {
      message: 'Hello from Vercel Serverless Function!',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      status: 'ok',
      message: 'Connected to Database and enqueued background job successfully.',
      jobId: job.id
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
