/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface TimeSelectionControlsProps {
  showAspects: boolean;
  aspectTimeOfDay: 'morning' | 'noon' | 'evening' | 'custom';
  customHour: number;
  showOnlyAllDay: boolean;
  setAspectTimeOfDay: (time: 'morning' | 'noon' | 'evening' | 'custom') => void;
  setCustomHour: (hour: number) => void;
  setShowOnlyAllDay: (show: boolean) => void;
}

export default function TimeSelectionControls({
  showAspects,
  aspectTimeOfDay,
  customHour,
  showOnlyAllDay,
  setAspectTimeOfDay,
  setCustomHour,
  setShowOnlyAllDay
}: TimeSelectionControlsProps) {
  if (!showAspects) return null;

  return (
    <div className="px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Calculate aspects for:</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time of Day Selection */}
          <div className="bg-white border border-purple-200 rounded-lg p-1 inline-flex">
            {(['morning', 'noon', 'evening'] as const).map(time => (
              <button
                key={time}
                onClick={() => setAspectTimeOfDay(time)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  aspectTimeOfDay === time
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-purple-100'
                }`}
              >
                {time === 'morning' ? '🌅 9 AM' : time === 'noon' ? '☀️ 12 PM' : '🌆 6 PM'}
              </button>
            ))}
            <button
              onClick={() => setAspectTimeOfDay('custom')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                aspectTimeOfDay === 'custom'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-purple-100'
              }`}
            >
              ⚙️ Custom
            </button>
          </div>
          
          {/* Custom Hour Input */}
          {aspectTimeOfDay === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="23"
                value={customHour}
                onChange={(e) => setCustomHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1.5 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">:00</span>
            </div>
          )}
          
          {/* All-Day Filter */}
          <div className="border-l border-gray-300 pl-3">
            <button
              onClick={() => setShowOnlyAllDay(!showOnlyAllDay)}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                showOnlyAllDay
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              All-Day Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}