/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useAspectFilters, AspectCategory, AspectType } from '../../store/chartStore';

interface ChartAspectFiltersProps {
  className?: string;
}

export default function ChartAspectFilters({ className = '' }: ChartAspectFiltersProps) {
  const {
    selectedCategory,
    selectedType,
    showFilters,
    setAspectCategory,
    setAspectType,
    toggleAspectFilters,
    clearAspectFilters,
    hasActiveFilters
  } = useAspectFilters();

  const categories: { value: AspectCategory; label: string; icon: string; description: string }[] = [
    { value: 'all', label: 'All Aspects', icon: '🌟', description: 'Show all planetary aspects' },
    { value: 'personality', label: 'Personality', icon: '👤', description: 'Core personality traits' },
    { value: 'relationships', label: 'Relationships', icon: '💕', description: 'Love and partnerships' },
    { value: 'money', label: 'Money & Resources', icon: '💰', description: 'Financial matters' },
    { value: 'career', label: 'Career', icon: '💼', description: 'Professional life' },
    { value: 'spirituality', label: 'Spirituality', icon: '🔮', description: 'Spiritual growth' },
    { value: 'communication', label: 'Communication', icon: '💬', description: 'Communication style' }
  ];

  const types: { value: AspectType; label: string; icon: string; color: string }[] = [
    { value: 'all', label: 'All Types', icon: '🌈', color: 'text-gray-700' },
    { value: 'harmonious', label: 'Harmonious', icon: '✨', color: 'text-green-600' },
    { value: 'challenging', label: 'Challenging', icon: '⚡', color: 'text-red-600' },
    { value: 'neutral', label: 'Neutral', icon: '⚪', color: 'text-blue-600' }
  ];

  return (
    <div className={`bg-white border border-black ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Aspect Filters</h3>
            <p className="font-open-sans text-sm text-black/60">
              {hasActiveFilters ? 'Custom filters applied' : 'Showing all aspects'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAspectFilters}
              className="text-xs font-open-sans text-blue-600 hover:text-blue-800 underline"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={toggleAspectFilters}
            className="p-2 hover:bg-gray-100 transition-colors duration-200"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            <svg 
              className={`w-5 h-5 text-black transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block font-space-grotesk text-sm font-semibold text-black mb-3">
              Aspect Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map(({ value, label, icon, description }) => (
                <button
                  key={value}
                  onClick={() => setAspectCategory(value)}
                  className={`flex items-start space-x-3 p-3 text-left transition-all duration-200 border rounded-lg ${
                    selectedCategory === value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span className="text-lg mt-0.5">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-space-grotesk text-sm font-semibold">{label}</div>
                    <div className={`font-open-sans text-xs mt-1 ${
                      selectedCategory === value ? 'text-white/80' : 'text-black/60'
                    }`}>
                      {description}
                    </div>
                  </div>
                  {selectedCategory === value && (
                    <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block font-space-grotesk text-sm font-semibold text-black mb-3">
              Aspect Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map(({ value, label, icon, color }) => (
                <button
                  key={value}
                  onClick={() => setAspectType(value)}
                  className={`flex flex-col items-center space-y-2 p-3 transition-all duration-200 border rounded-lg ${
                    selectedType === value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="text-center">
                    <div className="font-space-grotesk text-sm font-semibold">{label}</div>
                  </div>
                  {selectedType === value && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Filters Summary */}
          {hasActiveFilters && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-space-grotesk text-sm font-semibold text-blue-900 mb-2">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Category: {categories.find(c => c.value === selectedCategory)?.label}
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Type: {types.find(t => t.value === selectedType)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}