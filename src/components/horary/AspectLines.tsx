/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AspectLines component for rendering astrological aspects in horary charts
 */

import React from 'react';
import type { NatalChartData } from '../../utils/natalChart';
import { CELESTIAL_POINTS } from '../../constants/astrological';

interface AspectLinesProps {
  chartData: NatalChartData;
  getChartCoordinates: (astroLongitude: number, radius: number) => { x: number; y: number };
  onAspectHover: (event: React.MouseEvent, aspect: any) => void;
  onAspectHoverEnd: () => void;
  showCelestialPointAspects?: boolean;
}

/**
 * Helper to get stroke dash array for different aspect types
 */
const getStrokeDashArray = (aspectType: string): string => {
  switch (aspectType) {
    case 'conjunction':
    case 'opposition':
      return 'none';
    case 'trine':
    case 'sextile':
      return '4,2';
    case 'square':
      return '8,4';
    default:
      return '2,2';
  }
};

export const AspectLines: React.FC<AspectLinesProps> = ({
  chartData,
  getChartCoordinates,
  onAspectHover,
  onAspectHoverEnd,
  showCelestialPointAspects = true
}) => {
  const aspectRadius = 150;

  // Helper function to check if a planet/point is a celestial point
  const isCelestialPoint = (name: string): boolean => {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    return CELESTIAL_POINTS.some(cp =>
      cp.toLowerCase().replace(/\s+/g, '') === normalizedName
    );
  };

  return (
    <g className="aspect-lines">
      {chartData.aspects.map((aspect) => {
        const planet1 = chartData.planets.find(p => p.name === aspect.planet1);
        const planet2 = chartData.planets.find(p => p.name === aspect.planet2);

        if (!planet1 || !planet2) return null;

        // Filter out celestial point aspects if toggle is off
        if (!showCelestialPointAspects) {
          const isP1Celestial = isCelestialPoint(aspect.planet1);
          const isP2Celestial = isCelestialPoint(aspect.planet2);

          // Skip this aspect if either planet is a celestial point
          if (isP1Celestial || isP2Celestial) {
            return null;
          }
        }

        // Use unified coordinate system for aspect lines
        const pos1 = getChartCoordinates(planet1.longitude, aspectRadius);
        const pos2 = getChartCoordinates(planet2.longitude, aspectRadius);

        return (
          <g key={`${aspect.planet1}-${aspect.planet2}-${aspect.aspect}`}>
            <line
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={aspect.color}
              strokeWidth={aspect.applying ? "2.5" : "1.5"}
              strokeDasharray={getStrokeDashArray(aspect.aspect)}
              opacity={aspect.applying ? 0.8 : 0.6}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => onAspectHover(e, aspect)}
              onMouseLeave={onAspectHoverEnd}
            />
            <circle
              cx={(pos1.x + pos2.x) / 2}
              cy={(pos1.y + pos2.y) / 2}
              r="4"
              fill={aspect.color}
              opacity={0.7}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => onAspectHover(e, aspect)}
              onMouseLeave={onAspectHoverEnd}
            />
          </g>
        );
      })}
    </g>
  );
};