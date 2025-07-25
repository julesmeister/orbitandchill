import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import DiscussionsPageClient from './DiscussionsPageClient';
import DiscussionsStructuredData from '@/components/SEO/DiscussionsStructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';
  const title = `Astrology Discussions - ${BRAND.name} Community`;
  const description = "Join our astrology community discussions. Ask questions, share insights, and connect with fellow astrology enthusiasts about natal charts, transits, synastry, electional astrology, and more.";
  const keywords = "astrology discussions, astrology community, natal chart questions, transit interpretations, synastry help, astrology forum, astrological insights, chart reading help, astrology learning, birth chart analysis";
  
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
      canonical: '/discussions',
    },
    openGraph: {
      title,
      description,
      url: '/discussions',
      siteName: BRAND.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/discussions-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Astrology Community Discussions',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/discussions-og.jpg'],
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

export default function DiscussionsPage() {
  return (
    <>
      <DiscussionsStructuredData />
      <DiscussionsPageClient />
    </>
  );
}