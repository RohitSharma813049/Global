import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { validateProxyUrl } from '@/lib/security-url';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  const { isValid, parsedUrl, error } = validateProxyUrl(rawUrl, request.url);

  if (!isValid || !parsedUrl) {
    return NextResponse.json({ error: error || 'Forbidden target URL' }, { status: 403 });
  }

  try {
    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch DOCX: ${response.statusText}` }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the DOCX to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value;

    return NextResponse.json(
      { html, messages: result.messages },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    console.error('DOCX parsing error:', error.message || error);
    return NextResponse.json({ error: 'Failed to parse DOCX: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
