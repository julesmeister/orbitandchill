/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';

interface ConfirmationToastProps {
  title: string;
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'red' | 'green' | 'blue';
}

export default function ConfirmationToast({ 
  title,
  message, 
  isVisible, 
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "red"
}: ConfirmationToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Hide the toast
  };

  const getConfirmButtonColors = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white';
    }
  };

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
          <div className="flex items-center gap-3 mb-3">
            {/* Warning icon */}
            <div className="flex-shrink-0">
              <svg 
                className="w-6 h-6 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-black font-space-grotesk">
                {title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <div className="mb-5">
            <p className="text-sm text-gray-700 font-inter leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${getConfirmButtonColors()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
    </div>
  );
}