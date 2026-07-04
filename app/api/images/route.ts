import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ success: true, images: [] });
    }

    const files = await readdir(uploadDir);
    
    // Filter out non-image files if needed, and map to URLs
    const images = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
      .map(file => `/uploads/${file}`);

    // Sort by most recent first (based on the Date.now() prefix in the filename)
    images.sort((a, b) => b.localeCompare(a));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
  }
}
