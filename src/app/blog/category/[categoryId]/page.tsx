/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Metadata } from 'next';
import BlogCategoryClient from '@/components/blog/BlogCategoryClient';
import { BRAND } from '@/config/brand';
import { extractCategoryIdFromSlug } from '@/utils/categorySlugUtils';

// Mock categories for metadata generation - replace with actual data fetching
const mockCategories = [
  { id: 'natal-charts', name: 'Natal Charts', description: 'Explore the mysteries of birth charts and personal astrology.' },
  { id: 'transits', name: 'Transits', description: 'Understanding planetary movements and their effects on your life.' },
  { id: 'synastry', name: 'Synastry', description: 'Relationship astrology and compatibility insights.' },
  { id: 'mundane', name: 'Mundane Astrology', description: 'World events and collective astrological influences.' },
];

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const searchParamsResolved = await searchParams;
  const { categoryId: urlSlug } = resolvedParams;
  const page = searchParamsResolved.page ? Number(searchParamsResolved.page) : 1;
  
  // Extract actual category ID from URL slug
  const categoryId = extractCategoryIdFromSlug(urlSlug) || urlSlug;
  
  // Find the current category - replace with actual data fetching
  const currentCategory = mockCategories.find(cat => cat.id === categoryId);
  
  const categoryName = currentCategory ? currentCategory.name : 'Category';
  const categoryDescription = currentCategory?.description || `Explore ${categoryName.toLowerCase()} articles and insights. Learn about ${categoryName.toLowerCase()} with expert guidance and cosmic wisdom.`;
  
  const title = page > 1 
    ? `${categoryName} - Page ${page} | Astrology Blog | ${BRAND.name}`
    : `${categoryName} | Astrology Blog | ${BRAND.name}`;
    
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || BRAND.domain;
  const canonical = page > 1 
    ? `${baseUrl}/blog/category/${urlSlug}?page=${page}` 
    : `${baseUrl}/blog/category/${urlSlug}`;
  
  return {
    title,
    description: categoryDescription,
    keywords: `${categoryName.toLowerCase()}, astrology, ${categoryName.toLowerCase()} astrology, zodiac, natal charts, cosmic wisdom`,
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
      description: categoryDescription,
      url: canonical,
      siteName: BRAND.name,
      locale: 'en_US',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${BRAND.name} - ${categoryName} Articles`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: categoryDescription,
      site: '@orbitandchill',
      creator: '@orbitandchill',
      images: [`${baseUrl}/twitter-image.jpg`],
    },
    other: {
      'theme-color': '#000000',
    },
  };
}

interface BlogCategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  return <BlogCategoryClient params={params} />;
}