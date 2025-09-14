/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface DragHandleIconProps {
  className?: string;
}

export const DragHandleIcon: React.FC<DragHandleIconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);