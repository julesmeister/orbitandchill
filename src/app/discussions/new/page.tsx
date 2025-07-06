import { Metadata } from 'next';
import { BRAND } from '../../../config/brand';
import NewDiscussionPageClient from './NewDiscussionPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  const title = `Start New Discussion - ${BRAND.name} Community`;
  const description = "Create a new astrology discussion. Ask questions, share insights, and engage with the astrology community about natal charts, transits, synastry, and more.";
  const keywords = "new astrology discussion, create discussion, astrology questions, community forum, natal chart help, astrology insights, astrological discussion";
  
  return {
    title,
    description,
    keywords,
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
      canonical: '/discussions/new',
    },
    openGraph: {
      title,
      description,
      url: '/discussions/new',
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/new-discussion-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Start New Astrology Discussion',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/new-discussion-og.jpg'],
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

export default function NewDiscussionPage() {
  return <NewDiscussionPageClient />;
}