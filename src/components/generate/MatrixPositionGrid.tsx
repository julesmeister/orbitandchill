/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface MatrixPosition {
  key: string;
  label: string;
  description: string;
}

interface MatrixPositionGridProps {
  positions: MatrixPosition[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  title: string;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export default function MatrixPositionGrid({ 
  positions, 
  values, 
  onChange, 
  title,
  columns 
}: MatrixPositionGridProps) {
  const getGridCols = () => {
    return `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
  };

  const getBorderClasses = (index: number) => {
    const isLastColumnLg = (index + 1) % columns.desktop === 0;
    const isLastColumnMd = (index + 1) % columns.tablet === 0;
    const isLastColumnSm = (index + 1) % columns.mobile === 0;
    
    let classes = '';
    
    // Desktop borders
    if (!isLastColumnLg) {
      classes += 'lg:border-r border-black ';
    }
    
    // Tablet borders
    if (!isLastColumnMd) {
      classes += 'md:border-r border-black ';
    }
    
    // Mobile borders
    if (!isLastColumnSm) {
      classes += 'border-r border-black ';
    }
    
    return classes.trim();
  };

  return (
    <div className="mb-8">
      <h5 className="font-space-grotesk text-lg font-bold text-black mb-4 text-center">
        {title}
      </h5>
      <div className={`grid ${getGridCols()} gap-0 bg-white rounded-2xl overflow-hidden border border-black`}>
        {positions.map((position, index) => (
          <div 
            key={position.key} 
            className={`group p-6 hover:bg-gray-50 transition-all duration-300 relative ${getBorderClasses(index)}`}
          >
            <div className="text-center">
              <h6 className="font-space-grotesk text-sm font-bold text-black mb-1">
                {position.label}
              </h6>
              <p className="text-xs text-black/70 mb-3 leading-tight">
                {position.description}
              </p>
              <input
                type="text"
                value={values[position.key] || 1}
                onChange={(e) => onChange(position.key, parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-black text-center font-bold bg-white focus:outline-none focus:bg-gray-50 transition-colors"
                style={{ borderRadius: '0' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}