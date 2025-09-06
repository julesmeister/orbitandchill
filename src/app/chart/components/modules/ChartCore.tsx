/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { memo, useCallback, useMemo } from "react";
import { useChartCore } from "@/hooks/chart-core/useChartCore";
import ChartDisplay from "@/components/charts/ChartDisplayContainer";
import ChartQuickActions from "@/components/charts/ChartQuickActions";
import StatusToast from "@/components/reusable/StatusToast";

interface ChartCoreProps {
  initialData?: any;
}

/**
 * Core chart display module - loads first for optimal LCP
 * Contains essential chart rendering and basic interactions
 */
const ChartCore = memo(function ChartCore({ initialData }: ChartCoreProps) {
  const {
    cachedChart,
    personToShow,
    birthDataToShow,
    isLoading,
    isGenerating,
    statusToast,
    chartSubjectAvatar,
    handlePersonChange,
    handleRegenerateChart,
    hideStatus,
  } = useChartCore(initialData);

  // Convert cachedChart to expected format
  const displayChart = useMemo(() => {
    if (!cachedChart) return null;
    
    // If cachedChart already has the correct structure, use it directly
    if (cachedChart.svg && cachedChart.metadata) {
      return cachedChart;
    }
    
    // Otherwise, create the expected structure
    return {
      id: cachedChart.id || 'temp-chart',
      svg: cachedChart.svg || 'placeholder',
      metadata: {
        name: personToShow?.name || cachedChart.metadata?.name || 'Chart',
        chartData: cachedChart,
        ...cachedChart.metadata
      }
    };
  }, [cachedChart, personToShow]);

  // Memoize chart props to prevent unnecessary re-renders
  const chartProps = useMemo(() => ({
    cachedChart: displayChart,
    personToShow,
    birthDataToShow,
    chartSubjectAvatar,
    isLoading,
    isGenerating,
  }), [displayChart, personToShow, birthDataToShow, chartSubjectAvatar, isLoading, isGenerating]);

  const handlePersonChangeCallback = useCallback((person: any) => {
    handlePersonChange(person);
  }, [handlePersonChange]);

  const handleRegenerateCallback = useCallback(() => {
    handleRegenerateChart();
  }, [handleRegenerateChart]);

  return (
    <div className="chart-core-module w-full">
      {/* Chart Display - Critical above-fold content */}
      <div className="chart-display-section mb-8 w-full">
        {/* Debug info */}
        <div className="bg-yellow-100 p-4 mb-4 text-sm">
          <p>Debug: displayChart exists: {displayChart ? 'YES' : 'NO'}</p>
          <p>Debug: displayChart.svg exists: {displayChart?.svg ? 'YES' : 'NO'}</p>
          <p>Debug: cachedChart exists: {cachedChart ? 'YES' : 'NO'}</p>
        </div>
        
        {displayChart && displayChart.svg ? (
          <ChartDisplay
            cachedChart={displayChart}
            personToShow={personToShow}
            birthDataToShow={birthDataToShow}
            chartSubjectAvatar={chartSubjectAvatar}
            isGenerating={isGenerating}
            activeTab="interpretation" // Show interpretation in sidebar
            onPersonChange={handlePersonChangeCallback}
            onRegenerateChart={handleRegenerateCallback}
            onAddPersonClick={() => console.log('Add person clicked')}
            onClearCache={() => console.log('Clear cache clicked')}
            onShare={() => console.log('Share clicked')}
          />
        ) : (
          // Force render layout even without chart for testing
          <div className="border-4 border-purple-500 bg-white w-full min-h-[600px]" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0px', minWidth: '800px'}}>
            <div className="border-black border-r bg-blue-50 p-8">
              <p className="text-gray-500">
                {isLoading ? 'Loading chart...' : 'Generate a chart to view'}
              </p>
            </div>
            <div className="bg-red-50 p-4">
              <h4>Sidebar Test</h4>
              <p>This is the sidebar area</p>
              <div className="bg-green-200 p-2 mt-4">Quick Actions would go here</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions removed - they're already in the ChartDisplayContainer sidebar */}

      {/* Status Toast for user feedback */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
        duration={statusToast.duration}
      />
    </div>
  );
});

export default ChartCore;