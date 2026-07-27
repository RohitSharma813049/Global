import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    R2_ENDPOINT_EXISTS: !!process.env.R2_ENDPOINT,
    R2_ACCESS_KEY_ID_EXISTS: !!process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY_EXISTS: !!process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_EXISTS: !!process.env.R2_BUCKET,
    NODE_ENV: process.env.NODE_ENV,
    TIMESTAMP: new Date().toISOString(),
  });
}
