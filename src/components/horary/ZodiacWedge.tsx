/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { renderZodiacSymbol, ZODIAC_COLORS, ZODIAC_SYMBOLS, ZODIAC_NAMES } from "./ZodiacSymbols";
import { CHART_CONFIG } from "./chartConfig";

interface ZodiacWedgeProps {
  index: number;
  ascendantLongitude: number;
  houses?: Array<{ cusp: number; sign: string; number: number }>;
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

export const ZodiacWedge: React.FC<ZodiacWedgeProps> = ({
  index,
  ascendantLongitude,
  houses = [],
  onMouseEnter,
  onMouseLeave
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius;
    return { x, y };
  };
  
  const signStartLongitude = index * 30;
  const signEndLongitude = signStartLongitude + 30;
  
  const innerRadius = 420;
  const outerRadius = 525;

  const startInner = getChartCoordinates(signStartLongitude, innerRadius);
  const startOuter = getChartCoordinates(signStartLongitude, outerRadius);
  const endOuter = getChartCoordinates(signEndLongitude, outerRadius);
  const endInner = getChartCoordinates(signEndLongitude, innerRadius);

  const pathData = `
    M ${startInner.x} ${startInner.y}
    L ${startOuter.x} ${startOuter.y}
    A ${outerRadius} ${outerRadius} 0 0 0 ${endOuter.x} ${endOuter.y}
    L ${endInner.x} ${endInner.y}
    A ${innerRadius} ${innerRadius} 0 0 1 ${startInner.x} ${startInner.y}
    Z
  `;

  const textRadius = (innerRadius + outerRadius) / 2;
  const wedgeCenterAngle = signStartLongitude + 15;
  const textPos = getChartCoordinates(wedgeCenterAngle, textRadius);
  
  const symbol = ZODIAC_SYMBOLS[index];
  const color = ZODIAC_COLORS[symbol as keyof typeof ZODIAC_COLORS] || "#666666";

  const houseCuspInSign = houses.find(house => {
    const cuspLon = house.cusp;
    return cuspLon >= signStartLongitude && cuspLon < signEndLongitude;
  });

  const degreeInSign = houseCuspInSign ? houseCuspInSign.cusp % 30 : 15;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degrees) * 60);

  const relativeAngle = (wedgeCenterAngle - ascendantLongitude + 360) % 360;
  const canvasAngle = (relativeAngle + 180) % 360;

  let rotationAngle: number;
  if (canvasAngle < 90 || canvasAngle > 270) {
    rotationAngle = -canvasAngle + 90 + 180 + 180;
  } else {
    rotationAngle = -canvasAngle - 90 + 180;
  }

  const separatorStart = getChartCoordinates(signStartLongitude, innerRadius);
  const separatorEnd = getChartCoordinates(signStartLongitude, outerRadius);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    onMouseEnter?.(e, { type: 'zodiac', index, symbol });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={pathData}
        fill={color}
        opacity={isHovered ? 0.9 : 0.6}
        stroke="none"
      />

      <line
        x1={separatorStart.x}
        y1={separatorStart.y}
        x2={separatorEnd.x}
        y2={separatorEnd.y}
        stroke="#1F2937"
        strokeWidth="2"
      />

      <g
        transform={`translate(${textPos.x}, ${textPos.y}) rotate(${rotationAngle})`}
        style={{ pointerEvents: 'none' }}
      >
        <text
          x={-50}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontFamily="Arial, sans-serif"
          fill="#1F2937"
        >
          {degrees}°
        </text>

        <g transform="scale(1.2) translate(-8, -8)">
          {renderZodiacSymbol(symbol)}
        </g>

        <text
          x={30}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontFamily="Arial, sans-serif"
          fill="#1F2937"
        >
          {minutes}&apos;
        </text>
      </g>
    </g>
  );
};
