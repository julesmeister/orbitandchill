/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';

interface FilterToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function FilterToast({ 
  message, 
  isVisible, 
  onHide, 
  duration = 3000 
}: FilterToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div 
        className={`
          px-6 py-4 bg-white border-2 border-black shadow-lg max-w-sm
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-95'
          }
        `}
      >
        {/* Content */}
        <div className="flex items-center gap-3">
          {/* Filter icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-black" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z" 
              />
            </svg>
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black font-open-sans">
              {message}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-0.5 bg-gray-200">
          <div 
            className={`h-full bg-black transition-all ease-linear ${
              isVisible ? 'w-full' : 'w-0'
            }`}
            style={{ 
              transitionDuration: isVisible ? `${duration}ms` : '300ms'
            }}
          />
        </div>
      </div>
    </div>
  );
}