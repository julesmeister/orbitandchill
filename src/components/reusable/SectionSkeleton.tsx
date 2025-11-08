/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface SectionSkeletonProps {
  /**
   * Section title to display while loading
   */
  title?: string;

  /**
   * Minimum height of the skeleton
   */
  minHeight?: string;

  /**
   * Background color gradient
   */
  bgGradient?: string;

  /**
   * Text color
   */
  textColor?: string;
}

/**
 * Skeleton placeholder for progressively loaded sections
 * Provides visual feedback that content is loading
 */
const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  title = 'Loading...',
  minHeight = '24rem',
  bgGradient = 'from-gray-50 to-gray-100',
  textColor = 'text-gray-400'
}) => {
  return (
    <div
      className={`bg-gradient-to-b ${bgGradient} flex items-center justify-center ${textColor}`}
      style={{ minHeight }}
    >
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
        </div>
        <div className="text-lg font-medium animate-pulse">{title}</div>
      </div>
    </div>
  );
};

export default SectionSkeleton;
