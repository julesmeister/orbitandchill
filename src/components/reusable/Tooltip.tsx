"use client";

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export default function Tooltip({ 
  children, 
  content, 
  position = 'bottom', 
  delay = 300,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-1';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-1';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-1';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
    }
  };

  const getCaretClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 -translate-y-0.5';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-0.5';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 translate-x-0.5';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 -translate-x-0.5';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-0.5';
    }
  };

  const getCaretPath = () => {
    switch (position) {
      case 'top':
        return 'M0 0 L6 8 L12 0 Z'; // Points down
      case 'bottom':
        return 'M0 8 L6 0 L12 8 Z'; // Points up
      case 'left':
        return 'M8 0 L0 6 L8 12 Z'; // Points right
      case 'right':
        return 'M0 0 L8 6 L0 12 Z'; // Points left
      default:
        return 'M0 8 L6 0 L12 8 Z'; // Points up
    }
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className="relative z-[200]">
          {/* Tooltip Container with Shadow */}
          <div
            className={`absolute ${getPositionClasses()}`}
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))'
            }}
          >
            {/* Tooltip Body */}
            <div className={`bg-white text-gray-800 text-xs rounded-lg px-3 py-2 whitespace-normal border border-gray-200 min-w-full ${className}`}>
              {content}
            </div>
            
            {/* Caret */}
            <div className={`absolute ${getCaretClasses()}`}>
              <svg 
                width="12" 
                height="8" 
                viewBox="0 0 12 8" 
                className={`${position === 'left' || position === 'right' ? 'w-2 h-3' : 'w-3 h-2'}`}
              >
                <path
                  d={getCaretPath()}
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}