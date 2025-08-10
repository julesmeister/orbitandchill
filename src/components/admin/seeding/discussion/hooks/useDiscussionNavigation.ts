/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';

interface UseDiscussionNavigationProps {
  fetchDiscussions: (params?: any) => Promise<void>;
}

export function useDiscussionNavigation({ fetchDiscussions }: UseDiscussionNavigationProps) {
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'forum' | 'recent'>('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilter: 'all' | 'forum' | 'recent') => {
    setFilter(newFilter);
    setCurrentPage(1);
    setSelectedDiscussion(null);
    fetchDiscussions({ page: 1, filter: newFilter, search: searchQuery });
  }, [searchQuery, fetchDiscussions]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setSelectedDiscussion(null);
      fetchDiscussions({ page: 1, filter, search: searchQuery });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filter, fetchDiscussions]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setSelectedDiscussion(null);
    fetchDiscussions({ page: newPage, filter, search: searchQuery });
  }, [filter, searchQuery, fetchDiscussions]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchDiscussions({ page: currentPage, filter, search: searchQuery, forceRefresh: true });
  }, [currentPage, filter, searchQuery, fetchDiscussions]);

  // Handle discussion selection
  const handleDiscussionSelect = useCallback((discussion: any) => {
    setSelectedDiscussion(discussion);
  }, []);

  return {
    selectedDiscussion,
    filter,
    searchQuery,
    currentPage,
    setSearchQuery,
    handleFilterChange,
    handlePageChange,
    handleRefresh,
    handleDiscussionSelect
  };
}