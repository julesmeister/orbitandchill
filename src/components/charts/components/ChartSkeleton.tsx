/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react';

interface ChartSkeletonProps {
  showPeopleSelector?: boolean;
  showActionButtons?: boolean;
  variant?: 'full' | 'chart' | 'interpretation' | 'section' | 'minimal';
}

const ChartSkeleton = memo(function ChartSkeleton({ 
  showPeopleSelector = true, 
  showActionButtons = true,
  variant = 'full'
}: ChartSkeletonProps) {
  // Minimal skeleton for quick loads
  if (variant === 'minimal') {
    return (
      <div className="chart-skeleton-minimal animate-pulse">
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    );
  }

  // Section skeleton for individual chart sections
  if (variant === 'section') {
    return (
      <div className="chart-skeleton-section">
        <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  // Interpretation skeleton for analysis sections
  if (variant === 'interpretation') {
    return (
      <div className="chart-skeleton-interpretation">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chart-only skeleton
  if (variant === 'chart') {
    return (
      <div className="chart-skeleton-chart">
        <div className="w-full max-w-2xl mx-auto animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Full skeleton (default)
  return (
    <div className="bg-white overflow-visible animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>

      {/* Primary Action Skeleton */}
      <div className="border-b border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-36 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-56"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      {showActionButtons && (
        <div className="grid grid-cols-3 gap-0 border-b border-gray-200">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 border-r border-gray-200 last:border-r-0">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* People Selector Skeleton */}
      {showPeopleSelector && (
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';

export default ChartSkeleton;