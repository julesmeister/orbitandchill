/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ValidationToastProps {
  title: string;
  errors: string[];
  isVisible: boolean;
  onClose: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function ValidationToast({ 
  title,
  errors, 
  isVisible, 
  onClose,
  autoHide = true,
  autoHideDelay = 5000
}: ValidationToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      
      // Auto-hide after delay
      if (autoHide) {
        const timer = setTimeout(() => {
          onClose();
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <div 
        className={`
          px-6 py-5 bg-white border-2 border-black shadow-xl max-w-md w-full
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-4 opacity-0 scale-95'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Info icon */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faInfoCircle} 
                className="w-5 h-5 text-black" 
              />
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-black font-space-grotesk">
              {title}
            </h3>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 transition-colors duration-200"
            title="Close"
          >
            <FontAwesomeIcon 
              icon={faTimes} 
              className="w-4 h-4 text-black" 
            />
          </button>
        </div>

        {/* Error list */}
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-black font-inter leading-relaxed">
                {error}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}