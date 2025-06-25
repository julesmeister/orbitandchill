/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AstrocartographyLines Component
 * 
 * Renders planetary astrocartography lines on the WorldMap by calculating
 * where MC/IC and AC/DC lines should appear based on birth data.
 */

import React, { useMemo } from 'react';
import { 
  calculateCompleteAstrocartography, 
  optimizeLineForRendering
} from '../../utils/astrocartography';
import { geoToSVGWithCorrections, MapProjectionUtils } from '../../utils/mapProjectionCorrections';

interface AstrocartographyLinesProps {
  /** Birth data for calculating planetary lines */
  birthData: {
    date: Date;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  /** Planetary data from natal chart calculation */
  planetaryData: Array<{
    name: string;
    rightAscension?: number;
    declination?: number;
  }>;
  /** Map container dimensions for coordinate conversion */
  mapDimensions?: {
    width: number;
    height: number;
  };
  /** Which planets to show lines for */
  visiblePlanets?: string[];
  /** Whether to show specific line types */
  visibleLineTypes?: {
    MC?: boolean;  // Midheaven lines
    IC?: boolean;  // Imum Coeli lines  
    AC?: boolean;  // Ascendant lines
    DC?: boolean;  // Descendant lines
  };
  /** Line styling options */
  lineStyle?: {
    opacity?: number;
    strokeWidth?: number;
  };
  /** Callback when a line is hovered */
  onLineHover?: (planet: string, lineType: string) => void;
  /** Callback when hover ends */
  onLineHoverEnd?: () => void;
}

// Planet colors for consistent theming
const PLANET_COLORS: { [key: string]: string } = {
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

// Line type styles
const LINE_TYPE_STYLES = {
  MC: { strokeDasharray: 'none', opacity: 0.8 },
  IC: { strokeDasharray: 'none', opacity: 0.8 },
  AC: { strokeDasharray: '5,5', opacity: 0.7 },
  DC: { strokeDasharray: '5,5', opacity: 0.7 },
};

export default function AstrocartographyLines({
  birthData,
  planetaryData,
  mapDimensions = { width: 1000, height: 500 },
  visiblePlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'],
  visibleLineTypes = { MC: true, IC: true, AC: true, DC: true },
  lineStyle = { opacity: 0.7, strokeWidth: 2 },
  onLineHover,
  onLineHoverEnd
}: AstrocartographyLinesProps) {
  
  // Debug logging
  console.log('AstrocartographyLines Props:', {
    birthData: birthData ? 'present' : 'missing',
    planetaryDataCount: planetaryData.length,
    planetaryData,
    visiblePlanets,
    visibleLineTypes,
    mapDimensions
  });
  
  // Calculate astrocartography data
  const astrocartographyData = useMemo(() => {
    const validPlanets = planetaryData.filter(planet => 
      planet.rightAscension !== undefined && 
      planet.declination !== undefined &&
      visiblePlanets.includes(planet.name)
    );

    console.log('AstrocartographyLines Calculation:', {
      allPlanets: planetaryData,
      validPlanets,
      visiblePlanets,
      hasValidPlanets: validPlanets.length > 0
    });

    if (validPlanets.length === 0) {
      console.log('No valid planets for astrocartography calculation');
      return null;
    }

    const result = calculateCompleteAstrocartography(
      validPlanets.map(planet => ({
        name: planet.name,
        rightAscension: planet.rightAscension!,
        declination: planet.declination!
      })),
      birthData
    );

    console.log('Astrocartography calculation result:', result);
    return result;
  }, [birthData, planetaryData, visiblePlanets]);

  // Convert geographic coordinates to SVG coordinates with zone-based corrections
  const geoToSVG = useMemo(() => {
    return (lat: number, lng: number) => {
      // Use sophisticated geographic zone-based corrections
      const result = geoToSVGWithCorrections(lat, lng, mapDimensions);
      
      // Log correction details for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Coordinate conversion: (${lat.toFixed(3)}, ${lng.toFixed(3)}) → (${result.x.toFixed(1)}, ${result.y.toFixed(1)}) [zone: ${result.zoneUsed}]`);
      }
      
      return { x: result.x, y: result.y };
    };
  }, [mapDimensions]);

  // Convert astrocartography lines to SVG paths
  const svgPaths = useMemo(() => {
    if (!astrocartographyData) return [];

    const paths: Array<{
      planet: string;
      lineType: string;
      path: string;
      color: string;
      style: {
        strokeDasharray?: string;
        opacity?: number;
      };
    }> = [];

    astrocartographyData.planets.forEach(planetData => {
      const planetColor = PLANET_COLORS[planetData.planet] || '#666666';

      Object.entries(planetData.lines).forEach(([lineType, line]) => {
        const upperLineType = lineType.toUpperCase() as keyof typeof visibleLineTypes;
        if (!line || !visibleLineTypes[upperLineType]) return;

        const optimizedLine = optimizeLineForRendering(line);
        if (optimizedLine.coordinates.length === 0) return;

        // Convert coordinates to SVG path
        let pathString = '';
        let isFirstPoint = true;

        optimizedLine.coordinates.forEach((coord, index) => {
          const svgCoord = geoToSVG(coord.lat, coord.lng);
          
          // Handle antimeridian crossings by breaking the path
          if (index > 0) {
            const prevCoord = optimizedLine.coordinates[index - 1];
            const lngDiff = Math.abs(coord.lng - prevCoord.lng);
            
            if (lngDiff > 180) {
              // Start a new path segment
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

        if (pathString) {
          paths.push({
            planet: planetData.planet,
            lineType: upperLineType,
            path: pathString,
            color: planetColor,
            style: LINE_TYPE_STYLES[upperLineType]
          });
        }
      });
    });

    console.log('AstrocartographyLines: Generated SVG paths:', paths);
    
    return paths;
  }, [astrocartographyData, geoToSVG, visibleLineTypes]);

  if (!astrocartographyData || svgPaths.length === 0) {
    // Show debug info even when no data
    return (
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
        viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <text x="50%" y="50%" textAnchor="middle" fill="blue" fontSize="14">
          Astrocartography Lines: {!astrocartographyData ? 'No Data' : `${svgPaths.length} paths`}
        </text>
        {/* Test line */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="blue" strokeWidth="2" opacity="0.5" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="blue" strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }

  console.log('AstrocartographyLines: Final render:', {
    svgPathsCount: svgPaths.length,
    mapDimensions,
    astrocartographyData: !!astrocartographyData
  });

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
      viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Create gradients for each planet */}
        {Object.entries(PLANET_COLORS).map(([planet, color]) => (
          <linearGradient
            key={`gradient-${planet}`}
            id={`astro-gradient-${planet}`}
            x1="0%" y1="0%" x2="0%" y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>

      {/* Render astrocartography lines */}
      <g className="astrocartography-lines">
        {svgPaths.map((pathData, index) => (
          <path
            key={`${pathData.planet}-${pathData.lineType}-${index}`}
            d={pathData.path}
            stroke={`url(#astro-gradient-${pathData.planet})`}
            strokeWidth={lineStyle.strokeWidth}
            strokeDasharray={pathData.style.strokeDasharray}
            fill="none"
            opacity={(lineStyle.opacity || 0.7) * (pathData.style.opacity || 1)}
            className="astrocartography-line pointer-events-auto cursor-pointer hover:opacity-100 transition-opacity duration-200"
            onMouseEnter={() => onLineHover?.(pathData.planet, pathData.lineType)}
            onMouseLeave={() => onLineHoverEnd?.()}
          />
        ))}
      </g>

      {/* Legend removed - now handled by toggle buttons outside the map */}
    </svg>
  );
}

// Export additional utility functions for external use
export { PLANET_COLORS, LINE_TYPE_STYLES };