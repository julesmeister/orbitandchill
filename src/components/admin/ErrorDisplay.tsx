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
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-800 font-open-sans text-sm mb-2">
          {errorMessage}
        </p>
        <button 
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 underline text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}