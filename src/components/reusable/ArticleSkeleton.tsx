/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ArticleSkeletonProps {
  showImage?: boolean;
  className?: string;
  count?: number;
}

const ArticleSkeleton: React.FC<ArticleSkeletonProps> = React.memo(({ 
  showImage = true, 
  className = '', 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className={`border border-black bg-white animate-pulse ${className}`}
        >
          <div className="p-4 xl:p-5 2xl:p-8">
            <div className="flex items-start gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  {/* Excerpt skeleton */}
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  {/* Author skeleton */}
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              {/* Image skeleton */}
              {showImage && (
                <div className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gray-300 flex-shrink-0"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

ArticleSkeleton.displayName = 'ArticleSkeleton';

export default ArticleSkeleton;