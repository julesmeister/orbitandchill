/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRAND } from '../../../config/brand';
import DiscussionDetailPageClient from './DiscussionDetailPageClient';
import DiscussionDetailStructuredData from '../../../components/SEO/DiscussionDetailStructuredData';

// Server-side function to fetch discussion data
async function fetchDiscussion(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  
  try {
    const response = await fetch(`${siteUrl}/api/discussions/by-slug/${slug}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'max-age=300',
      },
      // Add cache revalidation for production
      next: { revalidate: 300 }
    });
    
    const data = await response.json();
    return data.success ? data.discussion : null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const discussion = await fetchDiscussion(resolvedParams.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  
  if (!discussion) {
    return {
      title: `Discussion Not Found | ${BRAND.name}`,
      description: 'The requested discussion could not be found.',
      robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
    };
  }

  const title = `${discussion.title} | ${BRAND.name} Discussions`;
  const description = discussion.excerpt || 
    `Join the discussion about ${discussion.title} in the ${discussion.category} category. ${discussion.replies} replies and ${discussion.views} views.`;
  const keywords = `astrology, ${discussion.category}, ${discussion.tags?.join(', ') || ''}, discussion, community`;
  const canonicalUrl = `/discussions/${discussion.slug || resolvedParams.slug}`;
  
  // Helper to safely convert dates
  const getValidDate = (dateValue: string | Date | number) => {
    try {
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue * 1000);
        return isNaN(date.getTime()) ? new Date() : date;
      }
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const publishedDate = getValidDate(discussion.createdAt || discussion.lastActivity);
  const modifiedDate = getValidDate(discussion.lastActivity);
  
  return {
    title,
    description,
    keywords,
    authors: [{ name: discussion.author }],
    creator: discussion.author,
    publisher: BRAND.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authors: [discussion.author],
      section: discussion.category,
      tags: discussion.tags || [],
      images: [
        {
          url: '/images/discussion-og.jpg',
          width: 1200,
          height: 630,
          alt: discussion.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/discussion-og.jpg'],
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
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const discussion = await fetchDiscussion(resolvedParams.slug);
  
  // If discussion not found, return 404
  if (!discussion) {
    notFound();
  }
  
  return (
    <>
      <DiscussionDetailStructuredData discussion={discussion} slug={resolvedParams.slug} />
      <DiscussionDetailPageClient params={params} />
    </>
  );
}
