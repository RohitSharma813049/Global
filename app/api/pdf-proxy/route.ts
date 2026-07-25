import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    let absoluteUrl = url;
    if (url.startsWith('/')) {
      // Need absolute URL for fetch in Next.js backend
      absoluteUrl = new URL(url, request.url).toString();
    }
    
    const response = await fetch(absoluteUrl)
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status })
    }

    // Always force application/pdf so the browser renders it inline
    // instead of downloading if the origin server returns application/octet-stream
    const contentType = 'application/pdf'
    const arrayBuffer = await response.arrayBuffer()
    
    // Force inline disposition
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline; filename="document.pdf"',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    })
  } catch (error) {
    console.error('PDF Proxy error:', error)
    return new NextResponse('Internal Server Error while fetching PDF', { status: 500 })
  }
}
