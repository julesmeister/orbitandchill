import { Metadata } from 'next';
import { ChartService } from '@/db/services/chartService';
import { BRAND } from '@/config/brand';
import SharedChartClient from './SharedChartClient';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

// Generate metadata for social media sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  
  try {
    const chart = await ChartService.getChartByShareToken(token);
    
    if (!chart) {
      return {
        title: 'Chart Not Found | Orbit and Chill',
        description: 'This chart link is invalid or no longer available.',
      };
    }

    const subjectName = chart.subjectName || 'Someone';
    const birthDate = (chart as any).birthData?.dateOfBirth ? new Date((chart as any).birthData.dateOfBirth).toLocaleDateString() : '';
    const birthLocation = (chart as any).birthData?.locationOfBirth || '';
    
    const title = `${subjectName}'s Natal Chart | ${BRAND.name}`;
    const description = `Explore ${subjectName}'s cosmic blueprint${birthDate ? ` born on ${birthDate}` : ''}${birthLocation ? ` in ${birthLocation}` : ''}. Created with ${BRAND.name}'s free natal chart generator.`;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/chart/shared/${token}`;
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/api/charts/${chart.id}/preview?shareToken=${token}`;

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
    console.error('Error generating metadata for shared chart:', error);
    return {
      title: 'Natal Chart | Orbit and Chill',
      description: 'View this natal chart created with Orbit and Chill\'s free chart generator.',
    };
  }
}

export default async function SharedChartPage({ params }: PageProps) {
  const { token } = await params;
  
  // Try to get chart data server-side for better performance
  let initialChart = null;
  try {
    initialChart = await ChartService.getChartByShareToken(token);
  } catch (error) {
    // Will be handled by client component
    console.error('Error loading chart server-side:', error);
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {initialChart && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: `${initialChart.subjectName || 'Someone'}'s Natal Chart`,
              description: `Natal chart created with ${BRAND.name}`,
              creator: {
                '@type': 'Organization',
                name: BRAND.name,
                url: process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com',
              },
              dateCreated: initialChart.createdAt,
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/chart/shared/${token}`,
              thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orbitandchill.com'}/api/charts/${initialChart.id}/preview?shareToken=${token}`,
              about: {
                '@type': 'Thing',
                name: 'Astrology',
                description: 'Natal chart astrology reading',
              },
            }),
          }}
        />
      )}
      
      <SharedChartClient token={token} initialChart={initialChart} />
    </>
  );
}