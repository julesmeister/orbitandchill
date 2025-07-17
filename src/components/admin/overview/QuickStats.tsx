/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface QuickStatsProps {
  avgChartsPerUser?: string;
  totalPageViews: number;
  conversionRate?: string;
  peakActivityTime?: string;
  topLocation?: string;
  avgSessionDuration?: string;
}

export default function QuickStats({ 
  avgChartsPerUser, 
  totalPageViews, 
  conversionRate, 
  peakActivityTime, 
  topLocation, 
  avgSessionDuration 
}: QuickStatsProps) {
  const stats = [
    avgChartsPerUser && { 
      label: 'Average Charts per User', 
      value: avgChartsPerUser, 
      color: '#6bdbff' 
    },
    peakActivityTime && { 
      label: 'Peak Activity Time', 
      value: peakActivityTime, 
      color: '#51bd94' 
    },
    topLocation && { 
      label: 'Top Location', 
      value: topLocation, 
      color: '#ff91e9' 
    },
    avgSessionDuration && { 
      label: 'Avg. Session Duration', 
      value: avgSessionDuration, 
      color: '#f2e356' 
    }
  ].filter(Boolean) as { label: string; value: string; color: string; }[];

  return (
    <div className="bg-white border border-black p-4 sm:p-6 lg:p-8">
      <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-4 sm:mb-6">
        Quick Stats
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 sm:p-4 border border-black" 
            style={{ backgroundColor: stat.color }}
          >
            <span className="font-open-sans text-xs sm:text-sm font-medium text-black">{stat.label}</span>
            <span className="font-open-sans text-xs sm:text-sm font-bold text-black">{stat.value}</span>
          </div>
        ))}
      </div>
      
      {(totalPageViews > 0 || conversionRate) && (
        <div className="mt-4 pt-3 border-t border-black/20">
          <div className={conversionRate ? "grid grid-cols-2 gap-3 text-center" : "text-center"}>
            {totalPageViews > 0 && (
              <div>
                <div className="font-space-grotesk text-lg font-bold text-black">
                  {totalPageViews.toLocaleString()}
                </div>
                <div className="font-open-sans text-xs text-black/60">Page Views</div>
              </div>
            )}
            {conversionRate && (
              <div>
                <div className="font-space-grotesk text-lg font-bold text-black">
                  {conversionRate}
                </div>
                <div className="font-open-sans text-xs text-black/60">Chart Conversion</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}