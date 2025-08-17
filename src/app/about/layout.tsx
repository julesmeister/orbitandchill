import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `About Us | ${BRAND.name}`,
  description: `Learn about ${BRAND.name}, our mission to make quality astrology accessible to everyone. Discover our free natal chart generator, community platform, and commitment to privacy-first astrological tools.`,
  keywords: ['about', 'astrology platform', 'natal charts', 'astrology mission', 'free astrology tools', 'community'],
  openGraph: {
    title: `About Us | ${BRAND.name}`,
    description: `Learn about ${BRAND.name}, our mission to make quality astrology accessible to everyone. Discover our free natal chart generator and community platform.`,
    type: 'website',
  },
  twitter: {
    title: `About Us | ${BRAND.name}`,
    description: `Learn about ${BRAND.name}, our mission to make quality astrology accessible to everyone. Discover our free natal chart generator and community platform.`,
    card: 'summary',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}