/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from 'react';
import { TooltipData } from '../components/horary/ChartTooltip';
import { MatrixCalculation } from '../utils/matrixCalculations';
import { 
  createMatrixMouseEnterHandler,
  createMatrixMouseLeaveHandler,
  createMatrixClickHandler
} from '../utils/matrixEventHandlers';
import { DebugPositions, ResponsiveValues } from '../components/charts/MatrixTypes';

export const useMatrixEventHandlers = (
  matrixData: MatrixCalculation | null,
  selectedPosition: string | null,
  setSelectedPosition: (position: string | null) => void,
  setTooltip: (tooltip: TooltipData) => void,
  setHoveredPosition: (position: string | null) => void,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isDragging: string | null,
  setIsDragging: (dragging: string | null) => void,
  setDebugPositions: React.Dispatch<React.SetStateAction<DebugPositions>>,
  responsive: ResponsiveValues
) => {
  // Create reusable event handlers
  const handleMouseEnter = matrixData ? createMatrixMouseEnterHandler(
    setTooltip,
    setHoveredPosition,
    containerRef,
    matrixData.positions
  ) : () => { };

  const handleMouseLeave = createMatrixMouseLeaveHandler(setHoveredPosition, setTooltip);
  const handleClick = createMatrixClickHandler(selectedPosition, setSelectedPosition);

  // DEBUG: Drag handlers
  const handleDragStart = useCallback((elementId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(elementId);
  }, [setIsDragging]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
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
  }, [isDragging, containerRef, setDebugPositions, responsive.centerX, responsive.centerY]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(null);
  }, [setIsDragging]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};