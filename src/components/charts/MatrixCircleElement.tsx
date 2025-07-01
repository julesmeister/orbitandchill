/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface MatrixCircleElementProps {
  x: number;
  y: number;
  radius: number;
  fill: string;
  stroke?: string;
  strokeWidth?: string;
  number: number;
  fontSize?: string;
  textColor?: string;
  opacity?: number;
  id: string;
  label: string;
  type: string;
  selectedPosition: string | null;
  onMouseEnter: (id: string, position: any, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: (id: string) => void;
}

const MatrixCircleElement: React.FC<MatrixCircleElementProps> = ({
  x,
  y,
  radius,
  fill,
  stroke = "#000",
  strokeWidth = "1",
  number,
  fontSize = "12",
  textColor = "text-black",
  opacity = 1,
  id,
  label,
  type,
  selectedPosition,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const isSelected = selectedPosition === id;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="cursor-pointer transition-all duration-200"
        opacity={opacity}
        onMouseEnter={(e) => onMouseEnter(id, {
          x,
          y,
          id,
          label,
          type,
          number
        }, e)}
        onMouseLeave={onMouseLeave}
        onClick={() => onClick(id)}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={`font-bold ${textColor} pointer-events-none select-none`}
        fontSize={fontSize}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {number}
      </text>
    </g>
  );
};

export default MatrixCircleElement;