/**
 * Dynamic Sitemap Generation
 * 
 * Generates sitemap.xml for better SEO with real-time data
 */

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit-and-chill.com'
  const currentDate = new Date().toISOString().split('T')[0]

  // Static pages with updated priorities to reflect new features
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily', // Updated more frequently due to Astrological Events
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chart`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9, // Increased priority for main feature
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
    // Add specific section anchors for main page features
    {
      url: `${baseUrl}/#natal-chart-section`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#astrological-events-section`,
      lastModified: currentDate,
      changeFrequency: 'daily', // High frequency due to changing events
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#astrocartography-section`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#electional-astrology-section`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  return staticPages
}