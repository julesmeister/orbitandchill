/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface VertexBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  cornerSize?: 'small' | 'medium' | 'large';
}

export default function VertexBorderButton({ 
  children, 
  className = '',
  cornerSize = 'medium',
  ...props 
}: VertexBorderButtonProps) {
  // Use static classes to ensure Tailwind includes them
  const getCornerClasses = () => {
    switch (cornerSize) {
      case 'small':
        return 'w-2 h-2';
      case 'large':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const cornerClasses = getCornerClasses();

  return (
    <button
      className={`relative group ${className}`}
      {...props}
    >
      {/* Vertex borders on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {/* Top-left corner */}
        <span className={`absolute top-0 left-0 ${cornerClasses} border-t-2 border-l-2 border-black`}></span>
        {/* Top-right corner */}
        <span className={`absolute top-0 right-0 ${cornerClasses} border-t-2 border-r-2 border-black`}></span>
        {/* Bottom-left corner */}
        <span className={`absolute bottom-0 left-0 ${cornerClasses} border-b-2 border-l-2 border-black`}></span>
        {/* Bottom-right corner */}
        <span className={`absolute bottom-0 right-0 ${cornerClasses} border-b-2 border-r-2 border-black`}></span>
      </div>
      {/* Content with higher z-index to stay above corners */}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  );
}