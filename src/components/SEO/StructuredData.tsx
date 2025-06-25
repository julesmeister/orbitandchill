'use client';

import { useEffect, useState } from 'react';

interface StructuredDataProps {
  type?: 'website' | 'article' | 'faq' | 'breadcrumb';
  data?: Record<string, unknown>;
}

export default function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: 'Luckstrology',
          url: 'https://luckstrology.com',
          description: 'Free natal chart generator and astrology community platform',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://luckstrology.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          sameAs: [
            'https://twitter.com/luckstrology',
            'https://instagram.com/luckstrology',
            'https://facebook.com/luckstrology',
          ],
        };

      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: data?.title || 'Luckstrology Article',
          description: data?.description || 'Astrology insights and natal chart analysis',
          author: {
            '@type': 'Organization',
            name: 'Luckstrology',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Luckstrology',
            logo: {
              '@type': 'ImageObject',
              url: 'https://luckstrology.com/logo.png',
            },
          },
          datePublished: data?.datePublished || '2024-01-01T00:00:00.000Z',
          dateModified: data?.dateModified || '2024-01-01T00:00:00.000Z',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data?.url || 'https://luckstrology.com',
          },
        };

      case 'faq':
        return {
          ...baseData,
          '@type': 'FAQPage',
          mainEntity: data?.questions || [
            {
              '@type': 'Question',
              name: 'What is a natal chart?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A natal chart is a map of where all the planets were in their journey around the Sun at the exact moment you were born.',
              },
            },
            {
              '@type': 'Question',
              name: 'How accurate is my birth time?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Birth time accuracy is crucial for precise natal chart calculations. Even a few minutes can affect your rising sign and house placements.',
              },
            },
          ],
        };

      case 'breadcrumb':
        return {
          ...baseData,
          '@type': 'BreadcrumbList',
          itemListElement: data?.breadcrumbs || [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://luckstrology.com',
            },
          ],
        };

      default:
        return baseData;
    }
  };

  // Only render on client to avoid hydration issues with browser extensions
  if (!isClient) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}