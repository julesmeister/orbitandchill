"use client";

import React from 'react';
import AdvancedTooltip from '../reusable/AdvancedTooltip';
import { NatalChartData, PlanetPosition, ChartAspect, HousePosition } from '../../utils/natalChart';

interface ReactNatalChartProps {
  chartData: NatalChartData;
  width?: number;
  height?: number;
  className?: string;
}

const ReactNatalChart: React.FC<ReactNatalChartProps> = ({
  chartData,
  width = 1000,
  height = 1000,
  className = ''
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = Math.min(width, height) * 0.05;
  const maxRadius = (Math.min(width, height) - margin) / 2;
  const ringThickness = maxRadius * 0.12;

  // Define the ring radii (from outer to inner)
  const signRingRadius = maxRadius;
  const houseRingRadius = maxRadius - ringThickness;
  const planetRingRadius = maxRadius - 2 * ringThickness;
  const aspectRingRadius = maxRadius - 3 * ringThickness;

  // Planet data and styling
  const planetSymbols: { [key: string]: string } = {
    sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
    jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇"
  };

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700", moon: "#C0C0C0", mercury: "#FFA500", venus: "#FF69B4", mars: "#FF4500",
    jupiter: "#9932CC", saturn: "#8B4513", uranus: "#4169E1", neptune: "#00CED1", pluto: "#8B0000"
  };

  // Sign data
  const signColors = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3",
    "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#48dbfb", "#0abde3"
  ];

  const signSymbols = [
    "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"
  ];

  const signNames = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // House colors
  const houseColors = [
    "#e3f2fd", "#f3e5f5", "#e8f5e8", "#fff3e0", "#fce4ec", "#e0f2f1",
    "#f9fbe7", "#fff8e1", "#f1f8e9", "#fef7ff", "#e8eaf6", "#e1f5fe"
  ];

  // Helper functions
  const createSectorPath = (
    centerX: number, centerY: number, outerRadius: number, innerRadius: number,
    startAngle: number, endAngle: number
  ) => {
    const startRad = startAngle * (Math.PI / 180);
    const endRad = endAngle * (Math.PI / 180);

    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z"
    ].join(" ");
  };

  const adjustPlanetPositions = (planets: PlanetPosition[]): number[] => {
    const minSeparation = 12;
    const positions = planets.map((p) => p.longitude);

    for (let i = 1; i < positions.length; i++) {
      const prevPos = positions[i - 1];
      const currentPos = positions[i];

      let diff = currentPos - prevPos;
      if (diff < 0) diff += 360;

      if (diff < minSeparation) {
        positions[i] = (prevPos + minSeparation) % 360;
      }
    }

    return positions;
  };

  // Sort planets by longitude to avoid overlaps
  const sortedPlanets = [...chartData.planets].sort((a, b) => a.longitude - b.longitude);
  const adjustedPositions = adjustPlanetPositions(sortedPlanets);

  // Tooltip content generators
  const getPlanetTooltipContent = (planet: PlanetPosition) => {
    const degree = Math.floor(planet.longitude % 30);
    const minute = Math.floor(((planet.longitude % 30) - degree) * 60);
    
    return (
      <div>
        <div className="font-bold text-base mb-1 capitalize">{planet.name}</div>
        <div className="text-sm space-y-1">
          <div>Sign: <span className="font-medium capitalize">{planet.sign}</span></div>
          <div>House: <span className="font-medium">{planet.house}</span></div>
          <div>Position: <span className="font-medium">{degree}°{minute}&apos;</span></div>
          {planet.retrograde && (
            <div className="text-red-600 font-medium">Retrograde</div>
          )}
        </div>
      </div>
    );
  };

  const getHouseTooltipContent = (house: HousePosition) => {
    const houseMeanings = [
      'Self, Identity, First Impressions',
      'Money, Values, Possessions', 
      'Communication, Siblings, Learning',
      'Home, Family, Roots',
      'Creativity, Children, Romance',
      'Health, Work, Daily Routine',
      'Partnerships, Marriage, Others',
      'Transformation, Shared Resources',
      'Philosophy, Higher Learning, Travel',
      'Career, Reputation, Public Image',
      'Friends, Groups, Hopes',
      'Spirituality, Subconscious, Endings'
    ];
    
    return (
      <div>
        <div className="font-bold text-base mb-1">{house.number}th House</div>
        <div className="text-sm space-y-1">
          <div>Sign: <span className="font-medium capitalize">{house.sign}</span></div>
          <div className="text-gray-600">{houseMeanings[house.number - 1]}</div>
        </div>
      </div>
    );
  };

  const getSignTooltipContent = (signIndex: number) => {
    const signName = signNames[signIndex];
    const signInfo = {
      'Aries': 'Fire • Cardinal • Mars',
      'Taurus': 'Earth • Fixed • Venus', 
      'Gemini': 'Air • Mutable • Mercury',
      'Cancer': 'Water • Cardinal • Moon',
      'Leo': 'Fire • Fixed • Sun',
      'Virgo': 'Earth • Mutable • Mercury',
      'Libra': 'Air • Cardinal • Venus',
      'Scorpio': 'Water • Fixed • Mars/Pluto',
      'Sagittarius': 'Fire • Mutable • Jupiter',
      'Capricorn': 'Earth • Cardinal • Saturn',
      'Aquarius': 'Air • Fixed • Saturn/Uranus',
      'Pisces': 'Water • Mutable • Jupiter/Neptune'
    };
    
    return (
      <div>
        <div className="font-bold text-base mb-1">{signName}</div>
        <div className="text-sm text-gray-600">
          {signInfo[signName as keyof typeof signInfo]}
        </div>
      </div>
    );
  };

  const getAspectTooltipContent = (aspect: ChartAspect) => {
    return (
      <div>
        <div className="font-bold text-base mb-1 capitalize">{aspect.aspect}</div>
        <div className="text-sm space-y-1">
          <div><span className="capitalize">{aspect.planet1}</span> - <span className="capitalize">{aspect.planet2}</span></div>
          <div>Angle: <span className="font-medium">{aspect.angle.toFixed(1)}°</span></div>
          <div>Orb: <span className="font-medium">{aspect.orb.toFixed(1)}°</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[85vh] min-h-[500px]">
        {/* Background */}
        <rect width={width} height={height} fill="white" />

        {/* Gradients for aspect lines */}
        <defs>
          {chartData.aspects.map((aspect, index) => {
            const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
            const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);
            if (planet1 && planet2) {
              const color1 = planetColors[planet1.name] || "#333";
              const color2 = planetColors[planet2.name] || "#333";
              return (
                <linearGradient key={index} id={`aspect-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: color1, stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: color2, stopOpacity: 0.8 }} />
                </linearGradient>
              );
            }
            return null;
          })}
        </defs>

        {/* Zodiac Signs Ring */}
        <g>
          <circle cx={centerX} cy={centerY} r={signRingRadius} fill="#f8f9fa" stroke="#333" strokeWidth="2" />
          {Array.from({ length: 12 }, (_, i) => {
            const startAngle = i * 30 - 90;
            const endAngle = (i + 1) * 30 - 90;
            const symbolAngle = (startAngle + 15) * (Math.PI / 180);
            const symbolRadius = signRingRadius - ringThickness / 2;
            const symbolX = centerX + symbolRadius * Math.cos(symbolAngle);
            const symbolY = centerY + symbolRadius * Math.sin(symbolAngle);

            return (
              <g key={`sign-${i}`}>
                <path
                  d={createSectorPath(centerX, centerY, signRingRadius, signRingRadius - ringThickness, startAngle, endAngle)}
                  fill={signColors[i] + "20"}
                  stroke="#333"
                  strokeWidth="1"
                />
                <AdvancedTooltip
                  title="Zodiac Sign"
                  content={getSignTooltipContent(i)}
                  position="auto"
                  delay={200}
                  showConnector={true}
                  connectorColor="#059669"
                >
                  <text
                    x={symbolX}
                    y={symbolY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fill={signColors[i]}
                    fontWeight="bold"
                    style={{ 
                      fontFamily: 'monospace',
                      cursor: 'help'
                    }}
                  >
                    {signSymbols[i]}
                  </text>
                </AdvancedTooltip>
              </g>
            );
          })}
        </g>

        {/* Houses Ring */}
        <g>
          <circle cx={centerX} cy={centerY} r={houseRingRadius} fill="#f1f3f4" stroke="#666" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={houseRingRadius - ringThickness} fill="white" stroke="#666" strokeWidth="1" />
          {chartData.houses.map((house, i) => {
            const nextHouse = chartData.houses[(i + 1) % 12];
            const startAngle = house.cusp - 90;
            let endAngle = nextHouse.cusp - 90;
            if (endAngle < startAngle) endAngle += 360;

            const midAngle = (startAngle + (endAngle - startAngle) / 2) * (Math.PI / 180);
            const numberRadius = houseRingRadius - ringThickness / 2;
            const numberX = centerX + numberRadius * Math.cos(midAngle);
            const numberY = centerY + numberRadius * Math.sin(midAngle);

            const cuspAngle = startAngle * (Math.PI / 180);
            const lineStart = houseRingRadius - ringThickness;
            const lineEnd = houseRingRadius;
            const x1 = centerX + lineStart * Math.cos(cuspAngle);
            const y1 = centerY + lineStart * Math.sin(cuspAngle);
            const x2 = centerX + lineEnd * Math.cos(cuspAngle);
            const y2 = centerY + lineEnd * Math.sin(cuspAngle);

            const strokeWidth = [1, 4, 7, 10].includes(i + 1) ? 3 : 1;

            return (
              <g key={`house-${i}`}>
                <path
                  d={createSectorPath(centerX, centerY, houseRingRadius, houseRingRadius - ringThickness, startAngle, endAngle)}
                  fill={houseColors[i]}
                  stroke="#666"
                  strokeWidth="1"
                />
                <AdvancedTooltip
                  title="House"
                  content={getHouseTooltipContent(house)}
                  position="auto"
                  delay={200}
                  showConnector={true}
                  connectorColor="#7c3aed"
                >
                  <text
                    x={numberX}
                    y={numberY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fill="#333"
                    fontWeight="bold"
                    style={{ cursor: 'help' }}
                  >
                    {i + 1}
                  </text>
                </AdvancedTooltip>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#333"
                  strokeWidth={strokeWidth}
                />
              </g>
            );
          })}
        </g>

        {/* Planets Ring */}
        <g>
          <circle cx={centerX} cy={centerY} r={planetRingRadius} fill="#fafbfc" stroke="#999" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={planetRingRadius - ringThickness} fill="white" stroke="#999" strokeWidth="1" />
          {sortedPlanets.map((planet, index) => {
            const originalAngle = (planet.longitude - 90) * (Math.PI / 180);
            const adjustedAngle = (adjustedPositions[index] - 90) * (Math.PI / 180);

            const degreeRadius = planetRingRadius - ringThickness;
            const degreeX = centerX + degreeRadius * Math.cos(originalAngle);
            const degreeY = centerY + degreeRadius * Math.sin(originalAngle);

            const symbolRadius = planetRingRadius - ringThickness / 2;
            const symbolX = centerX + symbolRadius * Math.cos(adjustedAngle);
            const symbolY = centerY + symbolRadius * Math.sin(adjustedAngle);

            const color = planetColors[planet.name] || "#333";
            const symbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();

            return (
              <g key={`planet-${planet.name}`}>
                <line
                  x1={degreeX} y1={degreeY} x2={symbolX} y2={symbolY}
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.7"
                />
                <circle cx={degreeX} cy={degreeY} r="2" fill={color} stroke="white" strokeWidth="1" />
                
                <AdvancedTooltip
                  title="Planet"
                  content={getPlanetTooltipContent(planet)}
                  position="auto"
                  delay={200}
                  showConnector={true}
                  connectorColor={color}
                >
                  <g style={{ cursor: 'help' }}>
                    <circle cx={symbolX} cy={symbolY} r="10" fill="white" stroke={color} strokeWidth="2" />
                    <text
                      x={symbolX}
                      y={symbolY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill={color}
                      fontWeight="bold"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {symbol}
                    </text>
                    {planet.retrograde && (
                      <text
                        x={symbolX + 12}
                        y={symbolY - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="7"
                        fill="red"
                        fontWeight="bold"
                      >
                        R
                      </text>
                    )}
                  </g>
                </AdvancedTooltip>
              </g>
            );
          })}
        </g>

        {/* Aspect Lines */}
        <g>
          <circle cx={centerX} cy={centerY} r={aspectRingRadius} fill="white" stroke="#ccc" strokeWidth="1" />
          {chartData.aspects.map((aspect, index) => {
            const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
            const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

            if (planet1 && planet2) {
              const angle1 = (planet1.longitude - 90) * (Math.PI / 180);
              const angle2 = (planet2.longitude - 90) * (Math.PI / 180);

              const x1 = centerX + aspectRingRadius * Math.cos(angle1);
              const y1 = centerY + aspectRingRadius * Math.sin(angle1);
              const x2 = centerX + aspectRingRadius * Math.cos(angle2);
              const y2 = centerY + aspectRingRadius * Math.sin(angle2);

              const strokeWidth = aspect.aspect === "conjunction" || aspect.aspect === "opposition" || aspect.aspect === "square" || aspect.aspect === "trine" ? 2 : 1;
              const opacity = aspect.aspect === "conjunction" ? 0.9 : 0.7;

              return (
                <AdvancedTooltip
                  key={`aspect-${index}`}
                  title="Aspect"
                  content={getAspectTooltipContent(aspect)}
                  position="auto"
                  delay={200}
                  showConnector={true}
                  connectorColor="#e11d48"
                >
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={`url(#aspect-gradient-${index})`}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    style={{ cursor: 'help' }}
                  />
                </AdvancedTooltip>
              );
            }
            return null;
          })}
        </g>
      </svg>
    </div>
  );
};

export default ReactNatalChart;