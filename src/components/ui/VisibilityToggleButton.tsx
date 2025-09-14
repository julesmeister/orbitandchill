/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { EyeIcon } from '@/components/icons/EyeIcon';

interface VisibilityToggleButtonProps {
  isVisible: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export const VisibilityToggleButton: React.FC<VisibilityToggleButtonProps> = ({
  isVisible,
  onToggle,
  className = ""
}) => (
  <button
    onClick={onToggle}
    className={`w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 ${className}`}
    title={isVisible ? 'Hide section' : 'Show section'}
  >
    <EyeIcon isVisible={isVisible} />
  </button>
);