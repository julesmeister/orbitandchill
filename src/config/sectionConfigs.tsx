/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

export interface SectionConfig {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  backgroundColor: string;
  hoverColor?: string;
  icon: React.ReactNode;
  borderClasses?: string;
}

export const homepageSections: SectionConfig[] = [
  {
    id: 'natal-chart',
    sectionId: 'natal-chart-section',
    title: 'Natal Chart',
    description: 'Discover your cosmic blueprint',
    backgroundColor: '#6bdbff',
    hoverColor: '#5bc8ec',
    borderClasses: 'border-r border-black border-b',
    icon: (
      <svg className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  {
    id: 'astrocartography',
    sectionId: 'astrocartography-section',
    title: 'Astrocartography',
    description: 'Find your ideal locations',
    backgroundColor: '#f2e356',
    hoverColor: '#e8d84a',
    borderClasses: 'border-b',
    icon: (
      <svg className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'astrological-events',
    sectionId: 'astrological-events-section',
    title: 'Astrological Events',
    description: 'Track rare celestial events',
    backgroundColor: '#26efa2',
    hoverColor: '#26e59f',
    borderClasses: 'border-r border-black',
    icon: <span className="text-lg">✨</span>
  },
  {
    id: 'electional-astrology',
    sectionId: 'electional-astrology-section',
    title: 'Electional Astrology',
    description: 'Perfect cosmic moments',
    backgroundColor: '#ff91e9',
    hoverColor: '#ff7de4',
    borderClasses: '',
    icon: <span className="text-lg">⏰</span>
  }
];

// Featured Articles Section Configuration
export interface FeaturedArticlesConfig {
  title: string;
  subtitle: string;
  maxArticles: number;
  viewAllButtonText: string;
  viewAllRoute: string;
}

export const featuredArticlesConfig: FeaturedArticlesConfig = {
  title: 'Featured Articles',
  subtitle: 'Discover the latest insights and cosmic wisdom from our astrology experts',
  maxArticles: 3,
  viewAllButtonText: 'View All Articles',
  viewAllRoute: '/blog'
};

// Natal Chart Section Configuration
export interface NatalChartSectionConfig {
  title: string;
  description: string;
  actionButtons: {
    viewChart: string;
    editData: string;
  };
  quickInsights: {
    title: string;
    items: string[];
    backgroundColor: string;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
    details: string;
  }>;
}

export const natalChartSectionConfig: NatalChartSectionConfig = {
  title: '⭐ Your Cosmic Blueprint Revealed',
  description: 'A natal chart is a snapshot of the sky at the exact moment you were born. It reveals your personality traits, strengths, challenges, and life path through the positions of planets and stars.',
  actionButtons: {
    viewChart: 'View Full Chart',
    editData: 'Edit Data'
  },
  quickInsights: {
    title: 'Quick Insights',
    items: [
      '✨ Chart generated and cached',
      '🎯 Ready for detailed analysis',
      '💫 Join discussions to learn more'
    ],
    backgroundColor: '#f0e3ff'
  },
  features: [
    {
      icon: '🏠',
      title: 'Houses & Life Areas',
      description: 'Explore 12 life areas including career, relationships, health, and spirituality through astrological houses.',
      details: 'Each house represents a different sphere of life experience, from personal identity (1st house) to career ambitions (10th house) and spiritual growth (12th house).'
    },
    {
      icon: '🔢',
      title: 'Matrix Destiny',
      description: 'Discover your life purpose and karmic patterns through ancient numerological wisdom combined with modern psychology.',
      details: 'Matrix Destiny uses your birth date to reveal your soul\'s mission, energy centers, and personal development path through a unique 22-arcana system based on Tarot symbolism.'
    },
    {
      icon: '🪐',
      title: 'Planetary Positions',
      description: 'Discover where Venus, Mars, Mercury, Jupiter, Saturn, and outer planets were positioned at your birth.',
      details: 'Each planet governs different aspects of life: Mercury (communication), Venus (love), Mars (action), Jupiter (expansion), Saturn (discipline), and more.'
    }
  ]
};