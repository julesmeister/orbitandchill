/**
 * Dynamic Sitemap Generation
 * 
 * Generates sitemap.xml for better SEO with real-time data
 */

import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use production URL for sitemap to prevent localhost issues
  const baseUrl = 'https://orbitandchill.com'
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
      url: `${baseUrl}/event-chart`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
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
    // Core astrology guides
    {
      url: `${baseUrl}/guides/natal-chart`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/big-three`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/elements-and-modalities`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/astrological-houses`,
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
      url: `${baseUrl}/guides/astrocartography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Advanced guides
    {
      url: `${baseUrl}/guides/transits-and-timing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/retrograde-planets`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/moon-phases`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/destiny-matrix`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Tarot guides
    {
      url: `${baseUrl}/guides/tarot-fundamentals`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/major-arcana`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/minor-arcana`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/tarot-astrology`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
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
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learning-center`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Fetch dynamic content
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    // Only fetch dynamic content if we have a valid API endpoint
    // Skip localhost fetching during build to prevent localhost URLs in production sitemap
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_URL) {
      // Use Vercel's internal URL for API calls during build
      const apiUrl = `https://${process.env.VERCEL_URL}/api/discussions`
      const response = await fetch(apiUrl, {
        next: { revalidate: 3600 } // Cache for 1 hour
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Handle both direct array and wrapped response formats
        const discussions = Array.isArray(data) ? data : (data.discussions || [])
        
        // Add individual discussion/blog pages
        dynamicPages = discussions.map((post: any) => ({
          url: `${baseUrl}/discussions/${post.slug || post.id}`,
          lastModified: new Date(post.updatedAt || post.createdAt),
          changeFrequency: 'monthly' as const,
          priority: post.isPinned ? 0.8 : 0.6,
        }))
      }
    }
    // For development/local builds, skip API calls to prevent localhost URLs in production
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

  // Discussion category pages
  const discussionCategories = [
    'Natal Chart Analysis',
    'Transits & Predictions', 
    'Chart Reading Help',
    'Synastry & Compatibility',
    'Mundane Astrology',
    'Learning Resources',
    'General Discussion'
  ]

  const discussionCategoryPages: MetadataRoute.Sitemap = discussionCategories.map(category => ({
    url: `${baseUrl}/discussions?category=${encodeURIComponent(category)}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Discussion RSS feed
  const discussionRssPage: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/discussions/rss.xml`,
    lastModified: currentDate,
    changeFrequency: 'hourly' as const,
    priority: 0.6,
  }]

  // Combine all pages
  return [...staticPages, ...dynamicPages, ...categoryPages, ...discussionCategoryPages, ...discussionRssPage]
}