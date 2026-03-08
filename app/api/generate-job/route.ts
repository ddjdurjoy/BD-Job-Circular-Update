import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 2. Extract text using Cheerio
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, and non-content elements to save tokens
    $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();
    
    // Get the text content and clean it up
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Limit text length just in case it's a massive page
    const truncatedText = textContent.slice(0, 20000);

    return NextResponse.json({
      success: true,
      text: truncatedText,
      url: url
    });

  } catch (error: any) {
    console.error('Error in job generation API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process the URL' },
      { status: 500 }
    );
  }
}
