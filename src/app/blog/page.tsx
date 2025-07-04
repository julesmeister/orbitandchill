/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Metadata } from 'next';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { BRAND } from '@/config/brand';

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  
  const title = page > 1 
    ? `Astrology Blog - Page ${page} | Expert Insights & Cosmic Wisdom | ${BRAND.name}`
    : `Astrology Blog | Expert Insights & Cosmic Wisdom | ${BRAND.name}`;
    
  const description = 'Explore comprehensive astrology guides, zodiac insights, planetary influences, and cosmic wisdom. Learn about natal charts, transits, and astrological techniques.';
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
  const canonical = page > 1 ? `${baseUrl}/blog?page=${page}` : `${baseUrl}/blog`;
  
  return {
    title,
    description,
    keywords: 'astrology blog, zodiac signs, natal charts, planetary transits, horoscope, astrology guides, cosmic wisdom, birth chart, astrology reading',
    authors: [{ name: BRAND.name }],
    creator: BRAND.name,
    publisher: BRAND.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical,
      types: {
        'application/rss+xml': `${baseUrl}/blog/rss.xml`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: BRAND.name,
      locale: 'en_US',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${BRAND.name} - Astrology Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@orbitandchill',
      creator: '@orbitandchill',
      images: [`${baseUrl}/twitter-image.jpg`],
    },
    other: {
      'theme-color': '#000000',
    },
  };
}

export default function BlogPage() {
  return <BlogPageClient />;
}