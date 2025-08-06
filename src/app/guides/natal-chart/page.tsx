import React from 'react';
import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import GuideTemplate from '@/components/guides/GuideTemplate';
import { renderNatalChartContent } from './content';
import HowToStructuredData, { natalChartGuideSteps } from '@/components/SEO/HowToStructuredData';

export const metadata: Metadata = {
  title: `Your First Natal Chart: A Complete Beginner's Guide | ${BRAND.name}`,
  description: 'Learn how to create and interpret your natal chart with this comprehensive beginner\'s guide. Discover your Sun, Moon, and Rising signs and understand your cosmic blueprint.',
  keywords: 'natal chart guide, birth chart tutorial, astrology for beginners, how to read natal chart, sun moon rising signs',
  openGraph: {
    title: `Natal Chart Guide | ${BRAND.name}`,
    description: 'Learn how to create and interpret your natal chart with this comprehensive beginner\'s guide.',
    type: 'article',
    url: `${BRAND.domain}/guides/natal-chart`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: 'Natal Chart Guide'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Natal Chart Guide | ${BRAND.name}`,
    description: 'Learn how to create and interpret your natal chart with this comprehensive beginner\'s guide.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
  },
};

export default function NatalChartGuidePage() {
  const guide = {
    id: 'natal-chart',
    title: 'Your First Natal Chart: A Complete Beginner\'s Guide',
    description: 'Start your astrological journey with this comprehensive introduction to natal charts. Learn what each element means and how to interpret your cosmic blueprint.',
    level: 'beginner' as const,
    estimatedTime: '30 min',
    sections: [
      {
        id: 'intro',
        title: 'What is a Natal Chart?',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'big-three',
        title: 'The Big Three: Sun, Moon & Rising',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'chart-wheel',
        title: 'Understanding Your Chart Wheel',
        type: 'visual' as const,
        content: ''
      },
      {
        id: 'houses',
        title: 'Houses: Life Areas',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'putting-together',
        title: 'Putting It All Together',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    return renderNatalChartContent(currentSection);
  };

  const quickActions = {
    primary: {
      title: "Generate Your Chart",
      description: "Create your personalized natal chart to start exploring your astrological blueprint.",
      href: "/chart",
      linkText: "Create Natal Chart",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Join the Discussion",
      description: "Share your chart insights and learn from the astrology community.",
      href: "/discussions",
      linkText: "Community Forum",
      backgroundColor: "#f2e356"
    }
  };

  return (
    <>
      <HowToStructuredData
        name="How to Create and Read Your Natal Chart"
        description="Learn how to generate your personalized natal chart and understand the key elements that make up your astrological blueprint."
        steps={natalChartGuideSteps}
        totalTime="PT30M"
        supply={["Birth date", "Birth time (exact if possible)", "Birth location"]}
        tool={["Natal Chart Generator", "Computer or mobile device", "Internet connection"]}
      />
      <GuideTemplate 
        guide={guide} 
        renderSectionContent={renderSectionContent}
        quickActions={quickActions}
      />
    </>
  );
}