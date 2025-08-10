/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

interface UseDiscussionSearchOptions {
  debounceMs?: number;
  itemsPerPage?: number;
  filter?: 'all' | 'forum' | 'recent';
  onSearchChange?: (searchQuery: string, filter: string) => void;
}

export function useDiscussionSearch(options: UseDiscussionSearchOptions = {}) {
  const {
    debounceMs = 500,
    itemsPerPage = 10,
    filter = 'forum',
    onSearchChange
  } = options;

  const [searchQuery, setSearchQuery] = useState('');

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchQuery, filter);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, filter, debounceMs, onSearchChange]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch
  };
}