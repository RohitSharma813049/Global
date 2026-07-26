import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Initialize S3 Client for Cloudflare R2 if variables are present
const s3Client = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID
  ? new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    })
  : null;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userPrefix = `user_${userId}/`;

    let images: string[] = [];

    // If Cloudflare R2 is configured, fetch images from the bucket
    if (s3Client && process.env.R2_BUCKET) {
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET,
        Prefix: userPrefix,
      });
      const response = await s3Client.send(command);
      
      if (response.Contents) {
        images = response.Contents
          .filter(item => item.Key && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.Key))
          .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
          .map(item => {
            if (process.env.R2_PUBLIC_URL) {
              return `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${item.Key}`;
            }
            return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${item.Key}`;
          });
      }
    } else {
      // Fallback: Fetch from local 'public/uploads' directory
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      if (existsSync(uploadDir)) {
        const files = await readdir(uploadDir);
        images = files
          .filter(file => file.startsWith(`user_${userId}_`) && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
          .map(file => `/uploads/${file}`);
        
        // Sort by most recent first (based on the Date.now() prefix in the filename)
        images.sort((a, b) => b.localeCompare(a));
      }
    }

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
  }
}
