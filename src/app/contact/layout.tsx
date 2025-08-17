import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Contact Us | ${BRAND.name}`,
  description: `Get in touch with the ${BRAND.name} team. Contact us for support, feedback, or questions about our free natal chart generator and astrology platform. We're here to help!`,
  keywords: ['contact', 'support', 'feedback', 'astrology support', 'natal chart help', 'customer service'],
  openGraph: {
    title: `Contact Us | ${BRAND.name}`,
    description: `Get in touch with the ${BRAND.name} team. Contact us for support, feedback, or questions about our free natal chart generator and astrology platform.`,
    type: 'website',
  },
  twitter: {
    title: `Contact Us | ${BRAND.name}`,
    description: `Get in touch with the ${BRAND.name} team. Contact us for support, feedback, or questions about our free natal chart generator and astrology platform.`,
    card: 'summary',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}