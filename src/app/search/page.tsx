import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: `Search | ${BRAND.name}`,
  description: `Search through ${BRAND.name}'s astrology discussions, guides, and FAQ. Find answers to your astrological questions and explore our community content.`,
  keywords: ['astrology search', 'natal chart search', 'astrology discussions', 'horary questions', 'astrology guides search'],
  openGraph: {
    title: `Search | ${BRAND.name}`,
    description: `Search through astrology discussions, guides, and FAQ.`,
    type: 'website',
    url: `${BRAND.domain}/search`,
    siteName: BRAND.name,
  },
  twitter: {
    card: 'summary',
    title: `Search | ${BRAND.name}`,
    description: `Search through astrology discussions, guides, and FAQ.`,
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function SearchPage() {
  return <SearchPageClient />;
}