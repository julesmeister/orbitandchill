/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import type { NatalChartData } from '../../utils/natalChart';
import { ZODIAC_SYMBOLS } from './ZodiacSymbols';
import ZodiacSymbolIcon from './tooltips/ZodiacSymbolIcon';

interface PlanetInfoStackProps {
  chartData: NatalChartData;
  getChartCoordinates: (astroLongitude: number, radius: number) => { x: number; y: number };
  selectedPlanets?: Set<string>;
  showCelestialPoints?: boolean;
}

const CELESTIAL_POINT_NAMES = ['lilith', 'northnode', 'southnode', 'partoffortune', 'vertex', 'chiron'];

const isCelestialPoint = (name: string): boolean => {
  const normalized = name.toLowerCase().replace(/\s+/g, '');
  return CELESTIAL_POINT_NAMES.includes(normalized);
};

export const PlanetInfoStack: React.FC<PlanetInfoStackProps> = ({
  chartData,
  getChartCoordinates,
  selectedPlanets = new Set(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']),
  showCelestialPoints = false
}) => {
  const selectedPlanetsLower = new Set(Array.from(selectedPlanets).map(p => p.toLowerCase()));

  const filteredPlanets = chartData.planets.filter(planet => {
    const normalized = planet.name.toLowerCase();
    const isCelestial = isCelestialPoint(planet.name);
    if (!selectedPlanetsLower.has(normalized) && !isCelestial) return false;
    if (isCelestial && !showCelestialPoints && !selectedPlanetsLower.has(normalized)) return false;
    return true;
  });

  return (
    <g className="planet-info-stack">
      {filteredPlanets.map((planet, planetIndex) => {
        const longitude = typeof planet.longitude === 'number' && !isNaN(planet.longitude)
          ? planet.longitude
          : 0;

        const degreeInSign = Math.floor(longitude % 30);
        const minuteInSign = Math.floor(((longitude % 30) - degreeInSign) * 60);

        const degreesPos = getChartCoordinates(longitude, 340);
        const signPos = getChartCoordinates(longitude, 315);
        const minutesPos = getChartCoordinates(longitude, 292);
        const retrogradePos = getChartCoordinates(longitude, 274);

        return (
          <g key={`info-stack-${planetIndex}`}>
            <text
              x={degreesPos.x}
              y={degreesPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontFamily="Arial, sans-serif"
              fill="#374151"
              fontWeight="600"
            >
              {degreeInSign}°
            </text>

            <g transform={`translate(${signPos.x}, ${signPos.y})`}>
              <g transform="scale(1.3) translate(-8, -8)">
                <ZodiacSymbolIcon 
                  symbol={ZODIAC_SYMBOLS[Math.floor(longitude / 30)]} 
                  size="large" 
                  asInlineSVG={true}
                />
              </g>
            </g>

            <text
              x={minutesPos.x}
              y={minutesPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontFamily="Arial, sans-serif"
              fill="#64748b"
            >
              {minuteInSign}'
            </text>

            {planet.retrograde && (
              <text
                x={retrogradePos.x}
                y={retrogradePos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
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
