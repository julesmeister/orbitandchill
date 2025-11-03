/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Natal Chart Generation - Main Orchestration Module
 *
 * This module coordinates chart generation by composing services:
 * - Astronomical calculations (astroCalculationService)
 * - House system calculations (houseSystemService)
 * - Celestial points (celestialPointsService)
 * - Chart rendering (chartRenderingService)
 *
 * Professional-grade accuracy using astronomy-engine (MIT license)
 */

import { processBirthTime } from './timeZoneHandler';
import { calculatePlanetaryPositions } from '@/services/businessServices/astroCalculationService';
import { generateNatalChartSVG } from '@/services/dataServices/chartRenderingService';
import { ChartMetadata } from '@/types/astrology';

// Re-export types and constants for backward compatibility
export { SIGNS, PLANETS, CELESTIAL_POINTS, HOUSES, ASPECTS, ASTRONOMY_BODIES } from '@/constants/astrological';
export type { PlanetPosition, HousePosition, ChartAspect, NatalChartData, ChartMetadata } from '@/types/astrology';
export { formatAstrologicalDegree } from '@/utils/formatters/astroFormatters';

// Re-export services for direct access if needed
export { calculatePlanetaryPositions, calculateAspects } from '@/services/businessServices/astroCalculationService';
export { calculatePlacidusHouses, determineHouse } from '@/services/businessServices/houseSystemService';
export {
  calculateLilith,
  calculateLunarNodes,
  calculatePartOfFortune
} from '@/services/businessServices/celestialPointsService';
export { generateNatalChartSVG } from '@/services/dataServices/chartRenderingService';

/**
 * Generate natal chart from birth data
 * Main entry point for chart generation
 */
export async function generateNatalChart(birthData: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  coordinates: { lat: string; lon: string };
  locationOfBirth: string;
}): Promise<{ svg: string; metadata: ChartMetadata }> {
  // Process birth time with proper timezone handling
  const processedTime = processBirthTime({
    dateOfBirth: birthData.dateOfBirth,
    timeOfBirth: birthData.timeOfBirth,
    coordinates: birthData.coordinates,
    locationOfBirth: birthData.locationOfBirth
  });

  if (processedTime.confidence === 'low' || processedTime.warnings.length > 2) {
    console.warn('NATAL CHART ACCURACY WARNING:', processedTime.warnings);
  }

  const birthDate = processedTime.utcDate; // Use properly processed UTC date
  const latitude = parseFloat(birthData.coordinates.lat);
  const longitude = parseFloat(birthData.coordinates.lon);

  // Calculate planetary positions
  const chartData = await calculatePlanetaryPositions(birthDate, latitude, longitude);

  // Generate SVG with larger size for better display
  const svg = generateNatalChartSVG(chartData, 1000, 1000);

  // Validate SVG was generated successfully
  if (!svg || svg.length === 0) {
    throw new Error('SVG generation failed: No content generated');
  }

  return {
    svg,
    metadata: {
      name: birthData.name,
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      locationOfBirth: birthData.locationOfBirth,
      coordinates: birthData.coordinates,
      generatedAt: new Date().toISOString(),
      chartData,
      timeZone: processedTime.timeZone,
      utcOffset: processedTime.utcOffset,
    },
  };
}
