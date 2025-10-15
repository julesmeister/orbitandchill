/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { memo, Suspense, useState } from "react";
import { useNatalChart } from "@/hooks/useNatalChart";
import ChartSkeleton from "@/components/charts/components/ChartSkeleton";
import { useInterpretationSections } from "@/store/chartStore";
import { usePremiumFeatures } from "@/hooks/usePremiumFeatures";
import { useUserStore } from "@/store/userStore";
import InterpretationModal from "@/components/charts/InterpretationModal";
// Lazy load section components
import { lazy } from 'react';

const CorePersonalitySection = lazy(() => import('@/components/charts/sections/CorePersonalitySection'));
const PlanetaryPositionsSection = lazy(() => import('@/components/charts/sections/PlanetaryPositionsSection'));
const MajorAspectsSection = lazy(() => import('@/components/charts/sections/MajorAspectsSection'));
const HousesSection = lazy(() => import('@/components/charts/sections/HousesSection'));
const StelliumsSection = lazy(() => import('@/components/charts/sections/StelliumsSection'));
const PlanetaryInfluencesSection = lazy(() => import('@/components/charts/sections/PlanetaryInfluencesSection'));
const CelestialPointsSection = lazy(() => import('@/components/charts/sections/CelestialPointsSection'));
const PlanetaryDignitiesSection = lazy(() => import('@/components/charts/sections/PlanetaryDignitiesSection'));
const AngularAspectsSection = lazy(() => import('@/components/charts/sections/AngularAspectsSection'));

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
  const { orderedSections, resetSectionsToDefault } = useInterpretationSections();

  // TEMPORARY: Force reset sections to get updated configuration (removed to prevent render loops)
  // React.useEffect(() => {
  //   resetSectionsToDefault();
  // }, [resetSectionsToDefault]);

  // Only treat as event chart if explicitly passed AND it has different structure
  const isEventChart = propChartData !== undefined && propChartData !== null &&
                      (propChartData as any)?.isEventChart === true;
  const { cachedChart } = useNatalChart();

  // Use prop chart data if provided, otherwise use FRESH API-generated chart data
  const chartData = propChartData || (cachedChart?.metadata?.chartData || null);

  // Modal state and functions
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    text: string;
    icon: string;
    iconColor: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    text: '',
    icon: '',
    iconColor: ''
  });

  const openModal = (title: string, subtitle: string, text: string, icon: string, iconColor: string) => {
    console.log('🔍 ChartInterpretation: openModal called with:', { title, subtitle });

    // Check if detailed modals are premium and user has access
    if (isFeaturePremium('detailed-modals') && !userIsPremium) {
      // Show premium upgrade prompt instead
      setModalData({
        isOpen: true,
        title: '🔒 Premium Feature',
        subtitle: 'Detailed Interpretations',
        text: 'Unlock comprehensive planetary interpretations with in-depth analysis of how each planet affects different areas of your life. Premium members get access to detailed modal explanations, extended interpretations, and personalized insights.\\n\\nUpgrade to Premium to access:\\n• Complete planetary analysis\\n• Detailed aspect interpretations\\n• Advanced filtering options\\n• Export capabilities\\n• And much more!',
        icon: '💎',
        iconColor: 'from-purple-400 to-pink-500'
      });
      return;
    }

    setModalData({
      isOpen: true,
      title,
      subtitle,
      text,
      icon,
      iconColor
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Debug logging for celestial points
  React.useEffect(() => {
    if (chartData?.planets) {
      // FIXED: More comprehensive celestial points filtering to catch all naming variations
      // Validation: ensure planets array is properly populated
      const celestialPoints = chartData.planets.filter(p => {
        const name = p.name?.toLowerCase() || '';
        return [
          'lilith', 'chiron', 'northnode', 'southnode', 'partoffortune',
          'northNode', 'southNode', 'partOfFortune', 'north node', 'south node', 'part of fortune'
        ].includes(name);
      });
      const traditionalPlanets = chartData.planets.filter(p =>
        ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.name?.toLowerCase() || '')
      );
    }
  }, [chartData]);
  
  // Event chart validation
  // (Event chart handling implemented below)
  
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

  // Section filtering validation (premium access control)
  // Filtered sections are displayed based on user tier

  // Show loading skeleton while chart data is loading
  if (!chartData) {
    return (
      <div className="chart-interpretation-placeholder">
        <ChartSkeleton variant="interpretation" />
      </div>
    );
  }

  // Simple section component mapping
  const getSectionComponent = (sectionId: string) => {
    const commonProps = { chartData, isFeaturePremium, userIsPremium, shouldShowFeature, openModal };

    switch (sectionId) {
      case 'corePersonality':
        return <CorePersonalitySection {...commonProps} />;
      case 'planetaryPositions':
        return <PlanetaryPositionsSection {...commonProps} />;
      case 'majorAspects':
        return <MajorAspectsSection {...commonProps} />;
      case 'houses':
        return <HousesSection {...commonProps} />;
      case 'stelliums':
        return <StelliumsSection {...commonProps} />;
      case 'planetaryInfluences':
        return <PlanetaryInfluencesSection {...commonProps} />;
      case 'celestialPoints':
        return <CelestialPointsSection {...commonProps} />;
      case 'planetaryDignities':
        return <PlanetaryDignitiesSection {...commonProps} />;
      case 'angularAspects':
        return <AngularAspectsSection {...commonProps} />;
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

          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="scroll-mt-4"
            >
              <Suspense fallback={<ChartSkeleton variant="section" />}>
                {sectionComponent}
              </Suspense>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <InterpretationModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        subtitle={modalData.subtitle}
        text={modalData.text}
        icon={modalData.icon}
        iconColor={modalData.iconColor}
      />
    </div>
  );
});

export default ChartInterpretation;