/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense } from 'react';
import NextImage from 'next/image';
import { useUserStore } from '../../store/userStore';
import { useChartTab, useChartPreferences } from '../../store/chartStore';
import { usePDFGeneration } from '../../hooks/usePDFGeneration';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';
import ChartTabs from './ChartTabs';
import ChartActions from './ChartActions';
import { ComponentErrorBoundary } from '../ErrorBoundary';

// TEMPORARILY DISABLED LAZY LOADING TO FIX CHUNK ERROR
// const ChartInterpretation = lazy(() => import('../../app/chart/components/modules/ChartInterpretation'));
import ChartInterpretation from '../../app/chart/components/modules/ChartInterpretation';
import UnifiedAstrologicalChart from './UnifiedAstrologicalChart';
import TransitAspectsTab from './TransitAspectsTab';

const MatrixOfDestiny = lazy(() =>
  import('./MatrixOfDestiny').catch((err) => {
    console.error('Failed to load MatrixOfDestiny chunk:', err);
    // Return a fallback component
    return {
      default: () => (
        <div className="p-8 bg-white border border-red-500">
          <p className="text-red-600">Failed to load Matrix of Destiny. Please refresh the page.</p>
        </div>
      )
    };
  })
);

// Loading skeleton for Matrix of Destiny
const MatrixLoadingSkeleton = () => (
  <div className="p-8 bg-white">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="aspect-square bg-gray-200 rounded-lg mb-6 max-w-md mx-auto"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

interface NatalChartDisplayProps {
  svgContent: string;
  chartName?: string;
  birthData?: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates?: { lat: string; lon: string };
  };
  chartData?: import('../../utils/natalChart').NatalChartData;
  personName?: string;
  personAvatar?: string;
  onDownload?: () => void;
  onShare?: () => void;
  isSharedView?: boolean;
}

const NatalChartDisplay: React.FC<NatalChartDisplayProps> = ({
  svgContent,
  chartName = 'Natal Chart',
  birthData,
  chartData,
  personName,
  personAvatar,
  onDownload,
  onShare,
  isSharedView = false
}) => {
  const { user } = useUserStore();
  const { activeTab, setActiveTab } = useChartTab();
  const { chartPreferences, updateChartPreferences } = useChartPreferences();
  const { generateChartPDF, isGenerating: isPDFGenerating } = usePDFGeneration();
  
  // Stabilize data references to prevent unnecessary remounts
  const stableBirthData = React.useMemo(() => birthData, [
    birthData?.dateOfBirth,
    birthData?.timeOfBirth, 
    birthData?.locationOfBirth,
    birthData?.coordinates?.lat,
    birthData?.coordinates?.lon
  ]);
  
  const stableChartData = React.useMemo(() => {
    // FIXED: Chart data structure - chartData IS the chart data, no double nesting
    if (!chartData?.planets) {
      return null;
    }

    return chartData;
  }, [
    (chartData as any)?.id,
    JSON.stringify(chartData?.planets || []),
    JSON.stringify(chartData?.houses || [])
  ]);
  

  // Only set interpretation tab on initial load in development, not on every tab change
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && activeTab === 'chart' && !chartData) {
      setActiveTab('interpretation');
    }
  }, [chartData, setActiveTab]);
  const handleDownloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartName.replace(/\s+/g, '_')}_natal_chart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onDownload) onDownload();
  };

  const handleDownloadPNG = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 800;

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${chartName.replace(/\s+/g, '_')}_natal_chart.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };

      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;
    } catch (error) {
      // Error downloading PNG
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const result = await generateChartPDF(chartName, personName || user?.username);
      
      if (!result.success) {
        alert(`Failed to generate PDF: ${result.error}`);
      }
      
      if (onDownload) onDownload();
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div 
      id={`natal-chart-display-${Date.now()}`}
      data-chart-container
      className="bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="relative p-8 overflow-hidden" style={{ backgroundColor: '#ff91e9' }}>
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 mr-3 rounded-full overflow-hidden border-2 border-black bg-white">
              <NextImage
                src={personAvatar || user?.preferredAvatar || user?.profilePictureUrl || getAvatarByIdentifier(personName || user?.username || 'Anonymous')}
                alt={`${personName || user?.username}'s avatar`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-space-grotesk text-2xl font-bold text-black">
              {chartName}
            </h3>
          </div>

          {birthData && (
            <div className="bg-black text-white p-4 border border-black mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-open-sans text-sm font-medium">
                  Born: {new Date(birthData.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {birthData.timeOfBirth}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="font-open-sans text-sm">Location: {birthData.locationOfBirth}</span>
              </div>
            </div>
          )}

          <ChartTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content Display */}
      <div className="border-t border-black">
        <div className="p-6">
          {(() => {
            if (activeTab === 'chart') {
              return (
                <>
                  {/* Chart View Controls */}
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={() => updateChartPreferences({
                        showCelestialPointAspects: !chartPreferences.showCelestialPointAspects
                      })}
                      className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-medium transition-colors ${
                        chartPreferences.showCelestialPointAspects
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {chartPreferences.showCelestialPointAspects ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        )}
                      </svg>
                      <span className="text-sm">
                        {chartPreferences.showCelestialPointAspects ? 'Hide' : 'Show'} Celestial Point Aspects
                      </span>
                    </button>
                  </div>

                  {/* Chart View with Unified Astrological Chart */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="p-2 bg-transparent w-full max-w-none"
                      style={{
                        maxHeight: '90vh',
                      }}
                    >
                      {stableChartData ? (
                        <UnifiedAstrologicalChart
                          chartData={stableChartData}
                          chartType="natal"
                          showPlanetInfo={true}
                          showAspects={true}
                          showCelestialPointAspects={chartPreferences.showCelestialPointAspects}
                          showAngularMarkers={true}
                          showPlanetCircles={false}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-96 text-gray-500">
                          <p>Chart data not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            } else if (activeTab === 'interpretation') {
              return (
                // Interpretation View with Section Controls
                <div>
                  <Suspense fallback={
                    <div className="p-8 bg-white">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  }>
                    <ChartInterpretation chartData={stableChartData} />
                  </Suspense>
                </div>
              );
            } else if (activeTab === 'transits') {
              return (
                // Transit Effects View
                <div>
                  <TransitAspectsTab chartData={stableChartData || undefined} />
                </div>
              );
            } else if (activeTab === 'matrix-destiny') {
              return (
                // Matrix of Destiny View - Use event data for event charts
                <div>
                  {stableBirthData ? (
                    <ComponentErrorBoundary componentName="Matrix of Destiny">
                      <Suspense fallback={<MatrixLoadingSkeleton />}>
                        <MatrixOfDestiny
                          birthData={stableBirthData}
                          personName={personName}
                        />
                      </Suspense>
                    </ComponentErrorBoundary>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">Birth data is required for Matrix of Destiny calculation.</p>
                    </div>
                  )}
                </div>
              );
            }
          })()}
          

          {/* Export & Share section commented out as requested */}
          {/* <ChartActions
            onDownloadSVG={handleDownloadSVG}
            onDownloadPNG={handleDownloadPNG}
            onDownloadPDF={handleDownloadPDF}
            onShare={onShare}
            isPDFGenerating={isPDFGenerating}
          /> */}
        </div>

        {/* Chart Info */}
        <div className="px-6 py-4 border-t border-black" style={{ backgroundColor: '#f2e356' }}>
          <div className="flex items-center text-sm text-black">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-open-sans">Generated using astronomy-engine for professional-grade accuracy (±1 arcminute)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartDisplay;