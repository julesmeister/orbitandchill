/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Chart Rendering Service
 * SVG generation for natal charts with ring-based visualization
 */

import { NatalChartData, PlanetPosition } from '@/types/astrology';
import { SIGNS, ASPECTS } from '@/constants/astrological';

/**
 * Generate SVG natal chart with proper ring-based partitioning
 */
export function generateNatalChartSVG(
  chartData: NatalChartData,
  width: number = 800,
  height: number = 800
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = Math.min(width, height) * 0.05;
  const maxRadius = (Math.min(width, height) - margin) / 2;
  const ringThickness = maxRadius * 0.12;

  // Define the ring radii (from outer to inner)
  const signRingRadius = maxRadius;                      // Outermost ring: Zodiac signs
  const houseRingRadius = maxRadius - ringThickness;    // Middle ring: Houses
  const planetRingRadius = maxRadius - 2 * ringThickness; // Inner ring: Planets
  const aspectRingRadius = maxRadius - 3 * ringThickness; // Center area: Aspect lines

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Generate sign wheel (outermost ring)
  try {
    svg += generateSignWheel(centerX, centerY, signRingRadius, ringThickness);
  } catch (error) {
    console.error('Error generating sign wheel:', error);
    svg += '<!-- Sign wheel generation failed -->';
  }

  // Generate house wheel
  try {
    svg += generateHouseWheel(
      centerX,
      centerY,
      houseRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating house wheel:', error);
    svg += '<!-- House wheel generation failed -->';
  }

  // Generate planet wheel (3rd ring)
  try {
    svg += generatePlanetWheel(
      centerX,
      centerY,
      planetRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating planet wheel:', error);
    svg += '<!-- Planet wheel generation failed -->';
  }

  // Generate aspect lines (innermost - in the center)
  try {
    svg += generateAspectLines(centerX, centerY, aspectRingRadius, chartData);
  } catch (error) {
    console.error('Error generating aspect lines:', error);
    svg += '<!-- Aspect lines generation failed -->';
  }

  svg += "</svg>";

  return svg;
}

/**
 * Generate the zodiac sign wheel (outermost ring)
 */
function generateSignWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number
): string {
  let svg = "";

  // Sign ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f8f9fa" stroke="#333" stroke-width="2"/>`;

  const signColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#48dbfb",
    "#0abde3",
  ];

  const signSymbols = [
    "♈", // Aries
    "♉", // Taurus
    "♊", // Gemini
    "♋", // Cancer
    "♌", // Leo
    "♍", // Virgo
    "♎", // Libra
    "♏", // Scorpio
    "♐", // Sagittarius
    "♑", // Capricorn
    "♒", // Aquarius
    "♓", // Pisces
  ];

  for (let i = 0; i < 12; i++) {
    const startAngle = i * 30 - 90;
    const endAngle = (i + 1) * 30 - 90;

    // Create sign sector
    svg += createSector(
      centerX,
      centerY,
      radius,
      radius - thickness,
      startAngle,
      endAngle,
      signColors[i] + "20",
      "#333",
      1
    );

    // Add sign symbol
    const symbolAngle = (startAngle + 15) * (Math.PI / 180);
    const symbolRadius = radius - thickness / 2;
    const symbolX = centerX + symbolRadius * Math.cos(symbolAngle);
    const symbolY = centerY + symbolRadius * Math.sin(symbolAngle);

    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle"
            font-size="18" fill="${signColors[i]}" font-weight="bold"
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${signSymbols[i]}</text>`;
  }

  return svg;
}

/**
 * Generate the house wheel
 */
function generateHouseWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // House ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f1f3f4" stroke="#666" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${
    radius - thickness
  }" fill="white" stroke="#666" stroke-width="1"/>`;

  const houseColors = [
    "#e3f2fd",
    "#f3e5f5",
    "#e8f5e8",
    "#fff3e0",
    "#fce4ec",
    "#e0f2f1",
    "#f9fbe7",
    "#fff8e1",
    "#f1f8e9",
    "#fef7ff",
    "#e8eaf6",
    "#e1f5fe",
  ];

  for (let i = 0; i < 12; i++) {
    const house = chartData.houses[i];
    const nextHouse = chartData.houses[(i + 1) % 12];

    const startAngle = house.cusp - 90;
    let endAngle = nextHouse.cusp - 90;

    // Improved handling of crossing 0 degrees with validation
    if (endAngle < startAngle) {
      endAngle += 360;
    }

    // Ensure minimum house size of 10 degrees to prevent invisible wedges
    const houseSize = endAngle - startAngle;
    if (houseSize < 10) {
      console.warn(`🏠 House ${i + 1} size too small (${houseSize.toFixed(1)}°), adjusting to 10°`);
      endAngle = startAngle + 10;
    }

    // Log house wedge details for debugging houses 4 and 8
    if (i === 3 || i === 7) { // Houses 4 and 8 (0-indexed)
      // House wedge calculation for chart display
    }

    // Create house sector with improved error handling
    try {
      svg += createSector(
        centerX,
        centerY,
        radius,
        radius - thickness,
        startAngle,
        endAngle,
        houseColors[i],
        "#666",
        1
      );
    } catch (error) {
      console.error(`🏠 Error creating sector for house ${i + 1}:`, error);
      // Create a fallback simple sector
      const fallbackPath = `<path d="M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius} Z" fill="${houseColors[i]}" stroke="#666" stroke-width="1"/>`;
      svg += fallbackPath;
    }

    // Add house number with better positioning
    const midAngle = (startAngle + (endAngle - startAngle) / 2) * (Math.PI / 180);
    const numberRadius = radius - thickness / 2;
    const numberX = centerX + numberRadius * Math.cos(midAngle);
    const numberY = centerY + numberRadius * Math.sin(midAngle);

    svg += `<text x="${numberX}" y="${numberY}" text-anchor="middle" dominant-baseline="middle"
            font-size="14" fill="#333" font-weight="bold">${i + 1}</text>`;

    // Add house cusp line with improved angular house emphasis
    const cuspAngle = startAngle * (Math.PI / 180);
    const lineStart = radius - thickness;
    const lineEnd = radius;
    const x1 = centerX + lineStart * Math.cos(cuspAngle);
    const y1 = centerY + lineStart * Math.sin(cuspAngle);
    const x2 = centerX + lineEnd * Math.cos(cuspAngle);
    const y2 = centerY + lineEnd * Math.sin(cuspAngle);

    // Emphasize angular houses (1st, 4th, 7th, 10th)
    const isAngularHouse = [1, 4, 7, 10].includes(i + 1);
    const strokeWidth = isAngularHouse ? 3 : 1;
    const strokeColor = isAngularHouse ? "#333" : "#666";
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
  }

  return svg;
}

/**
 * Generate the planet wheel
 */
function generatePlanetWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Planet ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#fafbfc" stroke="#999" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius - thickness}" fill="white" stroke="#999" stroke-width="1"/>`;

  const planetSymbols: { [key: string]: string } = {
    sun: "☉",
    moon: "☽",
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
    // Additional celestial points
    lilith: "⚸",
    chiron: "⚷",
    northNode: "☊",
    southNode: "☋",
    partOfFortune: "⊕",
  };

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
    // Additional celestial points
    lilith: "#800080",      // Purple for Lilith
    chiron: "#228B22",      // Forest green for Chiron
    northNode: "#4682B4",   // Steel blue for North Node
    southNode: "#708090",   // Slate gray for South Node
    partOfFortune: "#DAA520", // Goldenrod for Part of Fortune
  };

  // Sort planets by longitude to avoid overlaps
  const sortedPlanets = [...chartData.planets].sort(
    (a, b) => a.longitude - b.longitude
  );
  const adjustedPositions = adjustPlanetPositions(sortedPlanets);

  sortedPlanets.forEach((planet, index) => {
    const originalAngle = (planet.longitude - 90) * (Math.PI / 180);
    const adjustedAngle = (adjustedPositions[index] - 90) * (Math.PI / 180);

    // Position on the actual degree (on the inner boundary of the chart)
    const degreeRadius = radius - thickness; // Point to the inner edge of the planet ring
    const degreeX = centerX + degreeRadius * Math.cos(originalAngle);
    const degreeY = centerY + degreeRadius * Math.sin(originalAngle);

    // Position for the symbol (in the planet ring - the innermost ring)
    const symbolRadius = radius - thickness / 2; // Position in the middle of the planet ring
    const symbolX = centerX + symbolRadius * Math.cos(adjustedAngle);
    const symbolY = centerY + symbolRadius * Math.sin(adjustedAngle);

    const color = planetColors[planet.name] || "#333";

    // Draw line from degree position to symbol
    svg += `<line x1="${degreeX}" y1="${degreeY}" x2="${symbolX}" y2="${symbolY}"
            stroke="${color}" stroke-width="1" opacity="0.7"/>`;

    // Draw degree marker on the rim
    svg += `<circle cx="${degreeX}" cy="${degreeY}" r="2" fill="${color}" stroke="white" stroke-width="1"/>`;

    // Draw symbol background (well inside the center)
    svg += `<circle cx="${symbolX}" cy="${symbolY}" r="10" fill="white" stroke="${color}" stroke-width="2"/>`;

    // Draw symbol
    const symbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();
    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle"
            font-size="12" fill="${color}" font-weight="bold"
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${symbol}</text>`;

    // Retrograde indicator
    if (planet.retrograde) {
      svg += `<text x="${symbolX + 12}" y="${
        symbolY - 8
      }" text-anchor="middle" dominant-baseline="middle"
              font-size="7" fill="red" font-weight="bold">R</text>`;
    }
  });

  return svg;
}

/**
 * Generate aspect lines in the center
 */
function generateAspectLines(
  centerX: number,
  centerY: number,
  radius: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Inner circle background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" stroke="#ccc" stroke-width="1"/>`;

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
  };

  // Generating aspect lines for chart visualization

  // Create gradients for each aspect line
  let gradientDefs = '<defs>';
  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      const color1 = planetColors[planet1.name] || "#333";
      const color2 = planetColors[planet2.name] || "#333";

      gradientDefs += `
        <linearGradient id="aspect-gradient-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:0.8" />
        </linearGradient>`;
    }
  });
  gradientDefs += '</defs>';
  svg += gradientDefs;

  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      // Draw lines to the edge of the aspect ring (inner circle boundary)
      const lineRadius = radius;

      const angle1 = (planet1.longitude - 90) * (Math.PI / 180);
      const angle2 = (planet2.longitude - 90) * (Math.PI / 180);

      const x1 = centerX + lineRadius * Math.cos(angle1);
      const y1 = centerY + lineRadius * Math.sin(angle1);
      const x2 = centerX + lineRadius * Math.cos(angle2);
      const y2 = centerY + lineRadius * Math.sin(angle2);

      const aspectData = ASPECTS[aspect.aspect as keyof typeof ASPECTS];
      const strokeWidth = aspectData?.type === "major" ? 2 : 1;
      const opacity = aspect.aspect === "conjunction" ? 0.9 : 0.7;

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="url(#aspect-gradient-${index})" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
    }
  });

  return svg;
}

/**
 * Create an SVG sector (arc segment)
 */
function createSector(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  fill: string,
  stroke: string,
  strokeWidth: number
): string {
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

  const pathData = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");

  return `<path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Adjust planet positions to avoid overlaps
 */
function adjustPlanetPositions(planets: PlanetPosition[]): number[] {
  const minSeparation = 12; // Minimum degrees between planets
  const positions = planets.map((p) => p.longitude);

  // Simple collision avoidance
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
}
