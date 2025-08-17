import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${BRAND.name}`,
  description: `Admin dashboard for ${BRAND.name}. Manage content, monitor analytics, and oversee platform operations.`,
  robots: {
    index: false, // Admin pages should never be indexed
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}