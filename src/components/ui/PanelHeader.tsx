/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export default function PanelHeader({ title, onClose, className = "" }: PanelHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="font-space-grotesk text-lg font-bold text-black">
        {title}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          className="text-black hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}