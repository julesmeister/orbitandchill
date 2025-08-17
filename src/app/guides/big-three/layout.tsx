import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Your Big Three: Sun, Moon, and Rising Signs | ${BRAND.name}`,
  description: 'Master the foundation of astrology by understanding your Big Three: Sun sign (identity), Moon sign (emotions), and Rising sign (persona). Complete beginner guide to your cosmic trinity.',
  keywords: ['big three astrology', 'sun moon rising', 'natal chart basics', 'astrological trinity', 'ascendant sign', 'moon sign meaning', 'sun sign identity'],
  openGraph: {
    title: `Big Three Astrology Guide | ${BRAND.name}`,
    description: 'Master your Sun, Moon, and Rising signs - the foundation of astrological interpretation.',
    type: 'article',
    url: `${BRAND.domain}/guides/big-three`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Big Three Astrology Guide - Sun Moon Rising'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Big Three Astrology Guide | ${BRAND.name}`,
    description: 'Master your Sun, Moon, and Rising signs - the foundation of astrological interpretation.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function BigThreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}