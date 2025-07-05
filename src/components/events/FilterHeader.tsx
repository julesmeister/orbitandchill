/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface FilterHeaderProps {
  activeFiltersCount: number;
  onResetAllFilters: () => void;
}

export default function FilterHeader({ activeFiltersCount, onResetAllFilters }: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-black flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
        </div>
        <div>
          <h3 className="font-space-grotesk text-lg font-bold text-black">
            Calendar Filters
          </h3>
          <div className="w-12 h-0.5 bg-black mt-1"></div>
        </div>
      </div>

      {/* Active Filters Indicator & Reset Button */}
      <div className="flex items-center gap-3">
        {activeFiltersCount > 0 && (
          <div className="px-3 py-2 bg-white border border-black text-black text-xs font-medium font-open-sans">
            🔍 {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
          </div>
        )}
        
        <button
          onClick={onResetAllFilters}
          className="px-4 py-2 bg-transparent text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-open-sans text-xs font-medium"
        >
          🔄 Reset All
        </button>
      </div>
    </div>
  );
}