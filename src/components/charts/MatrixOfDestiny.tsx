/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChartTooltip, type TooltipData } from '../horary/ChartTooltip';
import {
  getMatrixResponsiveValues,
  calculateMatrixDimensions
} from '../../utils/matrixResponsive';
import { getArcanaInfo } from '../../utils/arcanaInfo';
import { getMatrixInterpretation, type MatrixInterpretation } from '../../utils/matrixInterpretations';
import { getAgeConnections, getMainCircleAges } from '../../utils/ageConnections';
import { getAgeLabelProps } from '../../utils/ageLabels';
import MatrixOfDestinyHeader from './MatrixOfDestinyHeader';
import MatrixOfDestinyLegend from './MatrixOfDestinyLegend';
import MatrixOfDestinyCalculationDetails from './MatrixOfDestinyCalculationDetails';
import MatrixOfDestinyInstructions from './MatrixOfDestinyInstructions';
import MatrixCircleElement from './MatrixCircleElement';
import {
  createMatrixMouseEnterHandler,
  createMatrixMouseLeaveHandler,
  createMatrixClickHandler
} from '../../utils/matrixEventHandlers';
import { MatrixLine, LabeledMatrixLine, MATRIX_LINE_STYLES } from '../../utils/matrixLineUtils';
import { calculateMatrixPositions } from '../../utils/matrixPositions';
import { MATRIX_INNER_ELEMENTS, createElementPosition, getElementLabel } from '../../utils/matrixElementDefinitions';
import { calculateMatrixOfDestiny, validateBirthDate, MatrixCalculation } from '../../utils/matrixCalculations';
import { calculateAgeDestinyArcana } from '../../utils/ageDestinyCalculations';

interface MatrixOfDestinyProps {
  birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates?: { lat: string; lon: string };
  };
  personName?: string;
}

interface Position {
  x: number;
  y: number;
  id: string;
  label: string;
  type: 'diagonal' | 'straight' | 'center';
}



const MatrixOfDestiny: React.FC<MatrixOfDestinyProps> = ({ birthData, personName }) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [isClient, setIsClient] = useState(false);

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

  // DEBUG: Draggable positions state for ALL inner circles
  const [debugPositions, setDebugPositions] = useState({
    // Relationship circles (already positioned)
    K: { x: 58, y: 169 }, // Income Streams
    L: { x: 111, y: 114 }, // Work Life Balance  
    M: { x: 166, y: 61 }, // Ingredients for Love
    N: { x: 228, y: 0 }, // Past Life Income

    // Inner elements that need positioning  
    V: { x: 85, y: 0 }, // Sexuality

    // F, G, H, I positions - DIAGONAL square corners (45-degree angles)
    F: { x: -212, y: -212 }, // Top-left diagonal (radius * cos(45°))
    G: { x: 212, y: -212 }, // Top-right diagonal
    H: { x: 212, y: 212 }, // Bottom-right diagonal  
    I: { x: -212, y: 212 }, // Bottom-left diagonal

    // Special inner elements
    HEART_POWER: { x: 60, y: 0 }, // Power of Ancestors
    TALENT: { x: 0, y: -120 }, // Heart's Desire
    GUARD: { x: -225, y: 0 }, // Guard/Blockage
    EARTH_PURPOSE: { x: -130, y: 0 }, // Earth Purpose

    // Temporary static positions - will be overridden by responsive calculations
    F1: { x: -190, y: -193 },
    F2: { x: -168, y: -169 },
    G1: { x: 195, y: -193 },
    G2: { x: 172, y: -171 },
    H1: { x: -193, y: 193 },
    H2: { x: -173, y: 169 },
    I1: { x: 200, y: 198 },
    I2: { x: 181, y: 179 },

    // O, P, Q, R positions - will be overridden by responsive calculations  
    O: { x: -150, y: 0 }, // As a Parent (15% from A)
    P: { x: 0, y: -150 }, // Higher Self (15% from B)
    Q: { x: 150, y: 0 }, // Past Life Money Mindset (15% from C)
    R: { x: 0, y: 150 }, // Present Life Task (15% from D)

    // J position - will be overridden by responsive calculations
    J: { x: 0, y: 35 }, // Past Life Mistakes (below center)

    diagonal: { x1: 0, y1: 30, x2: 180, y2: 0 } // Will be overridden by J to N coordinates
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const [responsive, setResponsive] = useState(() => {
    // Default values for SSR
    return {
      centerX: 300, centerY: 300, radius: 300,
      circleRadius: { center: 36, outer: 25 },
      fontSize: { center: 25, outer: 21 },
      ageDot: { radius: 3.5, fontSize: 9, labelOffset: 11 },
      innerElements: {
        talent: { offsetX: 0, offsetY: -120, radius: 20 },
        guard: { offsetX: -225, offsetY: 0, radius: 16 },
        earthPurpose: { offsetX: -130, offsetY: 0, radius: 16 },
        heart: { offsetX: 50, offsetY: 0, radius: 22 },
        karmicTail: { leftOffsetX: -60, centerOffsetX: 0, rightOffsetX: 60, offsetY: 380, radius: 16 }
      }
    };
  });
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    content: null,
    title: "",
    x: 0,
    y: 0,
    color: "#000000",
    position: "bottom-right",
  });

  // Update responsive values on mount and resize
  useEffect(() => {
    setIsClient(true);

    const updateResponsiveValues = () => {
      setResponsive(getMatrixResponsiveValues());
    };

    // Set initial values on client
    updateResponsiveValues();

    // Listen for resize events
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  // Responsive container sizing
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const newDimensions = calculateMatrixDimensions(width, height);
      setDimensions(newDimensions);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Russian Matrix Destiny calculation algorithm using precise reference implementation
  const matrixData = useMemo((): MatrixCalculation | null => {
    if (!birthData.dateOfBirth || !validateBirthDate(birthData.dateOfBirth)) {
      return null;
    }

    return calculateMatrixOfDestiny(birthData.dateOfBirth);
  }, [birthData.dateOfBirth]);

  // Calculate age-specific destiny arcana for all ages 0-79
  const ageDestinyMap = useMemo(() => {
    if (!birthData.dateOfBirth || !validateBirthDate(birthData.dateOfBirth)) {
      return {};
    }
    return calculateAgeDestinyArcana(birthData.dateOfBirth);
  }, [birthData.dateOfBirth]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [responsive.centerX, responsive.centerY, convertPositionsToRelative, responsiveGenerationalPositions, debugPositions, anchorPositions.incomeStreams, anchorPositions.ingredientsForLove]);

  // Helper function to map position IDs to Matrix aspect types
  const getPositionAspectType = (positionId: string): 'incomeStreams' | 'workLifeBalance' | 'ingredientsForLove' | 'pastLifeIncome' | 'sexuality' | 'powerOfAncestors' | null => {
    const aspectMap: Record<string, 'incomeStreams' | 'workLifeBalance' | 'ingredientsForLove' | 'pastLifeIncome' | 'sexuality' | 'powerOfAncestors'> = {
      // INCOME & MONEY RELATED POSITIONS
      'K': 'incomeStreams',        // Income Streams (original mapping)
      'C': 'incomeStreams',        // Money Block - financial obstacles and patterns
      'Q': 'pastLifeIncome',       // Past Life Money Mindset
      'N': 'pastLifeIncome',       // Past Life Income (original mapping)
      
      // WORK & LIFE PURPOSE POSITIONS  
      'L': 'workLifeBalance',      // Work Life Balance (original mapping)
      'R': 'workLifeBalance',      // Present Life Task
      'D': 'workLifeBalance',      // Biggest Obstacle in Life
      'A': 'workLifeBalance',      // Reputation - how you're seen professionally
      'E': 'workLifeBalance',      // Comfort Zone - work patterns and habits
      'P': 'workLifeBalance',      // Higher Self - spiritual work purpose
      'T': 'workLifeBalance',      // Self Expression - how you show up at work
      'O': 'workLifeBalance',      // As a Parent - family-work balance
      
      // LOVE & RELATIONSHIPS POSITIONS
      'M': 'ingredientsForLove',   // Ingredients for Love (original mapping) 
      'B': 'ingredientsForLove',   // Inspiration - emotional nature in relationships
      'FUTURE_CHILDREN': 'ingredientsForLove', // Future Children - family aspirations
      'TALENT': 'ingredientsForLove', // Heart's Desire - what you need emotionally
      
      // SEXUALITY & INTIMATE ENERGY
      'V': 'sexuality',            // Sexuality (original mapping)
      'S': 'sexuality',            // Relationship sexuality and passion
      'U': 'sexuality',            // Intimate connection and sexual expression
      'W': 'sexuality',            // Physical attraction and magnetism
      'X': 'sexuality',            // Sexual healing and transformation
      
      // ANCESTRAL & FAMILY LINEAGE
      'POWER_OF_ANCESTORS': 'powerOfAncestors', // Power of Ancestors (original mapping)
      'F': 'powerOfAncestors',     // Dad's Talents - paternal lineage
      'G': 'powerOfAncestors',     // Mom's Talents - maternal lineage  
      'H': 'powerOfAncestors',     // Dad's Karma - paternal patterns
      'I': 'powerOfAncestors',     // Mom's Karma - maternal patterns
      'J': 'powerOfAncestors',     // Past Life Mistakes - ancestral karma
      'F1': 'powerOfAncestors',    // Dad's Talents (outer)
      'F2': 'powerOfAncestors',    // Dad's Talents (inner)
      'G1': 'powerOfAncestors',    // Mom's Talents (outer)
      'G2': 'powerOfAncestors',    // Mom's Talents (inner)
      'H1': 'powerOfAncestors',    // Dad's Karma (outer)
      'H2': 'powerOfAncestors',    // Dad's Karma (inner)
      'I1': 'powerOfAncestors',    // Mom's Karma (outer)
      'I2': 'powerOfAncestors',    // Mom's Karma (inner)
      
      // HEART & SPIRITUAL PURPOSE
      'HEART_WISHES': 'ingredientsForLove' // Heart/Wishes - material desires in love
    };
    
    return aspectMap[positionId] || null;
  };


  // Create reusable event handlers (before early returns)
  const handleMouseEnter = matrixData ? createMatrixMouseEnterHandler(
    setTooltip,
    setHoveredPosition,
    containerRef,
    matrixData.positions
  ) : () => { };

  const handleMouseLeave = createMatrixMouseLeaveHandler(setHoveredPosition, setTooltip);
  const handleClick = createMatrixClickHandler(selectedPosition, setSelectedPosition);

  // DEBUG: Drag handlers
  const handleDragStart = (elementId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(elementId);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const svgRect = containerRef.current.querySelector('svg')?.getBoundingClientRect();
    if (!svgRect) return;

    // Convert mouse position to SVG coordinates
    const x = ((e.clientX - svgRect.left) / svgRect.width) * 700;
    const y = ((e.clientY - svgRect.top) / svgRect.height) * 850 - 100;

    setDebugPositions(prev => {
      if (isDragging === 'diagonal') {
        // For diagonal, update based on which end is closer
        const dist1 = Math.sqrt((x - (responsive.centerX + prev.diagonal.x1)) ** 2 + (y - (responsive.centerY + prev.diagonal.y1)) ** 2);
        const dist2 = Math.sqrt((x - (responsive.centerX + prev.diagonal.x2)) ** 2 + (y - (responsive.centerY + prev.diagonal.y2)) ** 2);

        if (dist1 < dist2) {
          return {
            ...prev,
            diagonal: { ...prev.diagonal, x1: x - responsive.centerX, y1: y - responsive.centerY }
          };
        } else {
          return {
            ...prev,
            diagonal: { ...prev.diagonal, x2: x - responsive.centerX, y2: y - responsive.centerY }
          };
        }
      } else {
        return {
          ...prev,
          [isDragging]: { x: x - responsive.centerX, y: y - responsive.centerY }
        };
      }
    });
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };


  if (!matrixData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No birth data available for Matrix of Destiny calculation.</p>
      </div>
    );
  }

  // Return loading state if not on client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="text-slate-600">Initializing Matrix of Destiny...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <MatrixOfDestinyHeader personName={personName} />

      {/* Octagram Matrix Chart */}
      <div ref={containerRef} className="w-full mx-auto relative">
        <div className="relative w-full flex items-center justify-center">
          <svg
            viewBox="0 -100 700 850"
            width={dimensions.width}
            height={dimensions.height}
            className="octagram-chart w-full max-w-none"
            style={{ minHeight: '900px', minWidth: '900px', maxHeight: '95vh' }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Background elements */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Octagram structure - Diagonal Square (Rhombus) */}
            <polygon
              points={`${positions.A.x},${positions.A.y} ${positions.B.x},${positions.B.y} ${positions.C.x},${positions.C.y} ${positions.D.x},${positions.D.y}`}
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Straight Square */}
            <polygon
              points={`${positions.F.x},${positions.F.y} ${positions.G.x},${positions.G.y} ${positions.H.x},${positions.H.y} ${positions.I.x},${positions.I.y}`}
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Connection lines to centers */}
            {Object.entries(positions).filter(([key]) => key !== 'E' && key !== 'J').map(([key, pos]) => (
              <line
                key={`center-line-${key}`}
                x1={pos.x}
                y1={pos.y}
                x2={responsive.centerX}
                y2={responsive.centerY}
                stroke="#000000"
                strokeWidth="0.5"
                opacity="0.2"
              />
            ))}

            {/* Sky Line (vertical axis) - emphasized */}
            <MatrixLine
              from={positions.B}
              to={positions.D}
              {...MATRIX_LINE_STYLES.axis}
            />

            {/* Earth Line (horizontal axis) - emphasized */}
            <MatrixLine
              from={positions.A}
              to={positions.C}
              {...MATRIX_LINE_STYLES.axis}
            />

            {/* Love Line (horizontal - A to C) */}
            <MatrixLine
              from={positions.A}
              to={positions.C}
              {...MATRIX_LINE_STYLES.love}
              className="love-line"
            />

            {/* Money Line (vertical - B to D) */}
            <MatrixLine
              from={positions.B}
              to={positions.D}
              {...MATRIX_LINE_STYLES.money}
              className="money-line"
            />

            {/* DEBUG: Draggable diagonal line from J (Past Life Mistakes) to N (Past Life Income) */}
            <line
              x1={responsive.centerX + updatedDebugPositions.diagonal.x1}
              y1={responsive.centerY + updatedDebugPositions.diagonal.y1}
              x2={responsive.centerX + updatedDebugPositions.diagonal.x2}
              y2={responsive.centerY + updatedDebugPositions.diagonal.y2}
              stroke="#888888"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.4"
              style={{ cursor: isDragging === 'diagonal' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('diagonal', e)}
            />

            {/* Diagonal generational lines with labels */}
            {/* Female Generational Line (Bottom-left to Top-right) */}
            <g>
              <line
                x1={positions.I.x}
                y1={positions.I.y}
                x2={positions.G.x}
                y2={positions.G.y}
                stroke="#ff0000"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Female Generational Line Label */}
              <text
                x={positions.I.x + (positions.G.x - positions.I.x) * 0.68}
                y={positions.I.y + (positions.G.y - positions.I.y) * 0.68 + 12}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none font-space-grotesk"
                fontSize="10"
                fontFamily="Space Grotesk, system-ui, -apple-system, sans-serif"
                fill="#000000"
                opacity="0.7"
                transform={`rotate(-45 ${positions.I.x + (positions.G.x - positions.I.x) * 0.68} ${positions.I.y + (positions.G.y - positions.I.y) * 0.68 + 12})`}
              >
                female generational line
              </text>
            </g>

            {/* Male Generational Line (Top-left to Bottom-right) */}
            <g>
              <line
                x1={positions.F.x}
                y1={positions.F.y}
                x2={positions.H.x}
                y2={positions.H.y}
                stroke="#0000ff"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Male Generational Line Label */}
              <text
                x={positions.F.x + (positions.H.x - positions.F.x) * 0.35}
                y={positions.F.y + (positions.H.y - positions.F.y) * 0.35 - 12}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none font-space-grotesk"
                fontSize="10"
                fontFamily="Space Grotesk, system-ui, -apple-system, sans-serif"
                fill="#000000"
                opacity="0.7"
                transform={`rotate(45 ${positions.F.x + (positions.H.x - positions.F.x) * 0.35} ${positions.F.y + (positions.H.y - positions.F.y) * 0.35 - 12})`}
              >
                male generational line
              </text>
            </g>

            {/* Outer circle connections with age dots */}
            {(() => {
              const ageConnections = getAgeConnections();
              const connections = ageConnections.map(conn => ({
                from: positions[conn.from],
                to: positions[conn.to],
                ages: conn.ages,
                ageBrackets: conn.ageBrackets,
                phase: conn.phase
              }));

              return connections.map((connection, index) => (
                <g key={`connection-${index}`}>
                  {/* Base line */}
                  <line
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    stroke="#000000"
                    strokeWidth="0.5"
                    opacity="0.25"
                  />

                  {/* Age dots */}
                  {connection.ages.map((ageCode, ageIndex) => {
                    // Move dots much further from circles by adjusting progress
                    const totalSegments = connection.ages.length + 1;
                    const segmentLength = 1 / totalSegments;
                    const buffer = segmentLength * 1.5; // 150% buffer from circles - maximum space
                    const availableLength = 1 - (2 * buffer); // Space available for dots
                    const dotSpacing = availableLength / connection.ages.length;
                    const adjustedProgress = buffer + (ageIndex * dotSpacing) + (dotSpacing * 0.5);

                    const x = connection.from.x + (connection.to.x - connection.from.x) * adjustedProgress;
                    const y = connection.from.y + (connection.to.y - connection.from.y) * adjustedProgress;

                    // Get destiny arcana for this age code
                    const destinyArcana = ageDestinyMap[ageCode];
                    const arcanaInfo = destinyArcana ? getArcanaInfo(destinyArcana) : null;

                    // Get age bracket display for this age
                    const ageBracket = connection.ageBrackets?.[ageIndex];

                    // Calculate label position based on dot's position relative to center
                    const centerX = responsive.centerX;
                    const centerY = responsive.centerY;
                    const isLeft = x < centerX;
                    const isTop = y < centerY;

                    // Offset labels from dot based on position
                    const outwardOffsetX = isLeft ? -responsive.ageDot.labelOffset : responsive.ageDot.labelOffset;
                    const outwardOffsetY = isTop ? -responsive.ageDot.labelOffset * 0.5 : responsive.ageDot.labelOffset * 0.5;

                    // Inward offset (closer to center) for age bracket labels
                    const inwardOffsetX = isLeft ? responsive.ageDot.labelOffset * 0.5 : -responsive.ageDot.labelOffset * 0.5;
                    const inwardOffsetY = isTop ? responsive.ageDot.labelOffset * 0.3 : -responsive.ageDot.labelOffset * 0.3;

                    return (
                      <g key={`age-${ageCode}`}>
                        {/* Age dot with destiny arcana color */}
                        <circle
                          cx={x}
                          cy={y}
                          r={responsive.ageDot.radius}
                          fill={arcanaInfo?.color || "#000000"}
                          stroke="#000000"
                          strokeWidth="0.5"
                          opacity="0.7"
                          className="cursor-pointer"
                        />

                        {/* Destiny arcana number - outward (clear and visible) */}
                        {destinyArcana && (
                          <text
                            x={x + outwardOffsetX}
                            y={y + outwardOffsetY}
                            textAnchor={isLeft ? "end" : "start"}
                            dominantBaseline="central"
                            className="pointer-events-none select-none font-bold"
                            fontSize={responsive.ageDot.fontSize}
                            fontFamily="system-ui, -apple-system, sans-serif"
                            fill="#000000"
                            opacity="0.9"
                          >
                            {destinyArcana}
                          </text>
                        )}

                        {/* Age bracket label - inward (closer to center) */}
                        {ageBracket && (
                          <text
                            x={x + inwardOffsetX}
                            y={y + inwardOffsetY}
                            textAnchor={isLeft ? "start" : "end"}
                            dominantBaseline="central"
                            className="pointer-events-none select-none"
                            fontSize={Math.max(5, responsive.ageDot.fontSize - 2)}
                            fontFamily="system-ui, -apple-system, sans-serif"
                            fill="#666666"
                            opacity="0.8"
                          >
                            {ageBracket.display}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              ));
            })()}

            {/* Heart/Wishes Position - Power of Ancestors - responsive positioning */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.POWER_OF_ANCESTORS.x}
              y={responsive.centerY + updatedDebugPositions.POWER_OF_ANCESTORS.y}
              radius={responsive.innerElements.heart.radius}
              fill={getArcanaInfo(matrixData.innerElements.heart).color}
              number={matrixData.innerElements.heart}
              fontSize="18"
              id="POWER_OF_ANCESTORS"
              label={getElementLabel("POWER_OF_ANCESTORS")}
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* Additional Inner Circle Elements */}
            {/* Heart's Desire Position - Above comfort zone */}
            <MatrixCircleElement
              x={responsive.centerX + responsive.innerElements.talent.offsetX}
              y={responsive.centerY + responsive.innerElements.talent.offsetY}
              radius={responsive.innerElements.talent.radius}
              fill={getArcanaInfo(matrixData.innerElements.talent).color}
              number={matrixData.innerElements.talent}
              fontSize="14"
              id="TALENT"
              label={getElementLabel("TALENT")}
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* Guard/Blockage Position - Left on vertical line */}
            <g>
              <circle
                cx={responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN.x}
                cy={responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN.y}
                r={responsive.innerElements.guard.radius}
                fill={getArcanaInfo(matrixData.innerElements.guard).color}
                stroke="#000"
                strokeWidth="1"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => handleMouseEnter('FUTURE_CHILDREN', createElementPosition(
                  'FUTURE_CHILDREN',
                  responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN.x,
                  responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN.y,
                  matrixData.innerElements.guard
                ), e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setSelectedPosition(selectedPosition === 'FUTURE_CHILDREN' ? null : 'FUTURE_CHILDREN')}
              />
              <text
                x={responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN.x}
                y={responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold text-black pointer-events-none select-none"
                fontSize="12"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {matrixData.innerElements.guard}
              </text>
            </g>

            {/* Earth Purpose Position - Between Guardian and Comfort Zone */}
            <g>
              <circle
                cx={responsive.centerX + responsive.innerElements.earthPurpose.offsetX}
                cy={responsive.centerY + responsive.innerElements.earthPurpose.offsetY}
                r={responsive.innerElements.earthPurpose.radius}
                fill={getArcanaInfo(matrixData.innerElements.earthPurpose).color}
                stroke="#000"
                strokeWidth="1"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => handleMouseEnter('HEART_WISHES', createElementPosition(
                  'HEART_WISHES',
                  responsive.centerX + responsive.innerElements.earthPurpose.offsetX,
                  responsive.centerY + responsive.innerElements.earthPurpose.offsetY,
                  matrixData.innerElements.earthPurpose
                ), e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setSelectedPosition(selectedPosition === 'HEART_WISHES' ? null : 'HEART_WISHES')}
              />
              <text
                x={responsive.centerX + responsive.innerElements.earthPurpose.offsetX}
                y={responsive.centerY + responsive.innerElements.earthPurpose.offsetY}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold text-black pointer-events-none select-none"
                fontSize="11"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {matrixData.innerElements.earthPurpose}
              </text>
            </g>

            {/* Matrix Inner Elements - Following Reference Implementation */}

            {/* Medium Circles - Secondary Powers */}
            {/* O Point - Left Inner (As a Parent) - moved closer to reputation */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.O.x}
              y={responsive.centerY + updatedDebugPositions.O.y}
              radius={18}
              fill={getArcanaInfo(matrixData.positions.O).color}
              number={matrixData.positions.O}
              fontSize="16"
              id="O"
              label="As a Parent"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* P Point - Top Inner (Higher Self) - moved closer to inspiration */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.P.x}
              y={responsive.centerY + updatedDebugPositions.P.y}
              radius={18}
              fill={getArcanaInfo(matrixData.positions.P).color}
              number={matrixData.positions.P}
              fontSize="16"
              id="P"
              label="Higher Self"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* Q Point - Right Inner (Past Life Money Mindset) - moved closer to money block */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.Q.x}
              y={responsive.centerY + updatedDebugPositions.Q.y}
              radius={18}
              fill={getArcanaInfo(matrixData.positions.Q).color}
              number={matrixData.positions.Q}
              fontSize="16"
              id="Q"
              label="Past Life Money Mindset"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* R Point - Bottom Inner (Present Life Task) - moved closer to karmic */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.R.x}
              y={responsive.centerY + updatedDebugPositions.R.y}
              radius={18}
              fill={getArcanaInfo(matrixData.positions.R).color}
              number={matrixData.positions.R}
              fontSize="16"
              id="R"
              label="Present Life Task"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* J Point - Past Life Mistakes (positioned below center) */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.J.x}
              y={responsive.centerY + updatedDebugPositions.J.y}
              radius={16}
              fill={getArcanaInfo(matrixData.centers.J).color}
              number={matrixData.centers.J}
              fontSize="14"
              id="J"
              label="Past Life Mistakes"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />

            {/* Small Circles - Detailed Aspects */}

            {/* T Point - Top Middle (Self Expression) - responsive positioning */}
            <MatrixCircleElement
              x={responsive.centerX + updatedDebugPositions.T.x}
              y={responsive.centerY + updatedDebugPositions.T.y}
              radius={14}
              fill={getArcanaInfo(matrixData.positions.T).color}
              number={matrixData.positions.T}
              fontSize="12"
              id="T"
              label="Self Expression"
              type="center"
              selectedPosition={selectedPosition}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />



            {/* DEBUG: N Point - Right Center (Past Life Income) */}
            <g
              style={{ cursor: isDragging === 'N' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('N', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.N.x}
                y={responsive.centerY + updatedDebugPositions.N.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.N).color}
                number={matrixData.positions.N}
                fontSize="12"
                id="N"
                label="Past Life Income"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>


            {/* DEBUG: Relationship/Income Lines */}
            {/* K Point - Income Streams */}
            <g
              style={{ cursor: isDragging === 'K' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('K', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.K.x}
                y={responsive.centerY + updatedDebugPositions.K.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.K).color}
                number={matrixData.positions.K}
                fontSize="12"
                id="K"
                label="Income Streams"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />

              {/* Dollar sign icon above Income Streams Position K */}
              <g transform={`translate(${responsive.centerX + updatedDebugPositions.K.x}, ${responsive.centerY + updatedDebugPositions.K.y - 25})`}>
                <text
                  x="0"
                  y="2"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#22c55e"
                  stroke="#16a34a"
                  strokeWidth="0.5"
                  textAnchor="middle"
                  opacity="0.9"
                >
                  $
                </text>
              </g>
            </g>

            {/* L Point - Work Life Balance */}
            <g
              style={{ cursor: isDragging === 'L' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('L', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.L.x}
                y={responsive.centerY + updatedDebugPositions.L.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.L).color}
                number={matrixData.positions.L}
                fontSize="12"
                id="L"
                label="Work Life Balance"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            {/* M Point - Ingredients for Love */}
            <g
              style={{ cursor: isDragging === 'M' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('M', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.M.x}
                y={responsive.centerY + updatedDebugPositions.M.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.M).color}
                number={matrixData.positions.M}
                fontSize="12"
                id="M"
                label="Ingredients for Love"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />

              {/* Heart icon above Ingredients for Love Position M */}
              <g transform={`translate(${responsive.centerX + updatedDebugPositions.M.x}, ${responsive.centerY + updatedDebugPositions.M.y - 30})`}>
                <path
                  d="M0,-4 C-3,-7 -8,-7 -8,-2 C-8,2 0,8 0,8 C0,8 8,2 8,-2 C8,-7 3,-7 0,-4 Z"
                  fill="#e91e63"
                  stroke="#e91e63"
                  strokeWidth="0.5"
                  opacity="0.8"
                />
              </g>
            </g>








            {/* Position circles */}
            {Object.entries(positions).map(([key, pos]) => {
              if (key === 'J') return null; // Skip past life mistakes as it overlaps with comfort zone
              if (['F1', 'F2', 'G1', 'G2', 'H1', 'H2', 'I1', 'I2'].includes(key)) return null; // Skip inner generational circles - rendered separately

              const number = matrixData.positions[key];
              if (!number || number === undefined) return null; // Skip if number is invalid

              const arcana = getArcanaInfo(number);
              const isSelected = selectedPosition === key;
              const isHovered = hoveredPosition === key;
              const isCenter = key === 'E';

              const circleRadius = isCenter ? responsive.circleRadius.center : responsive.circleRadius.outer;
              const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1;

              return (
                <g key={key}>

                  {/* Position circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={circleRadius}
                    fill={arcana.color}
                    stroke="#000"
                    strokeWidth={strokeWidth}
                    filter={isHovered ? "url(#glow)" : undefined}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transformOrigin: `${pos.x}px ${pos.y}px`
                    }}
                    onMouseEnter={(e) => handleMouseEnter(key, pos, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setSelectedPosition(selectedPosition === key ? null : key)}
                  />

                  {/* Position number */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold text-black pointer-events-none select-none"
                    fontSize={isCenter ? responsive.fontSize.center : responsive.fontSize.outer}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {number}
                  </text>

                  {/* Age labels for outer positions */}
                  {!isCenter && (() => {
                    const mainCircleAges = getMainCircleAges();
                    const ageData = mainCircleAges.find(a => a.position === key);
                    if (!ageData) return null;

                    const age = ageData.age.toString();
                    const labelProps = getAgeLabelProps(key, pos.x, pos.y, age, circleRadius);

                    return (
                      <text
                        x={labelProps.x}
                        y={labelProps.y}
                        textAnchor={labelProps.textAnchor}
                        dominantBaseline="central"
                        className="pointer-events-none select-none"
                        fontSize="11"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fill="#000000"
                        opacity="0.8"
                        fontWeight="bold"
                      >
                        {labelProps.age}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {/* F1, F2 - Male Generational Line Inner Circles */}
            <g
              style={{ cursor: isDragging === 'F1' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('F1', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.F1.x}
                y={responsive.centerY + updatedDebugPositions.F1.y}
                radius={18}
                fill={getArcanaInfo(matrixData.positions.F1).color}
                number={matrixData.positions.F1}
                fontSize="10"
                id="F1"
                label="Dad's Talents"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            <g
              style={{ cursor: isDragging === 'F2' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('F2', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.F2.x}
                y={responsive.centerY + updatedDebugPositions.F2.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.F2).color}
                number={matrixData.positions.F2}
                fontSize="10"
                id="F2"
                label="Dad's Talents"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            {/* G1, G2 - Female Generational Line Inner Circles */}
            <g
              style={{ cursor: isDragging === 'G1' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('G1', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.G1.x}
                y={responsive.centerY + updatedDebugPositions.G1.y}
                radius={18}
                fill={getArcanaInfo(matrixData.positions.G1).color}
                number={matrixData.positions.G1}
                fontSize="10"
                id="G1"
                label="Mom's Talents"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            <g
              style={{ cursor: isDragging === 'G2' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('G2', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.G2.x}
                y={responsive.centerY + updatedDebugPositions.G2.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.G2).color}
                number={matrixData.positions.G2}
                fontSize="10"
                id="G2"
                label="Mom's Talents"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            {/* H1, H2 - Male Generational Line Inner Circles */}
            <g
              style={{ cursor: isDragging === 'H1' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('H1', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.H1.x}
                y={responsive.centerY + updatedDebugPositions.H1.y}
                radius={18}
                fill={getArcanaInfo(matrixData.positions.H1).color}
                number={matrixData.positions.H1}
                fontSize="10"
                id="H1"
                label="Mom's Karma"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            <g
              style={{ cursor: isDragging === 'H2' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('H2', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.H2.x}
                y={responsive.centerY + updatedDebugPositions.H2.y}
                radius={12}
                fill={getArcanaInfo(matrixData.positions.H2).color}
                number={matrixData.positions.H2}
                fontSize="10"
                id="H2"
                label="Mom's Karma"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            {/* I1, I2 - Female Generational Line Inner Circles */}
            <g
              style={{ cursor: isDragging === 'I1' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('I1', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.I1.x}
                y={responsive.centerY + updatedDebugPositions.I1.y}
                radius={18}
                fill={getArcanaInfo(matrixData.positions.I1).color}
                number={matrixData.positions.I1}
                fontSize="10"
                id="I1"
                label="Dad's Karma"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            <g
              style={{ cursor: isDragging === 'I2' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('I2', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.I2.x}
                y={responsive.centerY + updatedDebugPositions.I2.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.I2).color}
                number={matrixData.positions.I2}
                fontSize="10"
                id="I2"
                label="Dad's Karma"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

            {/* V - Sexuality (keeping only this one) */}
            <g
              style={{ cursor: isDragging === 'V' ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleDragStart('V', e)}
            >
              <MatrixCircleElement
                x={responsive.centerX + updatedDebugPositions.V.x}
                y={responsive.centerY + updatedDebugPositions.V.y}
                radius={14}
                fill={getArcanaInfo(matrixData.positions.V).color}
                number={matrixData.positions.V}
                fontSize="12"
                id="V"
                label="Sexuality"
                type="center"
                selectedPosition={selectedPosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              />
            </g>

          </svg>
        </div>

        {/* Tooltip */}
        <ChartTooltip
          tooltip={tooltip}
          containerRef={containerRef}
        />

        {/* DEBUG: Floating Coordinate Display
        <div className="fixed top-4 right-4 bg-white border-2 border-gray-300 p-4 rounded shadow-lg z-50 font-mono text-xs max-h-96 overflow-y-auto">
          <div className="font-bold mb-2 text-sm">Debug Coordinates</div>
          <div className="space-y-1">
            <div><strong>F:</strong> x: {Math.round(debugPositions.F.x)}, y: {Math.round(debugPositions.F.y)}</div>
            <div><strong>G:</strong> x: {Math.round(debugPositions.G.x)}, y: {Math.round(debugPositions.G.y)}</div>
            <div><strong>H:</strong> x: {Math.round(debugPositions.H.x)}, y: {Math.round(debugPositions.H.y)}</div>
            <div><strong>I:</strong> x: {Math.round(debugPositions.I.x)}, y: {Math.round(debugPositions.I.y)}</div>
            <div className="border-t pt-2 mt-2">
              <div><strong>K (Income Streams):</strong> x: {Math.round(updatedDebugPositions.K.x)}, y: {Math.round(updatedDebugPositions.K.y)}</div>
              <div><strong>L (Work Life Balance):</strong> x: {Math.round(updatedDebugPositions.L.x)}, y: {Math.round(updatedDebugPositions.L.y)}</div>
              <div><strong>M (Ingredients for Love):</strong> x: {Math.round(updatedDebugPositions.M.x)}, y: {Math.round(updatedDebugPositions.M.y)}</div>
              <div><strong>N (Past Life Income):</strong> x: {Math.round(updatedDebugPositions.N.x)}, y: {Math.round(updatedDebugPositions.N.y)}</div>
            </div>
            <div className="border-t pt-2 mt-2">
              <div><strong>V (Sexuality):</strong> x: {Math.round(updatedDebugPositions.V.x)}, y: {Math.round(updatedDebugPositions.V.y)}</div>
            </div>
            <div className="border-t pt-2 mt-2">
              <div><strong>Male/Female Generational Lines:</strong></div>
              <div><strong>F1:</strong> x: {Math.round(updatedDebugPositions.F1.x)}, y: {Math.round(updatedDebugPositions.F1.y)}</div>
              <div><strong>F2:</strong> x: {Math.round(updatedDebugPositions.F2.x)}, y: {Math.round(updatedDebugPositions.F2.y)}</div>
              <div><strong>G1:</strong> x: {Math.round(updatedDebugPositions.G1.x)}, y: {Math.round(updatedDebugPositions.G1.y)}</div>
              <div><strong>G2:</strong> x: {Math.round(updatedDebugPositions.G2.x)}, y: {Math.round(updatedDebugPositions.G2.y)}</div>
              <div><strong>H1:</strong> x: {Math.round(updatedDebugPositions.H1.x)}, y: {Math.round(updatedDebugPositions.H1.y)}</div>
              <div><strong>H2:</strong> x: {Math.round(updatedDebugPositions.H2.x)}, y: {Math.round(updatedDebugPositions.H2.y)}</div>
              <div><strong>I1:</strong> x: {Math.round(updatedDebugPositions.I1.x)}, y: {Math.round(updatedDebugPositions.I1.y)}</div>
              <div><strong>I2:</strong> x: {Math.round(updatedDebugPositions.I2.x)}, y: {Math.round(updatedDebugPositions.I2.y)}</div>
            </div>
            <div className="border-t pt-2 mt-2">
              <div><strong>Diagonal:</strong></div>
              <div className="ml-2">x1: {Math.round(debugPositions.diagonal.x1)}, y1: {Math.round(debugPositions.diagonal.y1)}</div>
              <div className="ml-2">x2: {Math.round(debugPositions.diagonal.x2)}, y2: {Math.round(debugPositions.diagonal.y2)}</div>
            </div>
            {isDragging && (
              <div className="mt-2 text-red-600">
                <strong>Dragging: {isDragging}</strong>
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Matrix Interpretation Panel */}
      {selectedPosition && (() => {
        // Get the arcana number for this position
        let arcanaNumber: number | null = null;
        
        // Check different data sources for the arcana number
        if (matrixData.positions && selectedPosition in matrixData.positions) {
          arcanaNumber = matrixData.positions[selectedPosition as keyof typeof matrixData.positions];
        } else if (matrixData.centers && selectedPosition in matrixData.centers) {
          arcanaNumber = matrixData.centers[selectedPosition as keyof typeof matrixData.centers];
        } else if (matrixData.innerElements) {
          // Map inner element keys to their properties
          const innerElementMap: Record<string, keyof typeof matrixData.innerElements> = {
            'POWER_OF_ANCESTORS': 'heart',
            'TALENT': 'talent', 
            'FUTURE_CHILDREN': 'guard',
            'HEART_WISHES': 'earthPurpose'
          };
          
          const innerElementKey = innerElementMap[selectedPosition];
          if (innerElementKey && matrixData.innerElements[innerElementKey]) {
            arcanaNumber = matrixData.innerElements[innerElementKey];
          }
        }

        if (!arcanaNumber) return null;

        const arcana = getArcanaInfo(arcanaNumber);
        const positionName = getElementLabel(selectedPosition); // Use the same function as tooltips
        const aspectType = getPositionAspectType(selectedPosition);
        const matrixInterpretation = aspectType ? getMatrixInterpretation(aspectType, arcanaNumber) : null;

        return (
          <div className="margin-large padding-global">
            <div className="container-large">
              {/* Synapsas-style Card Design */}
              <div className="bg-white border-2 border-black">
                {/* Header Section with Synapsas Colors */}
                <div 
                  className="px-8 py-6 border-b-2 border-black"
                  style={{ backgroundColor: '#f0e3ff' }} // Synapsas light purple
                >
                  <div className="flex items-center space-x-6">
                    <div
                      className="w-20 h-20 border-2 border-black flex items-center justify-center text-white font-black"
                      style={{ 
                        backgroundColor: arcana.color
                      }}
                    >
                      <span className="text-2xl font-epilogue">{arcanaNumber}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-space-grotesk text-3xl font-black text-black mb-1">
                        {positionName}
                      </h3>
                      <p className="font-inter text-xl text-black/70 mb-2">Arcana {arcanaNumber}: {arcana.name}</p>
                      {aspectType && (
                        <div 
                          className="inline-flex items-center px-3 py-1 text-sm font-semibold text-black border-2 border-black"
                          style={{ 
                            backgroundColor: '#fffbed' // Synapsas light yellow
                          }}
                        >
                          {aspectType.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Basic Arcana Description */}
                  <div className="margin-medium">
                    <h4 className="font-space-grotesk text-xl font-bold text-black margin-small">
                      General Meaning
                    </h4>
                    <p className="font-inter text-black leading-relaxed text-lg">
                      {arcana.description}
                    </p>
                  </div>

                  {/* Matrix-Specific Interpretation */}
                  {matrixInterpretation && (
                    <div className="space-y-6">
                      <h4 className="font-space-grotesk text-xl font-bold text-black margin-medium">
                        Matrix of Destiny Interpretation
                      </h4>
                      
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Overview & Strengths */}
                        <div className="space-y-6">
                          <div 
                            className="p-6 border-2 border-black"
                            style={{ 
                              backgroundColor: '#6bdbff' // Synapsas blue
                            }}
                          >
                            <h5 className="font-space-grotesk font-bold text-black margin-small">Overview</h5>
                            <p className="font-inter text-black leading-relaxed">
                              {matrixInterpretation.general}
                            </p>
                          </div>
                          
                          <div 
                            className="p-6 border-2 border-black"
                            style={{ 
                              backgroundColor: '#4ade80' // Synapsas green
                            }}
                          >
                            <h5 className="font-space-grotesk font-bold text-black margin-small">Strengths</h5>
                            <p className="font-inter text-black leading-relaxed">
                              {matrixInterpretation.positive}
                            </p>
                          </div>
                        </div>

                        {/* Challenges & Guidance */}
                        <div className="space-y-6">
                          <div 
                            className="p-6 border-2 border-black"
                            style={{ 
                              backgroundColor: '#f2e356' // Synapsas yellow
                            }}
                          >
                            <h5 className="font-space-grotesk font-bold text-black margin-small">Challenges</h5>
                            <p className="font-inter text-black leading-relaxed">
                              {matrixInterpretation.challenge}
                            </p>
                          </div>
                          
                          <div 
                            className="p-6 border-2 border-black"
                            style={{ 
                              backgroundColor: '#ff91e9' // Synapsas purple
                            }}
                          >
                            <h5 className="font-space-grotesk font-bold text-black margin-small">Guidance</h5>
                            <p className="font-inter text-black leading-relaxed">
                              {matrixInterpretation.advice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Matrix Interpretation Available */}
                  {!matrixInterpretation && aspectType === null && (
                    <div 
                      className="p-6 border-2 border-black"
                      style={{ 
                        backgroundColor: '#e7fff6' // Synapsas light green
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className="w-6 h-6 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ 
                            backgroundColor: '#19181a' // Synapsas black
                          }}
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-space-grotesk font-bold text-black margin-small">Foundational Element</h5>
                          <p className="font-inter text-black leading-relaxed">
                            This position represents a foundational element in your Matrix of Destiny. 
                            While specific interpretations for this aspect are still being developed, 
                            the general arcana meaning above provides valuable insight into this energy in your life.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Instructions */}
      <MatrixOfDestinyInstructions />
    </div>
  );
};

export default MatrixOfDestiny;