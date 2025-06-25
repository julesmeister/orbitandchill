/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPaginationInfo } from '@/types/blog';

interface BlogPaginationProps {
  paginationInfo: BlogPaginationInfo;
  onPageChange: (page: number) => void;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  paginationInfo,
  onPageChange
}) => {
  const { currentPage, totalPages, totalPosts, postsPerPage } = paginationInfo;

  // Calculate the range of posts being displayed
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Post count info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{startPost}</span> to{' '}
          <span className="font-medium text-gray-900">{endPost}</span> of{' '}
          <span className="font-medium text-gray-900">{totalPosts}</span> posts
        </div>

        {/* Pagination controls */}
        <nav className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 text-sm font-medium border rounded-none transition-colors duration-200 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-black'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-3 py-2 text-sm font-medium border rounded-none transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-black'
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className="sm:hidden text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 text-sm font-medium border rounded-none transition-colors duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-black'
            }`}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </nav>
      </div>

      {/* Jump to page (optional enhancement) */}
      <div className="mt-4 flex items-center justify-center sm:hidden">
        <label htmlFor="page-select" className="sr-only">
          Go to page
        </label>
        <select
          id="page-select"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-300 rounded-none focus:outline-none focus:border-black"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BlogPagination;