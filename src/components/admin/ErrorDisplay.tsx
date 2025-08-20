/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ErrorDisplayProps {
  eventsError?: string | null;
  analyticsError?: string | null;
  onRetry: () => void;
}

export default function ErrorDisplay({ 
  eventsError, 
  analyticsError, 
  onRetry 
}: ErrorDisplayProps) {
  const errorMessage = eventsError || analyticsError || 'Failed to load data';

  return (
    <div className="space-y-8">
      {/* Synapsas-style error display */}
      <div className="bg-white border border-black p-6">
        {/* Three-dot error indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-black [animation-delay:-0.3s] animate-pulse"></div>
          <div className="w-2 h-2 bg-black [animation-delay:-0.15s] animate-pulse"></div>
          <div className="w-2 h-2 bg-black animate-pulse"></div>
        </div>
        
        <div className="text-center">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
            Data Loading Error
          </h3>
          <p className="font-inter text-black/80 mb-4 text-sm leading-relaxed">
            {errorMessage}
          </p>
          <button 
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}