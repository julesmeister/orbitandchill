/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface PreviewHeaderProps {
  hasReplies: boolean;
  onClearAllReplies?: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ hasReplies, onClearAllReplies }) => {
  return (
    <div className="p-4 border-b border-black bg-pink-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-space-grotesk font-semibold text-black">
          AI-Processed Content Preview
        </h2>
        <div className="flex items-center gap-4">
          {onClearAllReplies && hasReplies && (
            <button
              onClick={onClearAllReplies}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium border border-black transition-colors"
              title="Clear all accumulated replies"
            >
              Clear Replies
            </button>
          )}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-black font-medium">PREVIEW MODE</span>
          </div>
        </div>
      </div>
      <div className="p-3 bg-yellow-50 border border-yellow-300 rounded">
        <div className="flex items-start gap-2 text-sm text-yellow-800">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-semibold">This is a temporary workspace</div>
            <div className="mt-1">• Add/remove replies as needed • Replies scheduled with random delays (1h-7d) • Click "Generate Forum" to save to database</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewHeader;