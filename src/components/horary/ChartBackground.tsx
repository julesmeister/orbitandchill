"use client";

import React from "react";
import { ZODIAC_SYMBOLS, ZODIAC_COLORS } from "./ZodiacSymbols";

// Function to darken a hex color - matching _Old.tsx
const darkenColor = (hex: string, factor: number): string => {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const newR = Math.floor(r * (1 - factor));
  const newG = Math.floor(g * (1 - factor));
  const newB = Math.floor(b * (1 - factor));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export const ChartBackground: React.FC = () => {
  return (
    <g>
      {/* Background circles - traditional astrological layout - matching _Old.tsx */}
      <circle cx="0" cy="0" r="525" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="420" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />

      {/* Degree markers on outer edge - pointing inward, colored by zodiac sign - matching _Old.tsx */}
      <g className="degree-markers">
        {Array.from({ length: 36 }, (_, i) => {
          const angle = -i * 10 - 90; // Every 10 degrees counterclockwise
          const radian = (angle * Math.PI) / 180;
          const outerR = 525; // Start from outer edge
          const innerR = i % 3 === 0 ? 510 : 518; // Major marks point deeper inward every 30°

          // Determine which zodiac sign this degree marker belongs to
          const degreePosition = ((360 - i * 10) % 360); // Counterclockwise degree position
          const signIndex = Math.floor(degreePosition / 30);
          const zodiacSignSymbol = ZODIAC_SYMBOLS[signIndex];

          // Get the zodiac color and make it darker
          const baseColor = ZODIAC_COLORS[zodiacSignSymbol as keyof typeof ZODIAC_COLORS] || "#666666";
          const darkerColor = darkenColor(baseColor, 0.3); // Make 30% darker

          const x1 = Math.cos(radian) * outerR;
          const y1 = Math.sin(radian) * outerR;
          const x2 = Math.cos(radian) * innerR;
          const y2 = Math.sin(radian) * innerR;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={darkerColor}
              strokeWidth={i % 3 === 0 ? "2" : "1"}
              opacity={i % 3 === 0 ? "0.8" : "0.6"}
            />
          );
        })}
      </g>
    </g>
  );
};