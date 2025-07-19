import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import GeneratePageClient from './GeneratePageClient';

export const metadata: Metadata = {
  title: `Generate Charts | Empty Templates for Content Creation | ${BRAND.name}`,
  description: 'Create empty chart templates perfect for TikTok content, educational purposes, and custom demonstrations. Generate customizable Destiny Matrix and astrology charts.',
  keywords: 'chart generator, empty charts, TikTok content, educational charts, destiny matrix generator, astrology templates, chart creation, custom charts',
};

export default function GeneratePage() {
  return <GeneratePageClient />;
}