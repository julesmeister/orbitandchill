/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ClearCacheSectionProps {
  onClearCache?: () => void;
}

export default function ClearCacheSection({ onClearCache }: ClearCacheSectionProps) {
  if (!onClearCache) return null;

  return (
    <button
      onClick={onClearCache}
      className="group relative w-full p-4 transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-red-500 border-b border-black"
    >
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-black group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="font-space-grotesk text-sm font-medium text-black group-hover:text-white transition-colors duration-300">Clear All Caches</span>
        <span className="font-open-sans text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">(Force refresh)</span>
      </div>
    </button>
  );
}