/**
 * Dynamic robots.txt Generation
 * 
 * Generates robots.txt for search engine crawling instructions
 */

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com'
  
  const robotsTxt = `# Orbit and Chill - Robots.txt
# Generated dynamically

# Allow all crawlers
User-agent: *
Allow: /

# Specific crawler instructions
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Disallow admin and API routes
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow specific API endpoints for structured data
Allow: /api/discussions
Allow: /api/seo-settings
Allow: /api/generate-sitemap
Allow: /api/generate-robots

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Clean URL parameters
Disallow: /*?
Allow: /*?page=
Allow: /*?category=
Allow: /*?tag=

# Prevent crawling of duplicate content
Disallow: /print/
Disallow: /amp/
Disallow: /*.json$
Disallow: /*.xml$

# Allow social media crawlers
User-agent: facebookexternalhit
Allow: /
Crawl-delay: 0

User-agent: Twitterbot
Allow: /
Crawl-delay: 0

User-agent: LinkedInBot
Allow: /
Crawl-delay: 0

User-agent: WhatsApp
Allow: /
Crawl-delay: 0

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Cache control hint
# Cache-Control: max-age=86400
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}