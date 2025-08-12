/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Generate a simple visitor hash based on IP and User Agent
function generateVisitorHash(ip: string, userAgent: string): string {
  const combined = `${ip}-${userAgent}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Edge Runtime compatible middleware for redirects and headers

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Handle WWW vs non-WWW redirect (choose non-WWW as canonical)
  // This will redirect www.orbitandchill.com to orbitandchill.com
  if (hostname === 'www.orbitandchill.com' || hostname === 'www.orbit-and-chill.com') {
    const url = request.nextUrl.clone();
    url.hostname = hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  
  // Alternative: If you want WWW as canonical, uncomment this instead:
  // if ((hostname === 'orbitandchill.com' || hostname === 'orbit-and-chill.com') && !hostname.startsWith('www.')) {
  //   const url = request.nextUrl.clone();
  //   url.hostname = `www.${hostname}`;
  //   return NextResponse.redirect(url, 301);
  // }
  
  // Skip tracking for API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.jpeg') ||
    pathname.includes('.gif') ||
    pathname.includes('.svg') ||
    pathname.includes('.css') ||
    pathname.includes('.js') ||
    pathname.includes('.woff') ||
    pathname.includes('.ttf') ||
    pathname.includes('.eot') ||
    pathname.includes('robots.txt') ||
    pathname.includes('sitemap.xml')
  ) {
    return NextResponse.next();
  }
  
  // Generate visitor hash for analytics
  const ip = (request as any).ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const visitorHash = generateVisitorHash(ip, userAgent);
  
  // Continue with the request immediately
  const response = NextResponse.next();
  
  // Add tracking headers for client-side analytics
  response.headers.set('x-visitor-hash', visitorHash);
  response.headers.set('x-page-tracked', pathname);
  
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - Any file extensions (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};