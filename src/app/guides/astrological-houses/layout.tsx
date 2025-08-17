import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `The Astrological Houses: Life's Twelve Stages | ${BRAND.name}`,
  description: 'Master the twelve astrological houses and their life themes. Learn how planetary placements in each house influence your experiences in career, relationships, health, and personal growth.',
  keywords: ['astrological houses', 'twelve houses astrology', 'houses in natal chart', 'house system astrology', 'house meanings', 'life themes astrology'],
  openGraph: {
    title: `Astrological Houses Guide | ${BRAND.name}`,
    description: 'Master the twelve astrological houses and their life themes.',
    type: 'article',
    url: `${BRAND.domain}/guides/astrological-houses`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Astrological Houses Guide - Life Themes'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Astrological Houses Guide | ${BRAND.name}`,
    description: 'Master the twelve astrological houses and their life themes.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function AstrologicalHousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}