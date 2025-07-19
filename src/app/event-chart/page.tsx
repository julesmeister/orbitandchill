import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import EventChartPageClient from './EventChartPageClient';

export const metadata: Metadata = {
  title: `Event Chart | Astrological Timing | ${BRAND.name}`,
  description: 'View astrological charts for specific events and moments in time. Analyze planetary positions and aspects for any date and time.',
  keywords: 'event chart, astrological timing, planetary positions, event astrology, moment analysis, celestial events, astrological aspects',
};

export default function EventChartPage() {
  return <EventChartPageClient />;
}