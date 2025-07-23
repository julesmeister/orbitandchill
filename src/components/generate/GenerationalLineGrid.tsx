/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface GenerationalPosition {
  key: string;
  label: string;
  description: string;
}

interface GenerationalLineGridProps {
  positions: GenerationalPosition[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export default function GenerationalLineGrid({ positions, values, onChange }: GenerationalLineGridProps) {
  return (
    <div className="mb-8">
      <h5 className="font-space-grotesk text-lg font-bold text-black mb-4 text-center">
        Generational Lines
      </h5>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0 bg-white rounded-2xl overflow-hidden border border-black">
        {positions.map((position, index) => {
          // Desktop (lg): 8 columns - right border on items 0-6 (not on 7)
          const isLastColumnLg = (index + 1) % 8 === 0;
          // Tablet (md): 4 columns - right border on items 0,1,2 and 4,5,6 (not on 3,7)
          const isLastColumnMd = (index + 1) % 4 === 0;
          // Mobile: 2 columns - right border on items 0,2,4,6 (not on 1,3,5,7)
          const isLastColumnSm = (index + 1) % 2 === 0;
          
          return (
            <div 
              key={position.key} 
              className={`group p-4 hover:bg-gray-50 transition-all duration-300 relative ${
                !isLastColumnLg ? 'lg:border-r border-black' : ''
              } ${!isLastColumnMd ? 'md:border-r border-black' : ''} ${
                !isLastColumnSm ? 'border-r border-black' : ''
              }`}
            >
              <div className="text-center h-full flex flex-col">
                <h6 className="font-space-grotesk text-xs font-bold text-black mb-1">
                  {position.label}
                </h6>
                <p className="text-xs text-black/60 mb-2 leading-tight flex-1">
                  {position.description}
                </p>
                <input
                  type="text"
                  value={values[position.key] || 1}
                  onChange={(e) => onChange(position.key, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-black text-center font-bold text-sm bg-white focus:outline-none focus:bg-gray-50 transition-colors mx-auto"
                  style={{ borderRadius: '0' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}