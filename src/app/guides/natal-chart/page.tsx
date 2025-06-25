/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import GuideTemplate from '@/components/guides/GuideTemplate';
import { renderNatalChartContent } from './content';

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
    <GuideTemplate 
      guide={guide} 
      renderSectionContent={renderSectionContent}
      quickActions={quickActions}
    />
  );
}