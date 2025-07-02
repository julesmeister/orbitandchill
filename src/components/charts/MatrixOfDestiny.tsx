/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChartTooltip, type TooltipData } from '../horary/ChartTooltip';
import {
  getMatrixResponsiveValues,
  calculateMatrixDimensions
} from '../../utils/matrixResponsive';
import { calculateMatrixOfDestiny, MatrixCalculation } from '../../utils/matrixCalculations';
import { calculateAgeDestinyArcana } from '../../utils/ageDestinyCalculations';
import MatrixOfDestinyHeader from './MatrixOfDestinyHeader';
import MatrixOfDestinyInstructions from './MatrixOfDestinyInstructions';
import MatrixSVGChart from './MatrixSVGChart';
import MatrixInterpretationPanel from './MatrixInterpretationPanel';
import { MatrixOfDestinyProps, DebugPositions, ResponsiveValues } from './MatrixTypes';
import { useMatrixPositionCalculations } from '../../hooks/useMatrixPositionCalculations';
import { useMatrixEventHandlers } from '../../hooks/useMatrixEventHandlers';

const MatrixOfDestiny: React.FC<MatrixOfDestinyProps> = ({ birthData, personName }) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPositionData, setSelectedPositionData] = useState<any>(null);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [isClient, setIsClient] = useState(false);

  // DEBUG: Draggable positions state for ALL inner circles
  const [debugPositions, setDebugPositions] = useState<DebugPositions>({
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

  const [responsive, setResponsive] = useState<ResponsiveValues>(() => {
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

  // Custom validation for both birth dates and event dates
  const validateDateForMatrix = (dateString: string): boolean => {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
    
    // Check if date is not more than 120 years ago
    const today = new Date();
    const maxAge = 120;
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    if (date < minDate) {
      return false;
    }
    
    // Allow future dates for event charts (unlike birth date validation)
    return true;
  };

  // Russian Matrix Destiny calculation algorithm using precise reference implementation
  const matrixData = useMemo((): MatrixCalculation | null => {
    if (!birthData.dateOfBirth || !validateDateForMatrix(birthData.dateOfBirth)) {
      return null;
    }

    return calculateMatrixOfDestiny(birthData.dateOfBirth);
  }, [birthData.dateOfBirth]);

  // Calculate age-specific destiny arcana for all ages 0-79
  const ageDestinyMap = useMemo(() => {
    if (!birthData.dateOfBirth || !validateDateForMatrix(birthData.dateOfBirth)) {
      return {};
    }
    return calculateAgeDestinyArcana(birthData.dateOfBirth);
  }, [birthData.dateOfBirth]);

  // Use position calculations hook
  const {
    positions,
    updatedDebugPositions
  } = useMatrixPositionCalculations(responsive, debugPositions);

  // Use event handlers hook
  const {
    handleMouseEnter,
    handleMouseLeave,
    handleClick: originalHandleClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useMatrixEventHandlers(
    matrixData,
    selectedPosition,
    setSelectedPosition,
    setTooltip,
    setHoveredPosition,
    containerRef,
    isDragging,
    setIsDragging,
    setDebugPositions,
    responsive
  );

  // Custom click handler that also stores position data for age positions
  const handleClick = (id: string, positionData?: any) => {
    originalHandleClick(id);
    
    // Store position data for age positions
    if (id.startsWith('AGE_') && positionData) {
      setSelectedPositionData(positionData);
    } else {
      setSelectedPositionData(null);
    }
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
          <MatrixSVGChart
            matrixData={matrixData}
            ageDestinyMap={ageDestinyMap}
            responsive={responsive}
            positions={positions}
            updatedDebugPositions={updatedDebugPositions}
            dimensions={dimensions}
            selectedPosition={selectedPosition}
            hoveredPosition={hoveredPosition}
            setSelectedPosition={setSelectedPosition}
            isDragging={isDragging}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleClick={handleClick}
            handleDragStart={handleDragStart}
            handleDragMove={handleDragMove}
            handleDragEnd={handleDragEnd}
          />
        </div>

        {/* Tooltip */}
        <ChartTooltip
          tooltip={tooltip}
          containerRef={containerRef}
        />
      </div>

      {/* Matrix Interpretation Panel */}
      {selectedPosition && (
        <MatrixInterpretationPanel
          selectedPosition={selectedPosition}
          matrixData={matrixData}
          hoveredPosition={selectedPositionData}
        />
      )}

      {/* Instructions */}
      <MatrixOfDestinyInstructions />
    </div>
  );
};

export default MatrixOfDestiny;