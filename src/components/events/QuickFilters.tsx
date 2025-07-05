/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Tooltip from '../reusable/Tooltip';
import { QUICK_FILTERS } from './config/filterConfigs';

interface QuickFiltersProps {
  getQuickFilterState: (key: string) => boolean;
  getQuickFilterHandler: (key: string) => (value: boolean) => void;
  getQuickFilterLabel: (key: string, isActive: boolean) => string;
}

export default function QuickFilters({
  getQuickFilterState,
  getQuickFilterHandler,
  getQuickFilterLabel
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {QUICK_FILTERS.map((filter) => {
        const isActive = getQuickFilterState(filter.key);
        const handler = getQuickFilterHandler(filter.key);
        const displayLabel = getQuickFilterLabel(filter.key, isActive);
        
        return (
          <Tooltip 
            key={filter.key}
            content={filter.tooltip}
            position="bottom"
            delay={300}
          >
            <button
              onClick={() => {
                handler(!isActive);
              }}
              className={`group px-4 py-2 border border-black transition-all duration-200 font-inter text-xs font-medium hover:shadow-md rounded ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {filter.icon}
                <span>{displayLabel} {filter.label.split(' ').slice(-1)[0]}</span>
              </div>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}