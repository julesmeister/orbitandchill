/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useInterpretationSections } from '../../store/chartStore';
import { usePremiumFeatures } from '../../hooks/usePremiumFeatures';
import { useUserStore } from '../../store/userStore';
import ChartAspectFilters from './ChartAspectFilters';
import ChartPreferences from './ChartPreferences';

interface ChartSectionControlsProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type ControlTab = 'sections' | 'aspects' | 'preferences';

export default function ChartSectionControls({
  className = '',
  isCollapsed = false,
  onToggleCollapse
}: ChartSectionControlsProps) {
  const { user } = useUserStore();
  const { sections, toggleSectionVisibility, resetSectionsToDefault } = useInterpretationSections();
  const { shouldShowFeature, isFeaturePremium } = usePremiumFeatures();
  const [showPremiumFilter, setShowPremiumFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [activeTab, setActiveTab] = useState<ControlTab>('sections');

  const userIsPremium = user?.subscriptionTier === 'premium' || false;

  // Filter sections based on premium filter
  const filteredSections = sections.filter(section => {
    if (showPremiumFilter === 'free') return !section.isPremium;
    if (showPremiumFilter === 'premium') return section.isPremium;
    return true; // 'all'
  });

  const visibleSections = filteredSections.filter(s => s.isVisible);
  const totalSections = filteredSections.length;

  return (
    <div className={`bg-white border border-black ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Section Controls</h3>
            <p className="font-open-sans text-sm text-black/60">
              {visibleSections.length} of {totalSections} sections visible
            </p>
          </div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand controls" : "Collapse controls"}
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
        <div>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'sections', label: 'Sections', icon: '📄', description: 'Toggle chart sections' },
              { id: 'aspects', label: 'Aspects', icon: '🔗', description: 'Filter aspect types' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️', description: 'Chart appearance' }
            ].map(({ id, label, icon, description }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as ControlTab)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === id
                    ? 'border-black text-black bg-white'
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
                title={description}
              >
                <span>{icon}</span>
                <span className="font-space-grotesk">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'sections' && (
              <div className="space-y-4">
                {/* Premium Filter */}
                <div>
                  <label className="block font-space-grotesk text-sm font-semibold text-black mb-2">
                    Feature Filter
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: 'All Sections', icon: '🌟' },
                      { value: 'free', label: 'Free Only', icon: '🆓' },
                      { value: 'premium', label: 'Premium Only', icon: '💎' }
                    ].map(({ value, label, icon }) => (
                      <button
                        key={value}
                        onClick={() => setShowPremiumFilter(value as typeof showPremiumFilter)}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 border ${
                          showPremiumFilter === value
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                      >
                        <span>{icon}</span>
                        <span className="font-space-grotesk">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

          {/* Section Toggles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-space-grotesk text-sm font-semibold text-black">
                Chart Sections
              </label>
              <button
                onClick={resetSectionsToDefault}
                className="text-xs font-open-sans text-blue-600 hover:text-blue-800 underline"
              >
                Reset to Default
              </button>
            </div>

            <div className="space-y-2">
              {filteredSections
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                  const canAccess = !section.isPremium || userIsPremium;
                  const isAccessible = shouldShowFeature(section.id, userIsPremium);
                  
                  return (
                    <div
                      key={section.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                        section.isVisible && canAccess
                          ? 'border-black bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      } ${!canAccess ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="text-lg">{section.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-space-grotesk text-sm font-semibold text-black truncate">
                              {section.name}
                            </span>
                            {section.isPremium && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                💎 Premium
                              </span>
                            )}
                          </div>
                          <p className="font-open-sans text-xs text-black/60 truncate">
                            {section.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!canAccess && (
                          <span className="text-xs font-open-sans text-gray-500">
                            Premium Required
                          </span>
                        )}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={section.isVisible}
                            onChange={() => toggleSectionVisibility(section.id)}
                            disabled={!canAccess}
                            className="sr-only peer"
                          />
                          <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                            !canAccess 
                              ? 'bg-gray-300 cursor-not-allowed'
                              : section.isVisible 
                                ? 'bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300'
                                : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300'
                          }`}>
                            <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                              section.isVisible ? 'transform translate-x-full' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
              </div>
            )}

            {activeTab === 'aspects' && (
              <div className="-m-4">
                <ChartAspectFilters className="border-0" />
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="-m-4">
                <ChartPreferences className="border-0" isCollapsed={false} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}