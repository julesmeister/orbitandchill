/* eslint-disable @typescript-eslint/no-unused-vars */

import NatalChartDisplay from './NatalChartDisplay';
import ChartQuickActions from './ChartQuickActions';
import BirthDataSummary from './BirthDataSummary';
import InterpretationSidebar from './InterpretationSidebar';

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
        {activeTab === 'interpretation' && cachedChart?.metadata?.chartData && (
          <div className="border-t border-black p-4 max-h-96 overflow-y-auto">
            <h4 className="font-bold mb-3">Chart Interpretation</h4>
            
            {/* Quick interpretation preview */}
            <div className="space-y-3 text-sm">
              {cachedChart.metadata.chartData.planets && (
                <div>
                  <h5 className="font-semibold">Planetary Positions</h5>
                  <p className="text-gray-600">
                    {cachedChart.metadata.chartData.planets.length} planets calculated
                  </p>
                </div>
              )}
              
              {cachedChart.metadata.chartData.houses && (
                <div>
                  <h5 className="font-semibold">Houses</h5>
                  <p className="text-gray-600">
                    {cachedChart.metadata.chartData.houses.length} houses calculated
                  </p>
                </div>
              )}
              
              {cachedChart.metadata.chartData.aspects && (
                <div>
                  <h5 className="font-semibold">Aspects</h5>
                  <p className="text-gray-600">
                    {cachedChart.metadata.chartData.aspects.length} aspects found
                  </p>
                </div>
              )}
              
              <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
                <p>Full interpretations will be displayed here. Chart data is available and ready for detailed analysis.</p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}