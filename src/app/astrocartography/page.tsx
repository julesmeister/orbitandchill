import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import AstrocartographyPageClient from './AstrocartographyPageClient';

export const metadata: Metadata = {
  title: `Astrocartography | Find Your Power Places | ${BRAND.name}`,
  description: 'Discover your astrological power places around the world. Explore planetary lines, power spots, and optimal locations for love, career, and personal growth.',
  keywords: 'astrocartography, astrological relocation, planetary lines, power places, astrology travel, relocational astrology, AC MC lines, astrolocality',
};

export default function AstrocartographyPage() {
  return <AstrocartographyPageClient />;
}