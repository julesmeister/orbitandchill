import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Learning Center | ${BRAND.name}`,
  description: `Master ${BRAND.name}'s features and deepen your astrology knowledge. Comprehensive guides for natal charts, horary astrology, astrocartography, event planning, and more.`,
  keywords: ['astrology learning center', 'natal chart tutorial', 'horary astrology guide', 'astrocartography help', 'electional astrology', 'astrology education'],
  openGraph: {
    title: `Learning Center | ${BRAND.name}`,
    description: `Master astrology features and deepen your cosmic knowledge with comprehensive tutorials.`,
    type: 'website',
    url: `${BRAND.domain}/learning-center`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Astrology Learning Center - Tutorials and Guides'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Learning Center | ${BRAND.name}`,
    description: `Master astrology features and deepen your cosmic knowledge with comprehensive tutorials.`,
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function LearningCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}