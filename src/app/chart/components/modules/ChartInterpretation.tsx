/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { lazy, memo, Suspense } from "react";
import { useChartCache } from "@/hooks/useChartCache";
import ChartSkeleton from "@/components/charts/components/ChartSkeleton";
import { useInterpretationSections } from "@/store/chartStore";
import { usePremiumFeatures } from "@/hooks/usePremiumFeatures";
import { useUserStore } from "@/store/userStore";

// Lazy load interpretation sections for better performance
const PlanetaryPositions = lazy(() => import("@/components/charts/sections/PlanetaryPositionsSection"));
const PlanetaryInfluences = lazy(() => import("@/components/charts/sections/PlanetaryInfluencesSection"));
const HousesSection = lazy(() => import("@/components/charts/sections/HousesSection"));
const MajorAspects = lazy(() => import("@/components/charts/sections/MajorAspectsSection"));
const CelestialPoints = lazy(() => import("@/components/charts/sections/CelestialPointsSection"));
const Stelliums = lazy(() => import("@/components/charts/sections/StelliumsSection"));
const PlanetaryDignities = lazy(() => import("@/components/charts/sections/PlanetaryDignitiesSection"));
const CorePersonality = lazy(() => import("@/components/charts/sections/CorePersonalitySection"));

/**
 * Chart interpretation module - lazy loaded with intersection observer
 * Uses virtual scrolling to only render visible sections
 */
interface ChartInterpretationProps {
  /** Override chart data (for event charts). If not provided, uses cached natal chart data. */
  chartData?: import('@/utils/natalChart').NatalChartData | null;
}

const ChartInterpretation = memo(function ChartInterpretation({ chartData: propChartData }: ChartInterpretationProps = {}) {
  const { user } = useUserStore();
  const { shouldShowFeature, isFeaturePremium, features } = usePremiumFeatures();
  const { orderedSections } = useInterpretationSections();
  
  // If we have event/external chart data, use it directly and skip cache entirely
  const isEventChart = propChartData !== undefined;
  const { cachedChart } = useChartCache();

  // Use prop chart data if provided (event charts), otherwise use cached natal chart data
  const chartData = isEventChart ? propChartData : (cachedChart?.metadata?.chartData || null);
  
  // Debug logging for event charts
  if (isEventChart) {
    console.log('🔍 ChartInterpretation (Event Chart):', {
      isEventChart,
      hasPropData: !!propChartData,
      chartDataType: typeof chartData,
      chartDataKeys: chartData ? Object.keys(chartData) : null
    });
  }
  
  // Premium user check
  const userIsPremium = user?.subscriptionTier === 'premium' || false;
  
  // Filter sections based on visibility and premium status
  const filteredSections = orderedSections.filter(section => {
    if (!section.isVisible) return false;
    
    // Always show non-premium sections
    if (!section.isPremium) {
      return true;
    }
    
    // For premium sections, check user access
    // If features array is empty, fall back to simple premium check
    if (features.length === 0) {
      return userIsPremium;
    }
    
    return shouldShowFeature(section.id, userIsPremium);
  });

  // Show loading skeleton while chart data is loading
  if (!chartData) {
    return (
      <div className="chart-interpretation-placeholder">
        <ChartSkeleton variant="interpretation" />
      </div>
    );
  }

  // Component mapping for dynamic rendering
  const getSectionComponent = (sectionId: string) => {
    switch (sectionId) {
      case 'core-personality':
        return (
          <CorePersonality 
            chartData={chartData}
            openModal={() => {}}
            isFeaturePremium={isFeaturePremium}
            userIsPremium={userIsPremium}
          />
        );
      case 'stellium-analysis':
        return <Stelliums chartData={chartData} />;
      case 'planetary-influences':
        return (
          <PlanetaryInfluences 
            chartData={chartData}
            openModal={() => {}}
          />
        );
      case 'planetary-positions':
        return <PlanetaryPositions chartData={chartData} />;
      case 'detailed-aspects':
        return (
          <MajorAspects 
            chartData={chartData}
            shouldShowFeature={shouldShowFeature}
            userIsPremium={userIsPremium}
          />
        );
      case 'planetary-dignities':
        return (
          <PlanetaryDignities 
            chartData={chartData}
            openModal={() => {}}
          />
        );
      case 'house-analysis':
        return <HousesSection chartData={chartData} />;
      case 'celestial-points':
        return <CelestialPoints chartData={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="chart-interpretation-module">
      {/* Chart Interpretation Header */}
      <div className="mb-6">
        <div className="bg-white border border-black">
          <div className="flex items-center p-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-space-grotesk text-lg font-bold text-black">Chart Interpretation</h4>
              <p className="font-open-sans text-sm text-black/60">Discover the meaning behind your natal chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Section Rendering */}
      <div className="interpretation-sections space-y-6">
        {filteredSections.map((section) => {
          const sectionComponent = getSectionComponent(section.id);
          
          if (!sectionComponent) return null;
          
          // Sections that already have complete styling and don't need extra borders
          const selfContainedSections = ['core-personality', 'stellium-analysis', 'planetary-influences'];
          const needsBorder = !selfContainedSections.includes(section.id);
          
          return (
            <div 
              key={section.id} 
              id={`section-${section.id}`} 
              className={`scroll-mt-4 ${needsBorder ? 'border border-black bg-white overflow-hidden' : ''}`}
            >
              <Suspense fallback={<ChartSkeleton variant="section" />}>
                {needsBorder ? (
                  <div className="[&>*]:!border-0 [&>*]:!sm:border-0 [&>*]:bg-transparent">
                    {sectionComponent}
                  </div>
                ) : (
                  sectionComponent
                )}
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ChartInterpretation;