/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { renderZodiacSymbol, ZODIAC_COLORS, ZODIAC_SYMBOLS } from "./ZodiacSymbols";
import { CHART_CONFIG } from "./chartConfig";

interface ZodiacWedgeProps {
  index: number;
  ascendantLongitude: number; // Pass the ascendant longitude for proper rotation
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

export const ZodiacWedge: React.FC<ZodiacWedgeProps> = ({
  index,
  ascendantLongitude,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Unified coordinate conversion function (same as in main chart)
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius; // Negative Y for correct orientation
    
    return { x, y };
  };
  
  // Calculate zodiac sign boundaries
  const signStartLongitude = index * 30; // 0° for Aries, 30° for Taurus, etc.
  const signEndLongitude = signStartLongitude + 30;
  
  const innerRadius = 420;
  const outerRadius = 525;

  // Get coordinates for wedge corners
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

  // Text position at middle of sign
  const textRadius = (innerRadius + outerRadius) / 2;
  const textPos = getChartCoordinates(signStartLongitude + 15, textRadius);
  
  const symbol = ZODIAC_SYMBOLS[index];
  const color = ZODIAC_COLORS[symbol as keyof typeof ZODIAC_COLORS] || "#666666";

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
        stroke="#19181a"
        strokeWidth="2"
        transform={isHovered ? 'scale(1.02)' : 'scale(1)'}
        style={{
          transition: 'all 0.3s ease',
          transformOrigin: `${textPos.x}px ${textPos.y}px`
        }}
      />
      <g
        transform={`translate(${textPos.x}, ${textPos.y})`}
        style={{
          pointerEvents: 'none'
        }}
      >
        {renderZodiacSymbol(symbol)}
      </g>
    </g>
  );
};