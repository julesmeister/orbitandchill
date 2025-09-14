/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { AstrologicalEvent } from '../../../types/events';
import SynapsasDropdown from '../../reusable/SynapsasDropdown';
import { getTabCount } from '../../../utils/events/eventFormattingUtils';

export interface EventsTableTabsProps {
  selectedTab: string;
  events: AstrologicalEvent[];
  itemsPerPage: number;
  itemsPerPageOptions: Array<{ value: string; label: string }>;
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual' | 'generated') => void;
  handleItemsPerPageChange: (newItemsPerPage: number) => void;
}

export function EventsTableTabs({
  selectedTab,
  events,
  itemsPerPage,
  itemsPerPageOptions,
  setSelectedTab,
  handleItemsPerPageChange
}: EventsTableTabsProps) {
  return (
    <div className="border-b border-black">
      {/* Desktop Tabs */}
      <nav className="hidden md:flex items-stretch justify-between">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
              selectedTab === 'all'
                ? 'bg-black text-white border-r'
                : 'text-black hover:bg-gray-50 border-r'
            }`}
          >
            All Events
            <span
              className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'all' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('generated')}
            className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
              selectedTab === 'generated'
                ? 'bg-black text-white border-r'
                : 'text-black hover:bg-gray-50 border-r'
            }`}
          >
            <div className="w-3 h-3 bg-blue-500 border border-black inline-block mr-2 -mt-0.5"></div>
            Generated Events
            <span
              className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'generated' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'generated')}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('bookmarked')}
            className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
              selectedTab === 'bookmarked'
                ? 'bg-black text-white border-r'
                : 'text-black hover:bg-gray-50 border-r'
            }`}
          >
            <div className="w-3 h-3 bg-yellow-500 border border-black inline-block mr-2 -mt-0.5"></div>
            Bookmarked
            <span
              className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'bookmarked' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'bookmarked')}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('manual')}
            className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 ${
              selectedTab === 'manual'
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <div className="w-3 h-3 bg-gray-500 border border-black inline-block mr-2 -mt-0.5"></div>
            Manual Events
            <span
              className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'manual' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'manual')}
            </span>
          </button>
        </div>

        {/* Show Per Page Selector */}
        <div className="flex items-center space-x-3 px-6 py-4 border-l border-black">
          <span className="text-sm text-black font-open-sans font-medium">Show:</span>
          <div className="w-20">
            <SynapsasDropdown
              options={itemsPerPageOptions}
              value={itemsPerPage.toString()}
              onChange={(value) => handleItemsPerPageChange(parseInt(value))}
            />
          </div>
          <span className="text-sm text-black font-open-sans font-medium">per page</span>
        </div>
      </nav>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        {/* Mobile Tab Grid */}
        <div className="grid grid-cols-2 gap-0">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-3 flex flex-col items-center font-space-grotesk font-medium text-xs transition-all duration-200 border-r border-black ${
              selectedTab === 'all'
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <span className="mb-1">All Events</span>
            <span
              className={`px-1.5 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'all' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('generated')}
            className={`px-3 py-3 flex flex-col items-center font-space-grotesk font-medium text-xs transition-all duration-200 ${
              selectedTab === 'generated'
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-blue-500 border border-black"></div>
              <span>Generated</span>
            </div>
            <span
              className={`px-1.5 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'generated' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'generated')}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-0 border-t border-black">
          <button
            onClick={() => setSelectedTab('bookmarked')}
            className={`px-3 py-3 flex flex-col items-center font-space-grotesk font-medium text-xs transition-all duration-200 border-r border-black ${
              selectedTab === 'bookmarked'
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-yellow-500 border border-black"></div>
              <span>Bookmarked</span>
            </div>
            <span
              className={`px-1.5 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'bookmarked' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'bookmarked')}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('manual')}
            className={`px-3 py-3 flex flex-col items-center font-space-grotesk font-medium text-xs transition-all duration-200 ${
              selectedTab === 'manual'
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-gray-500 border border-black"></div>
              <span>Manual</span>
            </div>
            <span
              className={`px-1.5 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'manual' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              suppressHydrationWarning
            >
              {getTabCount(events, 'manual')}
            </span>
          </button>
        </div>

        {/* Mobile Per Page Selector */}
        <div className="flex items-center justify-center space-x-2 px-4 py-3 border-t border-black bg-gray-50">
          <span className="text-xs text-black font-open-sans font-medium">Show:</span>
          <div className="w-16">
            <SynapsasDropdown
              options={itemsPerPageOptions}
              value={itemsPerPage.toString()}
              onChange={(value) => handleItemsPerPageChange(parseInt(value))}
            />
          </div>
          <span className="text-xs text-black font-open-sans font-medium">per page</span>
        </div>
      </div>
    </div>
  );
}