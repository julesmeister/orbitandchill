/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

export interface EventsTableHeaderProps {
  selectedTab: string;
  selectedType: string;
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => void;
}

export function EventsTableHeader({
  selectedTab,
  selectedType,
  hideChallengingDates,
  showCombosOnly,
  setSelectedType
}: EventsTableHeaderProps) {
  const getTabTitle = () => {
    switch (selectedTab) {
      case 'bookmarked':
        return 'Bookmarked Events';
      case 'manual':
        return 'Manual Events';
      case 'generated':
        return 'Generated Events';
      default:
        return 'Events Overview';
    }
  };

  return (
    <>
      {/* Desktop Header & Filters */}
      <div className="hidden md:block px-8 py-6 border-b border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="font-space-grotesk text-xl font-bold text-black">
                  {getTabTitle()}
                </h2>
                <div className="w-16 h-0.5 bg-black mt-1"></div>
              </div>
            </div>
            {hideChallengingDates && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-open-sans font-semibold bg-orange-50 text-black border border-black">
                <div className="w-2 h-2 bg-orange-500 border border-black mr-2"></div>
                Challenging Hidden
              </span>
            )}
            {showCombosOnly && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-open-sans font-semibold bg-indigo-50 text-black border border-black">
                <div className="w-2 h-2 bg-indigo-500 border border-black mr-2"></div>
                Combos Only
              </span>
            )}
          </div>
          <div className="border border-black p-1 inline-flex bg-white">
            {(['all', 'benefic', 'challenging', 'neutral'] as const).map((type, index) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`inline-flex items-center justify-center px-4 py-2 font-open-sans font-medium transition-all duration-200 border-black ${
                  selectedType === type
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-gray-50'
                } ${index < 3 ? 'border-r' : ''}`}
              >
                <div className={`w-2 h-2 mr-2 border border-black ${
                  type === 'all' ? 'bg-gray-500' :
                  type === 'benefic' ? 'bg-emerald-500' :
                  type === 'challenging' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
                {type === 'all' ? 'All Types' :
                 type === 'benefic' ? 'Favorable' :
                 type === 'challenging' ? 'Challenging' :
                 'Neutral'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Header & Filters */}
      <div className="md:hidden border-b border-black">
        {/* Mobile Header */}
        <div className="px-4 py-4 border-b border-black">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="font-space-grotesk text-base font-bold text-black">
                {getTabTitle()}
              </h2>
              <div className="w-12 h-0.5 bg-black mt-1"></div>
            </div>
          </div>

          {/* Mobile Filter Badges */}
          {(hideChallengingDates || showCombosOnly) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hideChallengingDates && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-open-sans font-semibold bg-orange-50 text-black border border-black">
                  <div className="w-1.5 h-1.5 bg-orange-500 border border-black mr-1.5"></div>
                  Challenging Hidden
                </span>
              )}
              {showCombosOnly && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-open-sans font-semibold bg-indigo-50 text-black border border-black">
                  <div className="w-1.5 h-1.5 bg-indigo-500 border border-black mr-1.5"></div>
                  Combos Only
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile Type Filters */}
        <div className="grid grid-cols-2 gap-0">
          {(['all', 'benefic', 'challenging', 'neutral'] as const).map((type, index) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-3 flex flex-col items-center font-open-sans font-medium text-xs transition-all duration-200 ${
                selectedType === type
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-50'
              } ${index === 1 || index === 3 ? '' : 'border-r border-black'} ${index < 2 ? 'border-b border-black' : ''}`}
            >
              <div className={`w-2 h-2 mb-1 border border-black ${
                type === 'all' ? 'bg-gray-500' :
                type === 'benefic' ? 'bg-emerald-500' :
                type === 'challenging' ? 'bg-red-500' :
                'bg-gray-400'
              }`}></div>
              <span className="text-center leading-tight">
                {type === 'all' ? 'All Types' :
                 type === 'benefic' ? 'Favorable' :
                 type === 'challenging' ? 'Challenging' :
                 'Neutral'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}