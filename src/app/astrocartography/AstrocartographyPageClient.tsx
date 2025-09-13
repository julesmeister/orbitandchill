/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, Suspense } from 'react';
import { usePeopleAPI } from '../../hooks/usePeopleAPI';
import { useUserStore } from '../../store/userStore';
import { Person } from '../../types/people';
import { useAstrocartography } from '../../hooks/useAstrocartography';
import TimeZoneWarnings from '../../components/astrocartography/TimeZoneWarnings';
import CalculationMethodInfo from '../../components/astrocartography/CalculationMethodInfo';
import AstrocartographyAnalysisComponent from '../../components/astrocartography/AstrocartographyAnalysis';

// Import components
import AstrocartographyHeader from './components/AstrocartographyHeader';
import AstrocartographyControls from './components/AstrocartographyControls';
import AstrocartographyMap from './components/AstrocartographyMap';
import AstrocartographyInfoCards from './components/AstrocartographyInfoCards';

const FullscreenMapModal = React.lazy(() => import('./components/FullscreenMapModal'));

// Import hooks
import { useAstrocartographyState } from './hooks/useAstrocartographyState';
import { useAstrocartographyHandlers } from './hooks/useAstrocartographyHandlers';
import { useAstrocartographyData } from './hooks/useAstrocartographyData';

// Custom styles for range sliders
const sliderStyles = `
  .range-slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #8b5cf6;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .range-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #8b5cf6;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    border: none;
  }
`;

export default function AstrocartographyPageClient() {
  const { defaultPerson, people, selectedPersonId } = usePeopleAPI();
  const { user } = useUserStore();
  const [astroPersonData, setAstroPersonData] = React.useState<Person | null>(null);

  // Check for person data from chart navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPersonData = sessionStorage.getItem('astro_person_data');
        if (storedPersonData) {
          const personData = JSON.parse(storedPersonData);
          console.log('🌍 Astrocartography: Received person data from chart navigation:', personData);
          setAstroPersonData(personData);
          // Clear the session storage after using it
          sessionStorage.removeItem('astro_person_data');
        }
      } catch (error) {
        console.error('Error reading astro person data from sessionStorage:', error);
      }
    }
  }, []);

  // Manually compute selectedPerson to avoid potential Zustand getter issues
  const selectedPerson = selectedPersonId ? people.find(p => p.id === selectedPersonId) || null : null;
  
  // Priority: astro person data from chart navigation, then selected person, then default person, then first person
  const currentPerson = astroPersonData || selectedPerson || defaultPerson || people[0];
  
  // Debug log the current person being used
  useEffect(() => {
    console.log('🌍 Astrocartography: Current person:', {
      astroPersonData: !!astroPersonData,
      selectedPerson: !!selectedPerson,
      defaultPerson: !!defaultPerson,
      peopleCount: people.length,
      finalPerson: currentPerson ? { id: currentPerson.id, name: currentPerson.name } : null
    });
  }, [astroPersonData, selectedPerson, defaultPerson, people.length, currentPerson]);

  // Use custom hooks for state management
  const {
    selectedCountry,
    hoveredLine,
    astroAnalysis,
    isAnalyzing,
    clickedCoords,
    parans,
    visiblePlanets,
    visibleLineTypes,
    showReferencePoints,
    showParans,
    isFullscreen,
    hasInitialLoad,
    hasCheckedCache,
    hasFreshAstroData,
    stableAstroLines,
    setSelectedCountry,
    setHoveredLine,
    setAstroAnalysis,
    setIsAnalyzing,
    setClickedCoords,
    setParans,
    setShowReferencePoints,
    setShowParans,
    setHasInitialLoad,
    setHasCheckedCache,
    setStableAstroLines,
    togglePlanet,
    toggleLineType,
    toggleFullscreen,
    closeAnalysis
  } = useAstrocartographyState();


  // Use astrocartography hook to calculate planetary lines
  const {
    astrocartographyData,
    isCalculating,
    error: astroError,
    canCalculate,
    calculateAstrocartography
  } = useAstrocartography({
    autoCalculate: false, // We'll manually trigger calculation with current person's data
    includePlanets: ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] // Always include all planets
  });

  // Use custom hooks for data processing
  const { birthData, timeZoneInfo, astrocartographyLines, hasAstroData } = useAstrocartographyData({
    currentPerson,
    astrocartographyData,
    visiblePlanets,
    visibleLineTypes,
    hasFreshAstroData,
    stableAstroLines,
    hasCheckedCache,
    userId: user?.id,
    setStableAstroLines,
    setParans,
    setHasCheckedCache,
    setHasInitialLoad
  });

  // Use custom hooks for event handlers
  const { handleCountryClick, handleLineHover, handleLineHoverEnd, handleMapClick } = useAstrocartographyHandlers({
    astrocartographyLines,
    parans,
    setClickedCoords,
    setIsAnalyzing,
    setAstroAnalysis,
    setSelectedCountry,
    setHoveredLine
  });




  // Calculate astrocartography when current person or birth data changes
  useEffect(() => {
    if (birthData && (!hasInitialLoad || !astrocartographyData)) {
      calculateAstrocartography(birthData).then(() => {
        if (!hasInitialLoad) {
          setHasInitialLoad(true);
        }
      });
    }
  }, [birthData, currentPerson?.id, calculateAstrocartography, hasInitialLoad, astrocartographyData, setHasInitialLoad]);


  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />

      {/* Fullscreen Map Modal */}
      {isFullscreen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white">Loading fullscreen map...</div>
        </div>}>
          <FullscreenMapModal
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onCountryClick={handleCountryClick}
            onMapClick={handleMapClick}
            astrocartographyLines={astrocartographyLines}
            parans={parans}
            onLineHover={handleLineHover}
            onLineHoverEnd={handleLineHoverEnd}
            showReferencePoints={showReferencePoints}
            showParans={showParans}
            onToggleParans={() => setShowParans(!showParans)}
            onToggleReferencePoints={() => setShowReferencePoints(!showReferencePoints)}
            visiblePlanets={visiblePlanets}
            onTogglePlanet={togglePlanet}
            isCalculating={isCalculating}
          />
        </Suspense>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-6">
        {/* Header Section */}
        <AstrocartographyHeader
          currentPerson={currentPerson}
          hasAstroData={hasAstroData}
          isCalculating={isCalculating}
          visibleLineTypes={visibleLineTypes}
          onToggleLineType={toggleLineType}
        />

        {/* Time Zone Warnings - Only show for critical issues */}
        {timeZoneInfo && (
          timeZoneInfo.confidence === 'low' ||
          timeZoneInfo.warnings.some(warning =>
            warning.includes('ERROR') ||
            warning.includes('CRITICAL') ||
            warning.includes('low confidence')
          )
        ) && (
            <div className="px-6 md:px-12 lg:px-20 mb-6">
              <TimeZoneWarnings
                warnings={timeZoneInfo.warnings}
                confidence={timeZoneInfo.confidence}
                timeZone={timeZoneInfo.timeZone}
                className="bg-white/60 backdrop-blur-sm border border-slate-200"
              />
            </div>
          )}

        {/* Controls */}
        <AstrocartographyControls
          hasAstroData={hasAstroData}
          visiblePlanets={visiblePlanets}
          onTogglePlanet={togglePlanet}
          showReferencePoints={showReferencePoints}
          onToggleReferencePoints={() => setShowReferencePoints(!showReferencePoints)}
          showParans={showParans}
          onToggleParans={() => setShowParans(!showParans)}
          onToggleFullscreen={toggleFullscreen}
          isCalculating={isCalculating}
          parans={parans || []}
          astrocartographyLines={astrocartographyLines}
          astroError={astroError}
        />

        {/* Error Display */}
        {astroError && (
          <div className="px-6 md:px-12 lg:px-20 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{astroError}</p>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <AstrocartographyInfoCards
          hasAstroData={hasAstroData}
          visiblePlanets={visiblePlanets}
          parans={parans || []}
          selectedCountry={selectedCountry}
        />

        {/* Map Section */}
        <div className="px-6 md:px-12 lg:px-20 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 overflow-hidden">
            <AstrocartographyMap
              onCountryClick={handleCountryClick}
              onMapClick={handleMapClick}
              astrocartographyLines={astrocartographyLines}
              parans={parans}
              onLineHover={handleLineHover}
              onLineHoverEnd={handleLineHoverEnd}
              hoveredLine={hoveredLine}
              showReferencePoints={showReferencePoints}
              showParans={showParans}
              visiblePlanets={visiblePlanets}
              isCalculating={isCalculating}
              hasAstroData={hasAstroData}
              onTogglePlanet={togglePlanet}
            />
          </div>
        </div>

        {/* Analysis Modal */}
        {isAnalyzing && astroAnalysis && (
          <AstrocartographyAnalysisComponent
            analysis={astroAnalysis}
            isAnalyzing={isAnalyzing}
            onClose={closeAnalysis}
          />
        )}

        {/* Bottom Info Section */}
        <div className="px-6 md:px-12 lg:px-20 mb-8">
          <CalculationMethodInfo currentMethod="zodiacal" />
        </div>
      </div>
    </div>
  );
}