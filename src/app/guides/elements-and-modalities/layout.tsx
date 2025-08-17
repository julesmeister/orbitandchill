import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Elements and Modalities: The Building Blocks | ${BRAND.name}`,
  description: 'Master the four elements (Fire, Earth, Air, Water) and three modalities (Cardinal, Fixed, Mutable) that form the foundation of astrology. Understand how they create all zodiac signs.',
  keywords: ['astrology elements', 'modalities', 'fire earth air water', 'cardinal fixed mutable', 'zodiac fundamentals', 'astrological building blocks'],
  openGraph: {
    title: `Elements and Modalities Guide | ${BRAND.name}`,
    description: 'Master the four elements and three modalities that form the foundation of astrology.',
    type: 'article',
    url: `${BRAND.domain}/guides/elements-and-modalities`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Elements and Modalities Astrology Guide'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Elements and Modalities Guide | ${BRAND.name}`,
    description: 'Master the four elements and three modalities that form the foundation of astrology.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function ElementsModalitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}