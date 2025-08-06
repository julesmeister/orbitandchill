/**
 * Dynamic Sitemap Generation
 * 
 * Generates sitemap.xml for better SEO with real-time data
 */

import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com'
  const currentDate = new Date()

  // Static pages with updated priorities to reflect new features
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chart`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/astrocartography`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/horary`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/electional`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/discussions`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/matrix-of-destiny`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/astrocartography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/horary-astrology`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/electional-astrology`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Fetch dynamic content
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    // Fetch blog posts and discussions
    const response = await fetch(`${baseUrl}/api/discussions`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // Handle both direct array and wrapped response formats
      const discussions = Array.isArray(data) ? data : (data.discussions || [])
      
      // Add individual discussion/blog pages
      dynamicPages = discussions.map((post: any) => ({
        url: `${baseUrl}/discussions/${post.id}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'monthly' as const,
        priority: post.isPinned ? 0.8 : 0.6,
      }))
    }
  } catch (error) {
    // If API fails, continue with static pages only
    console.error('Failed to fetch dynamic content for sitemap:', error)
  }

  // Fetch blog categories
  const categories = [
    'natal-chart-analysis',
    'transits-predictions',
    'synastry-compatibility',
    'mundane-astrology',
    'learning-resources',
    'chart-reading-help',
    'general-discussion'
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Combine all pages
  return [...staticPages, ...dynamicPages, ...categoryPages]
}