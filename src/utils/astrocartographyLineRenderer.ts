/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astrocartography Line Renderer for WorldMap Integration
 * 
 * Handles the conversion of astrocartography calculations to SVG paths
 * that align properly with the responsive WorldMap component.
 * Solves the coordinate system mismatch between fixed calculations
 * and dynamic map sizing.
 */

import {
  calculateCompleteAstrocartography,
  optimizeLineForRendering
} from './astrocartography';
import { geoToSVGWithCorrections } from './mapProjectionCorrections';

export interface AstrocartographySVGLine {
  planet: string;
  lineType: 'MC' | 'IC' | 'AC' | 'DC';
  path: string;
  color: string;
  style: {
    strokeDasharray?: string;
    opacity?: number;
  };
}

export interface AstrocartographyRenderData {
  lines: AstrocartographySVGLine[];
  metadata: {
    calculatedAt: string;
    planetsCount: number;
    birthData: {
      date: string;
      latitude: number;
      longitude: number;
    };
  };
}

// Planet colors for consistent theming
export const PLANET_COLORS: { [key: string]: string } = {
  sun: '#FFD700',      // Gold
  moon: '#C0C0C0',     // Silver
  mercury: '#FFA500',  // Orange
  venus: '#FF69B4',    // Hot Pink
  mars: '#DC143C',     // Crimson
  jupiter: '#4B0082',  // Indigo
  saturn: '#8B4513',   // Saddle Brown
  uranus: '#40E0D0',   // Turquoise
  neptune: '#4169E1',  // Royal Blue
  pluto: '#800080',    // Purple
};

// Line type styles for different angular relationships
export const LINE_TYPE_STYLES = {
  MC: { strokeDasharray: 'none', opacity: 0.8 },      // Midheaven - solid
  IC: { strokeDasharray: 'none', opacity: 0.8 },      // Imum Coeli - solid
  AC: { strokeDasharray: '5,5', opacity: 0.7 },       // Ascendant - dashed
  DC: { strokeDasharray: '5,5', opacity: 0.7 },       // Descendant - dashed
};

/**
 * Convert geographic coordinates to World Map SVG coordinates
 * This function now uses the sophisticated zone-based correction system
 */
export function geoToWorldMapSVG(lat: number, lng: number, _svgElement?: SVGSVGElement): { x: number; y: number } {
  // Use the new sophisticated geographic zone-based corrections
  const result = geoToSVGWithCorrections(lat, lng, { width: 1000, height: 507.209 });
  
  // Log correction details for debugging astrocartography lines
  if (process.env.NODE_ENV === 'development') {
    console.log(`Astro line coord: (${lat.toFixed(3)}, ${lng.toFixed(3)}) → (${result.x.toFixed(1)}, ${result.y.toFixed(1)}) [zone: ${result.zoneUsed}]`);
  }
  
  return { x: result.x, y: result.y };
}

/**
 * Generate SVG path from geographic coordinates for world map overlay
 */
export function coordinatesToWorldMapPath(
  coordinates: Array<{ lat: number; lng: number }>,
  svgElement?: SVGSVGElement
): string {
  if (coordinates.length === 0) return '';
  
  let pathString = '';
  let isFirstPoint = true;
  
  coordinates.forEach((coord, index) => {
    const svgCoord = geoToWorldMapSVG(coord.lat, coord.lng, svgElement);
    
    // Handle antimeridian crossings by breaking the path
    if (index > 0) {
      const prevCoord = coordinates[index - 1];
      const lngDiff = Math.abs(coord.lng - prevCoord.lng);
      
      if (lngDiff > 180) {
        // Start a new path segment for antimeridian crossing
        pathString += ` M ${svgCoord.x} ${svgCoord.y}`;
        isFirstPoint = true;
        return;
      }
    }
    
    if (isFirstPoint) {
      pathString += `M ${svgCoord.x} ${svgCoord.y}`;
      isFirstPoint = false;
    } else {
      pathString += ` L ${svgCoord.x} ${svgCoord.y}`;
    }
  });
  
  return pathString;
}

/**
 * Calculate astrocartography lines for WorldMap integration
 */
export function calculateAstrocartographyForWorldMap(
  planetaryData: Array<{
    name: string;
    rightAscension?: number;
    declination?: number;
  }>,
  birthData: {
    date: Date;
    location: {
      latitude: number;
      longitude: number;
    };
  },
  options: {
    visiblePlanets?: string[];
    visibleLineTypes?: {
      MC?: boolean;
      IC?: boolean;
      AC?: boolean;
      DC?: boolean;
    };
    svgElement?: SVGSVGElement;
  } = {}
): AstrocartographyRenderData | null {
  const {
    visiblePlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'],
    visibleLineTypes = { MC: true, IC: true, AC: true, DC: true },
    svgElement
  } = options;
  
  // Filter valid planets with complete astronomical data
  const validPlanets = planetaryData.filter(planet =>
    planet.rightAscension !== undefined &&
    planet.declination !== undefined &&
    visiblePlanets.includes(planet.name)
  );
  
  if (validPlanets.length === 0) {
    return null;
  }
  
  // Calculate astrocartography data using existing utilities
  const astrocartographyData = calculateCompleteAstrocartography(
    validPlanets.map(planet => ({
      name: planet.name,
      rightAscension: planet.rightAscension!,
      declination: planet.declination!
    })),
    birthData
  );
  
  // Convert to SVG paths for world map overlay
  const svgLines: AstrocartographySVGLine[] = [];
  
  astrocartographyData.planets.forEach((planetData, planetIndex) => {
    const planetColor = PLANET_COLORS[planetData.planet] || '#6B7280';
    
    Object.entries(planetData.lines).forEach(([lineType, line]) => {
      const upperLineType = lineType.toUpperCase() as keyof typeof visibleLineTypes;
      if (!line || !visibleLineTypes[upperLineType]) {
        return;
      }
      
      // Optimize line for better rendering performance
      const optimizedLine = optimizeLineForRendering(line);
      if (optimizedLine.coordinates.length === 0) {
        return;
      }
      
      // Convert geographic coordinates to world map SVG path
      const svgPath = coordinatesToWorldMapPath(optimizedLine.coordinates, svgElement);
      
      if (svgPath) {
        svgLines.push({
          planet: planetData.planet,
          lineType: upperLineType,
          path: svgPath,
          color: planetColor,
          style: LINE_TYPE_STYLES[upperLineType]
        });
      }
    });
  });
  
  return {
    lines: svgLines,
    metadata: {
      calculatedAt: astrocartographyData.calculatedAt,
      planetsCount: astrocartographyData.planets.length,
      birthData: {
        date: birthData.date.toISOString(),
        latitude: birthData.location.latitude,
        longitude: birthData.location.longitude
      }
    }
  };
}

/**
 * Filter visible astrocartography lines based on user preferences
 */
export function filterVisibleLines(
  renderData: AstrocartographyRenderData,
  visiblePlanets: string[],
  visibleLineTypes: { [key: string]: boolean }
): AstrocartographySVGLine[] {
  return renderData.lines.filter(line =>
    visiblePlanets.includes(line.planet) &&
    visibleLineTypes[line.lineType]
  );
}

/**
 * Create SVG gradient definitions for planetary lines
 */
export function createPlanetaryGradients(): string {
  return Object.entries(PLANET_COLORS)
    .map(([planet, color]) => `
      <linearGradient id="astro-gradient-${planet}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.8" />
        <stop offset="50%" stop-color="${color}" stop-opacity="0.6" />
        <stop offset="100%" stop-color="${color}" stop-opacity="0.4" />
      </linearGradient>
    `).join('');
}

/**
 * Validate astrocartography data completeness
 */
export function validateAstrocartographyData(
  planetaryData: Array<{
    name: string;
    rightAscension?: number;
    declination?: number;
  }>,
  birthData: {
    date: Date;
    location: {
      latitude: number;
      longitude: number;
    };
  }
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate birth data
  if (!birthData.date || isNaN(birthData.date.getTime())) {
    errors.push('Invalid birth date');
  }
  
  if (Math.abs(birthData.location.latitude) > 90) {
    errors.push('Invalid latitude (must be between -90 and 90)');
  }
  
  if (Math.abs(birthData.location.longitude) > 180) {
    errors.push('Invalid longitude (must be between -180 and 180)');
  }
  
  // Validate planetary data
  const validPlanets = planetaryData.filter(planet =>
    planet.rightAscension !== undefined && planet.declination !== undefined
  );
  
  if (validPlanets.length === 0) {
    errors.push('No planets with valid astronomical coordinates');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}