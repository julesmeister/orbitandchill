/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ChartHistoryItem {
  id: string;
  createdAt: string;
  metadata?: { title?: string };
}

interface ChartHistoryProps {
  charts: ChartHistoryItem[];
  onDeleteChart: (chartId: string) => void;
  onViewChart?: (chartId: string) => void;
}

export default function ChartHistory({ charts, onDeleteChart, onViewChart }: ChartHistoryProps) {
  return (
    <div className="bg-white border-black border-t">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-space-grotesk text-lg font-bold text-black">Chart History</h3>
          <span
            className="px-3 py-1.5 text-xs font-semibold text-black border border-black"
            style={{ backgroundColor: '#f2e356' }}
          >
            {charts.length} chart{charts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Chart List */}
        <div className="divide-y divide-black">
          {charts.slice(0, 5).map((chart, index) => (
            <div key={chart.id} className="group py-4 transition-all duration-200 relative">
              {/* Hover accent bar */}
              <div
                className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                style={{ backgroundColor: '#19181a' }}
              ></div>

              <div className="flex items-center justify-between ml-3">
                <div className="flex-1 min-w-0">
                  <div className="font-open-sans text-sm font-semibold text-black mb-1">
                    {chart.metadata?.title || 'Natal Chart'}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-black/60">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(chart.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(chart.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onViewChart?.(chart.id)}
                    className="p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteChart(chart.id)}
                    className="p-2 border border-black bg-white text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {charts.length > 5 && (
          <div className="pt-4 border-t border-black mt-4">
            <button className="w-full py-3 text-black font-semibold border border-black hover:bg-black hover:text-white transition-all duration-200">
              View all {charts.length} charts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}