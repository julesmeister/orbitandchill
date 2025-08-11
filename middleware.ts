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

// Non-blocking analytics tracking function
async function trackPageView(data: any) {
  try {
    // Use absolute URL for internal API call
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com';
    
    await fetch(`${baseUrl}/api/analytics/track`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Middleware/1.0'
      },
      body: JSON.stringify({
        event: 'page_view',
        data
      }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(3000)
    });
  } catch (error) {
    // Silently fail - don't break page loading for analytics
    console.error('Middleware analytics tracking failed:', error);
  }
}

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
  
  // Get visitor information for tracking
  const ip = (request as any).ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referrer = request.headers.get('referer') || 'direct';
  
  // Generate consistent visitor hash for unique visitor tracking
  const visitorHash = generateVisitorHash(ip, userAgent);
  
  // Prepare tracking data
  const trackingData = {
    ip,
    userAgent,
    referrer,
    page: pathname, // Changed from pathname to page for analytics API compatibility
    timestamp: new Date().toISOString(),
    visitorHash,
    // Extract useful metadata
    country: (request as any).geo?.country || request.headers.get('cf-ipcountry') || 'unknown',
    city: (request as any).geo?.city || 'unknown',
    // Session tracking (simplified)
    sessionId: `${visitorHash}-${Date.now()}`,
    // Page metadata
    isHomePage: pathname === '/',
    isChartPage: pathname === '/chart' || pathname.startsWith('/chart/'),
    isDiscussionPage: pathname.startsWith('/discussions'),
    isAdminPage: pathname.startsWith('/admin'),
    isAPIRoute: false, // Already filtered out above
    // User experience tracking
    loadTime: Date.now(), // Will be completed in client-side tracking
  };
  
  // Track page view asynchronously (non-blocking)
  // Use process.nextTick to ensure this doesn't delay the response
  process.nextTick(() => {
    trackPageView(trackingData);
  });
  
  // Continue with the request immediately
  return NextResponse.next();
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