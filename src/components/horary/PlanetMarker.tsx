/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PlanetPosition } from "../../utils/natalChart";
import { calculateSVGAngle } from "../../utils/horaryCalculations";

interface PlanetMarkerProps {
  planet: PlanetPosition;
  ascendantLongitude: number;
  showCircles?: boolean;
  sunLongitude?: number;
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

const planetSymbols: { [key: string]: string } = {
  sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
  jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇",
  lilith: "⚸", chiron: "⚷",
  northNode: "☊", southNode: "☋", partOfFortune: "⊕", vertex: "Vx"
};

const planetColors: { [key: string]: string } = {
  sun: "#FF8C00", moon: "#C0C0C0", mercury: "#FFA500", venus: "#FF69B4",
  mars: "#FF4500", jupiter: "#9932CC", saturn: "#8B4513", uranus: "#4169E1",
  neptune: "#4682B4", pluto: "#8B0000", lilith: "#800080", chiron: "#228B22",
  northNode: "#4682B4", southNode: "#708090", partOfFortune: "#DAA520",
  vertex: "#DC143C"
};

const isCombust = (planetLongitude: number, sunLongitude: number): boolean => {
  const distance = Math.abs(planetLongitude - sunLongitude);
  return distance <= 8.5 || distance >= 351.5;
};

export const PlanetMarker: React.FC<PlanetMarkerProps> = ({
  planet,
  ascendantLongitude,
  showCircles = true,
  sunLongitude,
  onMouseEnter,
  onMouseLeave
}) => {
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius;
    return { x, y };
  };

  const longitude = typeof planet.longitude === 'number' && !isNaN(planet.longitude)
    ? planet.longitude
    : 0;

  const planetRadius = 380;
  const position = getChartCoordinates(longitude, planetRadius);
  const pointerStart = getChartCoordinates(longitude, 420);
  const pointerEnd = getChartCoordinates(longitude, 405);

  if (isNaN(position.x) || isNaN(position.y)) {
    return null;
  }

  const planetIsCombust = planet.name !== 'sun' && sunLongitude !== undefined && isCombust(planet.longitude, sunLongitude);
  const planetColor = planetColors[planet.name] || "#333333";
  const planetSymbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();
  const isVertex = planet.name === 'vertex';
  
  return (
    <g>
      {showCircles && (
        <line
          x1={pointerStart.x}
          y1={pointerStart.y}
          x2={pointerEnd.x}
          y2={pointerEnd.y}
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.8"
        />
      )}

      {showCircles && (
        <circle
          cx={position.x}
          cy={position.y}
          r="20"
          fill="none"
          stroke={planetIsCombust ? "#dc2626" : planetColor}
          strokeWidth="2"
          strokeDasharray="4,2"
          opacity={planetIsCombust ? 0.6 : 0.8}
        />
      )}

      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isVertex ? "18" : "24"}
        fontFamily="Arial, sans-serif"
        fill={planetIsCombust ? "#dc2626" : planetColor}
        opacity={planetIsCombust ? 0.7 : 1}
        style={{ cursor: 'pointer' }}
        onMouseEnter={(e) => onMouseEnter?.(e, {
          type: 'planet',
          name: planet.name,
          longitude: planet.longitude,
          sign: planet.sign,
          house: planet.house,
          retrograde: planet.retrograde
        })}
        onMouseLeave={onMouseLeave}
      >
        {planetSymbol}
      </text>
    </g>
  );
};
