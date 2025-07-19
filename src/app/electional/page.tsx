import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import ElectionalPageClient from './ElectionalPageClient';

export const metadata: Metadata = {
  title: `Electional Astrology | Perfect Timing | ${BRAND.name}`,
  description: 'Choose the most auspicious timing for important events using electional astrology. Find optimal moments for launches, weddings, business ventures, and major decisions.',
  keywords: 'electional astrology, auspicious timing, planetary hours, lunar elections, astrological timing, event planning, optimal timing, celestial events',
};

export default function ElectionalPage() {
  return <ElectionalPageClient />;
}