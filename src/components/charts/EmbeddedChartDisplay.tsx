/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { EmbeddedChart } from '../../types/threads';
import ChartSummaryCard from './ChartSummaryCard';
import UnifiedAstrologicalChart from './UnifiedAstrologicalChart';
import InteractiveHoraryChart from '../horary/InteractiveHoraryChart';
import VertexBorderButton from '../reusable/VertexBorderButton';
import MajorAspectsSection from './sections/MajorAspectsSection';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useUserStore } from '../../store/userStore';
import { getFullAspectInfo } from '../../utils/astrologicalInterpretations';
import { BRAND } from '../../config/brand';

interface EmbeddedChartDisplayProps {
  chart: EmbeddedChart;
  isPreview?: boolean;
  showFullDetails?: boolean;
}

export default function EmbeddedChartDisplay({ 
  chart, 
  isPreview = false, 
  showFullDetails = false 
}: EmbeddedChartDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDetails);
  const [showChartModal, setShowChartModal] = useState(false);
  const { user } = useUserStore();
  const { cachedChart } = useNatalChart();

  // Use ref to track if we've logged this chart data already
  const lastLoggedChartId = useRef<string | null>(null);

  // Check if this embedded chart matches the user's current chart
  const isUserChart = useMemo(() => {
    if (!chart.metadata.birthData || !user?.birthData) return false;
    
    return (
      chart.metadata.birthData.dateOfBirth === user.birthData.dateOfBirth &&
      chart.metadata.birthData.timeOfBirth === user.birthData.timeOfBirth &&
      chart.metadata.birthData.locationOfBirth === user.birthData.locationOfBirth
    );
  }, [chart.metadata.birthData, user?.birthData]);

  // Get real chart data if this is the user's chart
  const realChartData = useMemo(() => {
    if (isUserChart && cachedChart?.metadata?.chartData) {
      console.log('🔍 Found matching cached chart with real data:', {
        planetsCount: cachedChart.metadata.chartData.planets?.length,
        aspectsCount: cachedChart.metadata.chartData.aspects?.length,
        samplePlanet: cachedChart.metadata.chartData.planets?.[0]
      });
      return cachedChart.metadata.chartData;
    }
    return null;
  }, [isUserChart, cachedChart]);

  // Calculate aspects from existing planet data
  const calculateAspectsFromPlanets = (planetSummary: any[]) => {
    if (!planetSummary || planetSummary.length === 0) return [];
    
    // Only calculate major aspects (conjunction, square, trine, opposition)
    const majorAspectDefinitions = {
      conjunction: { angle: 0, orb: 8 },
      square: { angle: 90, orb: 8 },
      trine: { angle: 120, orb: 8 },
      opposition: { angle: 180, orb: 8 }
    };
    
    // Convert planet data and filter out planets without valid degree data
    const planets = planetSummary
      .filter(p => p.degree && p.degree !== 0) // Only include planets with valid degree data
      .map(p => ({
        name: p.planet,
        longitude: p.degree,
        sign: p.sign
      }));

    if (planets.length < 2) {
      console.log('🔍 Not enough planets with valid degree data for aspect calculation');
      return [];
    }

    const aspects = [];

    // Calculate aspects between all planet pairs
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        let angle = Math.abs(planet1.longitude - planet2.longitude);
        if (angle > 180) angle = 360 - angle;

        // Check each major aspect type
        for (const [aspectName, aspectDef] of Object.entries(majorAspectDefinitions)) {
          const orb = Math.abs(angle - aspectDef.angle);
          if (orb <= aspectDef.orb) {
            aspects.push(`${planet1.name} ${aspectName} ${planet2.name}`);
            break; // Only add the first matching aspect
          }
        }
      }
    }

    // Limit to maximum 6 major aspects to avoid cluttering
    return aspects.slice(0, 6);
  };

  // Calculate aspects using useMemo to prevent infinite loops
  const computedAspects = useMemo(() => {
    // First priority: Use real chart data if this is the user's chart
    if (realChartData?.aspects && realChartData.aspects.length > 0) {
      console.log('🔍 Using real chart aspects:', realChartData.aspects.length);
      // Filter to major aspects only and limit to 6
      const majorAspects = realChartData.aspects
        .filter(aspect => ['conjunction', 'square', 'trine', 'opposition'].includes(aspect.aspect.toLowerCase()))
        .slice(0, 6)
        .map(aspect => `${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`);
      return majorAspects;
    }
    
    // Second priority: Use embedded chart's majorAspects if available
    if (chart.metadata.majorAspects?.length > 0) {
      return chart.metadata.majorAspects.slice(0, 6); // Limit to 6 aspects
    }
    
    // Last resort: Calculate from planetSummary
    return calculateAspectsFromPlanets(chart.metadata.planetSummary);
  }, [realChartData?.aspects, chart.metadata.majorAspects, chart.metadata.planetSummary]);
  
  // Debug logging to see what data we receive (only log once per chart)
  useEffect(() => {
    if (chart.id !== lastLoggedChartId.current) {
      console.log('🔍 EmbeddedChartDisplay received chart:', {
        chartId: chart.id,
        chartType: chart.chartType,
        hasNatalChartData: !!chart.metadata.natalChartData,
        natalChartDataAspects: chart.metadata.natalChartData?.aspects?.length || 0,
        majorAspects: chart.metadata.majorAspects?.length || 0,
        computedAspects: computedAspects.length,
        allMetadataKeys: Object.keys(chart.metadata),
        planetSummaryCount: chart.metadata.planetSummary?.length || 0,
        houseSummaryCount: chart.metadata.houseSummary?.length || 0
      });
      lastLoggedChartId.current = chart.id;
    }
  }, [chart.id, chart.chartType, chart.metadata, computedAspects]);

  const handleViewMore = () => {
    if (isPreview) {
      setIsExpanded(true);
    } else {
      setShowChartModal(true);
    }
  };

  return (
    <>
      <div className="my-6 border border-black bg-white">
        {/* Chart Header */}
        <div className="p-4 bg-gray-50 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">
                  {chart.chartType === 'natal' ? '🌟' : chart.chartType === 'horary' ? '🔮' : '📅'}
                </span>
              </div>
              <div>
                <h3 className="font-space-grotesk font-bold text-black">
                  📊 Shared Chart
                </h3>
                <p className="text-sm text-black/70 font-inter">
                  {chart.metadata.chartTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-black text-white px-2 py-1 font-space-grotesk font-bold">
                {chart.chartType.toUpperCase()}
              </span>
              {chart.metadata.chartScore && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 font-space-grotesk font-bold">
                  {chart.metadata.chartScore}%
                </span>
              )}
              {/* Show Less Button in Header */}
              {isPreview && isExpanded && (
                <VertexBorderButton
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1 border border-gray-200 font-space-grotesk font-bold text-xs transition-all duration-300 hover:bg-black hover:text-white hover:border-transparent"
                  cornerSize="small"
                  style={{ 
                    backgroundColor: 'white',
                    color: '#19181a'
                  }}
                >
                  Show Less
                </VertexBorderButton>
              )}
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-4">
          {isPreview && !isExpanded ? (
            /* Preview Mode - Compact Summary */
            <div className="space-y-4">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm font-inter">
                {chart.chartType === 'natal' && chart.metadata.birthData && (
                  <>
                    <span>📅 {new Date(chart.metadata.birthData.dateOfBirth).toLocaleDateString()}</span>
                    <span>🕐 {chart.metadata.birthData.timeOfBirth}</span>
                    <span>📍 {chart.metadata.birthData.locationOfBirth}</span>
                  </>
                )}
                {chart.chartType === 'horary' && chart.metadata.horaryData && (
                  <>
                    <span>❓ "{chart.metadata.horaryData.question.substring(0, 50)}..."</span>
                    {chart.metadata.horaryData.answer && (
                      <span className="font-bold">💡 {chart.metadata.horaryData.answer}</span>
                    )}
                  </>
                )}
                {chart.chartType === 'event' && chart.metadata.eventData && (
                  <>
                    <span>📅 {chart.metadata.eventData.eventTitle}</span>
                    <span>🕐 {chart.metadata.eventData.eventDate}</span>
                  </>
                )}
              </div>

              {/* Chart and Planets Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Interactive Chart - Left Side (3/4 width) */}
                <div className="lg:col-span-3">
                  <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Interactive Chart</h4>
                  <div className="bg-white rounded-lg p-4 overflow-hidden" style={{ height: '600px' }}>
                    {chart.chartData && chart.metadata ? (
                      <div className="w-full h-full overflow-hidden">
                        {chart.chartType === 'natal' && (chart.metadata.natalChartData || realChartData) ? (
                          <UnifiedAstrologicalChart
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            chartData={realChartData || chart.metadata.natalChartData!}
                            chartType="natal"
                            showPlanetInfo={true}
                            showAspects={true}
                            showAngularMarkers={true}
                            className="w-full h-full [&>svg]:!min-h-0 [&>svg]:!max-h-full"
                          />
                        ) : chart.chartType === 'horary' ? (
                          <InteractiveHoraryChart
                            svgContent={chart.chartData}
                            chartData={chart.metadata.horaryChartData}
                            className="w-full h-full [&>svg]:!min-h-0 [&>svg]:!max-h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              {/* Three Square Loading Animation */}
                              <div className="flex items-center justify-center space-x-2 mb-4">
                                <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                              <p className="text-lg font-inter">
                                Loading {chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1)} Chart
                              </p>
                              <p className="text-sm text-gray-400 mt-2">Preparing chart data...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          {/* Three Square Loading Animation */}
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <p className="text-lg font-inter">
                            Loading {chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1)} Chart
                          </p>
                          <p className="text-sm text-gray-400 mt-2">Please wait...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Planets as Badges - Right Side (1/4 width) */}
                <div className="space-y-4">
                  <h4 className="font-space-grotesk font-bold text-black text-sm">Key Planets</h4>
                  <div className="flex flex-wrap gap-2">
                    {chart.metadata.planetSummary && chart.metadata.planetSummary.length > 0 ? (
                      chart.metadata.planetSummary.map((planet, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-inter font-medium border bg-white"
                          style={{ borderColor: '#e5e7eb', color: '#19181a' }}
                        >
                          {planet.planet} {planet.sign} {planet.house}H
                          {planet.isRetrograde && <span className="text-red-600"> ℞</span>}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs font-inter text-gray-500">No planet data available</p>
                    )}
                  </div>

                  {/* View More Button */}
                  <VertexBorderButton
                    onClick={handleViewMore}
                    className="w-full px-3 py-2 border border-gray-200 font-space-grotesk font-bold text-xs transition-all duration-300 hover:bg-black hover:text-white hover:border-transparent"
                    cornerSize="small"
                    style={{ 
                      backgroundColor: 'white',
                      color: '#19181a'
                    }}
                  >
                    View Full Details
                  </VertexBorderButton>
                </div>
              </div>
            </div>
          ) : (
            /* Full Display Mode */
            <div className="space-y-4">
              <ChartSummaryCard
                chartType={chart.chartType}
                metadata={chart.metadata}
                isPreview={false}
                onViewMore={() => setShowChartModal(true)}
              />
              
              {/* Major Aspects Section - Show computed aspects if available */}
              {chart.chartType === 'natal' && computedAspects.length > 0 && (
                <div className="border border-black bg-white">
                  <div className="p-4 bg-gray-50 border-b border-black">
                    <h4 className="font-space-grotesk font-bold text-black">
                      🌟 Major Aspects
                    </h4>
                    <p className="text-sm text-black/70 font-inter">
                      {computedAspects.length} aspects found
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {computedAspects.map((aspect, index) => {
                        // Parse aspect string to get aspect type for color coding
                        const aspectParts = aspect.split(' ');
                        const aspectType = aspectParts[1]?.toLowerCase() || '';
                        
                        // Get color based on aspect type (matching guides page colors)
                        const getAspectColor = () => {
                          switch (aspectType) {
                            case 'trine':
                            case 'sextile':
                              return 'text-black border-black';
                            case 'square':
                            case 'opposition':
                              return 'text-black border-black';
                            case 'conjunction':
                              return 'text-black border-black';
                            default:
                              return 'text-black border-black';
                          }
                        };
                        
                        const getAspectBgColor = () => {
                          switch (aspectType) {
                            case 'trine':
                            case 'sextile':
                              return '#a2ffdb'; // harmonious - light green from guides
                            case 'square':
                            case 'opposition':
                              return '#ffd1f6'; // challenging - light pink from guides
                            case 'conjunction':
                              return '#a8e9ff'; // neutral - light blue from guides
                            default:
                              return '#fff27e'; // other - light yellow from guides
                          }
                        };
                        
                        return (
                          <span 
                            key={index}
                            className={`inline-block px-3 py-1 text-sm font-inter font-medium border ${getAspectColor()}`}
                            style={{ backgroundColor: getAspectBgColor() }}
                          >
                            {aspect}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Chart Attribution */}
        <div className="px-4 py-2 bg-gray-50 border-t border-black">
          <div className="flex items-center justify-between text-xs text-black/60 font-inter">
            <span>
              Chart created {new Date(chart.createdAt).toLocaleDateString()}
            </span>
            <span>
              Powered by {BRAND.name}
            </span>
          </div>
        </div>
      </div>

      {/* Full Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <h2 className="font-space-grotesk text-2xl font-bold text-black">
                  {chart.metadata.chartTitle}
                </h2>
                <button
                  onClick={() => setShowChartModal(false)}
                  className="p-2 hover:bg-gray-100 border border-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart SVG */}
                <div className="border border-black p-4 bg-gray-50">
                  <div className="w-full h-96 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      {/* Three Square Loading Animation */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <p className="text-lg font-inter">
                        Loading {chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1)} Chart
                      </p>
                      <p className="text-sm text-gray-400 mt-2">Preparing detailed view...</p>
                    </div>
                  </div>
                </div>

                {/* Chart Details */}
                <div>
                  <ChartSummaryCard
                    chartType={chart.chartType}
                    metadata={chart.metadata}
                    isPreview={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}