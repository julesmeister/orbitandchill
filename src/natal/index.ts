/**
 * Natal Chart Library - JavaScript Implementation
 * Main entry point for the natal chart calculation and rendering library
 * 
 * This is a JavaScript translation of the Python natal library,
 * providing astrological calculation and chart generation capabilities.
 */

// Core data structures and types
import {
  CelestialBody,
  Planet,
  ChartPoint,
  House,
  Aspect,
  NatalChart,
  type Coordinates,
  type BirthData
} from './types';

export {
  // Classes
  CelestialBody,
  Planet,
  ChartPoint,
  House,
  Aspect,
  NatalChart,
  
  // Interfaces
  type Coordinates,
  type BirthData
};

// Constants and mappings
export {
  PLANETS,
  SIGNS,
  ASPECTS,
  HOUSE_SYSTEMS,
  CHART_POINTS,
  ELEMENTS,
  MODALITIES,
  POLARITIES,
  SIGN_NAMES,
  PLANET_NAMES,
  ASPECT_NAMES,
  getSignFromDegree,
  getDegreeInSign,
  normalizeAngle
} from './constants';

// Configuration and theming
import {
  ChartConfig,
  type DisplaySettings,
  THEMES,
  DEFAULT_ORBS,
  TIGHT_ORBS,
  WIDE_ORBS,
  DEFAULT_DISPLAY,
  PRESET_CONFIGS
} from './config';

export {
  ChartConfig,
  type DisplaySettings,
  THEMES,
  DEFAULT_ORBS,
  TIGHT_ORBS,
  WIDE_ORBS,
  DEFAULT_DISPLAY,
  PRESET_CONFIGS
};

// Core calculation engine
import { Data } from './data';

// Chart rendering
import { ChartRenderer } from './charts/renderer';

// Statistical analysis
import {
  ChartStats,
  type ChartStatistics,
  type ElementDistribution,
  type ModalityDistribution,
  type PolarityDistribution,
  type HouseDistribution,
  type QuadrantDistribution,
  type HemisphereDistribution,
  type AspectGrid
} from './stats';

// Re-export for external use
export { Data };
export { ChartRenderer };
export {
  ChartStats,
  type ChartStatistics,
  type ElementDistribution,
  type ModalityDistribution,
  type PolarityDistribution,
  type HouseDistribution,
  type QuadrantDistribution,
  type HemisphereDistribution,
  type AspectGrid
};

// Astronomical calculations
export {
  getJulianDay,
  degreesToRadians,
  radiansToDegrees,
  normalizeAngle as normalizeAngleCalc,
  calculatePlanetPosition,
  calculateHouseCusps,
  calculateMidheaven,
  calculateAspect,
  getAllPlanetPositions,
  validateInputs
} from './calculations/ephemeris';

// Types are already exported above, no need to re-export

// Chart metadata interface
export interface ChartMetadata {
  generatedAt: string;
  birthData: BirthData;
  chartType: string;
  version: string;
  configuration: {
    theme: string;
    dimensions: { width: number; height: number };
    houseSystem: string;
    orbs: Record<string, number>;
  };
}

// Main chart generation function (convenience wrapper)
export function generateNatalChart(birthData: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
}, config?: Partial<ChartConfig>): { svg: string; data: Data; metadata: ChartMetadata } {
  try {
    // Convert string inputs to proper types
    const dateTime = new Date(`${birthData.dateOfBirth}T${birthData.timeOfBirth}`);
    const coordinates = {
      lat: parseFloat(birthData.coordinates.lat),
      lon: parseFloat(birthData.coordinates.lon)
    };

    // Create birth data object
    const natalBirthData: BirthData = {
      name: birthData.name,
      dateTime,
      coordinates
    };

    // Create configuration
    const chartConfig = new ChartConfig(
      config?.theme || 'light',
      config?.width || 600,
      config?.height || 600,
      config?.orbs || DEFAULT_ORBS,
      config?.display || DEFAULT_DISPLAY,
      config?.houseSystem || 'Placidus'
    );

    // Calculate chart data
    const data = new Data(natalBirthData, chartConfig);

    // Generate SVG
    const renderer = new ChartRenderer(data, chartConfig);
    const svg = renderer.generateSVG();

    // Generate metadata
    const metadata = {
      generatedAt: new Date().toISOString(),
      birthData: natalBirthData,
      chartType: 'natal',
      version: '1.0.0',
      configuration: {
        theme: chartConfig.theme,
        dimensions: { width: chartConfig.width, height: chartConfig.height },
        houseSystem: chartConfig.houseSystem,
        orbs: chartConfig.orbs
      }
    };

    return { svg, data, metadata };

  } catch (error) {
    throw new Error(`Failed to generate natal chart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Chart generation with statistics
export function generateNatalChartWithStats(birthData: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
}, config?: Partial<ChartConfig>): { 
  svg: string; 
  data: Data; 
  stats: ChartStatistics; 
  report: string;
  metadata: ChartMetadata 
} {
  const result = generateNatalChart(birthData, config);
  
  // Generate statistics
  const statsCalculator = new ChartStats(result.data);
  const stats = statsCalculator.getStatistics();
  const report = statsCalculator.generateReport();

  return {
    ...result,
    stats,
    report
  };
}

// Version information
export const VERSION = '1.0.0';
export const DESCRIPTION = 'JavaScript natal chart calculation and rendering library';

// Library information
export const LIBRARY_INFO = {
  name: 'Natal Chart JS',
  version: VERSION,
  description: DESCRIPTION,
  author: 'Luckstrology',
  license: 'MIT',
  homepage: 'https://luckstrology.com',
  repository: 'https://github.com/luckstrology/natal-js',
  keywords: ['astrology', 'natal chart', 'horoscope', 'ephemeris', 'astronomy'],
  features: [
    'Precise astronomical calculations',
    'Multiple house systems support',
    'Comprehensive aspect calculations',
    'SVG chart generation',
    'Statistical analysis',
    'Multiple chart themes',
    'Collision avoidance for planet symbols',
    'Special pattern detection (T-squares, Grand Trines, etc.)',
    'Export capabilities (JSON, HTML reports)'
  ],
  limitations: [
    'Simplified ephemeris calculations (for production use, integrate with Swiss Ephemeris)',
    'Basic house system implementations',
    'Limited to natal charts (no progressions or transits)',
    'No timezone handling (assumes UTC input)'
  ]
};

// Default export for convenience
const NatalChartLibrary = {
  generateChart: generateNatalChart,
  generateChartWithStats: generateNatalChartWithStats,
  Data,
  ChartRenderer,
  ChartStats,
  ChartConfig,
  PRESET_CONFIGS,
  LIBRARY_INFO
};

export default NatalChartLibrary;