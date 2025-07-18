/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onClearAllEvents?: () => void;
}

export default function CalendarHeader({ currentDate, setCurrentDate, onClearAllEvents }: CalendarHeaderProps) {
  return (
    <div className="px-8 py-6 border-b border-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-space-grotesk text-xl font-bold text-black">
                Electional Calendar - {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="w-16 h-0.5 bg-black mt-1"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Clear All Events Button with Dropdown */}
          {onClearAllEvents && (
            <div className="relative group">
              <button
                onClick={onClearAllEvents}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 font-medium hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 h-[42px]"
                title="Clear all generated events from calendar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Events</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-300 shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={onClearAllEvents}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Clear Generated Events</span>
                  </button>
                  <div className="px-4 py-1 text-xs text-gray-500 border-t border-gray-100">
                    Preserve your manually created events and bookmarked events.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}