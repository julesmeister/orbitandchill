/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

// Analytics helpers removed - using Google Analytics
// Stub functions for backward compatibility
const getGeneratedPercentage = (analytics: any) => 0;
const getBookmarkPercentage = (analytics: any) => 0;
const getManualPercentage = (analytics: any) => 0;

interface FeatureAdoptionProps {
  analytics: any;
}

export default function FeatureAdoption({ analytics }: FeatureAdoptionProps) {
  return (
    <div className="bg-white border border-black p-8">
      <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Feature Adoption</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-open-sans text-sm text-black">Electional Astrology (Auto-generation)</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${getGeneratedPercentage(analytics)}%` 
                }}
              ></div>
            </div>
            <span className="font-open-sans text-xs text-black/60 w-12">
              {getGeneratedPercentage(analytics)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-open-sans text-sm text-black">Manual Event Creation</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${getManualPercentage(analytics)}%` 
                }}
              ></div>
            </div>
            <span className="font-open-sans text-xs text-black/60 w-12">
              {getManualPercentage(analytics)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-open-sans text-sm text-black">Event Bookmarking</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ 
                  width: `${getBookmarkPercentage(analytics)}%` 
                }}
              ></div>
            </div>
            <span className="font-open-sans text-xs text-black/60 w-12">
              {getBookmarkPercentage(analytics)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}