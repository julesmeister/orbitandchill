/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef } from 'react';
import { AstrocartographyAnalysis } from '../../../utils/astrocartographyDistanceCalculator';
import { Paran } from '../../../utils/paranCalculations';

export function useAstrocartographyState() {
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

  const [showReferencePoints, setShowReferencePoints] = useState(false);
  const [showParans, setShowParans] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [hasCheckedCache, setHasCheckedCache] = useState(false);

  // Track whether we have fresh astrocartography data to prevent fallback to cached data
  const hasFreshAstroData = useRef(false);
  const [stableAstroLines, setStableAstroLines] = useState<any[]>([]);

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

  const closeAnalysis = () => {
    setAstroAnalysis(null);
    setClickedCoords(null);
    setIsAnalyzing(false);
  };

  return {
    // State
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
    
    // Setters
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
    
    // Actions
    togglePlanet,
    toggleLineType,
    toggleFullscreen,
    closeAnalysis
  };
}