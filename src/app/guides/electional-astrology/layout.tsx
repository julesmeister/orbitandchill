import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Electional Astrology: Perfect Timing for Life Events | ${BRAND.name}`,
  description: 'Master electional astrology to choose the most auspicious times for important events. Learn optimal timing for weddings, business launches, and major life decisions.',
  keywords: ['electional astrology', 'auspicious timing', 'event timing astrology', 'wedding astrology', 'business launch timing', 'astrological timing'],
  openGraph: {
    title: `Electional Astrology Guide | ${BRAND.name}`,
    description: 'Master the art of choosing perfect timing for important life events.',
    type: 'article',
    url: `${BRAND.domain}/guides/electional-astrology`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Electional Astrology Guide - Perfect Timing'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Electional Astrology Guide | ${BRAND.name}`,
    description: 'Master the art of choosing perfect timing for important life events.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function ElectionalAstrologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}