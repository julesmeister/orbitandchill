import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import GuidesPageClient from './GuidesPageClient';

export const metadata: Metadata = {
  title: `Astrology Guides | Learn Natal Charts, Houses & More | ${BRAND.name}`,
  description: 'Master astrology with our comprehensive guides. Learn natal chart reading, astrological houses, planetary aspects, and advanced techniques from beginner to expert level.',
  keywords: 'astrology guides, natal chart tutorial, astrological houses, planetary aspects, astrology learning, birth chart reading, astrology education, zodiac signs guide',
};

export default function GuidesPage() {
  return <GuidesPageClient />;
}