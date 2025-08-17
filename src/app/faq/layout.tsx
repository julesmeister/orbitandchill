import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${BRAND.name}`,
  description: `Find answers to common questions about ${BRAND.name}, natal charts, and astrology. Get help with chart generation, account issues, and astrological interpretations.`,
  keywords: ['astrology FAQ', 'natal chart help', 'birth chart questions', 'astrology support', 'chart generator help', 'astrology beginner questions'],
  openGraph: {
    title: `Astrology FAQ | ${BRAND.name}`,
    description: `Find answers to common questions about natal charts, astrology, and our platform.`,
    type: 'website',
    url: `${BRAND.domain}/faq`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Frequently Asked Questions - Astrology Help'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Astrology FAQ | ${BRAND.name}`,
    description: `Find answers to common questions about natal charts, astrology, and our platform.`,
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}