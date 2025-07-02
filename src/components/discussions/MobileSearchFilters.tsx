/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';

interface MobileSearchFiltersProps {
  searchQuery: string;
  sortBy: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onRefresh: () => void;
}

const sortOptions = [
  { value: 'recent', label: 'Recent' },
  { value: 'popular', label: 'Popular' },
  { value: 'replies', label: 'Replies' },
  { value: 'views', label: 'Views' }
];

export default function MobileSearchFilters({
  searchQuery,
  sortBy,
  loading,
  onSearchChange,
  onSortChange,
  onRefresh
}: MobileSearchFiltersProps) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] lg:hidden">
      <section className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-black placeholder-black/50 focus:outline-none border-2 border-black bg-transparent font-open-sans text-base"
          />
        </div>

        {/* Sort and Actions Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SynapsasDropdown
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              className="w-full"
            />
          </div>
          
          <Link 
            href="/discussions/new"
            className="px-3 py-2 bg-black text-white font-medium border-2 border-black transition-all duration-300 hover:-translate-y-0.5 text-sm flex-shrink-0"
          >
            New
          </Link>
        </div>
      </section>
    </div>
  );
}