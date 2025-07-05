/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { formatTime12Hour } from '../../utils/timeNavigation';
import { getDefaultTimeOptions } from '../../utils/timeOptions';
import { calculateGridBorders, getSelectionClasses, getTimeInputClasses } from '../../utils/uiHelpers';

interface EventTimePickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  minuteIncrement: number;
  onMinuteIncrementChange: (increment: string) => void;
  onNavigateMinutes: (direction: 'prev' | 'next') => void;
  isOptimal: boolean;
  eventTime: string;
  startTime?: string | null;
  endTime?: string | null;
  duration?: string | null;
}

export default function EventTimePicker({
  selectedTime,
  onTimeChange,
  minuteIncrement,
  onMinuteIncrementChange,
  onNavigateMinutes,
  isOptimal,
  eventTime,
  startTime,
  endTime,
  duration
}: EventTimePickerProps) {
  const timeOptions = getDefaultTimeOptions();

  return (
    <div className="bg-white border border-black overflow-hidden">
      {/* Header */}
      <div style={{ backgroundColor: '#6bdbff' }} className="px-6 py-4 border-b border-black">
        <div className="flex items-center justify-between">
          <h3 className="font-space-grotesk text-lg font-bold text-black">Select Event Time</h3>
          <div className="flex items-center space-x-3">
            {isOptimal && (
              <div className="flex items-center space-x-2 bg-black text-white px-3 py-1.5 border border-black">
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-open-sans text-sm font-medium">Optimal: {formatTime12Hour(eventTime)}</span>
                {/* Time Window Display inside optimal badge */}
                {startTime && endTime && duration && (
                  <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-300">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300 text-xs font-medium">
                      Window: {formatTime12Hour(startTime)} - {formatTime12Hour(endTime)} ({duration})
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* Show time window separately if not optimal timing */}
            {!isOptimal && startTime && endTime && duration && (
              <div className="flex items-center space-x-2 bg-white text-black px-3 py-1.5 border border-black">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-open-sans text-sm font-medium">
                  Window: {formatTime12Hour(startTime)} - {formatTime12Hour(endTime)} ({duration})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Options Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-black">
          {timeOptions.map((option, index) => {
            const isSelected = selectedTime === option.value;
            const isOptimalTime = isOptimal && option.value === eventTime;
            const borderClasses = calculateGridBorders(index, timeOptions.length, 7);
            const selectionClasses = getSelectionClasses(
              isSelected,
              'bg-black text-white',
              'bg-white text-black hover:bg-black hover:text-white'
            );

            return (
              <button
                key={option.value}
                onClick={() => onTimeChange(option.value)}
                className={`group relative p-4 border-black transition-all duration-300 overflow-hidden ${borderClasses} ${selectionClasses}`}
              >
                {/* Animated gradient for non-selected buttons */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}

                {isOptimalTime && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 border border-black flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
                <div className="relative font-space-grotesk text-sm font-bold">{option.display}</div>
                <div className="relative font-open-sans text-xs opacity-75">{option.label.split(' - ')[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Custom Time and Minute Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="font-space-grotesk text-sm font-bold text-black">Custom Time:</label>

            {/* Time Input with Minute Navigation */}
            <div className="flex items-center">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className={getTimeInputClasses(isOptimal, selectedTime, eventTime)}
              />

              {/* Minute Navigation Controls - Connected to time input */}
              <div className="flex">
                {/* Previous Minute Button */}
                <button
                  onClick={() => onNavigateMinutes('prev')}
                  className="group relative px-3 py-2 bg-white border-2 border-black border-r-0 text-black hover:bg-black hover:text-white h-[38px] transition-all duration-300 overflow-hidden flex items-center justify-center"
                  title="Previous minute"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <svg className="w-3 h-3 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Minute Increment Input */}
                <input
                  type="number"
                  min="1"
                  max="59"
                  value={minuteIncrement}
                  onChange={(e) => onMinuteIncrementChange(e.target.value)}
                  className="w-16 px-2 py-2 text-center text-sm font-medium border-2 border-black border-r-0 bg-white h-[38px] focus:outline-none focus:bg-gray-50 transition-all duration-200"
                  title="Set minute increment/decrement value"
                />

                {/* Minutes label */}
                <span className="px-2 py-2 bg-white border-2 border-black border-r-0 text-sm font-medium text-black h-[38px] flex items-center">mins</span>

                {/* Next Minute Button */}
                <button
                  onClick={() => onNavigateMinutes('next')}
                  className="group relative px-3 py-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white h-[38px] transition-all duration-300 overflow-hidden flex items-center justify-center"
                  title="Next minute"
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                  <svg className="w-3 h-3 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOptimal && (
            <div className="flex items-center space-x-2 text-sm text-black bg-yellow-50 px-3 py-2 border border-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-open-sans font-medium">Optimal timing based on planetary positions</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}