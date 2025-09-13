/**
 * Tooltip helper utilities for horary chart components
 */

export type TooltipPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface MousePosition {
  x: number;
  y: number;
}

export interface TooltipPositionResult {
  position: TooltipPosition;
  x: number;
  y: number;
}

/**
 * Extract mouse position from React mouse event
 */
export const getMousePosition = (event: React.MouseEvent): MousePosition | null => {
  const rect = event.currentTarget.getBoundingClientRect();
  const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
  
  if (!svgRect) return null;
  
  return {
    x: rect.left + rect.width / 2 - svgRect.left,
    y: rect.top + rect.height / 2 - svgRect.top
  };
};

/**
 * Calculate optimal tooltip position based on mouse location in chart
 */
export const calculateTooltipPosition = (
  mouseX: number, 
  mouseY: number, 
  svgRect: DOMRect
): TooltipPositionResult => {
  const centerX = svgRect.width / 2;
  const centerY = svgRect.height / 2;
  const isRight = mouseX > centerX;
  const isBottom = mouseY > centerY;

  let position: TooltipPosition;
  if (isRight && isBottom) position = "bottom-right";
  else if (isRight && !isBottom) position = "top-right";
  else if (!isRight && isBottom) position = "bottom-left";
  else position = "top-left";

  return {
    position,
    x: mouseX,
    y: mouseY
  };
};

/**
 * Get tooltip position and coordinates from mouse event
 */
export const getTooltipPositionFromEvent = (event: React.MouseEvent): TooltipPositionResult | null => {
  const mousePos = getMousePosition(event);
  if (!mousePos) return null;
  
  const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
  if (!svgRect) return null;
  
  return calculateTooltipPosition(mousePos.x, mousePos.y, svgRect);
};