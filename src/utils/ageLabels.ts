/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AgeLabelPosition {
  offsetX: number;
  offsetY: number;
  textAnchor: "start" | "middle" | "end";
}

export interface ResponsiveValues {
  centerX: number;
  centerY: number;
  circleRadius: {
    center: number;
    outer: number;
  };
}

/**
 * Calculate precise positioning for age labels on outer positions
 * Uses intelligent alignment based on cardinal/diagonal directions
 */
export const calculateAgeLabelPosition = (
  key: string,
  circleRadius: number
): AgeLabelPosition => {
  let offsetX = 0;
  let offsetY = 0;
  let textAnchor: "start" | "middle" | "end" = "middle";
  
  // Cardinal directions - perfectly aligned
  if (key === 'A') {         // Left
    offsetX = -circleRadius - 20;
    offsetY = 0;
    textAnchor = "end";
  } else if (key === 'C') {  // Right
    offsetX = circleRadius + 20;
    offsetY = 0;
    textAnchor = "start";
  } else if (key === 'B') {  // Top
    offsetX = 0;
    offsetY = -circleRadius - 15;
    textAnchor = "middle";
  } else if (key === 'D') {  // Bottom
    offsetX = 0;
    offsetY = circleRadius + 20;
    textAnchor = "middle";
  } 
  // Diagonal directions - consistent offset
  else if (key === 'F') {  // Top-left
    offsetX = -circleRadius - 15;
    offsetY = -circleRadius - 10;
    textAnchor = "end";
  } else if (key === 'G') {  // Top-right
    offsetX = circleRadius + 15;
    offsetY = -circleRadius - 10;
    textAnchor = "start";
  } else if (key === 'H') {  // Bottom-right
    offsetX = circleRadius + 15;
    offsetY = circleRadius + 15;
    textAnchor = "start";
  } else if (key === 'I') {  // Bottom-left
    offsetX = -circleRadius - 15;
    offsetY = circleRadius + 15;
    textAnchor = "end";
  }

  return { offsetX, offsetY, textAnchor };
};

export interface AgeLabelProps {
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end";
  age: string;
}

/**
 * Get props for rendering age label at a specific position
 * Returns positioning data for creating text element in React component
 */
export const getAgeLabelProps = (
  key: string,
  posX: number,
  posY: number,
  age: string,
  circleRadius: number
): AgeLabelProps => {
  const { offsetX, offsetY, textAnchor } = calculateAgeLabelPosition(key, circleRadius);

  return {
    x: posX + offsetX,
    y: posY + offsetY,
    textAnchor,
    age
  };
};