/* eslint-disable @typescript-eslint/no-unused-vars */
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  backgroundColor?: string;
  label?: string;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageSelector = false,
  itemsPerPageOptions = [5, 10, 25, 50],
  backgroundColor = '#51bd94',
  label = 'entries'
}: TablePaginationProps) {
  return (
    <div className="px-4 md:px-6 py-4 border-t border-black" style={{ backgroundColor }}>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-black font-open-sans">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> {label}
          </p>
          
          {showItemsPerPageSelector && onItemsPerPageChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-black font-open-sans">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                className="px-2 py-1 text-sm font-medium text-black bg-white border border-black focus:outline-none hover:bg-[#6bdbff] transition-colors font-open-sans"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Desktop Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-black bg-white border border-black hover:bg-[#6bdbff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
          >
            ← Previous
          </button>
          
          <div className="flex items-center space-x-1">
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
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm font-medium transition-colors font-open-sans ${
                    currentPage === pageNum
                      ? 'bg-black text-white'
                      : 'text-black bg-white border border-black hover:bg-[#6bdbff]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-black bg-white border border-black hover:bg-[#6bdbff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Mobile Info */}
        <div className="text-center">
          <p className="text-xs text-black font-open-sans">
            <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> {label}
          </p>
        </div>
        
        {/* Mobile Pagination Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-xs font-medium text-black bg-white border border-black hover:bg-[#6bdbff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
          >
            ← Prev
          </button>
          
          <div className="flex items-center space-x-1">
            {/* Show fewer page numbers on mobile */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-2 py-1 text-xs font-medium transition-colors font-open-sans ${
                    currentPage === pageNum
                      ? 'bg-black text-white'
                      : 'text-black bg-white border border-black hover:bg-[#6bdbff]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <span className="px-1 text-xs text-black">...</span>
            )}
          </div>
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-xs font-medium text-black bg-white border border-black hover:bg-[#6bdbff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
          >
            Next →
          </button>
        </div>

        {/* Mobile Items Per Page */}
        {showItemsPerPageSelector && onItemsPerPageChange && (
          <div className="flex items-center justify-center space-x-2 pt-2 border-t border-black/20">
            <span className="text-xs text-black font-open-sans">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className="px-2 py-1 text-xs font-medium text-black bg-white border border-black focus:outline-none hover:bg-[#6bdbff] transition-colors font-open-sans"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-xs text-black font-open-sans">per page</span>
          </div>
        )}
      </div>
    </div>
  );
}