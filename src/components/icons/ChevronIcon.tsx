/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ChevronIconProps {
  className?: string;
  direction: 'up' | 'down' | 'left' | 'right';
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({
  className = "w-4 h-4",
  direction
}) => {
  const pathMap = {
    up: "M5 15l7-7 7 7",
    down: "M19 9l-7 7-7-7",
    left: "M15 19l-7-7 7-7",
    right: "M9 5l7 7-7 7"
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={pathMap[direction]}
      />
    </svg>
  );
};