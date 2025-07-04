/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { 
  analyzeAstrocartographyPoint,
  calculateLineDistance
} from '../../../utils/astrocartographyDistanceCalculator';
import { findParansAtLatitude } from '../../../utils/paranCalculations';

interface UseAstrocartographyHandlersProps {
  astrocartographyLines: any[];
  parans: any[];
  setClickedCoords: (coords: { lat: number; lng: number } | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAstroAnalysis: (analysis: any) => void;
  setSelectedCountry: (country: string | null) => void;
  setHoveredLine: (line: { planet: string; lineType: string } | null) => void;
}

export function useAstrocartographyHandlers({
  astrocartographyLines,
  parans,
  setClickedCoords,
  setIsAnalyzing,
  setAstroAnalysis,
  setSelectedCountry,
  setHoveredLine
}: UseAstrocartographyHandlersProps) {
  
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

  return {
    handleCountryClick,
    handleLineHover,
    handleLineHoverEnd,
    handleMapClick
  };
}