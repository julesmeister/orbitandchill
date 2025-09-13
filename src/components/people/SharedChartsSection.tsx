/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { SharedChart } from '@/types/people';

interface SharedChartsSectionProps {
  sharedCharts: SharedChart[];
  onSharedChartSelect: (chart: SharedChart) => void;
}

const SharedChartsSection: React.FC<SharedChartsSectionProps> = ({
  sharedCharts,
  onSharedChartSelect
}) => {
  if (sharedCharts.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200">
      <div className="bg-purple-50 px-3 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="text-sm font-medium text-purple-800">Shared Charts</span>
        </div>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {sharedCharts.slice(0, 5).map((chart, index) => (
          <div
            key={chart.shareToken || `chart-${index}`}
            onClick={() => onSharedChartSelect(chart)}
            className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{chart.subjectName}</div>
              <div className="text-sm text-gray-500 truncate">
                Born {new Date(chart.dateOfBirth).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedChartsSection;