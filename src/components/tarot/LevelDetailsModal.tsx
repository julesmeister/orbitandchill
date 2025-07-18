/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { calculateLevelProgress, getPointsToNextLevel } from './LevelBadge';

interface LevelDetailsModalProps {
  level: string;
  totalPoints: number;
  onClose: () => void;
}

const LEVEL_CONFIG = {
  'novice': {
    name: 'Novice',
    description: 'Starting your tarot journey (0-2,499 points)'
  },
  'apprentice': {
    name: 'Apprentice',
    description: 'Learning the basics (2,500-9,999 points)'
  },
  'adept': {
    name: 'Adept',
    description: 'Strong foundation (10,000-24,999 points)'
  },
  'master': {
    name: 'Master',
    description: 'Advanced practitioner (25,000-49,999 points)'
  },
  'grandmaster': {
    name: 'Grandmaster',
    description: 'True tarot sage (50,000+ points)'
  },
  // Legacy support for old naming
  'intermediate': {
    name: 'Adept',
    description: 'Strong foundation'
  },
  'advanced': {
    name: 'Adept',
    description: 'Strong foundation'
  },
  'expert': {
    name: 'Master',
    description: 'Advanced practitioner'
  }
};

export default function LevelDetailsModal({ level, totalPoints, onClose }: LevelDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const normalizedLevel = level.toLowerCase();
  const levelConfig = LEVEL_CONFIG[normalizedLevel as keyof typeof LEVEL_CONFIG];
  const progressPercentage = calculateLevelProgress(totalPoints);
  const pointsToNext = getPointsToNextLevel(totalPoints);
  const isMaxLevel = normalizedLevel === 'grandmaster';

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };

  // Get all level thresholds for progression display
  const levelThresholds = [
    { name: 'Novice', min: 0, max: 2499, level: 'novice' },
    { name: 'Apprentice', min: 2500, max: 9999, level: 'apprentice' },
    { name: 'Adept', min: 10000, max: 24999, level: 'adept' },
    { name: 'Master', min: 25000, max: 49999, level: 'master' },
    { name: 'Grandmaster', min: 50000, max: Infinity, level: 'grandmaster' }
  ];

  if (!levelConfig) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Bottom Sheet Container */}
      <div className={`fixed bottom-0 right-0 w-full max-w-md bg-white border-2 border-black shadow-lg pointer-events-auto transform transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-black bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk font-bold text-black text-xl">
                {levelConfig.name} Level
              </h2>
              <p className="text-sm text-black/70 font-inter">
                Your tarot mastery progression
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 border border-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Level Stats */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-0 border border-black">
              <div className="p-4 border-r border-black bg-white">
                <div className="text-sm font-inter text-black/60 mb-1">Total Points</div>
                <div className="font-space-grotesk font-bold text-black text-2xl">
                  {totalPoints.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-sm font-inter text-black/60 mb-1">
                  {isMaxLevel ? 'Max Level' : 'Points to Next'}
                </div>
                <div className="font-space-grotesk font-bold text-black text-2xl">
                  {isMaxLevel ? '🏆' : pointsToNext.toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            {!isMaxLevel && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-inter text-black/60">Progress to Next Level</span>
                  <span className="text-sm font-space-grotesk font-bold text-black">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-3 border border-black">
                  <div 
                    className="bg-black h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Level Progression */}
          <div className="mb-6">
            <h3 className="font-space-grotesk font-bold text-black mb-4 text-lg">
              Level Progression
            </h3>
            <div className="space-y-3">
              {levelThresholds.map((threshold) => {
                const isCurrentLevel = normalizedLevel === threshold.level;
                const isCompleted = totalPoints >= threshold.min;
                const isLocked = totalPoints < threshold.min;
                
                return (
                  <div 
                    key={threshold.level}
                    className={`flex items-center gap-4 p-3 border border-black transition-all duration-300 ${
                      isCurrentLevel 
                        ? 'bg-black text-white' 
                        : isCompleted 
                          ? 'bg-green-100 text-black' 
                          : 'bg-gray-100 text-black/50'
                    }`}
                  >
                    {/* Level Icon */}
                    <div className="w-10 h-10 flex items-center justify-center">
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Level Details */}
                    <div className="flex-1">
                      <div className="font-space-grotesk font-bold text-base">
                        {threshold.name}
                      </div>
                      <div className="text-sm font-inter opacity-80">
                        {threshold.max === Infinity 
                          ? `${threshold.min.toLocaleString()}+ points`
                          : `${threshold.min.toLocaleString()} - ${threshold.max.toLocaleString()} points`
                        }
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    {isCurrentLevel && !isMaxLevel && (
                      <div className="text-sm font-inter font-bold">
                        {((totalPoints - threshold.min) / (threshold.max - threshold.min) * 100).toFixed(0)}%
                      </div>
                    )}
                    
                    {isCurrentLevel && (
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Level Description */}
          <div className="p-4 bg-gray-50 border border-black">
            <h4 className="font-space-grotesk font-bold text-black mb-2">
              About {levelConfig.name}
            </h4>
            <p className="text-sm font-inter text-black/80 leading-relaxed">
              {levelConfig.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-space-grotesk font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}