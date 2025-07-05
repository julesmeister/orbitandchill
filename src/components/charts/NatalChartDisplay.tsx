/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense } from 'react';
import NextImage from 'next/image';
import { useUserStore } from '../../store/userStore';
import { useChartTab } from '../../store/chartStore';
import { usePDFGeneration } from '../../hooks/usePDFGeneration';
import ChartTabs from './ChartTabs';
import ChartInterpretation from './ChartInterpretation';
import ChartActions from './ChartActions';
import UnifiedAstrologicalChart from './UnifiedAstrologicalChart';
import TransitAspectsTab from './TransitAspectsTab';

const MatrixOfDestiny = lazy(() => import('./MatrixOfDestiny'));

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
  const { generateChartPDF, isGenerating: isPDFGenerating } = usePDFGeneration();
  
  // Stabilize data references to prevent unnecessary remounts
  const stableBirthData = React.useMemo(() => birthData, [
    birthData?.dateOfBirth,
    birthData?.timeOfBirth, 
    birthData?.locationOfBirth,
    birthData?.coordinates?.lat,
    birthData?.coordinates?.lon
  ]);
  
  const stableChartData = React.useMemo(() => chartData, [
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
            {(personAvatar || user?.profilePictureUrl) ? (
              <NextImage
                src={personAvatar || user?.profilePictureUrl || ''}
                alt={`${personName || user?.username}'s avatar`}
                width={32}
                height={32}
                className="w-8 h-8 mr-3 border-2 border-black"
              />
            ) : (
              <div className="w-8 h-8 mr-3 bg-black flex items-center justify-center text-white font-bold text-sm border-2 border-black">
                {(personName || user?.username)?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
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
                // Chart View with Unified Astrological Chart
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
              );
            } else if (activeTab === 'interpretation') {
              return (
                // Interpretation View
                <div>
                  <ChartInterpretation 
                    key="interpretation-stable" // Stable key
                    birthData={stableBirthData} 
                    chartData={stableChartData} 
                  />
                </div>
              );
            } else if (activeTab === 'transits') {
              return (
                // Transit Effects View
                <div>
                  <TransitAspectsTab chartData={stableChartData} />
                </div>
              );
            } else if (activeTab === 'matrix-destiny') {
              return (
                // Matrix of Destiny View - Use event data for event charts
                <div>
                  {stableBirthData ? (
                    <Suspense fallback={<MatrixLoadingSkeleton />}>
                      <MatrixOfDestiny 
                        birthData={stableBirthData} 
                        personName={personName}
                      />
                    </Suspense>
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