/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Tooltip from '../reusable/Tooltip';
import { TIMING_METHODS } from './config/filterConfigs';

interface TimingMethodsFilterProps {
  getTimingMethodState: (method: string) => boolean;
  handleTimingMethodClick: (method: string) => void;
}

export default function TimingMethodsFilter({
  getTimingMethodState,
  handleTimingMethodClick
}: TimingMethodsFilterProps) {
  return (
    <Tooltip 
      content="Choose your timing approach: Houses (where planets live), Aspects (how planets talk), or Electional (ancient timing wisdom for new beginnings)" 
      position="bottom"
      delay={300}
    >
      <div className="flex gap-1 items-center bg-gray-100 p-2 border border-black rounded">
        <span className="text-xs font-medium text-gray-700 px-2">Timing Methods:</span>
        
        {TIMING_METHODS.map((method) => {
          const isActive = getTimingMethodState(method.key);
          
          return (
            <button
              key={method.key}
              onClick={() => handleTimingMethodClick(method.key)}
              className={`px-3 py-1 text-xs font-medium transition-all duration-200 rounded ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {method.label}
            </button>
          );
        })}
      </div>
    </Tooltip>
  );
}