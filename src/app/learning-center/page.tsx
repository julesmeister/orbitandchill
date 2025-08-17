/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
// Server-side metadata generation for SEO
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  const title = `Astrology Learning Center - Guides & Tutorials | ${BRAND.name}`;
  const description = "Master astrology with our comprehensive learning center. Step-by-step guides for natal charts, horary questions, astrocartography, and electional timing. Free tutorials for beginners.";
  
  return {
    title,
    description,
    keywords: [
      'astrology learning',
      'natal chart tutorial', 
      'horary astrology guide',
      'astrocartography tutorial',
      'electional astrology',
      'astrology guides',
      'astrology education',
      'learn astrology',
      'astrology tutorials',
      'birth chart analysis guide',
      'astrological houses guide',
      'astrology for beginners'
    ],
    authors: [{ name: BRAND.name }],
    creator: BRAND.name,
    publisher: BRAND.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/learning-center',
    },
    openGraph: {
      title,
      description,
      url: '/learning-center',
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/learning-center-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Astrology Learning Center - Comprehensive Guides',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/learning-center-og.jpg'],
      creator: '@orbitandchill',
      site: '@orbitandchill',
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
  };
}

import LearningCenterClient from './LearningCenterClient';

export default function LearningCenterPage() {
  return <LearningCenterClient />;
}