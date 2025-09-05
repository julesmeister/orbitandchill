/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { lazy, memo, Suspense, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useChartCache } from "@/hooks/useChartCache";
import ChartSkeleton from "@/components/charts/components/ChartSkeleton";
import { useInterpretationSections } from "@/store/chartStore";
import { usePremiumFeatures } from "@/hooks/usePremiumFeatures";
import { useUserStore } from "@/store/userStore";

// Lazy load section controls
const ChartSectionControls = lazy(() => import("@/components/charts/ChartSectionControls"));

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
const ChartInterpretation = memo(function ChartInterpretation() {
  const { cachedChart } = useChartCache();
  const { user } = useUserStore();
  const { shouldShowFeature, isFeaturePremium, features } = usePremiumFeatures();
  const { orderedSections } = useInterpretationSections();
  const [showSectionControls, setShowSectionControls] = useState(false);
  const [sectionControlsCollapsed, setSectionControlsCollapsed] = useState(false);
  const [isVisible, targetRef] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px', // Start loading 200px before visible
  });

  // Get chart data from cache
  const chartData = cachedChart?.metadata?.chartData || null;
  
  // Premium user check
  const userIsPremium = user?.subscriptionTier === 'premium' || false;
  
  // Filter sections based on visibility and premium status
  const filteredSections = features.length === 0 
    ? orderedSections.filter(section => section.isVisible)
    : orderedSections.filter(section => {
        if (!section.isVisible) return false;
        
        // Always show non-premium sections
        if (!section.isPremium) {
          return true;
        }
        
        // For premium sections, check user access
        return shouldShowFeature(section.id, userIsPremium);
      });

  // Don't render until near viewport
  if (!isVisible) {
    return (
      <div ref={targetRef} className="chart-interpretation-placeholder">
        <ChartSkeleton variant="interpretation" />
      </div>
    );
  }

  // Don't render if no chart data
  if (!chartData) {
    return (
      <div ref={targetRef} className="chart-interpretation-placeholder text-center py-8">
        <p className="text-gray-500">Generate a chart to see interpretations</p>
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
    <div ref={targetRef} className="chart-interpretation-module">
      {/* Section Controls Header */}
      <div className="mb-6">
        <div className="bg-white border border-black">
          <div className="flex items-center justify-between p-4 border-b border-black">
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-space-grotesk text-lg font-bold text-black">Chart Interpretation</h4>
                <p className="font-open-sans text-sm text-black/60">Discover the meaning behind your natal chart</p>
              </div>
            </div>
            
            {/* Section Controls Toggle */}
            <button
              onClick={() => setShowSectionControls(!showSectionControls)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 border ${
                showSectionControls
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="font-space-grotesk">
                {showSectionControls ? 'Hide Controls' : 'Section Controls'}
              </span>
            </button>
          </div>
          
          {/* Section Controls Panel */}
          {showSectionControls && (
            <div className="border-b border-black">
              <Suspense fallback={<ChartSkeleton variant="section" />}>
                <ChartSectionControls
                  className="border-0"
                  isCollapsed={sectionControlsCollapsed}
                  onToggleCollapse={() => setSectionControlsCollapsed(!sectionControlsCollapsed)}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Section Rendering */}
      <div className="interpretation-sections space-y-6">
        {filteredSections.map((section) => {
          const sectionComponent = getSectionComponent(section.id);
          
          if (!sectionComponent) return null;
          
          return (
            <div key={section.id} id={`section-${section.id}`} className="scroll-mt-4">
              <Suspense fallback={<ChartSkeleton variant="section" />}>
                {sectionComponent}
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ChartInterpretation;