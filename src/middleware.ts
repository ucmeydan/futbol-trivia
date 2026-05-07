import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''

  // Allow social media crawlers through without any interference
  const isSocialCrawler =
    ua.includes('facebookexternalhit') ||
    ua.includes('Facebot') ||
    ua.includes('Twitterbot') ||
    ua.includes('WhatsApp') ||
    ua.includes('LinkedInBot') ||
    ua.includes('TelegramBot')

  if (isSocialCrawler) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=3600')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
