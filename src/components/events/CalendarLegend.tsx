/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface CalendarLegendProps {
  hideChallengingDates: boolean;
  challengingEventsCount: number;
  showCombosOnly: boolean;
  comboEventsCount: number;
}

export default function CalendarLegend({
  hideChallengingDates,
  challengingEventsCount,
  showCombosOnly,
  comboEventsCount
}: CalendarLegendProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-black">
      <div className="p-4 bg-white flex items-center space-x-3 border-black lg:border-r">
        <div className="w-3 h-3 bg-black animate-pulse border border-black"></div>
        <span className="text-black font-inter font-medium text-sm">Favorable Election (8+ score)</span>
      </div>
      <div className="p-4 bg-white flex items-center space-x-3 border-black md:border-r lg:border-r">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 border border-black"></div>
          <div className="w-2 h-2 bg-orange-500 border border-black"></div>
          <div className="w-2 h-2 bg-indigo-500 border border-black"></div>
        </div>
        <span className="text-black font-inter font-medium text-sm">Daily Aspects</span>
      </div>
      <div className="p-4 bg-white flex items-center space-x-3">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 border border-black"></div>
        <span className="text-black font-inter font-medium text-sm">Events</span>
      </div>
      
      {/* Additional legend items if filters are active */}
      {hideChallengingDates && challengingEventsCount > 0 && (
        <div className="p-4 bg-orange-50 flex items-center space-x-3 border-t border-black lg:border-r">
          <div className="w-3 h-3 bg-orange-500 border border-black"></div>
          <span className="text-black font-inter font-medium text-sm">
            ⚠️ {challengingEventsCount} challenging date{challengingEventsCount !== 1 ? 's' : ''} hidden
          </span>
        </div>
      )}
      {showCombosOnly && comboEventsCount > 0 && (
        <div className="p-4 bg-indigo-50 flex items-center space-x-3 border-t border-black">
          <div className="w-3 h-3 bg-indigo-500 border border-black"></div>
          <span className="text-black font-inter font-medium text-sm">
            🔗 {comboEventsCount} combo event{comboEventsCount !== 1 ? 's' : ''} only
          </span>
        </div>
      )}
    </div>
  );
}