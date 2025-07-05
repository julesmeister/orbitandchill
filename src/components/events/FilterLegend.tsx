/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { FilterCounts } from './types/filterTypes';

interface FilterLegendProps extends FilterCounts {
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
}

export default function FilterLegend({
  hideChallengingDates,
  challengingEventsCount,
  showCombosOnly,
  comboEventsCount
}: FilterLegendProps) {
  const showLegend = (hideChallengingDates && challengingEventsCount > 0) || 
                    (showCombosOnly && comboEventsCount > 0);

  if (!showLegend) return null;

  return (
    <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-300">
      {hideChallengingDates && challengingEventsCount > 0 && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 border border-black rounded"></div>
          <span className="text-black font-open-sans font-medium text-xs">
            ⚠️ {challengingEventsCount} challenging date{challengingEventsCount !== 1 ? 's' : ''} hidden
          </span>
        </div>
      )}
      {showCombosOnly && comboEventsCount > 0 && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 border border-black rounded"></div>
          <span className="text-black font-open-sans font-medium text-xs">
            🔗 {comboEventsCount} combo event{comboEventsCount !== 1 ? 's' : ''} only
          </span>
        </div>
      )}
    </div>
  );
}