/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { HouseWithAngle } from "../../utils/horaryCalculations";

interface AngularMarkersProps {
  houses: HouseWithAngle[];
  chartData: any;
  onMouseEnter?: (event: React.MouseEvent, data: any) => void;
  onMouseLeave?: () => void;
}

// Unified coordinate conversion function - same as in InteractiveHoraryChart
const getChartCoordinates = (astroLongitude: number, radius: number, ascendantLongitude: number) => {
  // Calculate position relative to Ascendant
  const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
  
  // Place Ascendant at 180° (9 o'clock position)
  const finalAngleDegrees = (relativeAngle + 180) % 360;
  
  // Convert to radians and calculate coordinates
  const angleRad = (finalAngleDegrees * Math.PI) / 180;
  
  const x = Math.cos(angleRad) * radius;
  const y = -Math.sin(angleRad) * radius;
  
  return { x, y };
};

export const AngularMarkers: React.FC<AngularMarkersProps> = ({
  houses,
  chartData,
  onMouseEnter,
  onMouseLeave
}) => {
  // Find angular houses
  const ascendantHouse = houses.find(h => h.number === 1);
  const descendantHouse = houses.find(h => h.number === 7);
  const midheavenHouse = houses.find(h => h.number === 10);
  const imumCoeliHouse = houses.find(h => h.number === 4);
  
  const angles = [
    { 
      name: 'ASC', 
      angle: ascendantHouse?.angle ?? chartData.ascendant ?? 0,
      color: '#7c3aed', // Purple
      description: 'Ascendant (1st House Cusp)' 
    },
    { 
      name: 'DSC', 
      angle: descendantHouse?.angle ?? ((chartData.ascendant ?? 0) + 180) % 360,
      color: '#7c3aed', // Purple
      description: 'Descendant (7th House Cusp)'
    },
    { 
      name: 'MC', 
      angle: midheavenHouse?.angle ?? chartData.midheaven ?? 90,
      color: '#dc2626', // Red
      description: 'Midheaven (10th House Cusp)'
    },
    { 
      name: 'IC', 
      angle: imumCoeliHouse?.angle ?? ((chartData.midheaven ?? 90) + 180) % 360,
      color: '#dc2626', // Red
      description: 'Imum Coeli (4th House Cusp)'
    }
  ];

  return (
    <g className="angles-markers">
      {angles.map(angleMarker => {
        // Use unified coordinate system - same as InteractiveHoraryChart
        const ascendantLongitude = chartData.ascendant || 0;
        
        // Calculate line positions (inner and outer radius)
        const innerPos = getChartCoordinates(angleMarker.angle, 525, ascendantLongitude);
        const outerPos = getChartCoordinates(angleMarker.angle, 545, ascendantLongitude);
        const textPos = getChartCoordinates(angleMarker.angle, 555, ascendantLongitude);
        
        // Calculate text rotation to make it readable
        const relativeAngle = (angleMarker.angle - ascendantLongitude + 360) % 360;
        const finalAngleDegrees = (relativeAngle + 180) % 360;
        let textRotation = finalAngleDegrees;
        
        // Adjust text rotation to keep text upright
        if (textRotation > 90 && textRotation < 270) {
          textRotation += 180;
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
            {/* Angular marker line */}
            <line 
              x1={innerPos.x}
              y1={innerPos.y}
              x2={outerPos.x}
              y2={outerPos.y}
              stroke={angleMarker.color} 
              strokeWidth="3" 
              opacity="0.8" 
            />
            {/* Angular marker text */}
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
              {angleMarker.name}
            </text>
          </g>
        );
      })}
    </g>
  );
};