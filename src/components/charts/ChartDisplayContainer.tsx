/* eslint-disable @typescript-eslint/no-unused-vars */

import NatalChartDisplay from './NatalChartDisplay';
import ChartQuickActions from './ChartQuickActions';
import BirthDataSummary from './BirthDataSummary';
import InterpretationSidebar from './InterpretationSidebar';
import SocialShareButtons from '@/components/social/SocialShareButtons';

interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string; };
}

interface CachedChart {
  id: string;
  svg: string;
  metadata?: {
    name?: string;
    chartData?: any;
  };
}

interface PersonToShow {
  name: string;
}

interface ChartDisplayContainerProps {
  cachedChart: CachedChart;
  personToShow: PersonToShow | null;
  birthDataToShow: BirthData | null;
  chartSubjectAvatar: string;
  activeTab: string;
  isGenerating: boolean;
  onRegenerateChart: () => void;
  onPersonChange: (person: any) => void;
  onAddPersonClick: () => void;
  onClearCache: () => void;
  onShare: () => void;
}

/**
 * Container component for chart display with main chart and sidebar
 */
export default function ChartDisplayContainer({
  cachedChart,
  personToShow,
  birthDataToShow,
  chartSubjectAvatar,
  activeTab,
  isGenerating,
  onRegenerateChart,
  onPersonChange,
  onAddPersonClick,
  onClearCache,
  onShare
}: ChartDisplayContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
      {/* Main Chart */}
      <div className="lg:col-span-4 border-black lg:border-r">
        <NatalChartDisplay
          svgContent={cachedChart.svg}
          chartName={
            cachedChart.metadata?.name ||
            personToShow?.name ||
            "Natal Chart"
          }
          birthData={
            birthDataToShow ||
            {
              dateOfBirth: "",
              timeOfBirth: "",
              locationOfBirth: "",
              coordinates: { lat: "", lon: "" }
            }
          }
          chartData={cachedChart.metadata?.chartData}
          personName={cachedChart.metadata?.name || personToShow?.name}
          personAvatar={chartSubjectAvatar}
          onShare={onShare}
        />
      </div>

      {/* Sidebar with Actions */}
      <div className="lg:col-span-2 bg-white">
        {/* Quick Actions */}
        <ChartQuickActions
          onRegenerateChart={onRegenerateChart}
          isGenerating={isGenerating}
          onPersonChange={onPersonChange}
          onAddPersonClick={onAddPersonClick}
          onClearCache={onClearCache}
          chartId={cachedChart?.id}
        />

        {/* Birth Data Summary */}
        {birthDataToShow && (
          <BirthDataSummary
            birthData={birthDataToShow}
            personName={cachedChart?.metadata?.name || personToShow?.name}
          />
        )}

        {/* Interpretation Sidebar - Show when interpretation tab is active */}
        {activeTab === 'interpretation' && (
          <div className="border-t border-black">
            <InterpretationSidebar
              onSectionClick={(sectionId) => {
                // Scroll to section or handle section navigation
                const element = document.getElementById(`section-${sectionId}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          </div>
        )}
        
        {/* Social Share Buttons */}
        <div className="p-4 border-t border-black">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Share Your Chart</h3>
          <SocialShareButtons 
            title={`Check out my natal chart for ${personToShow?.name || 'my cosmic blueprint'}`}
            description="Generated with free astrology tools at Orbit and Chill"
            variant="horizontal"
          />
        </div>
      </div>
    </div>
  );
}