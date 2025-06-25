/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Person } from '../../types/people';
import { usePeopleStore } from '../../store/peopleStore';
import { useUserStore } from '../../store/userStore';
import { useAstrocartography } from '../../hooks/useAstrocartography';
import WorldMap from '../../components/WorldMap';
import {
  calculateAstrocartographyForWorldMap,
  filterVisibleLines,
  PLANET_COLORS,
  coordinatesToWorldMapPath
} from '../../utils/astrocartographyLineRenderer';
import { processBirthTime } from '../../utils/timeZoneHandler';
import TimeZoneWarnings from '../../components/astrocartography/TimeZoneWarnings';
import CalculationMethodInfo from '../../components/astrocartography/CalculationMethodInfo';
import AstrocartographyAnalysisComponent from '../../components/astrocartography/AstrocartographyAnalysis';
import MapProjectionValidator from '../../components/MapProjectionValidator';
import {
  analyzeAstrocartographyPoint,
  AstrocartographyAnalysis,
  calculateLineDistance
} from '../../utils/astrocartographyDistanceCalculator';
import {
  calculateParans,
  Paran,
  findParansAtLatitude
} from '../../utils/paranCalculations';
import {
  clearOutdatedNatalChartCaches,
  showCacheClearPrompt
} from '../../utils/cacheInvalidation';

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

export default function AstrocartographyPage() {
  const router = useRouter();
  const { defaultPerson, people, selectedPersonId } = usePeopleStore();

  // Manually compute selectedPerson to avoid potential Zustand getter issues
  const selectedPerson = selectedPersonId ? people.find(p => p.id === selectedPersonId) || null : null;
  const { user, isProfileComplete } = useUserStore();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<{ planet: string; lineType: string } | null>(null);
  const [astroAnalysis, setAstroAnalysis] = useState<AstrocartographyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [parans, setParans] = useState<Paran[]>([]);
  const [visiblePlanets, setVisiblePlanets] = useState<string[]>([
    'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'
  ]);
  const [visibleLineTypes, setVisibleLineTypes] = useState({
    MC: true,   // Midheaven lines
    IC: true,   // Imum Coeli lines
    AC: true,   // Ascendant lines  
    DC: true    // Descendant lines
  });

  const currentPerson = selectedPerson || defaultPerson || people[0];

  const [showReferencePoints, setShowReferencePoints] = useState(false);
  const [showParans, setShowParans] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [hasCheckedCache, setHasCheckedCache] = useState(false);

  // Track whether we have fresh astrocartography data to prevent fallback to cached data
  const hasFreshAstroData = useRef(false);
  const [stableAstroLines, setStableAstroLines] = useState<any[]>([]);


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

  const handleCountryClick = (countryId: string) => {
    setSelectedCountry(countryId);
  };

  const handleLineHover = (planet: string, lineType: string) => {
    setHoveredLine({ planet, lineType });
  };

  const handleLineHoverEnd = () => {
    setHoveredLine(null);
  };

  const handleMapClick = async (lat: number, lng: number, countryInfo?: { countryId: string; countryName: string } | null) => {
    setClickedCoords({ lat, lng });

    if (astrocartographyLines.length > 0) {
      setIsAnalyzing(true);

      // Create instant analysis with available data (no async calls)
      const nearbyLines = astrocartographyLines
        .map(line => calculateLineDistance(lat, lng, line))
        .filter(result => result.distanceKm <= 300)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5);

      const paranProximities = findParansAtLatitude(parans, lat, 75);

      // Show instant analysis immediately
      const instantAnalysis = {
        clickedPoint: { lat, lng },
        locationInfo: null, // Will be loaded asynchronously
        countryInfo: countryInfo || null,
        nearbyLines,
        crossings: [], // Could calculate this instantly too if needed
        parans: paranProximities,
        latitudinalInfluences: []
      };

      setAstroAnalysis(instantAnalysis);
      setIsAnalyzing(false);

      // Then load additional data in background
      try {
        const fullAnalysis = await analyzeAstrocartographyPoint(lat, lng, astrocartographyLines, parans, countryInfo);
        setAstroAnalysis(fullAnalysis);
      } catch (error) {
        console.error('Error loading full analysis:', error);
        // Keep the instant analysis if full analysis fails
      }
    }
  };

  const closeAnalysis = () => {
    setAstroAnalysis(null);
    setClickedCoords(null);
    setIsAnalyzing(false);
  };

  const togglePlanet = (planet: string) => {
    setVisiblePlanets(prev =>
      prev.includes(planet)
        ? prev.filter(p => p !== planet)
        : [...prev, planet]
    );
  };

  const toggleLineType = (lineType: 'MC' | 'IC' | 'AC' | 'DC') => {
    setVisibleLineTypes(prev => ({
      ...prev,
      [lineType]: !prev[lineType]
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };




  const birthData = useMemo(() => {
    if (!currentPerson?.birthData) return null;

    return (() => {
      // CRITICAL FIX: Use proper time zone handling instead of naive Date construction
      // This addresses the #1 cause of inaccurate astrocartography lines

      const rawLat = currentPerson.birthData.coordinates.lat;
      const rawLon = currentPerson.birthData.coordinates.lon;
      const parsedLat = parseFloat(rawLat);
      const parsedLon = parseFloat(rawLon);


      // Use imported time zone handler

      try {
        const processedTime = processBirthTime({
          dateOfBirth: currentPerson.birthData.dateOfBirth,
          timeOfBirth: currentPerson.birthData.timeOfBirth,
          coordinates: currentPerson.birthData.coordinates,
          locationOfBirth: currentPerson.birthData.locationOfBirth
        });

        // Display warnings if accuracy is compromised
        if (processedTime.confidence === 'low' || processedTime.warnings.length > 2) {
          console.warn('ASTROCARTOGRAPHY ACCURACY WARNING:', processedTime.warnings);
        }

        const finalBirthData = {
          date: processedTime.utcDate, // Use proper UTC date instead of naive construction
          location: {
            latitude: parsedLat,
            longitude: parsedLon
          },
          timeZoneInfo: processedTime // Include time zone metadata for debugging
        };

        return finalBirthData;
      } catch (error) {
        console.error('Time zone processing failed, falling back to naive date construction:', error);

        // Fallback to original method with warning
        const fallbackDate = new Date(`${currentPerson.birthData.dateOfBirth}T${currentPerson.birthData.timeOfBirth}:00`);

        return {
          date: fallbackDate,
          location: {
            latitude: parsedLat,
            longitude: parsedLon
          },
          timeZoneInfo: null
        };
      }
    })();
  }, [currentPerson?.birthData]);

  // Derive time zone info directly from birth data
  const timeZoneInfo = useMemo(() => {
    return birthData?.timeZoneInfo || null;
  }, [birthData?.timeZoneInfo]);

  // Update stable astro lines when fresh data arrives
  useEffect(() => {
    if (astrocartographyData) {
      console.log('🔄 ASTRO: Updating stable astrocartography lines from fresh data');
      hasFreshAstroData.current = true;

      // Convert astrocartography data to SVG lines
      const svgLines: any[] = [];

      astrocartographyData.planets.forEach((planetData) => {
        const planetColor = PLANET_COLORS[planetData.planet] || '#6B7280';

        Object.entries(planetData.lines).forEach(([lineType, line]) => {
          const upperLineType = lineType.toUpperCase() as keyof typeof visibleLineTypes;
          if (!line || !visibleLineTypes[upperLineType] || !visiblePlanets.includes(planetData.planet)) {
            return;
          }

          // Convert geographic coordinates to world map SVG path
          const svgPath = coordinatesToWorldMapPath(line.coordinates);

          if (svgPath) {
            svgLines.push({
              planet: planetData.planet,
              lineType: upperLineType,
              path: svgPath,
              color: planetColor,
              style: { strokeDasharray: upperLineType === 'MC' || upperLineType === 'IC' ? 'none' : '5,5', opacity: 0.8 }
            });
          }
        });
      });

      setStableAstroLines(svgLines);
    }
  }, [astrocartographyData, visiblePlanets, visibleLineTypes]);

  // Calculate astrocartography lines for WorldMap integration
  const astrocartographyLines = useMemo(() => {
    // Use stable lines if we have fresh data
    if (hasFreshAstroData.current && stableAstroLines.length > 0) {
      console.log('✅ ASTRO: Using stable fresh astrocartography lines');
      return stableAstroLines;
    }

    // No fallback needed - we always use fresh astrocartography data
    console.log('⚠️ ASTRO: No fresh astrocartography data available yet');
    return [];
  }, [stableAstroLines]);


  // Check if we have the necessary data for astrocartography
  const hasAstroData = astrocartographyLines.length > 0;


  // Calculate astrocartography when current person or birth data changes
  useEffect(() => {
    if (birthData && (!hasInitialLoad || !astrocartographyData)) {
      console.log('🔄 ASTRO: Triggering astrocartography calculation', {
        hasInitialLoad,
        hasAstroData: !!astrocartographyData,
        birthDate: birthData.date.toISOString()
      });
      calculateAstrocartography(birthData).then(() => {
        if (!hasInitialLoad) {
          setHasInitialLoad(true);
        }
      });
    }
  }, [birthData, currentPerson?.id, calculateAstrocartography, hasInitialLoad, astrocartographyData]);

  // Calculate parans when astrocartography data is available
  useEffect(() => {
    if (astrocartographyData && astrocartographyData.planets.length > 0) {
      const calculatedParans = calculateParans(astrocartographyData);
      setParans(calculatedParans);
    }
  }, [astrocartographyData]);

  // Check for outdated caches on mount
  useEffect(() => {
    const checkCaches = async () => {
      if (user?.id && !hasCheckedCache) {
        setHasCheckedCache(true);
        try {
          const clearedCount = await clearOutdatedNatalChartCaches();
          if (clearedCount > 0) {
            console.log(`Cleared ${clearedCount} outdated caches on astrocartography page load`);
            // Force a fresh calculation by setting hasInitialLoad to false
            setHasInitialLoad(false);
            // Reset fresh data flag to allow new calculations
            hasFreshAstroData.current = false;
          }
        } catch (error) {
          console.error('Error checking caches:', error);
        }
      }
    };

    checkCaches();
  }, [user?.id, hasCheckedCache]);

  // Reset fresh data flag and stable lines when person changes
  useEffect(() => {
    hasFreshAstroData.current = false;
    setStableAstroLines([]);
  }, [currentPerson?.id]);


  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />

      {/* Fullscreen Map Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="relative w-full h-full">
            <WorldMap
              onCountryClick={handleCountryClick}
              onMapClick={handleMapClick}
              className="w-full h-full"
              astrocartographyLines={astrocartographyLines}
              parans={parans}
              onLineHover={handleLineHover}
              onLineHoverEnd={handleLineHoverEnd}
              lineStyle={{ opacity: 0.8, strokeWidth: 2 }}
              showReferencePoints={showReferencePoints}
              showParans={showParans}
            />

            {/* Exit fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Fullscreen controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full p-1">
                  <button
                    onClick={() => setShowParans(!showParans)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showParans
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                    Parans ({parans.length})
                  </button>
                </div>
                <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full p-1">
                  <button
                    onClick={() => setShowReferencePoints(!showReferencePoints)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showReferencePoints
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Grids
                  </button>
                </div>
              </div>

              {/* Planet filters for fullscreen */}
              <div className="flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full p-2">
                {['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].map(planetName => {
                  const planetColor = PLANET_COLORS[planetName] || '#6B7280';
                  return (
                    <button
                      key={planetName}
                      onClick={() => togglePlanet(planetName)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${visiblePlanets.includes(planetName)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: planetColor }}
                      />
                      {planetName.charAt(0).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading overlay for fullscreen */}
            {isCalculating && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-slate-700">Calculating planetary lines...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-6">
        {/* Header Section */}
        <div className="px-6 md:px-12 lg:px-20 py-8">
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                Astrocartography Explorer
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover how your birth chart energy shifts across different locations around the world.
                Click on any country to explore potential influences.
              </p>

              {/* Line Type Filters in Header */}
              {(hasAstroData || isCalculating) && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-sm font-medium text-slate-700 mr-2">Line Types:</span>
                  {Object.entries(visibleLineTypes).map(([lineType, isVisible]) => (
                    <button
                      key={lineType}
                      onClick={() => toggleLineType(lineType as 'MC' | 'IC' | 'AC' | 'DC')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isVisible
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                      {lineType} {lineType === 'MC' ? '(Career)' : lineType === 'IC' ? '(Home)' : lineType === 'AC' ? '(Identity)' : '(Relationships)'}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => router.push('/chart')}
                    className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium">
                      {currentPerson ? 'Back to Chart' : 'Go to Chart and Pick a Person to Analyze'}
                    </span>
                  </button>
                  {currentPerson && (
                    <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-slate-700">
                        Viewing chart for: {currentPerson.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Map Section - Full Width */}
        <div className="w-full bg-white/80 backdrop-blur-sm border-t border-b border-slate-200 shadow-lg">
          <div className="px-6 md:px-12 lg:px-20 py-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Interactive World Map</h2>
                  <p className="text-slate-600">Click on any country to explore astrological influences</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
                    <button
                      onClick={() => setShowParans(!showParans)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showParans
                        ? 'bg-purple-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      Parans
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${showParans ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                        {parans.length}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
                    <button
                      onClick={() => setShowReferencePoints(!showReferencePoints)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showReferencePoints
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Grid
                    </button>
                  </div>
                  <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
                    <button
                      onClick={toggleFullscreen}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all duration-200"
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isFullscreen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        )}
                      </svg>
                      {isFullscreen ? 'Exit' : 'Fullscreen'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <WorldMap
                onCountryClick={handleCountryClick}
                onMapClick={handleMapClick}
                className="w-full"
                astrocartographyLines={astrocartographyLines}
                parans={parans}
                onLineHover={handleLineHover}
                onLineHoverEnd={handleLineHoverEnd}
                lineStyle={{ opacity: 0.8, strokeWidth: 2 }}
                showReferencePoints={showReferencePoints}
                showParans={showParans}
              />
            </div>

            {/* Loading overlay for astrocartography calculations */}
            {isCalculating && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-40">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-slate-700">Calculating planetary lines...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Astrocartography Controls */}
        {(hasAstroData || isCalculating) && (
          <div className="px-6 md:px-12 lg:px-20 py-4 bg-white/70 backdrop-blur-sm border-t border-slate-200">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 mr-2">Toggle Planets:</span>
                  {['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].map(planetName => {
                    const planetColor = PLANET_COLORS[planetName] || '#6B7280';
                    return (
                      <button
                        key={planetName}
                        onClick={() => togglePlanet(planetName)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${visiblePlanets.includes(planetName)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: planetColor }}
                        />
                        {planetName.charAt(0).toUpperCase() + planetName.slice(1)}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {astroError ? (
                    <span className="text-red-600">Error calculating lines</span>
                  ) : hasAstroData ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{astrocartographyLines.length} lines calculated</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>No birth data available</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="px-6 md:px-12 lg:px-20 py-8">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Planetary Lines Card */}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Planetary Lines</h3>
                <p className="text-slate-600 text-sm">
                  {hasAstroData ? (
                    `Currently showing ${visiblePlanets.length} planetary lines. Each colored line represents where that planet's energy is strongest on Earth.`
                  ) : (
                    'Generate your natal chart first to see personalized planetary lines based on your birth data.'
                  )}
                </p>
              </div>

              {/* Parans Card */}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Parans</h3>
                <p className="text-slate-600 text-sm">
                  {parans.length > 0 ? (
                    `Found ${parans.length} paran intersection${parans.length === 1 ? '' : 's'}. These special points combine planetary energies within a 75-mile radius.`
                  ) : (
                    'Parans are intersection points where planetary lines cross, creating powerful combined energies.'
                  )}
                </p>
              </div>

              {/* Location Insights Card */}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Location Insights</h3>
                <p className="text-slate-600 text-sm">
                  {selectedCountry ? (
                    `Selected: ${selectedCountry}. Click on planetary lines or parans to understand how different celestial energies manifest in this location.`
                  ) : (
                    'Click on any country to explore how planetary influences might affect your experiences in that location.'
                  )}
                </p>
              </div>

              {/* Relocation Charts Card */}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3a4 4 0 01-4 4H5m0 0a4 4 0 01-4-4v-1h4v1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Relocation Charts</h3>
                <p className="text-slate-600 text-sm">
                  Generate relocated birth charts to see how your astrological influences shift when you move to different parts of the world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Method Information */}
        <div className="px-6 md:px-12 lg:px-20 mb-6">
          <CalculationMethodInfo
            currentMethod="zodiacal"
            className=""
          />
        </div>




        {/* Astrocartography Analysis Modal */}
        <AstrocartographyAnalysisComponent
          analysis={astroAnalysis}
          onClose={closeAnalysis}
        />

        {/* Loading overlay for location analysis */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                <span className="text-gray-700 font-medium">Analyzing location...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}