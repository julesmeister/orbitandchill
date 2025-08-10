/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { stripHtmlTags } from '@/utils/textUtils';
import { formatRelativeTime } from './utils';

interface DiscussionListProps {
  discussions: any[];
  selectedDiscussion: any;
  onDiscussionSelect: (discussion: any) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  discussionsPerPage: number;
  totalCount?: number;
  totalPages?: number;
  isLoading?: boolean;
}

export default function DiscussionList({
  discussions,
  selectedDiscussion,
  onDiscussionSelect,
  currentPage,
  setCurrentPage,
  discussionsPerPage,
  totalCount = 0,
  totalPages = 0,
  isLoading = false
}: DiscussionListProps) {
  // For server-side pagination, we show all fetched discussions
  // The API already handles the pagination
  const currentDiscussions = discussions;

  // Show loading state
  if (isLoading && discussions.length === 0) {
    return (
      <div className="bg-white border border-black p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="font-space-grotesk font-semibold text-gray-900 mb-2">Loading discussions...</h3>
          <p className="text-gray-600 font-open-sans">
            Fetching the latest forum discussions
          </p>
        </div>
      </div>
    );
  }

  // Show empty state when not loading and no discussions
  if (discussions.length === 0 && !isLoading && currentPage === 1) {
    return (
      <div className="bg-white border border-black p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="font-space-grotesk font-semibold text-gray-900 mb-2">No discussions found</h3>
        <p className="text-gray-600 font-open-sans">
          Try adjusting your search terms or filters.
        </p>
      </div>
    );
  }

  // Calculate display range for server-side pagination
  const startIndex = (currentPage - 1) * discussionsPerPage + 1;
  const endIndex = Math.min(currentPage * discussionsPerPage, totalCount);

  return (
    <div className="bg-white border border-black">
      <div className="divide-y divide-gray-200">
        {currentDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedDiscussion?.id === discussion.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => onDiscussionSelect(discussion)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-space-grotesk font-semibold text-black">{discussion.title}</h3>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-300 font-open-sans">
                    {discussion.category}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 border border-green-300 font-open-sans">
                    {discussion.replies} replies
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-open-sans mb-2 line-clamp-2">
                  {stripHtmlTags(discussion.content).substring(0, 200)}...
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-open-sans">
                  <span>by {discussion.authorName}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(discussion.createdAt)}</span>
                  <span>•</span>
                  <span>{discussion.views} views</span>
                </div>
              </div>
              {selectedDiscussion?.id === discussion.id && (
                <div className="ml-4 text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700 font-open-sans">
              {totalCount > 0 ? (
                <>Showing {startIndex}-{endIndex} of {totalCount}</>
              ) : (
                <>No results</>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border ${
                        currentPage === pageNum
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-black bg-white hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}