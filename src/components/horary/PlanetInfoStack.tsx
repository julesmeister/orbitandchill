/* eslint-disable react/no-unescaped-entities */
/**
 * PlanetInfoStack component for rendering planet information rings around the chart
 */

import React from 'react';
import type { NatalChartData } from '../../utils/natalChart';
import { ZODIAC_SYMBOLS } from './ZodiacSymbols';
import ZodiacSymbolIcon from './tooltips/ZodiacSymbolIcon';

interface PlanetInfoStackProps {
  chartData: NatalChartData;
  getChartCoordinates: (astroLongitude: number, radius: number) => { x: number; y: number };
}

export const PlanetInfoStack: React.FC<PlanetInfoStackProps> = ({
  chartData,
  getChartCoordinates
}) => {
  return (
    <g className="planet-info-stack">
      {chartData.planets.map((planet, planetIndex) => {
        const longitude = typeof planet.longitude === 'number' && !isNaN(planet.longitude)
          ? planet.longitude
          : 0;

        // Calculate degree and minute within sign
        const degreeInSign = Math.floor(longitude % 30);
        const minuteInSign = Math.floor(((longitude % 30) - degreeInSign) * 60);

        // Use unified coordinate system
        const degreesPos = getChartCoordinates(longitude, 340);
        const signPos = getChartCoordinates(longitude, 310);
        const minutesPos = getChartCoordinates(longitude, 280);
        const retrogradePos = getChartCoordinates(longitude, 260);

        return (
          <g key={`info-stack-${planetIndex}`}>
            {/* Degrees - second ring from outer */}
            <text
              x={degreesPos.x}
              y={degreesPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontFamily="Arial, sans-serif"
              fill="#374151"
              fontWeight="600"
            >
              {degreeInSign}°
            </text>

            {/* Zodiac Sign - third ring from outer */}
            <g transform={`translate(${signPos.x}, ${signPos.y})`}>
              <g transform="scale(1.5) translate(-8, -8)">
                <ZodiacSymbolIcon 
                  symbol={ZODIAC_SYMBOLS[Math.floor(longitude / 30)]} 
                  size="large" 
                  asInlineSVG={true}
                />
              </g>
            </g>

            {/* Minutes - fourth ring from outer */}
            <text
              x={minutesPos.x}
              y={minutesPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontFamily="Arial, sans-serif"
              fill="#64748b"
            >
              {minuteInSign}'
            </text>

            {/* Retrograde - innermost ring (closest to houses) */}
            {planet.retrograde && (
              <text
                x={retrogradePos.x}
                y={retrogradePos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontFamily="Arial, sans-serif"
                fill="#dc2626"
                fontWeight="bold"
              >
                ℞
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};