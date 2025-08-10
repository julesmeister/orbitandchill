/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface DiscussionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: 'all' | 'forum' | 'recent';
  setFilter: (filter: 'all' | 'forum' | 'recent') => void;
  filteredCount: number;
  onRefresh: () => void;
}

export default function DiscussionFilters({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  filteredCount,
  onRefresh
}: DiscussionFiltersProps) {
  return (
    <div className="bg-white border border-black p-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-black bg-white text-black font-open-sans focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'forum' | 'recent')}
            className="px-4 py-2 border border-black bg-white text-black font-open-sans"
          >
            <option value="all">All Discussions</option>
            <option value="forum">Forum Only</option>
            <option value="recent">Recent (7 days)</option>
          </select>
          {filter === 'forum' && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 border border-black bg-white text-black font-open-sans hover:bg-gray-100 transition-colors flex items-center gap-2"
              title="Refresh discussions"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 font-open-sans">
        Found {filteredCount} discussions
      </div>
    </div>
  );
}