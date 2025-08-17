import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Account Settings | ${BRAND.name}`,
  description: `Manage your ${BRAND.name} account settings, privacy preferences, notifications, and data. Control how your birth information is stored and shared in our astrology community.`,
  keywords: ['account settings', 'privacy settings', 'astrology preferences', 'notification settings', 'data management'],
  openGraph: {
    title: `Account Settings | ${BRAND.name}`,
    description: `Manage your ${BRAND.name} account settings, privacy preferences, and data controls.`,
    type: 'website',
  },
  twitter: {
    title: `Account Settings | ${BRAND.name}`,
    description: `Manage your ${BRAND.name} account settings, privacy preferences, and data controls.`,
    card: 'summary',
  },
  robots: {
    index: false, // Settings pages shouldn't be indexed
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}