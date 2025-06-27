/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface QuickStatsProps {
  avgChartsPerUser: string;
  totalPageViews: number;
  conversionRate: string;
}

export default function QuickStats({ avgChartsPerUser, totalPageViews, conversionRate }: QuickStatsProps) {
  const stats = [
    { 
      label: 'Average Charts per User', 
      value: avgChartsPerUser, 
      color: '#6bdbff' 
    },
    { 
      label: 'Peak Activity Time', 
      value: 'N/A', 
      color: '#51bd94' 
    },
    { 
      label: 'Top Location', 
      value: 'N/A', 
      color: '#ff91e9' 
    },
    { 
      label: 'Avg. Session Duration', 
      value: '0m 0s', 
      color: '#f2e356' 
    }
  ];

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
            <span className="font-inter text-xs sm:text-sm font-medium text-black">{stat.label}</span>
            <span className="font-inter text-xs sm:text-sm font-bold text-black">{stat.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-black/20">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {totalPageViews.toLocaleString()}
            </div>
            <div className="font-inter text-xs text-black/60">Page Views</div>
          </div>
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {conversionRate}
            </div>
            <div className="font-inter text-xs text-black/60">Chart Conversion</div>
          </div>
        </div>
      </div>
    </div>
  );
}