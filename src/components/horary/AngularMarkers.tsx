/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { HouseWithAngle } from "../../utils/horaryCalculations";
import { ZODIAC_NAMES } from "./ZodiacSymbols";

interface AngularMarkersProps {
  houses: HouseWithAngle[];
  chartData: any;
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

const getChartCoordinates = (astroLongitude: number, radius: number, ascendantLongitude: number) => {
  const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
  const finalAngleDegrees = (relativeAngle + 180) % 360;
  const angleRad = (finalAngleDegrees * Math.PI) / 180;
  const x = Math.cos(angleRad) * radius;
  const y = -Math.sin(angleRad) * radius;
  return { x, y };
};

const getSignName = (longitude: number): string => {
  const signIndex = Math.floor(longitude / 30) % 12;
  return ZODIAC_NAMES[signIndex] || "?";
};

export const AngularMarkers: React.FC<AngularMarkersProps> = ({
  houses,
  chartData,
  onMouseEnter,
  onMouseLeave
}) => {
  const ascendantHouse = houses.find(h => h.number === 1);
  const descendantHouse = houses.find(h => h.number === 7);
  const midheavenHouse = houses.find(h => h.number === 10);
  const imumCoeliHouse = houses.find(h => h.number === 4);

  const ascendantLongitude = chartData.ascendant || 0;
  
  const ascAngle = ascendantHouse?.angle ?? chartData.ascendant ?? 0;
  const dscAngle = descendantHouse?.angle ?? ((chartData.ascendant ?? 0) + 180) % 360;
  const mcAngle = midheavenHouse?.angle ?? chartData.midheaven ?? 90;
  const icAngle = imumCoeliHouse?.angle ?? ((chartData.midheaven ?? 90) + 180) % 360;

  const angles = [
    { 
      name: 'AC',
      label: `AC ${Math.floor(ascAngle % 30)}° ${getSignName(ascAngle)}`,
      angle: ascAngle,
      color: '#DC2626',
      description: 'Ascendant (1st House Cusp)',
      rotationType: 'vertical' as const
    },
    { 
      name: 'DC',
      label: `DC ${Math.floor(dscAngle % 30)}° ${getSignName(dscAngle)}`,
      angle: dscAngle,
      color: '#DC2626',
      description: 'Descendant (7th House Cusp)',
      rotationType: 'vertical' as const
    },
    { 
      name: 'MC',
      label: `MC ${Math.floor(mcAngle % 30)}° ${getSignName(mcAngle)}`,
      angle: mcAngle,
      color: '#DC2626',
      description: 'Midheaven (10th House Cusp)',
      rotationType: 'horizontal' as const
    },
    { 
      name: 'IC',
      label: `IC ${Math.floor(icAngle % 30)}° ${getSignName(icAngle)}`,
      angle: icAngle,
      color: '#DC2626',
      description: 'Imum Coeli (4th House Cusp)',
      rotationType: 'horizontal' as const
    }
  ];

  return (
    <g className="angles-markers">
      {angles.map(angleMarker => {
        const innerPos = getChartCoordinates(angleMarker.angle, 525, ascendantLongitude);
        const outerPos = getChartCoordinates(angleMarker.angle, 545, ascendantLongitude);
        const textPos = getChartCoordinates(angleMarker.angle, 580, ascendantLongitude);
        
        const relativeAngle = (angleMarker.angle - ascendantLongitude + 360) % 360;
        const canvasAngle = (relativeAngle + 180) % 360;
        
        let textRotation: number;
        if (angleMarker.rotationType === 'vertical') {
          if (canvasAngle < 180) {
            textRotation = -90;
          } else {
            textRotation = 90;
          }
        } else {
          textRotation = 0;
        }
        
        return (
          <g 
            key={angleMarker.name}
            onMouseEnter={(e) => onMouseEnter?.(e, {
              type: 'angular',
              name: angleMarker.name,
              description: angleMarker.description,
              angle: angleMarker.angle
            })}
            onMouseLeave={onMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <line 
              x1={innerPos.x}
              y1={innerPos.y}
              x2={outerPos.x}
              y2={outerPos.y}
              stroke={angleMarker.color} 
              strokeWidth="3" 
              opacity="0.8" 
            />
            <text
              x={textPos.x}
              y={textPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill={angleMarker.color}
              transform={`rotate(${textRotation} ${textPos.x} ${textPos.y})`}
            >
              {angleMarker.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
