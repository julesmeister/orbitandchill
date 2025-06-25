/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import GuideTemplate from '@/components/guides/GuideTemplate';
import { renderElectionalContent } from './content';

export default function ElectionalAstrologyGuidePage() {
  const guide = {
    id: 'electional-astrology',
    title: 'Electional Astrology: Timing Your Success',
    description: 'Master the art of choosing auspicious timing for important events using electional astrology. Learn to select optimal moments for launches, contracts, and life decisions.',
    level: 'intermediate' as const,
    estimatedTime: '35 min',
    sections: [
      {
        id: 'intro',
        title: 'What is Electional Astrology?',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'timing-principles',
        title: 'Core Timing Principles',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-applications',
        title: 'Practical Applications',
        type: 'interactive' as const,
        content: ''
      },
      {
        id: 'planetary-hours',
        title: 'Planetary Hours and Daily Timing',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'getting-started',
        title: 'Getting Started with Elections',
        type: 'text' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    return renderElectionalContent(currentSection);
  };

  const quickActions = {
    primary: {
      title: "Plan Optimal Timing",
      description: "Use our tools to find the best timing for your important events and decisions.",
      href: "/events",
      linkText: "Explore Events",
      backgroundColor: "#f2e356"
    },
    secondary: {
      title: "Discuss Timing",
      description: "Share your electional experiences and learn from other practitioners.",
      href: "/discussions",
      linkText: "Join Community",
      backgroundColor: "#6bdbff"
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