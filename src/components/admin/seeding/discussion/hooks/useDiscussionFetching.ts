/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback } from 'react';

interface UseDiscussionFetchingProps {
  discussionsPerPage: number;
}

interface FetchParams {
  page?: number;
  filter?: string;
  search?: string;
  forceRefresh?: boolean;
}

export function useDiscussionFetching({ discussionsPerPage }: UseDiscussionFetchingProps) {
  const [threads, setThreads] = useState<any[]>([]);
  const [totalThreads, setTotalThreads] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use ref to prevent multiple simultaneous calls
  const loadingRef = useRef(false);
  
  // Cache to prevent unnecessary API calls
  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 30000; // 30 seconds

  // Direct API call function with caching
  const fetchDiscussions = useCallback(async (params: FetchParams = {}) => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) return;
    
    const {
      page = 1,
      filter: filterParam = 'forum',
      search = '',
      forceRefresh = false
    } = params;

    // Create cache key
    const cacheKey = `${page}-${filterParam}-${search}`;
    const now = Date.now();

    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = cacheRef.current.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setThreads(cached.data.discussions || []);
        setTotalThreads(cached.data.totalCount || 0);
        setTotalPages(cached.data.totalPages || 0);
        setIsLoading(false);
        return;
      }
    }
    
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: discussionsPerPage.toString(),
        sortBy: 'recent',
        drafts: 'false'
      });

      if (filterParam === 'forum') {
        queryParams.append('isBlogPost', 'false');
      } else if (filterParam === 'blog') {
        queryParams.append('isBlogPost', 'true');
      }

      if (search.trim()) {
        queryParams.append('search', search);
      }

      if (forceRefresh) {
        queryParams.append('_t', Date.now().toString());
      }

      const response = await fetch(`/api/discussions?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        const responseData = {
          discussions: data.discussions || [],
          totalCount: data.totalCount || 0,
          totalPages: data.totalPages || 0
        };
        
        // Update state
        setThreads(responseData.discussions);
        setTotalThreads(responseData.totalCount);
        setTotalPages(responseData.totalPages);
        
        // Cache the result
        cacheRef.current.set(cacheKey, {
          data: responseData,
          timestamp: now
        });
        
        // Clean old cache entries (keep only last 10 to prevent memory bloat)
        if (cacheRef.current.size > 10) {
          const entries = Array.from(cacheRef.current.entries());
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          // Remove oldest entries
          for (let i = 0; i < entries.length - 8; i++) {
            cacheRef.current.delete(entries[i][0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
      setThreads([]);
      setTotalThreads(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [discussionsPerPage]);

  return {
    threads,
    totalThreads,
    totalPages,
    isLoading,
    fetchDiscussions
  };
}