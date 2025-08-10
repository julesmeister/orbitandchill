/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface UseDiscussionPaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

export function useDiscussionPagination(options: UseDiscussionPaginationOptions = {}) {
  const {
    initialPage = 1,
    itemsPerPage = 10
  } = options;

  const { threads, totalThreads, totalPages, loadThreads } = useAdminStore();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);

  // Load threads function that can be called with parameters
  const loadDiscussions = useCallback((params: {
    page?: number;
    limit?: number;
    filter?: string;
    search?: string;
    forceRefresh?: boolean;
  } = {}) => {
    const {
      page = currentPage,
      limit = itemsPerPage,
      filter = 'forum',
      search = '',
      forceRefresh = false
    } = params;

    return loadThreads({
      page,
      limit,
      filter,
      search,
      sortBy: 'recent',
      forceRefresh
    });
  }, [loadThreads, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setSelectedDiscussion(null); // Clear selection on page change
  }, []);

  // Handle refresh
  const handleRefresh = useCallback((filter = 'forum', search = '') => {
    return loadDiscussions({
      page: currentPage,
      filter,
      search,
      forceRefresh: true
    });
  }, [loadDiscussions, currentPage]);

  // Handle discussion selection
  const handleDiscussionSelect = useCallback((discussion: any) => {
    setSelectedDiscussion(discussion);
  }, []);

  // Reset to first page (useful for search/filter changes)
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    threads,
    totalThreads,
    totalPages,
    currentPage,
    selectedDiscussion,
    handlePageChange,
    handleRefresh,
    handleDiscussionSelect,
    resetToFirstPage,
    loadDiscussions,
    setCurrentPage
  };
}