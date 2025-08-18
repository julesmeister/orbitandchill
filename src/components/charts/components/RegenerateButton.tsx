/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react';
import { RegenerateButtonProps } from '../types';

const RegenerateButton = memo(function RegenerateButton({ onClick, isGenerating }: RegenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      aria-label={isGenerating ? 'Regenerating chart in progress' : 'Regenerate chart'}
      aria-describedby="regenerate-status"
      className="group relative overflow-hidden w-full text-left transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed border-b border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      style={{ backgroundColor: isGenerating ? '#6bdbff' : '#51bd94' }}
    >
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
            {isGenerating ? (
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <div className="font-space-grotesk text-lg font-bold text-black">
              {isGenerating ? 'Regenerating Chart...' : 'Regenerate Chart'}
            </div>
            <div id="regenerate-status" className="font-open-sans text-sm text-black/80">
              {isGenerating ? 'Please wait, creating your chart' : 'Generate a fresh version with latest data'}
            </div>
          </div>
        </div>
        {!isGenerating && (
          <svg className="w-6 h-6 text-black group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </button>
  );
});

RegenerateButton.displayName = 'RegenerateButton';

export default RegenerateButton;