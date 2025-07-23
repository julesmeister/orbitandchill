/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useChartTab } from '../../store/chartStore';
import NatalChartDisplay from '../charts/NatalChartDisplay';
import InterpretationSidebar from '../charts/InterpretationSidebar';
import {
  formatEventDate,
  generateEventChartName
} from '../../utils/eventUtils';
import {
  createChartShareData,
  generateBirthDataForChart
} from '../../utils/chartGeneration';
import { formatTime12Hour } from '../../utils/timeNavigation';

interface EventChartContainerProps {
  chartData: { svg: string; metadata?: { chartData?: import('../../utils/natalChart').NatalChartData } } | null;
  eventTitle: string;
  eventDate: string;
  selectedTime: string;
  userBirthData: any;
}

export default function EventChartContainer({
  chartData,
  eventTitle,
  eventDate,
  selectedTime,
  userBirthData
}: EventChartContainerProps) {
  const { activeTab } = useChartTab();

  if (!chartData) {
    return (
      <div className="bg-white border border-black p-12">
        <div className="text-center">
          <p className="text-black">Click a time option above to generate the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
      {/* Main Chart */}
      <div className="lg:col-span-4 border-black lg:border-r">
        <NatalChartDisplay
          svgContent={chartData.svg}
          chartName={generateEventChartName(eventTitle, eventDate, selectedTime)}
          birthData={generateBirthDataForChart(eventDate, selectedTime, userBirthData)}
          chartData={chartData.metadata?.chartData}
          onShare={() => {
            const shareData = createChartShareData(eventTitle, eventDate);
            navigator.share?.(shareData);
          }}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2 bg-white">
        {/* Event Info */}
        <div className="p-6 border-b border-black">
          <h4 className="font-space-grotesk text-lg font-bold text-black mb-3">
            Event Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="font-open-sans text-black">
                {formatEventDate(eventDate)} at {formatTime12Hour(selectedTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Interpretation Sidebar - Only show when interpretation tab is active */}
        {activeTab === 'interpretation' && (
          <InterpretationSidebar
            onSectionClick={(sectionId) => {
              // Scroll to section or handle section navigation
              const element = document.getElementById(`section-${sectionId}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="border-t border-black"
          />
        )}
      </div>
    </div>
  );
}