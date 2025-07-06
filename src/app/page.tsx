import { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { BRAND } from '@/config/brand';

// Server-side metadata generation for SEO
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  const title = `${BRAND.name} - Free Natal Chart Calculator & Astrology Tracker`;
  const description = `${BRAND.tagline} ${BRAND.description} Generate your free natal chart, explore astrocartography, track astrological events, and discover electional astrology timing. Professional-grade astrology tools for beginners and experts.`;
  
  return {
    title,
    description,
    keywords: [
      'natal chart calculator',
      'free natal chart',
      'astrology chart',
      'birth chart',
      'astrocartography',
      'astrological events tracker',
      'electional astrology',
      'astrology tools',
      'cosmic blueprint',
      'planetary positions',
      'astrological houses',
      'matrix destiny',
      'astrology blog',
      'astrology community',
      'celestial events',
      'astronomical calculations'
    ],
    authors: [{ name: BRAND.name }],
    creator: BRAND.name,
    publisher: BRAND.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: BRAND.name,
      images: [
        {
          url: `${siteUrl}/images/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: `${BRAND.name} - Professional Astrology Tools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@orbitandchill',
      creator: '@orbitandchill',
      images: [`${siteUrl}/images/og-home.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: siteUrl,
      types: {
        'application/rss+xml': `${siteUrl}/blog/rss.xml`,
      },
    },
  };
}

// Server component for home page
export default function Home() {
  return <HomePageClient />;
}

