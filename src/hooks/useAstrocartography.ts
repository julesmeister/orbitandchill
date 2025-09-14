/* eslint-disable react-hooks/exhaustive-deps */
/**
 * useAstrocartography Hook
 * 
 * Manages astrocartography calculations and integrates with existing
 * natal chart data to provide planetary line coordinates.
 */

import { useState, useEffect, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { 
  calculateCompleteAstrocartography,
  AstrocartographyData
} from '../utils/astrocartography';
import { calculatePlanetaryPositions } from '../utils/natalChart';
import { processBirthTime } from '../utils/timeZoneHandler';

interface UseAstrocartographyOptions {
  /** Whether to automatically calculate when user data is available */
  autoCalculate?: boolean;
  /** Which planets to include in calculations */
  includePlanets?: string[];
  /** Minimum update interval in milliseconds */
  throttleMs?: number;
}

interface UseAstrocartographyReturn {
  /** Calculated astrocartography data */
  astrocartographyData: AstrocartographyData | null;
  /** Loading state */
  isCalculating: boolean;
  /** Error state */
  error: string | null;
  /** Manually trigger calculation */
  calculateAstrocartography: (birthData?: {
    date: Date;
    location: { latitude: number; longitude: number; };
  }) => Promise<AstrocartographyData | null>;
  /** Clear calculated data */
  clearData: () => void;
  /** Check if astrocartography can be calculated */
  canCalculate: boolean;
}

export function useAstrocartography({
  autoCalculate = true,
  includePlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
  throttleMs = 1000
}: UseAstrocartographyOptions = {}): UseAstrocartographyReturn {
  
  const { user, isProfileComplete } = useUserStore();
  
  const [astrocartographyData, setAstrocartographyData] = useState<AstrocartographyData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCalculation, setLastCalculation] = useState<number>(0);

  // Check if we can calculate astrocartography
  const canCalculate = useMemo(() => {
    return Boolean(
      isProfileComplete && 
      user?.birthData &&
      includePlanets.length > 0
    );
  }, [isProfileComplete, user?.birthData, includePlanets.length]);

  // Extract birth data from user store with proper timezone handling
  const birthData = useMemo(() => {
    if (!user?.birthData) return null;

    try {
      const latitude = parseFloat(user.birthData.coordinates.lat);
      const longitude = parseFloat(user.birthData.coordinates.lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn('Invalid coordinates in birth data');
        return null;
      }

      // Process birth time with proper timezone handling
      const processedTime = processBirthTime({
        dateOfBirth: user.birthData.dateOfBirth,
        timeOfBirth: user.birthData.timeOfBirth,
        coordinates: user.birthData.coordinates,
        locationOfBirth: user.birthData.locationOfBirth
      });

      if (processedTime.confidence === 'low' || processedTime.warnings.length > 2) {
        console.warn('ASTROCARTOGRAPHY ACCURACY WARNING:', processedTime.warnings);
      }

      return {
        date: processedTime.utcDate, // Use properly processed UTC date
        location: { latitude, longitude },
        timeZoneInfo: processedTime
      };
    } catch (error) {
      console.warn('Error parsing birth data:', error);
      
      // Fallback to naive date construction if timezone processing fails
      try {
        const fallbackDate = new Date(`${user.birthData.dateOfBirth}T${user.birthData.timeOfBirth}:00`);
        const latitude = parseFloat(user.birthData.coordinates.lat);
        const longitude = parseFloat(user.birthData.coordinates.lon);
        
        return {
          date: fallbackDate,
          location: { latitude, longitude },
          timeZoneInfo: null
        };
      } catch (fallbackError) {
        console.warn('Fallback date parsing also failed:', fallbackError);
        return null;
      }
    }
  }, [user?.birthData]);

  // Calculate astrocartography data
  const calculateAstrocartography = async (
    customBirthData?: {
      date: Date;
      location: { latitude: number; longitude: number; };
    }
  ): Promise<AstrocartographyData | null> => {
    const dataToUse = customBirthData || birthData;
    
    if (!dataToUse) {
      setError('Birth data is required for astrocartography calculations');
      return null;
    }

    if (includePlanets.length === 0) {
      setError('No planets specified for astrocartography');
      return null;
    }

    // Throttle calculations
    const now = Date.now();
    if (now - lastCalculation < throttleMs) {
      console.log('🔄 ASTRO: Throttling calculation, too recent:', now - lastCalculation, 'ms ago');
      return astrocartographyData;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Always calculate fresh planetary positions for astrocartography
      console.log('🔄 ASTRO: Calculating fresh planetary positions for astrocartography');
      const chartData = await calculatePlanetaryPositions(
        dataToUse.date,
        dataToUse.location.latitude,
        dataToUse.location.longitude
      );

      const planetaryDataToUse = chartData.planets
        .filter(planet => includePlanets.includes(planet.name))
        .map(planet => ({
          name: planet.name,
          rightAscension: planet.rightAscension!,
          declination: planet.declination!
        }));

      console.log('🔄 ASTRO: Fresh planetary positions calculated:', planetaryDataToUse.length);

      const result = calculateCompleteAstrocartography(
        planetaryDataToUse,
        dataToUse
      );

      setAstrocartographyData(result);
      setLastCalculation(now);
      
      console.log('🔄 ASTRO: Astrocartography calculation complete');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error calculating astrocartography:', error);
      setError(`Astrocartography calculation failed: ${errorMessage}`);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  // Clear data
  const clearData = () => {
    setAstrocartographyData(null);
    setError(null);
    setLastCalculation(0);
  };

  // Auto-calculate when conditions are met
  useEffect(() => {
    if (autoCalculate && canCalculate && !isCalculating && !astrocartographyData) {
      console.log('🔄 ASTRO: Auto-calculating astrocartography');
      calculateAstrocartography();
    }
  }, [autoCalculate, canCalculate, isCalculating, astrocartographyData]);

  // Clear data when user changes
  useEffect(() => {
    if (user?.id) {
      const currentUserId = user.id;
      const previousUserId = astrocartographyData?.birthData ? 'previous' : null;
      
      if (previousUserId && currentUserId !== previousUserId) {
        clearData();
      }
    }
  }, [user?.id]);

  return {
    astrocartographyData,
    isCalculating,
    error,
    calculateAstrocartography,
    clearData,
    canCalculate
  };
}

export default useAstrocartography;