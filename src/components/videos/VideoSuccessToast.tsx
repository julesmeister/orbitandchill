/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from 'react';
import { getPlatformIcon } from '../../utils/videoSharing';

interface VideoSuccessToastProps {
  isVisible: boolean;
  videoTitle: string;
  platform: 'youtube' | 'vimeo';
  onHide: () => void;
  duration?: number;
}

export default function VideoSuccessToast({ 
  isVisible, 
  videoTitle, 
  platform, 
  onHide, 
  duration = 3000 
}: VideoSuccessToastProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        setTimeout(onHide, 300); // Allow animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(onHide, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-4 left-4 z-50 max-w-sm
        transform transition-all duration-300 ease-out
        ${isAnimatingOut 
          ? 'translate-x-[-100%] opacity-0' 
          : 'translate-x-0 opacity-100'
        }
      `}
    >
      <div className="bg-green-50 border-2 border-green-500 shadow-lg">
        {/* Header */}
        <div className="p-3 bg-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white flex items-center justify-center mr-2 rounded">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-space-grotesk font-bold text-white text-sm">
                Video Attached!
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-green-600 rounded transition-colors"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-center">
            <span className="text-lg mr-2">{getPlatformIcon(platform)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-inter text-green-800 truncate">
                {videoTitle}
              </p>
              <p className="text-xs text-green-600 font-inter capitalize">
                {platform} video ready to share
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}