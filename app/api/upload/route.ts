import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ''); // sanitize
    const filename = `${uniqueSuffix}-${originalName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let fileUrl = '';

    // Upload to Cloudflare R2 if configured
    if (s3Client && process.env.R2_BUCKET) {
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(command);

      // Return the public URL if configured, otherwise fallback to standard endpoint URL structure
      if (process.env.R2_PUBLIC_URL) {
        // e.g. https://pub-xxxx.r2.dev/filename
        fileUrl = `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${filename}`;
      } else {
        // Fallback (might not be publicly accessible depending on R2 bucket settings)
        fileUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${filename}`;
      }
    } else {
      // Fallback to local upload if R2 is not configured
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      fileUrl = `/uploads/${filename}`;
    }
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Error uploading file' }, { status: 500 });
  }
}
