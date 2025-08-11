/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing discussions pagination
 */
export function useDiscussionsPagination<T>(
  items: T[],
  initialPage = 1,
  initialItemsPerPage = 6
) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination values
  const totalPages = useMemo(() => 
    Math.ceil(items.length / itemsPerPage), 
    [items.length, itemsPerPage]
  );

  const indexOfLastItem = useMemo(() => 
    currentPage * itemsPerPage, 
    [currentPage, itemsPerPage]
  );

  const indexOfFirstItem = useMemo(() => 
    indexOfLastItem - itemsPerPage, 
    [indexOfLastItem, itemsPerPage]
  );

  const currentItems = useMemo(() => 
    items.slice(indexOfFirstItem, indexOfLastItem),
    [items, indexOfFirstItem, indexOfLastItem]
  );

  // Page change handler with smooth scroll
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset to page 1 (useful when filters change)
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Generate page numbers for pagination UI
  const generatePageNumbers = useCallback(() => {
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

    return showPages;
  }, [currentPage, totalPages]);

  return {
    // State
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    indexOfFirstItem,
    indexOfLastItem,
    
    // Actions
    handlePageChange,
    resetToFirstPage,
    setCurrentPage,
    
    // Helpers
    generatePageNumbers,
    
    // Computed values
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: items.length
  };
}