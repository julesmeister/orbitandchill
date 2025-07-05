/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { TimingPriority } from '../../hooks/optimalTiming/types';

interface PriorityButtonProps {
  priority: TimingPriority;
  isSelected: boolean;
  onToggle: (id: string) => void;
  className?: string;
}

export default function PriorityButton({
  priority,
  isSelected,
  onToggle,
  className = ""
}: PriorityButtonProps) {
  return (
    <button
      onClick={() => onToggle(priority.id)}
      className={`w-full flex items-center gap-3 p-3 border transition-all duration-200 font-open-sans text-sm hover:shadow-sm ${
        isSelected
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-black hover:bg-gray-50'
      } ${className}`}
    >
      <span className="text-lg">{priority.icon}</span>
      <div className="flex-1 text-left">
        <span className="font-medium block">{priority.label}</span>
        <span className="text-xs opacity-75">{priority.description}</span>
      </div>
      {isSelected && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}