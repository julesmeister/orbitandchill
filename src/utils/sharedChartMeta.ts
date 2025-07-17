import { Metadata } from 'next';
import { ChartService } from '@/db/services/chartService';
import { BRAND } from '@/config/brand';

export interface SharedChartMetaOptions {
  shareToken?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

/**
 * Generate dynamic metadata for shared charts
 * This utility handles the meta tags for social media sharing
 */
export async function generateSharedChartMeta(
  options: SharedChartMetaOptions = {}
): Promise<Metadata> {
  const { shareToken, fallbackTitle, fallbackDescription } = options;

  // Default meta tags if no share token
  const defaultMeta: Metadata = {
    title: fallbackTitle || `${BRAND.name} - Free Natal Chart Generator & Astrological Events Tracker`,
    description: fallbackDescription || 'Generate your free natal chart and track rare astrological events in real-time. Discover your cosmic blueprint with our astrology community.',
    openGraph: {
      title: fallbackTitle || `${BRAND.name} - Free Natal Chart Generator`,
      description: fallbackDescription || 'Generate your free natal chart and track rare astrological events in real-time. Discover your cosmic blueprint with our astrology community.',
      type: 'website',
      siteName: BRAND.name,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@orbitandchill',
      creator: '@orbitandchill',
      title: fallbackTitle || `${BRAND.name} - Free Natal Chart Generator`,
      description: fallbackDescription || 'Generate your free natal chart and track rare astrological events in real-time.',
    },
  };

  // If no share token, return default meta
  if (!shareToken) {
    return defaultMeta;
  }

  try {
    // Fetch chart data using the share token
    const chart = await ChartService.getChartByShareToken(shareToken);
    
    if (!chart) {
      console.warn(`Chart not found for share token: ${shareToken}`);
      return {
        ...defaultMeta,
        title: 'Chart Not Found | Orbit and Chill',
        description: 'This chart link is invalid or no longer available.',
      };
    }

    // Extract chart information
    const subjectName = chart.subjectName || 'Someone';
    const birthDate = chart.dateOfBirth ? new Date(chart.dateOfBirth).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
    const birthLocation = chart.locationOfBirth || '';
    
    // Generate personalized meta tags
    const title = `${subjectName}'s Natal Chart | ${BRAND.name}`;
    const description = `Explore ${subjectName}'s cosmic blueprint${birthDate ? ` born on ${birthDate}` : ''}${birthLocation ? ` in ${birthLocation}` : ''}. Created with ${BRAND.name}'s free natal chart generator.`;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/chart?shareToken=${shareToken}`;
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/api/charts/${chart.id}/preview?shareToken=${shareToken}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: BRAND.name,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${subjectName}'s Natal Chart`,
          },
        ],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@orbitandchill',
        creator: '@orbitandchill',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
      },
      keywords: [
        'natal chart',
        'astrology',
        'birth chart',
        'horoscope',
        'zodiac',
        'astrology chart',
        'free natal chart',
        'astrology reading',
        subjectName,
        birthLocation,
      ].filter(Boolean),
    };

  } catch (error) {
    console.error('Error generating shared chart metadata:', error);
    return {
      ...defaultMeta,
      title: 'Natal Chart | Orbit and Chill',
      description: 'View this natal chart created with Orbit and Chill\'s free chart generator.',
    };
  }
}

/**
 * Generate structured data for shared charts (SEO)
 */
export function generateSharedChartStructuredData(chart: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${chart.subjectName || 'Someone'}'s Natal Chart`,
    description: `Natal chart created with ${BRAND.name}`,
    creator: {
      '@type': 'Organization',
      name: BRAND.name,
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com',
    },
    dateCreated: chart.createdAt,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/chart?shareToken=${chart.shareToken}`,
    thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/api/charts/${chart.id}/preview?shareToken=${chart.shareToken}`,
    about: {
      '@type': 'Thing',
      name: 'Astrology',
      description: 'Natal chart astrology reading',
    },
  };
}