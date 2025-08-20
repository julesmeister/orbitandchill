import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/discussions',
          '/discussions/*',
          '/discussions?category=*', // Allow category filtering
          '/discussions?sortBy=*', // Allow sorting
          '/discussions?page=*', // Allow pagination
          '/blog',
          '/blog/*',
          '/blog?category=*', // Allow blog category filtering
          '/blog?page=*', // Allow blog pagination
          '/search',
          '/search?*', // Allow search queries
          '/guides/*',
          '/faq',
          '/learning-center',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/settings/*',
          '/profile/*',
          '/chart?*', // Block chart URLs with parameters (user-specific)
          '/horary?*', // Block horary URLs with parameters (user-specific)
          '/astrocartography?*', // Block astrocartography URLs with parameters (user-specific)
          '/*?edit=*', // Block edit URLs
          '/*?draft=*', // Block draft URLs
          '/*?preview=*', // Block preview URLs
          '/*?utm_*', // Block tracking parameters
          '*/test/*', // Block all test pages
          '/electional/test',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's web crawler
        disallow: '/', // Prevent AI training data scraping
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl bot
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}