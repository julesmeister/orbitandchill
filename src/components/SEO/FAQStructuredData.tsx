import React from 'react';
import { BRAND } from '@/config/brand';
import { type FAQItem, faqToStructuredData } from '@/data/faqData';

interface FAQStructuredDataProps {
  faqs: FAQItem[];
  pageTitle?: string;
}

export default function FAQStructuredData({ faqs, pageTitle = "FAQ" }: FAQStructuredDataProps) {
  const structuredData = {
    ...faqToStructuredData(faqs.map(item => ({
      id: `seo-${Math.random().toString(36).substr(2, 9)}`,
      question: item.question,
      answer: item.answer,
      category: 'general' as const
    }))),
    "name": `${pageTitle} | ${BRAND.name}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Re-export from centralized data source for backward compatibility
export { 
  astrologyFAQs, 
  privacyFAQs,
  type FAQItem 
} from '@/data/faqData';