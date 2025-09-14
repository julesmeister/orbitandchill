/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useEffect } from 'react';
import { Person } from '../../../types/people';
import { processBirthTime } from '../../../utils/timeZoneHandler';
import { PLANET_COLORS, coordinatesToWorldMapPath } from '../../../utils/astrocartographyLineRenderer';
import { calculateParans } from '../../../utils/paranCalculations';

interface UseAstrocartographyDataProps {
  currentPerson: Person | null;
  astrocartographyData: any;
  visiblePlanets: string[];
  visibleLineTypes: any;
  hasFreshAstroData: React.MutableRefObject<boolean>;
  stableAstroLines: any[];
  hasCheckedCache: boolean;
  userId?: string;
  setStableAstroLines: (lines: any[]) => void;
  setParans: (parans: any[]) => void;
  setHasCheckedCache: (checked: boolean) => void;
  setHasInitialLoad: (loaded: boolean) => void;
}

export function useAstrocartographyData({
  currentPerson,
  astrocartographyData,
  visiblePlanets,
  visibleLineTypes,
  hasFreshAstroData,
  stableAstroLines,
  hasCheckedCache,
  userId,
  setStableAstroLines,
  setParans,
  setHasCheckedCache,
  setHasInitialLoad
}: UseAstrocartographyDataProps) {

  // Process birth data with proper time zone handling
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
      // Updating stable astrocartography lines from fresh data
      hasFreshAstroData.current = true;

      // Convert astrocartography data to SVG lines
      const svgLines: any[] = [];

      astrocartographyData.planets.forEach((planetData: any) => {
        const planetColor = PLANET_COLORS[planetData.planet] || '#6B7280';

        Object.entries(planetData.lines).forEach(([lineType, line]) => {
          const upperLineType = lineType.toUpperCase() as keyof typeof visibleLineTypes;
          if (!line || !visibleLineTypes[upperLineType] || !visiblePlanets.includes(planetData.planet)) {
            return;
          }

          // Convert geographic coordinates to world map SVG path
          const svgPath = coordinatesToWorldMapPath((line as any).coordinates);

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
  }, [astrocartographyData, visiblePlanets, visibleLineTypes, hasFreshAstroData, setStableAstroLines]);

  // Calculate astrocartography lines for WorldMap integration
  const astrocartographyLines = useMemo(() => {
    // Use stable lines if we have fresh data
    if (hasFreshAstroData.current && stableAstroLines.length > 0) {
      // Using stable fresh astrocartography lines
      return stableAstroLines;
    }

    // No fallback needed - we always use fresh astrocartography data
    // No fresh astrocartography data available yet
    return [];
  }, [stableAstroLines]);

  // Check if we have the necessary data for astrocartography
  const hasAstroData = astrocartographyLines.length > 0;

  // Calculate parans when astrocartography data is available
  useEffect(() => {
    if (astrocartographyData && astrocartographyData.planets.length > 0) {
      const calculatedParans = calculateParans(astrocartographyData);
      setParans(calculatedParans);
    }
  }, [astrocartographyData, setParans]);

  // Initialize fresh data on mount
  useEffect(() => {
    if (userId && !hasCheckedCache) {
      setHasCheckedCache(true);
      // Since we're using API-only architecture without caching,
      // we always want fresh calculations
      setHasInitialLoad(false);
      hasFreshAstroData.current = false;
    }
  }, [userId, hasCheckedCache, setHasCheckedCache, setHasInitialLoad, hasFreshAstroData]);

  // Reset fresh data flag and stable lines when person changes
  useEffect(() => {
    hasFreshAstroData.current = false;
    setStableAstroLines([]);
  }, [currentPerson?.id, setStableAstroLines, hasFreshAstroData]);

  return {
    birthData,
    timeZoneInfo,
    astrocartographyLines,
    hasAstroData
  };
}