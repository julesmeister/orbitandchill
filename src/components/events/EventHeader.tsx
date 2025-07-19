/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import Link from 'next/link';
import OrbitingLogo from '../navbar/OrbitingLogo';
import { formatEventDate } from '../../utils/eventUtils';
import { formatTime12Hour } from '../../utils/timeNavigation';
import { getBookmarkClasses } from '../../utils/uiHelpers';

interface EventHeaderProps {
  eventTitle: string;
  eventDate: string;
  selectedTime: string;
  isOptimal: boolean;
  optimalScore: number | null;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export default function EventHeader({
  eventTitle,
  eventDate,
  selectedTime,
  isOptimal,
  optimalScore,
  isBookmarked,
  onBookmarkToggle
}: EventHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <OrbitingLogo 
            size="normal"
            className="text-black"
          />
        </div>
        <div className="flex-1">
          <Link href="/electional" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Electional
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{eventTitle}</h1>
          <div className="flex items-center space-x-4">
          <p className="text-gray-600">
            {formatEventDate(eventDate)} at {formatTime12Hour(selectedTime)}
          </p>
          {isOptimal && optimalScore && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Optimal Timing
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                {optimalScore}/10
              </span>
            </div>
          )}
        </div>
        </div>
      </div>
      <button
        onClick={onBookmarkToggle}
        className={getBookmarkClasses(isBookmarked)}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this date'}
      >
        <svg
          className="w-6 h-6"
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    </div>
  );
}