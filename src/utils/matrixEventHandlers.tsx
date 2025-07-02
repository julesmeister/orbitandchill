/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { getArcanaInfo } from './arcanaInfo';
import { getMatrixInterpretation } from './matrixInterpretations';

export interface Position {
  x: number;
  y: number;
  id: string;
  label: string;
  type: string;
  number?: number;
}

/**
 * Creates standardized mouse enter handler for matrix elements
 */
export const createMatrixMouseEnterHandler = (
  setTooltip: (tooltip: any) => void,
  setHoveredPosition: (position: string | null) => void,
  containerRef: React.RefObject<HTMLDivElement | null>,
  matrixPositions: Record<string, number>
) => {
  return (key: string, pos: Position, event: React.MouseEvent) => {
    const number = pos.number ?? matrixPositions[key];
    const arcana = getArcanaInfo(number);
    
    // Get mouse position relative to the container
    const rect = event.currentTarget.getBoundingClientRect();
    const containerElement = containerRef.current;
    const containerRect = containerElement?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    // Calculate position relative to container
    const x = rect.left + rect.width / 2 - containerRect.left;
    const y = rect.top + rect.height / 2 - containerRect.top;
    
    // Determine position based on location within container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const isRight = x > centerX;
    const isBottom = y > centerY;
    
    let position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    if (isRight && isBottom) position = "bottom-right";
    else if (isRight && !isBottom) position = "top-right";
    else if (!isRight && isBottom) position = "bottom-left";
    else position = "top-left";
    
    setHoveredPosition(key);
    
    // Special handling for age destiny positions
    if (key.startsWith('AGE_')) {
      const destinyInterpretation = getMatrixInterpretation('destiny', number);
      
      setTooltip({
        visible: true,
        title: pos.label,
        content: (
          <div className="space-y-3">
            <div className="font-semibold text-sm">Arcana {number}: {arcana.name}</div>
            {destinyInterpretation && (
              <div className="space-y-2">
                <div className="font-medium text-xs text-purple-700">Destiny at This Age:</div>
                <div className="text-xs text-gray-700 leading-relaxed">
                  {destinyInterpretation.general.substring(0, 200)}
                  {destinyInterpretation.general.length > 200 ? '...' : ''}
                </div>
                <div className="text-xs text-gray-500 italic">
                  Click any matrix position for full interpretation
                </div>
              </div>
            )}
          </div>
        ),
        x: x,
        y: y,
        color: arcana.color,
        position: position
      });
    } else {
      // Default handling for regular positions
      setTooltip({
        visible: true,
        title: pos.label,
        content: (
          <div className="space-y-2">
            <div className="font-semibold text-sm">Arcana {number}: {arcana.name}</div>
            <div className="text-xs text-gray-600">{arcana.description}</div>
          </div>
        ),
        x: x,
        y: y,
        color: arcana.color,
        position: position
      });
    }
  };
};

/**
 * Creates standardized mouse leave handler for matrix elements
 */
export const createMatrixMouseLeaveHandler = (
  setHoveredPosition: (position: string | null) => void,
  setTooltip: (tooltip: any) => void
) => {
  return () => {
    setHoveredPosition(null);
    setTooltip((prev: any) => ({ ...prev, visible: false }));
  };
};

/**
 * Creates standardized click handler for matrix elements
 */
export const createMatrixClickHandler = (
  selectedPosition: string | null,
  setSelectedPosition: (position: string | null) => void
) => {
  return (id: string) => {
    setSelectedPosition(selectedPosition === id ? null : id);
  };
};