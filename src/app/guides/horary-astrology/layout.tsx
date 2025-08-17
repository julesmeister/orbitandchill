import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Horary Astrology: Cosmic Question & Answer | ${BRAND.name}`,
  description: 'Learn horary astrology - the ancient art of answering specific questions through astrological charts. Discover how to ask the cosmos for guidance and interpret divine timing.',
  keywords: ['horary astrology', 'astrological questions', 'cosmic guidance', 'divination astrology', 'horary chart interpretation', 'asking astrology questions'],
  openGraph: {
    title: `Horary Astrology Guide | ${BRAND.name}`,
    description: 'Learn the ancient art of asking the cosmos specific questions through horary astrology.',
    type: 'article',
    url: `${BRAND.domain}/guides/horary-astrology`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Horary Astrology Guide - Cosmic Questions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Horary Astrology Guide | ${BRAND.name}`,
    description: 'Learn the ancient art of asking the cosmos specific questions through horary astrology.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function HoraryAstrologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}