/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ReorderToggleButtonProps {
  isReorderMode: boolean;
  onToggle: () => void;
  className?: string;
}

export const ReorderToggleButton: React.FC<ReorderToggleButtonProps> = ({
  isReorderMode,
  onToggle,
  className = ""
}) => (
  <button
    onClick={onToggle}
    className={`h-8 px-3 text-xs font-medium border transition-colors ${
      isReorderMode
        ? 'bg-black text-white border-black'
        : 'bg-white text-black border-gray-300 hover:bg-gray-50'
    } ${className}`}
  >
    {isReorderMode ? 'Done' : 'Reorder'}
  </button>
);