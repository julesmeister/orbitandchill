/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface DiscussionsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function DiscussionsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: DiscussionsPaginationProps) {
  if (totalPages <= 1) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
          disabled={currentPage === 1}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
            currentPage === 1
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
          {(() => {
            const showPages = [];
            const delta = 2;

            if (currentPage > delta + 2) {
              showPages.push(1);
              if (currentPage > delta + 3) {
                showPages.push("...");
              }
            }

            for (
              let i = Math.max(1, currentPage - delta);
              i <= Math.min(totalPages, currentPage + delta);
              i++
            ) {
              showPages.push(i);
            }

            if (currentPage < totalPages - delta - 1) {
              if (currentPage < totalPages - delta - 2) {
                showPages.push("...");
              }
              showPages.push(totalPages);
            }

            return showPages.map((pageNumber, index) => {
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
            });
          })()}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium border border-black transition-all duration-300 ${
            currentPage === totalPages
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