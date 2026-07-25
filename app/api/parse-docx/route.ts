import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 })
  }

  try {
    let absoluteUrl = url;
    if (url.startsWith('/')) {
      absoluteUrl = new URL(url, request.url).toString();
    }
    
    const response = await fetch(absoluteUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch DOCX: ${response.statusText}` }, { status: response.status })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse the DOCX to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer })
    const html = result.value

    return NextResponse.json({ html, messages: result.messages })
  } catch (error: any) {
    console.error('DOCX parsing error:', error.message || error)
    return NextResponse.json({ error: 'Failed to parse DOCX: ' + (error.message || 'Unknown error') }, { status: 500 })
  }
}
