/* eslint-disable @typescript-eslint/no-unused-vars */

// Helper functions for matrix position calculations

// Create mock data for the matrix chart
export const createMockMatrixData = (matrixValues: Record<string, number>) => {
  return {
    positions: {
      A: matrixValues.A || 1,
      B: matrixValues.B || 2,
      C: matrixValues.C || 3,
      D: matrixValues.D || 4,
      E: matrixValues.E || 5,
      F: matrixValues.F || 6,
      G: matrixValues.G || 7,
      H: matrixValues.H || 8,
      I: matrixValues.I || 9,
      J: matrixValues.J || 10,
      K: matrixValues.K || 11,
      L: matrixValues.L || 12,
      M: matrixValues.M || 13,
      N: matrixValues.N || 14,
      O: matrixValues.O || 15,
      P: matrixValues.P || 16,
      Q: matrixValues.Q || 17,
      R: matrixValues.R || 18,
      S: matrixValues.S || 19,
      T: matrixValues.T || 20,
      U: matrixValues.U || 21,
      V: matrixValues.V || 22,
      F1: matrixValues.F1 || 1,
      F2: matrixValues.F2 || 2,
      G1: matrixValues.G1 || 3,
      G2: matrixValues.G2 || 4,
      H1: matrixValues.H1 || 5,
      H2: matrixValues.H2 || 6,
      I1: matrixValues.I1 || 7,
      I2: matrixValues.I2 || 8,
    },
    centers: {
      E: matrixValues.E || 5,
      J: matrixValues.J || 10,
    },
    diagonalSquare: {
      A: matrixValues.A || 1,
      B: matrixValues.B || 2,
      C: matrixValues.C || 3,
      D: matrixValues.D || 4,
    },
    straightSquare: {
      F: matrixValues.F || 6,
      G: matrixValues.G || 7,
      H: matrixValues.H || 8,
      I: matrixValues.I || 9,
    },
    karmicTail: {
      d1: matrixValues.d1 || 15,
      d2: matrixValues.d2 || 16,
      d: matrixValues.d || 17,
    },
    innerElements: {
      heart: matrixValues.POA || 11,
      talent: matrixValues.T || 20,
      guard: matrixValues.K || 11,
      earthPurpose: matrixValues.L || 12,
      // Add required additional inner elements with default values
      shadowAspects: 13,
      spiritualGifts: 14,
      karmicLessons: 15,
      pastKarma: 16,
      heartDesire: 17,
      partnershipPotential: 18,
      materialKarma: 19,
      financialTalents: 20,
      prosperityFlow: 21,
      spiritualWealth: 22,
      rootChakra: 1,
      sacralChakra: 2,
      solarPlexusChakra: 3,
      heartChakra: 4,
      throatChakra: 5,
      thirdEyeChakra: 6,
      crownChakra: 7,
      paternalLine: 8,
      maternalLine: 9,
      balancePoint: 10,
      ancestralWisdom: 11,
      ancestralHealing: 12,
    },
    purposes: {
      skypoint: 1,
      earthpoint: 2,
      perspurpose: 3,
      femalepoint: 4,
      malepoint: 5,
      socialpurpose: 6,
      generalpurpose: 7,
      planetarypurpose: 8,
    }
  };
};

// Create mock positions for the chart
export const createMockPositions = () => {
  const centerX = 350;
  const centerY = 350;
  const radius = 300;
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);

  return {
    A: { x: centerX - radius, y: centerY },
    B: { x: centerX, y: centerY - radius },
    C: { x: centerX + radius, y: centerY },
    D: { x: centerX, y: centerY + radius },
    E: { x: centerX, y: centerY },
    F: { x: centerX - radius * cos45, y: centerY - radius * sin45 },
    G: { x: centerX + radius * cos45, y: centerY - radius * sin45 },
    H: { x: centerX + radius * cos45, y: centerY + radius * sin45 },
    I: { x: centerX - radius * cos45, y: centerY + radius * sin45 },
  };
};

// Create mock responsive values
export const createMockResponsive = () => {
  return {
    centerX: 350,
    centerY: 350,
    radius: 300,
    circleRadius: { outer: 25, center: 36 },
    fontSize: { outer: 21, center: 25 },
    innerElements: {
      heart: { radius: 22, offsetX: 50, offsetY: 0 },
      talent: { radius: 20, offsetX: 0, offsetY: -120 },
      guard: { radius: 16, offsetX: -225, offsetY: 0 },
      earthPurpose: { radius: 16, offsetX: -130, offsetY: 0 },
      karmicTail: { leftOffsetX: -180, centerOffsetX: 0, rightOffsetX: 180, offsetY: 200, radius: 18 },
    },
    ageDot: { radius: 3.5, fontSize: 9, labelOffset: 11 }
  };
};

// Create mock debug positions that match the real positioning logic
export const createMockDebugPositions = () => {
  // Mock responsive values - matching the real chart's calculations
  const centerX = 350;
  const centerY = 325;
  const radius = 300;
  
  // Calculate base positions using the same logic as calculateMatrixPositions
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);
  
  const basePositions = {
    A: { x: centerX - radius, y: centerY },        // Left
    B: { x: centerX, y: centerY - radius },        // Top
    C: { x: centerX + radius, y: centerY },        // Right
    D: { x: centerX, y: centerY + radius },        // Bottom
    F: { x: centerX - radius * cos45, y: centerY - radius * sin45 }, // Top-left diagonal
    G: { x: centerX + radius * cos45, y: centerY - radius * sin45 }, // Top-right diagonal
    H: { x: centerX + radius * cos45, y: centerY + radius * sin45 }, // Bottom-right diagonal
    I: { x: centerX - radius * cos45, y: centerY + radius * sin45 }, // Bottom-left diagonal
  };
  
  const centerPoint = { x: centerX, y: centerY };
  
  // Calculate positioned spheres using the same logic as the real chart
  const calculatedPositions = {
    // 30% positions from outer toward center
    T: calculatePositionAtPercent(basePositions.B, centerPoint, 0.30), // Self Expression
    N: calculatePositionAtPercent(basePositions.C, centerPoint, 0.30), // Past Life Income
    FUTURE_CHILDREN: calculatePositionAtPercent(basePositions.A, centerPoint, 0.30),
    J: calculatePositionAtPercent(basePositions.D, centerPoint, 0.30), // Past Life Mistakes
    
    // Midpoint positions between outer circles and their respective 30% positions
    O: calculateMidpoint(basePositions.A, calculatePositionAtPercent(basePositions.A, centerPoint, 0.30)), // As a Parent
    P: calculateMidpoint(basePositions.B, calculatePositionAtPercent(basePositions.B, centerPoint, 0.30)), // Higher Self
    Q: calculateMidpoint(basePositions.C, calculatePositionAtPercent(basePositions.C, centerPoint, 0.30)), // Past Life Money Mindset
    R: calculateMidpoint(basePositions.D, calculatePositionAtPercent(basePositions.D, centerPoint, 0.30)), // Foundation
    
    // Special positioned spheres
    V: calculatePositionAtPercent(centerPoint, basePositions.C, 0.33), // Sexuality - 33% from center toward C
    POWER_OF_ANCESTORS: calculatePositionAtPercent(centerPoint, basePositions.C, 0.20), // 20% from center toward C
    
    // Calculate L using intersection logic
    L: (() => {
      const jPosition = calculatePositionAtPercent(basePositions.D, centerPoint, 0.30);
      const nPosition = calculatePositionAtPercent(basePositions.C, centerPoint, 0.30);
      
      const intersection = calculateLineIntersection(
        basePositions.F, basePositions.H,
        jPosition, nPosition
      );
      
      return intersection || calculatePositionAtPercent(basePositions.D, centerPoint, 0.45); // fallback
    })(),
    
    // Generational line positions (30% from corners toward center)
    F2: calculatePositionAtPercent(basePositions.F, centerPoint, 0.30),
    G2: calculatePositionAtPercent(basePositions.G, centerPoint, 0.30),
    H2: calculatePositionAtPercent(basePositions.I, centerPoint, 0.30), // Swapped
    I2: calculatePositionAtPercent(basePositions.H, centerPoint, 0.30), // Swapped
  };
  
  // Calculate generational line F1, G1, H1, I1 as midpoints
  const generationalMidpoints = {
    F1: calculateMidpoint(basePositions.F, calculatedPositions.F2),
    G1: calculateMidpoint(basePositions.G, calculatedPositions.G2),
    H1: calculateMidpoint(basePositions.I, calculatedPositions.H2), // Swapped
    I1: calculateMidpoint(basePositions.H, calculatedPositions.I2), // Swapped
  };
  
  // Calculate anchor positions for relationship circles
  const anchorPositions = {
    M: calculateMidpoint(calculatedPositions.J, calculatedPositions.L), // Ingredients for Love
    K: calculateMidpoint(calculatedPositions.L, calculatedPositions.N), // Income Streams
  };
  
  // Convert all positions to relative coordinates (relative to center)
  const allPositions = { ...calculatedPositions, ...generationalMidpoints, ...anchorPositions };
  const relativePositions = Object.fromEntries(
    Object.entries(allPositions).map(([key, pos]) => [
      key,
      convertToRelativePosition(pos, centerPoint)
    ])
  );
  
  // Calculate diagonal line coordinates
  const jRelative = convertToRelativePosition(calculatedPositions.J, centerPoint);
  const nRelative = convertToRelativePosition(calculatedPositions.N, centerPoint);
  
  return {
    ...relativePositions,
    // Ensure all required DebugPositions properties are present
    K: relativePositions.K || { x: 0, y: 0 },
    L: relativePositions.L || { x: 0, y: 0 },
    M: relativePositions.M || { x: 0, y: 0 },
    N: relativePositions.N || { x: 0, y: 0 },
    V: relativePositions.V || { x: 0, y: 0 },
    F: relativePositions.F || { x: 0, y: 0 },
    G: relativePositions.G || { x: 0, y: 0 },
    H: relativePositions.H || { x: 0, y: 0 },
    I: relativePositions.I || { x: 0, y: 0 },
    HEART_POWER: relativePositions.HEART_POWER || { x: 0, y: 0 },
    TALENT: relativePositions.TALENT || relativePositions.T || { x: 0, y: 0 },
    GUARD: relativePositions.GUARD || { x: 0, y: 0 },
    EARTH_PURPOSE: relativePositions.EARTH_PURPOSE || { x: 0, y: 0 },
    F1: relativePositions.F1 || { x: 0, y: 0 },
    F2: relativePositions.F2 || { x: 0, y: 0 },
    G1: relativePositions.G1 || { x: 0, y: 0 },
    G2: relativePositions.G2 || { x: 0, y: 0 },
    H1: relativePositions.H1 || { x: 0, y: 0 },
    H2: relativePositions.H2 || { x: 0, y: 0 },
    I1: relativePositions.I1 || { x: 0, y: 0 },
    I2: relativePositions.I2 || { x: 0, y: 0 },
    O: relativePositions.O || { x: 0, y: 0 },
    P: relativePositions.P || { x: 0, y: 0 },
    Q: relativePositions.Q || { x: 0, y: 0 },
    R: relativePositions.R || { x: 0, y: 0 },
    J: relativePositions.J || { x: 0, y: 0 },
    diagonal: {
      x1: jRelative.x, y1: jRelative.y,
      x2: nRelative.x, y2: nRelative.y
    },
    FUTURE_CHILDREN: relativePositions.FUTURE_CHILDREN || { x: 0, y: 0 },
    POWER_OF_ANCESTORS: relativePositions.POWER_OF_ANCESTORS || { x: 0, y: 0 }
  };
};

// Create mock age destiny map
export const createMockAgeDestinyMap = () => {
  // Create a simple map with mock destiny arcana values for each age code
  const mockAgeDestinyMap: Record<number, number> = {};
  
  // Generate 77 age destiny values (ages 1-77)
  for (let i = 1; i <= 77; i++) {
    mockAgeDestinyMap[i] = ((i - 1) % 22) + 1; // Cycle through 1-22
  }
  
  return mockAgeDestinyMap;
};

// Mock handlers
export const createMockHandlers = () => ({
  handleMouseEnter: () => {},
  handleMouseLeave: () => {},
  handleClick: () => {},
  handleDragStart: () => {},
  handleDragMove: () => {},
  handleDragEnd: () => {},
  setSelectedPosition: () => {},
});

// Helper functions for position calculations
const calculatePositionAtPercent = (fromPosition: { x: number; y: number }, toCenter: { x: number; y: number }, percent: number) => ({
  x: fromPosition.x + (toCenter.x - fromPosition.x) * percent,
  y: fromPosition.y + (toCenter.y - fromPosition.y) * percent
});

const calculateMidpoint = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => ({
  x: (pointA.x + pointB.x) / 2,
  y: (pointA.y + pointB.y) / 2
});

const convertToRelativePosition = (position: { x: number; y: number }, center: { x: number; y: number }) => ({
  x: position.x - center.x,
  y: position.y - center.y
});

const calculateLineIntersection = (
  line1Start: { x: number; y: number }, line1End: { x: number; y: number },
  line2Start: { x: number; y: number }, line2End: { x: number; y: number }
) => {
  const x1 = line1Start.x, y1 = line1Start.y;
  const x2 = line1End.x, y2 = line1End.y;
  const x3 = line2Start.x, y3 = line2Start.y;
  const x4 = line2End.x, y4 = line2End.y;
  
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  if (Math.abs(denominator) < 0.0001) {
    return null; // Lines are parallel
  }
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  
  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  };
};