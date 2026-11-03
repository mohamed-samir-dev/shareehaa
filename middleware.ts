import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block aggressive commercial crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const blockedBots = /bytespider|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|dataforseobot|baiduspider|yandexbot|sogou|zoominfo|seekport/i;
  
  if (blockedBots.test(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // Block malicious paths
  const lowerPath = pathname.toLowerCase();
  if (
    lowerPath.endsWith('.php') ||
    lowerPath.endsWith('.asp') ||
    lowerPath.endsWith('.aspx') ||
    lowerPath.endsWith('.jsp') ||
    lowerPath.startsWith('/wp-') ||
    lowerPath.startsWith('/xmlrpc') ||
    lowerPath.startsWith('/phpmyadmin') ||
    lowerPath.startsWith('/.env') ||
    lowerPath.startsWith('/.git') ||
    lowerPath.startsWith('/cgi-bin')
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Maintenance mode
  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/api/')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-icon.png|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
