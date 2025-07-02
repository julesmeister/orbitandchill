/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { calculateMatrixPositions } from '../utils/matrixPositions';
import { DebugPositions, ResponsiveValues } from '../components/charts/MatrixTypes';

export const useMatrixPositionCalculations = (
  responsive: ResponsiveValues,
  debugPositions: DebugPositions
) => {
  // Helper functions for positioning calculations
  const calculatePositionAtPercent = (
    fromPosition: { x: number; y: number },
    toCenter: { x: number; y: number },
    percent: number
  ) => ({
    x: fromPosition.x + (toCenter.x - fromPosition.x) * percent,
    y: fromPosition.y + (toCenter.y - fromPosition.y) * percent
  });

  const calculateMidpoint = (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
  ) => ({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
  });

  const convertToRelativePosition = (
    position: { x: number; y: number },
    center: { x: number; y: number }
  ) => ({
    x: position.x - center.x,
    y: position.y - center.y
  });

  // Helper function to calculate intersection of two lines
  const calculateLineIntersection = (
    line1Start: { x: number; y: number },
    line1End: { x: number; y: number },
    line2Start: { x: number; y: number },
    line2End: { x: number; y: number }
  ) => {
    const x1 = line1Start.x, y1 = line1Start.y;
    const x2 = line1End.x, y2 = line1End.y;
    const x3 = line2Start.x, y3 = line2Start.y;
    const x4 = line2End.x, y4 = line2End.y;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (Math.abs(denominator) < 0.0001) {
      // Lines are parallel
      return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;

    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  };

  // Calculate positions using responsive values
  const positions = calculateMatrixPositions(responsive.centerX, responsive.centerY, responsive.radius);

  // Calculate responsive generational line positions
  const responsiveGenerationalPositions = useMemo(() => {
    const centerPoint = { x: responsive.centerX, y: responsive.centerY };

    // Calculate 30% positions first (for "2" positions)
    const f2Position = calculatePositionAtPercent(positions.F, centerPoint, 0.30);
    const g2Position = calculatePositionAtPercent(positions.G, centerPoint, 0.30);
    const h2Position = calculatePositionAtPercent(positions.I, centerPoint, 0.30); // Swapped
    const i2Position = calculatePositionAtPercent(positions.H, centerPoint, 0.30); // Swapped

    return {
      // F1, F2: along F to center line (male generational line top)
      F2: f2Position,
      F1: calculateMidpoint(positions.F, f2Position),

      // G1, G2: along G to center line (female generational line top)
      G2: g2Position,
      G1: calculateMidpoint(positions.G, g2Position),

      // H1, H2: positioned on bottom-left (swapped to female side)
      H2: h2Position,
      H1: calculateMidpoint(positions.I, h2Position),

      // I1, I2: positioned on bottom-right (swapped to male side)
      I2: i2Position,
      I1: calculateMidpoint(positions.H, i2Position),

      // Main axis "2" positions (30% from outer toward center)
      T: calculatePositionAtPercent(positions.B, centerPoint, 0.30), // Self Expression
      N: calculatePositionAtPercent(positions.C, centerPoint, 0.30), // Past Life Income  
      FUTURE_CHILDREN: calculatePositionAtPercent(positions.A, centerPoint, 0.30),
      J: calculatePositionAtPercent(positions.D, centerPoint, 0.30), // Past Life Mistakes

      // "1" positions - midpoint between outer circles and their respective "2" positions  
      O: calculateMidpoint(positions.A, calculatePositionAtPercent(positions.A, centerPoint, 0.30)), // As a Parent
      P: calculateMidpoint(positions.B, calculatePositionAtPercent(positions.B, centerPoint, 0.30)), // Higher Self
      Q: calculateMidpoint(positions.C, calculatePositionAtPercent(positions.C, centerPoint, 0.30)), // Past Life Money Mindset
      R: calculateMidpoint(positions.D, calculatePositionAtPercent(positions.D, centerPoint, 0.30)), // Foundation

      // Calculate intersection-based positions
      L: (() => {
        // Calculate intersection of male generational line (F to H) and diagonal line (J to N)
        const jPosition = calculatePositionAtPercent(positions.D, centerPoint, 0.30);
        const nPosition = calculatePositionAtPercent(positions.C, centerPoint, 0.30);

        const intersection = calculateLineIntersection(
          positions.F, positions.H,
          jPosition, nPosition
        );

        return intersection || calculatePositionAtPercent(positions.D, centerPoint, 0.45); // fallback
      })(),

      // Other inner circles using helper functions
      V: calculatePositionAtPercent(centerPoint, positions.C, 0.33), // Sexuality - 33% from center toward C
      POWER_OF_ANCESTORS: calculatePositionAtPercent(centerPoint, positions.C, 0.20), // 20% from center toward C
    };
  }, [positions, responsive.centerX, responsive.centerY]);

  // Calculate anchor positions for relationship circles
  const anchorPositions = useMemo(() => {
    return {
      // M (Ingredients for Love) position at midpoint between J and L
      ingredientsForLove: calculateMidpoint(responsiveGenerationalPositions.J, responsiveGenerationalPositions.L),
      // K (Income Streams) position at midpoint between L and N  
      incomeStreams: calculateMidpoint(responsiveGenerationalPositions.L, responsiveGenerationalPositions.N)
    };
  }, [responsiveGenerationalPositions]);

  // Helper function to convert array of positions to relative coordinates
  const convertPositionsToRelative = (positions: Record<string, { x: number; y: number }>) => {
    const centerPoint = { x: responsive.centerX, y: responsive.centerY };
    return Object.fromEntries(
      Object.entries(positions).map(([key, pos]) => [
        key,
        convertToRelativePosition(pos, centerPoint)
      ])
    );
  };

  // Update debugPositions with responsive calculations
  const updatedDebugPositions = useMemo(() => {
    const centerPoint = { x: responsive.centerX, y: responsive.centerY };
    const convertedPositions = convertPositionsToRelative(responsiveGenerationalPositions);

    return {
      ...debugPositions,
      // Convert all responsive positions to relative coordinates
      ...convertedPositions,
      // Override with calculated anchor positions
      K: convertToRelativePosition(anchorPositions.incomeStreams, centerPoint),
      M: convertToRelativePosition(anchorPositions.ingredientsForLove, centerPoint),
      // Ensure these specific properties are available (explicit fallbacks for TypeScript)
      FUTURE_CHILDREN: convertedPositions.FUTURE_CHILDREN || convertToRelativePosition(responsiveGenerationalPositions.FUTURE_CHILDREN, centerPoint),
      POWER_OF_ANCESTORS: convertedPositions.POWER_OF_ANCESTORS || convertToRelativePosition(responsiveGenerationalPositions.POWER_OF_ANCESTORS, centerPoint),
      T: convertedPositions.T || convertToRelativePosition(responsiveGenerationalPositions.T, centerPoint),
      N: convertedPositions.N || convertToRelativePosition(responsiveGenerationalPositions.N, centerPoint),
      V: convertedPositions.V || convertToRelativePosition(responsiveGenerationalPositions.V, centerPoint),
      J: convertedPositions.J || convertToRelativePosition(responsiveGenerationalPositions.J, centerPoint),
      // Diagonal line from J (Past Life Mistakes) to N (Past Life Income)
      diagonal: (() => {
        const jRelative = convertToRelativePosition(responsiveGenerationalPositions.J, centerPoint);
        const nRelative = convertToRelativePosition(responsiveGenerationalPositions.N, centerPoint);
        return {
          x1: jRelative.x, y1: jRelative.y,
          x2: nRelative.x, y2: nRelative.y
        };
      })()
    };
  }, [responsive.centerX, responsive.centerY, responsiveGenerationalPositions, debugPositions, anchorPositions.incomeStreams, anchorPositions.ingredientsForLove]);

  return {
    positions,
    responsiveGenerationalPositions,
    anchorPositions,
    updatedDebugPositions,
    calculatePositionAtPercent,
    calculateMidpoint,
    convertToRelativePosition,
    calculateLineIntersection
  };
};