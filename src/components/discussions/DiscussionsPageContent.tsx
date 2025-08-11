/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from 'next/link';
import DiscussionCardSimple from './DiscussionCardSimple';
import { Discussion } from '@/types/discussion';

interface DiscussionsPageContentProps {
  loading: boolean;
  error: string | null;
  discussions: Discussion[];
  searchQuery: string;
  selectedCategory: string;
  onRetry: () => void;
}

/**
 * Content Section Component for Discussions Page
 */
export default function DiscussionsPageContent({
  loading,
  error,
  discussions,
  searchQuery,
  selectedCategory,
  onRetry
}: DiscussionsPageContentProps) {
  if (loading) {
    return (
      <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
          <p className="text-black/70">Loading discussions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-black text-white font-medium border border-black hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">No discussions found</h3>
          <p className="text-black/60 mb-4">
            {searchQuery ? 
              `No discussions match "${searchQuery}". Try adjusting your search terms.` :
              `No discussions in ${selectedCategory}. Be the first to start a conversation!`
            }
          </p>
          <Link 
            href="/discussions/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border border-black hover:bg-gray-800 transition-colors"
          >
            Start Discussion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
      <div className="divide-y divide-black">
        {discussions.map((discussion) => (
          <DiscussionCardSimple key={discussion.id} discussion={discussion} />
        ))}
      </div>
    </div>
  );
}