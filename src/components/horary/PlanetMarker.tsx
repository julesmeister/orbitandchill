/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PlanetPosition } from "../../utils/natalChart";
import { calculateSVGAngle } from "../../utils/horaryCalculations";

interface PlanetMarkerProps {
  planet: PlanetPosition;
  ascendantLongitude: number; // Pass the ascendant longitude for proper rotation
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

// Planet symbols and colors matching _Old.tsx exactly
const planetSymbols: { [key: string]: string } = {
  sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
  jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇",
  northNode: "☊", southNode: "☋", partOfFortune: "⊕"
};

const planetColors: { [key: string]: string } = {
  sun: "#FFD700", moon: "#C0C0C0", mercury: "#FFA500", venus: "#FF69B4",
  mars: "#FF4500", jupiter: "#9932CC", saturn: "#8B4513", uranus: "#4169E1",
  neptune: "#00CED1", pluto: "#8B0000", northNode: "#6b21a8", southNode: "#6b21a8",
  partOfFortune: "#10b981"
};

// Helper function to check if planet is combust (within 8°30' of Sun)
const isCombust = (planetLongitude: number, sunLongitude: number): boolean => {
  const distance = Math.abs(planetLongitude - sunLongitude);
  return distance <= 8.5 || distance >= 351.5; // Account for 360° wrap
};

// Traditional planetary rulerships for significator detection
const SIGN_RULERS = {
  'aries': 'mars',
  'taurus': 'venus',
  'gemini': 'mercury',
  'cancer': 'moon',
  'leo': 'sun',
  'virgo': 'mercury',
  'libra': 'venus',
  'scorpio': 'mars',
  'sagittarius': 'jupiter',
  'capricorn': 'saturn',
  'aquarius': 'saturn',
  'pisces': 'jupiter'
};

export const PlanetMarker: React.FC<PlanetMarkerProps> = ({
  planet,
  ascendantLongitude,
  onMouseEnter,
  onMouseLeave
}) => {
  // Unified coordinate conversion function (same as in main chart)
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius; // Negative Y for correct orientation
    
    return { x, y };
  };

  // Calculate position using unified coordinate system
  const longitude = typeof planet.longitude === 'number' && !isNaN(planet.longitude)
    ? planet.longitude
    : 0;

  const radius = 380; // Planets close to outer zodiac ring, matching _Old.tsx
  const position = getChartCoordinates(longitude, radius);

  // Check for NaN coordinates
  if (isNaN(position.x) || isNaN(position.y)) {
    console.warn('Invalid planet coordinates for', planet.name, { longitude, position });
    return null;
  }

  // Calculate additional planetary conditions (matching _Old.tsx)
  // For now, we'll use mock data for houses and significators since we don't have access to the full chart context
  // In a real implementation, these would be passed as props
  const mockHouses = [
    { number: 1, sign: 'aries' },
    { number: 7, sign: 'libra' }
  ];
  const mockSignificators = { querent: 1, quesited: 7 };
  
  const houseRulers = mockHouses.map(house => ({
    house: house.number,
    ruler: SIGN_RULERS[house.sign as keyof typeof SIGN_RULERS]
  }));

  const querentRuler = houseRulers.find(h => h.house === mockSignificators.querent)?.ruler;
  const quesitedRuler = houseRulers.find(h => h.house === mockSignificators.quesited)?.ruler;
  const isSignificator = planet.name === querentRuler || planet.name === quesitedRuler;
  
  // Mock sun longitude for combust calculations (in real implementation, get from chart data)
  const mockSunLongitude = 120; // This should come from the actual sun planet data
  const planetIsCombust = planet.name !== 'sun' && isCombust(planet.longitude, mockSunLongitude);

  const planetColor = planetColors[planet.name] || "#666666";
  const planetSymbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();
  
  // Debug log for special planets - commented out to reduce noise
  // if (['northNode', 'southNode', 'partOfFortune'].includes(planet.name)) {
  //   console.log(`🔍 Special planet ${planet.name}:`, { 
  //     symbol: planetSymbol, 
  //     expected: planetSymbols[planet.name],
  //     color: planetColor 
  //   });
  // }

  return (
    <g>
      {/* Combust indicator - red glow - matching _Old.tsx */}
      {planetIsCombust && (
        <circle
          cx={position.x}
          cy={position.y}
          r="25"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          opacity="0.4"
          strokeDasharray="2,2"
        />
      )}

      {/* Highlight circle for significators - matching _Old.tsx */}
      {isSignificator && (
        <circle
          cx={position.x}
          cy={position.y}
          r="20"
          fill="none"
          stroke={planet.name === querentRuler ? "#10b981" : "#3b82f6"}
          strokeWidth="3"
          strokeDasharray="4,2"
          opacity="0.8"
        />
      )}

      {/* Planet text symbol - matching _Old.tsx styling exactly */}
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="27"
        fontFamily="Arial, sans-serif"
        fill={planetIsCombust ? "#dc2626" : planetColor}
        opacity={planetIsCombust ? 0.7 : 1}
        style={{
          cursor: 'pointer',
          fontWeight: isSignificator ? 'bold' : 'normal'
        }}
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