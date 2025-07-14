/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Image from 'next/image';

interface LevelBadgeProps {
  level: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showProgressDetails?: boolean;
  totalPoints?: number;
  className?: string;
}

const LEVEL_CONFIG = {
  'novice': {
    image: '/levels/Novice.png',
    name: 'Novice',
    description: 'Starting your tarot journey (0-2,499 points)'
  },
  'apprentice': {
    image: '/levels/Apprentice.png',
    name: 'Apprentice',
    description: 'Learning the basics (2,500-9,999 points)'
  },
  'adept': {
    image: '/levels/Adept.png',
    name: 'Adept',
    description: 'Strong foundation (10,000-24,999 points)'
  },
  'master': {
    image: '/levels/Master.png',
    name: 'Master',
    description: 'Advanced practitioner (25,000-49,999 points)'
  },
  'grandmaster': {
    image: '/levels/Grandmaster.png',
    name: 'Grandmaster',
    description: 'True tarot sage (50,000+ points)'
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
  showProgressDetails = false,
  totalPoints = 0,
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

  // Calculate progress details if requested
  const progressPercentage = showProgressDetails ? calculateLevelProgress(totalPoints) : 0;
  const pointsToNext = showProgressDetails ? getPointsToNextLevel(totalPoints) : 0;
  const isMaxLevel = level.toLowerCase() === 'grandmaster';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Progress Details (Left Side) */}
      {showProgressDetails && (
        <div className="text-right">
          <div className="text-sm font-semibold text-black font-space-grotesk">
            {levelConfig.name}
          </div>
          <div className="text-xs text-black/70 font-inter">
            {totalPoints.toLocaleString()} points
          </div>
          {!isMaxLevel && (
            <div className="text-xs text-black/50 font-inter">
              {pointsToNext.toLocaleString()} to next level
            </div>
          )}
          {/* Progress Bar */}
          {!isMaxLevel && (
            <div className="w-20 bg-gray-200 h-1.5 border border-black mt-1 ml-auto">
              <div 
                className="bg-black h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          )}
          {isMaxLevel && (
            <div className="text-xs text-black/50 font-inter">
              Max Level Achieved! 🏆
            </div>
          )}
        </div>
      )}

      {/* Level Badge */}
      <div 
        className={`${sizeConfig.container} relative border-2 border-black bg-white shadow-md flex-shrink-0`}
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

      {/* Label (Right Side) */}
      {showLabel && !showProgressDetails && (
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

// Points-based level calculation with more challenging progression
export function calculateLevel(totalPoints: number): string {
  if (totalPoints >= 50000) return 'grandmaster';
  if (totalPoints >= 25000) return 'master';
  if (totalPoints >= 10000) return 'adept';
  if (totalPoints >= 2500) return 'apprentice';
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

// Calculate progress within current level (returns percentage 0-100)
export function calculateLevelProgress(totalPoints: number): number {
  const levelThresholds = [
    { name: 'novice', min: 0, max: 2499 },
    { name: 'apprentice', min: 2500, max: 9999 },
    { name: 'adept', min: 10000, max: 24999 },
    { name: 'master', min: 25000, max: 49999 },
    { name: 'grandmaster', min: 50000, max: Infinity }
  ];

  const currentLevel = levelThresholds.find(level => 
    totalPoints >= level.min && totalPoints <= level.max
  );

  if (!currentLevel || currentLevel.name === 'grandmaster') {
    return totalPoints >= 50000 ? 100 : 0;
  }

  const pointsInLevel = totalPoints - currentLevel.min;
  const levelRange = currentLevel.max - currentLevel.min + 1;
  return Math.min(100, Math.floor((pointsInLevel / levelRange) * 100));
}

// Get points needed for next level
export function getPointsToNextLevel(totalPoints: number): number {
  if (totalPoints < 2500) return 2500 - totalPoints;
  if (totalPoints < 10000) return 10000 - totalPoints;
  if (totalPoints < 25000) return 25000 - totalPoints;
  if (totalPoints < 50000) return 50000 - totalPoints;
  return 0; // Already grandmaster
}