/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

interface CategoryCounts {
  [category: string]: number;
}

interface UseCategoryCountsReturn {
  categoryCounts: CategoryCounts;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useCategoryCounts(): UseCategoryCountsReturn {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({});
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/discussions/stats', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCategoryCounts(data.categoryCounts || {});
          setTotalCount(data.totalCount || 0);
        } else {
          throw new Error(data.error || 'Failed to fetch category counts');
        }
      } catch (err) {
        console.error('Error fetching category counts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set empty counts on error
        setCategoryCounts({});
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  return {
    categoryCounts,
    totalCount,
    isLoading,
    error
  };
}