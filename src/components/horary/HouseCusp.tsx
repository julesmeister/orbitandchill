/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { HouseWithAngle } from "../../utils/horaryCalculations";

interface HouseCuspProps {
  house: HouseWithAngle;
  houses?: HouseWithAngle[];
  ascendantLongitude: number;
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

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
  
  useEffect(() => {
    setIsHovered(false);
  }, [house.angle, house.number]);
  
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius;
    return { x, y };
  };

  const validAngle = typeof house.angle === 'number' && !isNaN(house.angle) ? house.angle : (house.number - 1) * 30;

  const innerRadius = 210;
  const outerRadius = 255;

  const currentHouseCusp = validAngle;
  const nextHouseNumber = house.number === 12 ? 1 : house.number + 1;
  const nextHouse = houses?.find(h => h.number === nextHouseNumber);
  const nextHouseCusp = nextHouse ? nextHouse.angle : (currentHouseCusp + 30);

  let endAngleValue = nextHouseCusp;

  const normalizedCurrent = ((currentHouseCusp % 360) + 360) % 360;
  const normalizedNext = ((nextHouseCusp % 360) + 360) % 360;

  if (normalizedNext < normalizedCurrent) {
    endAngleValue = normalizedNext + 360;
  } else {
    endAngleValue = normalizedNext;
  }

  const houseSize = Math.abs(endAngleValue - currentHouseCusp);
  if (houseSize < 5) {
    endAngleValue = currentHouseCusp + Math.max(5, houseSize);
  }

  const segments = 30;
  const outerArcPoints: string[] = [];
  const innerArcPoints: string[] = [];

  for (let seg = 0; seg <= segments; seg++) {
    const fraction = seg / segments;
    const angle = currentHouseCusp + ((endAngleValue - currentHouseCusp) * fraction);
    const coords = getChartCoordinates(angle, outerRadius);
    outerArcPoints.push(`${coords.x},${coords.y}`);
  }

  for (let seg = segments; seg >= 0; seg--) {
    const fraction = seg / segments;
    const angle = currentHouseCusp + ((endAngleValue - currentHouseCusp) * fraction);
    const coords = getChartCoordinates(angle, innerRadius);
    innerArcPoints.push(`${coords.x},${coords.y}`);
  }

  const pathData = `M ${outerArcPoints.join(' L ')} L ${innerArcPoints.join(' L ')} Z`;

  let midAngleValue = (currentHouseCusp + endAngleValue) / 2;
  if (endAngleValue > currentHouseCusp + 180) {
    midAngleValue = ((currentHouseCusp + (endAngleValue - 360)) / 2 + 360) % 360;
  }

  const textRadius = (innerRadius + outerRadius) / 2;
  const textPos = getChartCoordinates(midAngleValue, textRadius);

  const lineInnerR = 255;
  const lineOuterR = 420;
  const lineInner = getChartCoordinates(house.angle, lineInnerR);
  const lineOuter = getChartCoordinates(house.angle, lineOuterR);
  
  const isAngularHouse = [1, 4, 7, 10].includes(house.number);
  const strokeWidth = isAngularHouse ? 3 : 1.5;
  const opacity = isAngularHouse ? 0.9 : 0.6;
  const strokeColor = isAngularHouse ? "#000000" : "#374151";

  const separatorStart = getChartCoordinates(house.angle, innerRadius);
  const separatorEnd = getChartCoordinates(house.angle, outerRadius);

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
      <g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={pathData}
          fill={houseColors[house.number]}
          opacity={isHovered ? 0.7 : 0.5}
          stroke="none"
        />
        <line
          x1={separatorStart.x}
          y1={separatorStart.y}
          x2={separatorEnd.x}
          y2={separatorEnd.y}
          stroke="#1F2937"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <text
          x={textPos.x}
          y={textPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="400"
          fill="#1F2937"
          fontFamily="Arial, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {house.number}
        </text>
      </g>
      
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
