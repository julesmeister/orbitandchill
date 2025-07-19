import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import HoraryPageClient from './HoraryPageClient';

export const metadata: Metadata = {
  title: `Horary Astrology | Ask the Stars | ${BRAND.name}`,
  description: 'Get answers to your specific questions using traditional horary astrology. Ask about relationships, career, health, and life decisions with precise timing.',
  keywords: 'horary astrology, divination, astrology questions, traditional astrology, predictive astrology, astrology consultation, astrological timing',
};

export default function HoraryPage() {
  return <HoraryPageClient />;
}