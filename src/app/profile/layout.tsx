import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Your Profile | ${BRAND.name}`,
  description: `View and manage your ${BRAND.name} profile. Access your natal chart, birth information, astrology preferences, and community activity.`,
  keywords: ['user profile', 'natal chart profile', 'astrology profile', 'birth chart account'],
  openGraph: {
    title: `Your Profile | ${BRAND.name}`,
    description: `View and manage your ${BRAND.name} profile and natal chart information.`,
    type: 'website',
  },
  twitter: {
    title: `Your Profile | ${BRAND.name}`,
    description: `View and manage your ${BRAND.name} profile and natal chart information.`,
    card: 'summary',
  },
  robots: {
    index: false, // Profile pages shouldn't be indexed
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}