/* eslint-disable @typescript-eslint/no-unused-vars */

interface DiscussionsPagePaginationProps {
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  totalItems: number;
  generatePageNumbers: () => (number | string)[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

/**
 * Pagination Component for Discussions Page
 */
export default function DiscussionsPagePagination({
  loading,
  error,
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems,
  generatePageNumbers,
  hasNextPage,
  hasPrevPage,
  onPageChange
}: DiscussionsPagePaginationProps) {
  // Don't show pagination if loading, error, or only one page
  if (loading || error || totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-t border-black p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-black/70">
          Showing{" "}
          <span className="font-medium text-black">
            {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-black">
            {totalItems}
          </span>{" "}
          discussions
        </div>

        <div className="text-sm text-black/70">
          Page{" "}
          <span className="font-medium text-black">{currentPage}</span>{" "}
          of{" "}
          <span className="font-medium text-black">{totalPages}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
            !hasPrevPage
              ? "text-black/40 cursor-not-allowed bg-gray-100"
              : "text-black hover:bg-black hover:text-white"
          }`}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-4">
          {generatePageNumbers().map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10">
                  <span className="text-black/40">...</span>
                </div>
              );
            }

            const isCurrentPage = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber as number)}
                className={`w-10 h-10 text-sm font-medium border border-black transition-all duration-300 ${
                  isCurrentPage
                    ? "bg-black text-white"
                    : "text-black hover:bg-black hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
            !hasNextPage
              ? "text-black/40 cursor-not-allowed bg-gray-100"
              : "text-black hover:bg-black hover:text-white"
          }`}
        >
          Next
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}