/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { HouseWithAngle } from "../../utils/horaryCalculations";

interface HouseCuspProps {
  house: HouseWithAngle;
  houses?: HouseWithAngle[];
  ascendantLongitude: number; // Pass the ascendant longitude for proper rotation
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

// House colors - matching _Old.tsx exactly
const houseColors: { [key: number]: string } = {
  1: "#ff91e9", 2: "#4ade80", 3: "#f2e356", 4: "#6bdbff",
  5: "#ff8c42", 6: "#ff91e9", 7: "#4ade80", 8: "#f2e356",
  9: "#6bdbff", 10: "#ff8c42", 11: "#ff91e9", 12: "#4ade80"
};

export const HouseCusp: React.FC<HouseCuspProps> = ({
  house,
  houses,
  ascendantLongitude,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Reset hover state when house data changes
  useEffect(() => {
    setIsHovered(false);
  }, [house.angle, house.number]);
  
  // Unified coordinate conversion function (same as in main chart)
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius; // Negative Y for correct orientation
    
    return { x, y };
  };

  // Ensure angle is a valid number
  const validAngle = typeof house.angle === 'number' && !isNaN(house.angle) ? house.angle : (house.number - 1) * 30;

  // Calculate wedge path for inner ring (houses much closer to center)
  const innerRadius = 150;
  const outerRadius = 200;

  // Calculate the correct start and end angles for this house
  const currentHouseCusp = validAngle;
  const nextHouseNumber = house.number === 12 ? 1 : house.number + 1;
  const nextHouse = houses?.find(h => h.number === nextHouseNumber);
  const nextHouseCusp = nextHouse ? nextHouse.angle : (currentHouseCusp + 30);

  // Handle the wrap-around case for all houses
  let endAngleValue = nextHouseCusp;

  // Normalize angles to handle crossing 0/360 degree boundary
  const normalizedCurrent = ((currentHouseCusp % 360) + 360) % 360;
  const normalizedNext = ((nextHouseCusp % 360) + 360) % 360;

  // If next cusp is smaller than current cusp, we're crossing the 360/0 boundary
  if (normalizedNext < normalizedCurrent) {
    endAngleValue = normalizedNext + 360;
  } else {
    endAngleValue = normalizedNext;
  }

  // Special handling for very small house sizes (less than 5 degrees)
  const houseSize = Math.abs(endAngleValue - currentHouseCusp);
  if (houseSize < 5) {
    endAngleValue = currentHouseCusp + Math.max(5, houseSize);
  }

  // Use unified coordinate system for house wedge
  const startInner = getChartCoordinates(currentHouseCusp, innerRadius);
  const startOuter = getChartCoordinates(currentHouseCusp, outerRadius);
  const endOuter = getChartCoordinates(endAngleValue, outerRadius);
  const endInner = getChartCoordinates(endAngleValue, innerRadius);

  // Calculate if we need large arc flag (for arcs > 180 degrees)
  const angleDiff = Math.abs(endAngleValue - currentHouseCusp);
  const largeArcFlag = angleDiff > 180 ? 1 : 0;

  const pathData = `
    M ${startInner.x} ${startInner.y}
    L ${startOuter.x} ${startOuter.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}
    L ${endInner.x} ${endInner.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}
    Z
  `;

  // Calculate the middle of the house for text positioning
  let midAngleValue = (currentHouseCusp + endAngleValue) / 2;

  // Handle wrap-around for text positioning
  if (endAngleValue > currentHouseCusp + 180) {
    midAngleValue = ((currentHouseCusp + (endAngleValue - 360)) / 2 + 360) % 360;
  }

  const textRadius = (innerRadius + outerRadius) / 2;
  const textPos = getChartCoordinates(midAngleValue, textRadius);

  // House cusp line coordinates (extending from house ring to zodiac ring)
  const lineInnerR = 200; // Outer edge of house ring
  const lineOuterR = 420; // Inner edge of zodiac ring
  const lineInner = getChartCoordinates(house.angle, lineInnerR);
  const lineOuter = getChartCoordinates(house.angle, lineOuterR);
  
  // Make angular houses (1, 4, 7, 10) more prominent
  const isAngularHouse = [1, 4, 7, 10].includes(house.number);
  const strokeWidth = isAngularHouse ? 3 : 1.5;
  const opacity = isAngularHouse ? 0.9 : 0.6;
  const strokeColor = isAngularHouse ? "#374151" : "#94a3b8";

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    onMouseEnter?.(e, { 
      type: 'house', 
      number: house.number,
      cusp: house.cusp,
      sign: house.sign 
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <g>
      {/* House wedge - zodiac-style with subtle colors */}
      <g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={pathData}
          fill={houseColors[house.number]}
          opacity={isHovered ? 0.8 : 0.5}
          transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
          stroke="#19181a"
          strokeWidth="2"
          style={{
            transition: 'all 0.3s ease',
            transformOrigin: `${textPos.x}px ${textPos.y}px`
          }}
        />
        <text
          x={textPos.x}
          y={textPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fontWeight="400"
          fill="#374151"
          fontFamily="Arial, sans-serif"
          style={{
            pointerEvents: 'none'
          }}
        >
          {house.number}
        </text>
      </g>
      
      {/* House cusp line */}
      <line
        x1={lineInner.x}
        y1={lineInner.y}
        x2={lineOuter.x}
        y2={lineOuter.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </g>
  );
};