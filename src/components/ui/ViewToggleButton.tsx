/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ViewToggleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  onMouseEnter?: () => void;
  isActive: boolean;
  icon?: string;
  className?: string;
}

export default function ViewToggleButton({
  children,
  onClick,
  onMouseEnter,
  isActive,
  icon,
  className = ""
}: ViewToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 ${
        isActive
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black'
      } ${className}`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  );
}