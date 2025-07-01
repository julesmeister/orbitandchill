/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface LineProps {
  from: Position;
  to: Position;
  stroke?: string;
  strokeWidth?: string;
  opacity?: number;
  strokeDasharray?: string;
  className?: string;
}

/**
 * Renders a simple line between two positions
 */
export const MatrixLine: React.FC<LineProps> = ({
  from,
  to,
  stroke = "#000000",
  strokeWidth = "1",
  opacity = 1,
  strokeDasharray,
  className
}) => (
  <line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke={stroke}
    strokeWidth={strokeWidth}
    opacity={opacity}
    strokeDasharray={strokeDasharray}
    className={className}
  />
);

/**
 * Renders a labeled line with text along the line
 */
export const LabeledMatrixLine: React.FC<LineProps & {
  label: string;
  labelPosition?: number; // 0-1, position along the line
  labelOffset?: number;
  fontSize?: string;
  labelRotation?: number;
}> = ({
  from,
  to,
  stroke = "#000000",
  strokeWidth = "1",
  opacity = 1,
  strokeDasharray,
  className,
  label,
  labelPosition = 0.75,
  labelOffset = 12,
  fontSize = "10",
  labelRotation
}) => {
  // Calculate label position along the line
  const labelX = from.x + (to.x - from.x) * labelPosition;
  const labelY = from.y + (to.y - from.y) * labelPosition + labelOffset;
  
  // Calculate rotation angle if not provided
  const rotation = labelRotation !== undefined 
    ? labelRotation 
    : Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;

  return (
    <g>
      <MatrixLine
        from={from}
        to={to}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeDasharray={strokeDasharray}
        className={className}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none font-space-grotesk"
        fontSize={fontSize}
        fontFamily="Space Grotesk, system-ui, -apple-system, sans-serif"
        fill="#000000"
        opacity="0.7"
        transform={`rotate(${rotation} ${labelX} ${labelY})`}
      >
        {label}
      </text>
    </g>
  );
};

/**
 * Common line configurations for Matrix of Destiny
 */
export const MATRIX_LINE_STYLES = {
  octagram: {
    stroke: "#000000",
    strokeWidth: "2",
    opacity: 0.3
  },
  axis: {
    stroke: "#000000", 
    strokeWidth: "1",
    opacity: 0.25
  },
  love: {
    stroke: "#ff69b4",
    strokeWidth: "2.5",
    opacity: 0.6,
    strokeDasharray: "5,5"
  },
  money: {
    stroke: "#8B4513",
    strokeWidth: "2",
    opacity: 0.5,
    strokeDasharray: "5,5"
  },
  generational: {
    stroke: "#ff0000", // red for female
    strokeWidth: "2",
    opacity: 0.8
  },
  generationalMale: {
    stroke: "#0000ff", // blue for male
    strokeWidth: "2", 
    opacity: 0.8
  }
} as const;