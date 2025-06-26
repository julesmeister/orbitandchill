/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { Database, TestTube, RotateCcw } from 'lucide-react';

interface DataSourceToggleProps {
  onToggle: (useRealData: boolean) => void;
  defaultValue?: boolean;
}

export default function DataSourceToggle({ onToggle, defaultValue = true }: DataSourceToggleProps) {
  const [useRealData, setUseRealData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load preference from localStorage
    const savedPreference = localStorage.getItem('admin_use_real_data');
    if (savedPreference !== null) {
      const realData = savedPreference === 'true';
      setUseRealData(realData);
      onToggle(realData);
    }
  }, [onToggle]);

  const handleToggle = async () => {
    setIsLoading(true);
    const newValue = !useRealData;
    
    try {
      // Save preference
      localStorage.setItem('admin_use_real_data', newValue.toString());
      setUseRealData(newValue);
      onToggle(newValue);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem('admin_use_real_data');
    setUseRealData(true);
    onToggle(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${useRealData ? 'bg-green-100' : 'bg-orange-100'}`}>
            {useRealData ? (
              <Database className="w-5 h-5 text-green-600" />
            ) : (
              <TestTube className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 font-space-grotesk">
              Data Source
            </h3>
            <p className="text-xs text-gray-600 font-inter">
              {useRealData ? 'Using real analytics data' : 'Using mock data for testing'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefault}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Reset to real data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              useRealData ? 'bg-green-600' : 'bg-orange-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                useRealData ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className={`p-2 rounded ${useRealData ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-800">Real Data</span>
          </div>
          <p className="text-green-700 mt-1">
            Live analytics from database
          </p>
        </div>
        
        <div className={`p-2 rounded ${!useRealData ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-1">
            <TestTube className="w-3 h-3 text-orange-600" />
            <span className="font-medium text-orange-800">Mock Data</span>
          </div>
          <p className="text-orange-700 mt-1">
            Simulated data for testing
          </p>
        </div>
      </div>
      
      {!useRealData && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
          <p className="text-orange-800">
            <span className="font-medium">⚠️ Testing Mode:</span> Dashboard showing mock data for validation purposes.
          </p>
        </div>
      )}
    </div>
  );
}