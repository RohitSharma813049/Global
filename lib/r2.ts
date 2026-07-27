import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;
  
  if (!process.env.R2_ENDPOINT) throw new Error("R2 is not configured: Missing R2_ENDPOINT");
  if (!process.env.R2_ACCESS_KEY_ID) throw new Error("R2 is not configured: Missing R2_ACCESS_KEY_ID");
  if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error("R2 is not configured: Missing R2_SECRET_ACCESS_KEY");
  if (!process.env.R2_BUCKET) throw new Error("R2 is not configured: Missing R2_BUCKET");

  s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

/**
 * Uploads a file buffer to Cloudflare R2 and returns the public URL.
 * @param buffer The file buffer to upload
 * @param originalFilename The original filename (used to extract extension)
 * @param prefix Optional prefix folder in the bucket (e.g., 'publications' or 'images')
 * @param contentType The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToR2(
  buffer: Buffer,
  originalFilename: string,
  prefix: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();


  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9.\-_]/g, '');
  // Clean up prefix to not have leading/trailing slashes
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
  const key = cleanPrefix ? `${cleanPrefix}/${uniqueSuffix}-${sanitizedName}` : `${uniqueSuffix}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  } else {
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}`;
  }
}
