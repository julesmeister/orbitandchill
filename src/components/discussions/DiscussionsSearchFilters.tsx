/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState } from "react";
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import DraftsToast from '@/components/reusable/DraftsToast';

interface DiscussionsSearchFiltersProps {
  searchQuery: string;
  sortBy: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onRefresh: () => void;
}

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'replies', label: 'Most Replies' },
  { value: 'views', label: 'Most Views' }
];

export default function DiscussionsSearchFilters({
  searchQuery,
  sortBy,
  loading,
  onSearchChange,
  onSortChange,
  onRefresh
}: DiscussionsSearchFiltersProps) {
  const [showDraftsToast, setShowDraftsToast] = useState(false);
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <section className="px-6 md:px-12 lg:px-20 py-8">
        <div className="">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-open-sans text-lg"
              />
            </div>
            
            <div className="flex items-end gap-4">
              <SynapsasDropdown
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                className="w-64"
              />

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Link 
                  href="/discussions/new"
                  className="px-3 py-2 bg-black text-white font-medium border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 whitespace-nowrap text-sm"
                >
                  <div className="flex items-center gap-2">
                    Start Discussion
                  </div>
                </Link>
                <button 
                  onClick={() => setShowDraftsToast(true)}
                  className="px-3 py-2 bg-transparent text-black font-medium border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 whitespace-nowrap text-sm"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    My Drafts
                  </div>
                </button>
                <Link 
                  href="/guides"
                  className="px-3 py-2 bg-transparent text-black font-medium border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 whitespace-nowrap text-sm"
                >
                  <div className="flex items-center gap-2">
                    Browse Guides
                  </div>
                </Link>
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="p-2 bg-transparent text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh discussions"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${loading ? 'animate-spin' : 'hover:rotate-180'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drafts Toast */}
      <DraftsToast 
        isVisible={showDraftsToast}
        onHide={() => setShowDraftsToast(false)}
      />
    </div>
  );
}