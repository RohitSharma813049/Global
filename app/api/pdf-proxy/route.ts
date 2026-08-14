import { NextRequest, NextResponse } from 'next/server';
import { validateProxyUrl } from '@/lib/security-url';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const { isValid, parsedUrl, error } = validateProxyUrl(rawUrl, request.url);

  if (!isValid || !parsedUrl) {
    return new NextResponse(error || 'Forbidden target URL', { status: 403 });
  }

  try {
    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const contentType = 'application/pdf';
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline; filename="document.pdf"',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('PDF Proxy error:', error);
    return new NextResponse('Internal Server Error while fetching PDF', { status: 500 });
  }
}
