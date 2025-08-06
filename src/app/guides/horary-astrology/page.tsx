/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import GuideTemplate from '@/components/guides/GuideTemplate';
import { renderHoraryContent } from './content';

export default function HoraryAstrologyGuidePage() {
  const guide = {
    id: 'horary-astrology',
    title: 'Horary Astrology: Answering Life\'s Questions',
    description: 'Learn the ancient art of horary astrology to answer specific questions using the moment a question is asked. Master traditional techniques and interpretation methods.',
    level: 'advanced' as const,
    estimatedTime: '60 min',
    sections: [
      {
        id: 'intro',
        title: 'What is Horary Astrology?',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'traditional-methods',
        title: 'Traditional Horary Methods',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'question-analysis',
        title: 'Analyzing Questions and Significators',
        type: 'interactive' as const,
        content: ''
      },
      {
        id: 'timing-judgment',
        title: 'Timing and Final Judgment',
        type: 'text' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    return renderHoraryContent(currentSection);
  };

  const quickActions = {
    primary: {
      title: "Ask a Horary Question",
      description: "Cast a horary chart for your sincere question using traditional astrological techniques.",
      href: "/horary",
      linkText: "Create Horary Chart",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Study with Others",
      description: "Discuss horary techniques and share chart interpretations with fellow practitioners.",
      href: "/discussions",
      linkText: "Join Community",
      backgroundColor: "#f0e3ff"
    }
  };

  return (
    <GuideTemplate 
      guide={guide} 
      quickActions={quickActions}
    />
  );
}