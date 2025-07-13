/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Image from 'next/image';

interface LevelBadgeProps {
  level: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

const LEVEL_CONFIG = {
  'novice': {
    image: '/levels/Novice.png',
    name: 'Novice',
    description: 'Starting your tarot journey (0-999 points)'
  },
  'apprentice': {
    image: '/levels/Apprentice.png',
    name: 'Apprentice',
    description: 'Learning the basics (1,000-4,999 points)'
  },
  'adept': {
    image: '/levels/Adept.png',
    name: 'Adept',
    description: 'Strong foundation (5,000-9,999 points)'
  },
  'master': {
    image: '/levels/Master.png',
    name: 'Master',
    description: 'Advanced practitioner (10,000-24,999 points)'
  },
  'grandmaster': {
    image: '/levels/Grandmaster.png',
    name: 'Grandmaster',
    description: 'True tarot sage (25,000+ points)'
  },
  // Legacy support for old naming
  'intermediate': {
    image: '/levels/Adept.png',
    name: 'Adept',
    description: 'Strong foundation'
  },
  'advanced': {
    image: '/levels/Adept.png',
    name: 'Adept',
    description: 'Strong foundation'
  },
  'expert': {
    image: '/levels/Master.png',
    name: 'Master',
    description: 'Advanced practitioner'
  }
};

const SIZE_CONFIGS = {
  small: {
    container: 'w-10 h-14',  // Tarot card ratio (roughly 2:3)
    image: 'w-8 h-12',
    text: 'text-xs'
  },
  medium: {
    container: 'w-12 h-18',  // Tarot card ratio
    image: 'w-10 h-16',
    text: 'text-sm'
  },
  large: {
    container: 'w-16 h-24',  // Tarot card ratio
    image: 'w-14 h-22',
    text: 'text-base'
  }
};

export default function LevelBadge({ 
  level, 
  size = 'medium', 
  showLabel = true, 
  className = '' 
}: LevelBadgeProps) {
  const normalizedLevel = level.toLowerCase();
  const levelConfig = LEVEL_CONFIG[normalizedLevel as keyof typeof LEVEL_CONFIG];
  const sizeConfig = SIZE_CONFIGS[size];

  if (!levelConfig) {
    // Fallback for unknown levels
    return (
      <div className={`${sizeConfig.container} bg-gray-200 flex items-center justify-center border-2 border-black ${className}`}>
        <span className={`${sizeConfig.text} font-bold text-gray-600`}>?</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`${sizeConfig.container} relative border-2 border-black bg-white shadow-md`}
        title={`${levelConfig.name} - ${levelConfig.description}`}
        style={{ aspectRatio: '2/3' }} // Tarot card proportions
      >
        {/* Image fills the entire card since it already contains the level text */}
        <Image
          src={levelConfig.image}
          alt={`${levelConfig.name} level badge`}
          fill
          className="object-cover"
          sizes={sizeConfig.image}
        />
      </div>
      {showLabel && (
        <span className={`${sizeConfig.text} font-semibold text-black ml-1`}>
          {levelConfig.name}
        </span>
      )}
    </div>
  );
}

// Utility function to get level info without rendering
export function getLevelInfo(level: string) {
  const normalizedLevel = level.toLowerCase();
  return LEVEL_CONFIG[normalizedLevel as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.novice;
}

// Points-based level calculation (matches tarot.md specification)
export function calculateLevel(totalPoints: number): string {
  if (totalPoints >= 25000) return 'grandmaster';
  if (totalPoints >= 10000) return 'master';
  if (totalPoints >= 5000) return 'adept';
  if (totalPoints >= 1000) return 'apprentice';
  return 'novice';
}

// Legacy accuracy-based calculation (for backwards compatibility)
export function calculateLevelByAccuracy(accuracy: number): string {
  if (accuracy >= 90) return 'grandmaster';
  if (accuracy >= 80) return 'master';
  if (accuracy >= 70) return 'adept';
  if (accuracy >= 50) return 'apprentice';
  return 'novice';
}