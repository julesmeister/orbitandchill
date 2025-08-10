/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
    className={`
      p-2 transition-all duration-150 border border-black
      ${isActive 
        ? 'bg-black text-white shadow-inner' 
        : 'text-black hover:bg-black hover:text-white active:bg-gray-800'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md active:scale-95'}
      flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 text-xs sm:text-sm
      focus:outline-none focus:ring-2 focus:ring-black/20
    `}
  >
    {children}
  </button>
);

export default ToolbarButton;