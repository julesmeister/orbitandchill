/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PostItem from './PostItem';
import { formatCurrentTime, formatRelativeTime } from '@/utils/dateFormatting';

interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  preferredAvatar?: string;
  slug?: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  upvotes: number;
  downvotes: number;
  replies: number;
  featuredImage?: string;
  category: string;
  embeddedChart?: any;
  embeddedVideo?: any;
}

interface PostsListProps {
  // Data
  filteredThreads: Thread[];
  currentPosts: Thread[];
  threads: Thread[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  indexOfFirstPost: number;
  indexOfLastPost: number;
  totalThreads: number;
  
  // Filter and UI state
  filter: string;
  isLoading: boolean;
  
  // Selection state
  selectedPosts: Set<string>;
  
  // Event handlers
  onSelectAll: (currentPosts: Thread[]) => void;
  onSelectPost: (postId: string) => void;
  onEdit: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
  onTogglePin: (thread: Thread) => void;
  onPageChange: (page: number) => void;
  onPostsPerPageChange: (postsPerPage: number) => void;
}

export default function PostsList({
  filteredThreads,
  currentPosts,
  threads,
  currentPage,
  totalPages,
  postsPerPage,
  indexOfFirstPost,
  indexOfLastPost,
  totalThreads,
  filter,
  isLoading,
  selectedPosts,
  onSelectAll,
  onSelectPost,
  onEdit,
  onDelete,
  onTogglePin,
  onPageChange,
  onPostsPerPageChange
}: PostsListProps) {

  return (
    <div className="bg-white border border-black">
      {/* List Header */}
      <div className="p-3 md:p-4 border-b border-black">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            {currentPosts.length > 0 && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPosts.size === currentPosts.length && currentPosts.length > 0}
                  onChange={() => onSelectAll(currentPosts)}
                  className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2"
                />
                <span className="text-sm text-gray-700 font-open-sans hidden sm:inline">
                  Select all on page
                </span>
                <span className="text-sm text-gray-700 font-open-sans sm:hidden">
                  Select all
                </span>
              </label>
            )}
            <h3 className="text-lg md:text-lg font-semibold text-black font-space-grotesk">
              {filter === 'all' ? 'All Posts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Posts`}
            </h3>
          </div>
          <div className="text-sm md:text-sm text-gray-700 font-open-sans md:text-right">
            <div>Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, totalThreads)} of {totalThreads} posts</div>
            {threads.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Most recent: {(() => {
                  const mostRecentThread = threads.reduce((latest, current) => 
                    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                  );
                  return formatRelativeTime(mostRecentThread.createdAt);
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Content */}
      <div className="divide-y divide-black">
        {isLoading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 md:p-4 animate-pulse border-b border-black last:border-b-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-2 sm:gap-0">
                      {/* Title skeleton */}
                      <div className="h-5 bg-gray-200 rounded w-full sm:w-3/4"></div>
                      {/* Status badges skeleton */}
                      <div className="flex space-x-2">
                        <div className="h-5 w-12 bg-gray-200 rounded"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Excerpt skeleton */}
                    <div className="space-y-2 mb-3">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    
                    {/* Meta info skeleton */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-3 w-14 bg-gray-200 rounded"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Action buttons skeleton */}
                  <div className="flex gap-0 md:ml-4">
                    <div className="w-10 md:w-12 h-8 md:h-10 bg-gray-200 border border-gray-300"></div>
                    <div className="w-10 md:w-12 h-8 md:h-10 bg-gray-200 border-l-0 border-r-0 border-t border-b border-gray-300"></div>
                    <div className="w-10 md:w-12 h-8 md:h-10 bg-gray-200 border border-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-open-sans">No posts found matching the current filter.</p>
          </div>
        ) : (
          currentPosts.map((thread: any) => (
            <PostItem
              key={thread.id}
              thread={thread}
              isSelected={selectedPosts.has(thread.id)}
              onSelect={onSelectPost}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          ))
        )}
      </div>

      {/* Time Update Info - Always show when posts exist */}
      {filteredThreads.length > 0 && totalPages <= 1 && (
        <div className="px-3 md:px-4 py-2 border-t border-black bg-gray-50">
          <div className="text-xs text-gray-500 text-center font-open-sans">
            Times updated {formatCurrentTime()} • Showing all {filteredThreads.length} posts
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-3 md:px-4 py-3 border-t border-black bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
            {/* Page Info */}
            <div className="text-sm text-black font-open-sans lg:order-1">
              <div>Page {currentPage} of {totalPages}</div>
              <div className="text-xs text-gray-500 mt-1">
                Times updated {formatCurrentTime()}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center flex-wrap gap-2 lg:order-2">
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 md:px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
              >
                <svg className="w-4 h-4 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden md:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - currentPage) <= 1;

                  if (!showPage) {
                    // Show ellipsis
                    if (pageNumber === 2 && currentPage > 4) {
                      return (
                        <span key={pageNumber} className="px-2 md:px-3 py-2 text-sm text-gray-600 font-open-sans">
                          ...
                        </span>
                      );
                    }
                    if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                      return (
                        <span key={pageNumber} className="px-2 md:px-3 py-2 text-sm text-gray-600 font-open-sans">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-2 md:px-3 py-2 text-sm font-medium border transition-colors font-open-sans ${currentPage === pageNumber
                          ? 'bg-[#6bdbff] text-black border-black hover:bg-[#5ac8ec]'
                          : 'text-gray-800 bg-white border-black hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 md:px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
              >
                <span className="hidden md:inline">Next</span>
                <svg className="w-4 h-4 md:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Posts per page selector */}
            <div className="flex items-center justify-center lg:justify-end space-x-2 lg:order-3">
              <span className="text-xs md:text-sm text-black font-open-sans">Posts per page:</span>
              <select
                value={postsPerPage}
                onChange={(e) => {
                  const newPostsPerPage = parseInt(e.target.value, 10);
                  onPostsPerPageChange(newPostsPerPage);
                }}
                className="text-xs md:text-sm border border-black px-1 md:px-2 py-1 bg-white font-open-sans hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}