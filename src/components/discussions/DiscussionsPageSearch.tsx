/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from 'next/link';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import { sortOptions } from '@/utils/discussionsUtils';

interface DiscussionsPageSearchProps {
  searchQuery: string;
  sortBy: string;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
}

/**
 * Search Section Component for Discussions Page
 */
export default function DiscussionsPageSearch({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange
}: DiscussionsPageSearchProps) {
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
                  className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 whitespace-nowrap"
                >
                  Start Discussion
                </Link>
                <Link 
                  href="/guides"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Browse Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}