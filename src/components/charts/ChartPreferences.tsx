/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useChartPreferences } from '../../store/chartStore';

interface ChartPreferencesProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChartPreferences({ 
  className = '',
  isCollapsed = false,
  onToggleCollapse 
}: ChartPreferencesProps) {
  const { chartPreferences, updateChartPreferences } = useChartPreferences();

  const themeOptions = [
    { value: 'light', label: 'Light Theme', icon: '☀️', description: 'Clean, bright appearance' },
    { value: 'dark', label: 'Dark Theme', icon: '🌙', description: 'Easy on the eyes' },
    { value: 'classic', label: 'Classic Theme', icon: '📜', description: 'Traditional astrology style' }
  ] as const;

  const sizeOptions = [
    { value: 'small', label: 'Small', icon: '🔍', description: 'Compact view' },
    { value: 'medium', label: 'Medium', icon: '📊', description: 'Standard size' },
    { value: 'large', label: 'Large', icon: '🔍', description: 'Detailed view' }
  ] as const;

  const togglePreference = <K extends keyof typeof chartPreferences>(
    key: K,
    value: typeof chartPreferences[K]
  ) => {
    updateChartPreferences({ [key]: value });
  };

  return (
    <div className={`bg-white border border-black ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Chart Preferences</h3>
            <p className="font-open-sans text-sm text-black/60">Customize chart appearance</p>
          </div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand preferences" : "Collapse preferences"}
          >
            <svg 
              className={`w-5 h-5 text-black transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Visual Elements Toggle */}
          <div>
            <label className="block font-space-grotesk text-sm font-semibold text-black mb-3">
              Visual Elements
            </label>
            <div className="space-y-3">
              {[
                {
                  key: 'showAspectLines' as const,
                  label: 'Aspect Lines',
                  description: 'Show connections between planets',
                  icon: '🔗'
                },
                {
                  key: 'showPlanetSymbols' as const,
                  label: 'Planet Symbols',
                  description: 'Display astrological symbols',
                  icon: '⭐'
                },
                {
                  key: 'showHouseNumbers' as const,
                  label: 'House Numbers',
                  description: 'Show house number labels',
                  icon: '🏠'
                }
              ].map(({ key, label, description, icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black">{label}</div>
                      <div className="font-open-sans text-xs text-black/60">{description}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chartPreferences[key]}
                      onChange={(e) => togglePreference(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                      chartPreferences[key]
                        ? 'bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300'
                        : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300'
                    }`}>
                      <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                        chartPreferences[key] ? 'transform translate-x-full' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block font-space-grotesk text-sm font-semibold text-black mb-3">
              Chart Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon, description }) => (
                <button
                  key={value}
                  onClick={() => togglePreference('chartTheme', value)}
                  className={`flex flex-col items-center space-y-2 p-3 transition-all duration-200 border rounded-lg ${
                    chartPreferences.chartTheme === value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="text-center">
                    <div className="font-space-grotesk text-sm font-semibold">{label}</div>
                    <div className={`font-open-sans text-xs mt-1 ${
                      chartPreferences.chartTheme === value ? 'text-white/80' : 'text-black/60'
                    }`}>
                      {description}
                    </div>
                  </div>
                  {chartPreferences.chartTheme === value && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block font-space-grotesk text-sm font-semibold text-black mb-3">
              Chart Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizeOptions.map(({ value, label, icon, description }) => (
                <button
                  key={value}
                  onClick={() => togglePreference('chartSize', value)}
                  className={`flex flex-col items-center space-y-2 p-3 transition-all duration-200 border rounded-lg ${
                    chartPreferences.chartSize === value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <div className="text-center">
                    <div className="font-space-grotesk text-xs font-semibold">{label}</div>
                    <div className={`font-open-sans text-xs mt-1 ${
                      chartPreferences.chartSize === value ? 'text-white/80' : 'text-black/60'
                    }`}>
                      {description}
                    </div>
                  </div>
                  {chartPreferences.chartSize === value && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Settings Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-space-grotesk text-sm font-semibold text-gray-900 mb-2">Current Settings</h4>
            <div className="text-xs font-open-sans text-gray-600 space-y-1">
              <div>Theme: <span className="font-semibold">{chartPreferences.chartTheme}</span></div>
              <div>Size: <span className="font-semibold">{chartPreferences.chartSize}</span></div>
              <div>
                Elements: {[
                  chartPreferences.showAspectLines && 'Aspect Lines',
                  chartPreferences.showPlanetSymbols && 'Planet Symbols',
                  chartPreferences.showHouseNumbers && 'House Numbers'
                ].filter(Boolean).join(', ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}