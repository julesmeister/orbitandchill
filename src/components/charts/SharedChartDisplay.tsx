/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useRouter } from 'next/navigation';
import { SharedChart, BirthData } from '@/types/sharedChart';
import { SharedChartService } from '@/services/sharedChartService';
import NatalChartDisplay from './NatalChartDisplay';
import BirthDataSummary from './BirthDataSummary';

interface SharedChartDisplayProps {
  chart: SharedChart;
  onShare: () => void;
  onCreateChart?: () => void;
}

export default function SharedChartDisplay({ 
  chart, 
  onShare, 
  onCreateChart 
}: SharedChartDisplayProps) {
  const router = useRouter();

  const handleCreateChart = () => {
    if (onCreateChart) {
      onCreateChart();
    } else {
      router.push('/');
    }
  };

  // Convert chart data to birth data format
  const birthData: BirthData = SharedChartService.chartToBirthData(chart);
  
  // Parse metadata safely
  const metadata = SharedChartService.parseChartMetadata(chart.metadata);
  
  // Get chart display name
  const chartName = SharedChartService.getChartDisplayName(chart);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
      {/* Main Chart */}
      <div className="lg:col-span-4 border-black lg:border-r">
        <NatalChartDisplay
          svgContent={chart.chartData}
          chartName={chartName}
          birthData={birthData}
          chartData={metadata}
          personName={chart.subjectName}
          personAvatar={undefined}
          onShare={onShare}
        />
      </div>

      {/* Sidebar with Birth Data */}
      <div className="lg:col-span-2 bg-white">
        {/* Birth Data Summary */}
        <BirthDataSummary
          birthData={birthData}
          personName={chart.subjectName}
        />

        {/* Create Your Own Chart CTA */}
        <div className="p-6 border-t border-black">
          <div className="text-center">
            <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
              Create Your Own Chart
            </h3>
            <p className="font-open-sans text-sm text-black/80 mb-6">
              Discover your cosmic blueprint with our free natal chart generator
            </p>
            <button
              onClick={handleCreateChart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}