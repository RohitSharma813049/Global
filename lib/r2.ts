import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export const uploadFile = async (fileKey: string, body: Buffer, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || '',
    Key: fileKey,
    Body: body,
    ContentType: contentType,
  });

  return await s3Client.send(command as any);
};
