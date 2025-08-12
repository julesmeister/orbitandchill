/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useMemo } from 'react';

interface UseOptimizedLoadingOptions {
  /** Minimum loading time to prevent flashing */
  minLoadingTime?: number;
  /** Maximum loading time before timeout */
  maxLoadingTime?: number;
  /** Whether to show loading immediately or wait for data */
  immediate?: boolean;
}

interface UseOptimizedLoadingReturn {
  /** Whether currently in loading state */
  isLoading: boolean;
  /** Whether data has loaded successfully */
  hasLoaded: boolean;
  /** Start the loading process */
  startLoading: () => void;
  /** Stop the loading process */
  stopLoading: () => void;
  /** Reset the loading state */
  reset: () => void;
}

/**
 * Optimized loading hook that prevents flashing and provides smooth UX
 * 
 * @param options Configuration options for loading behavior
 * @returns Loading state management functions and flags
 */
export function useOptimizedLoading(
  options: UseOptimizedLoadingOptions = {}
): UseOptimizedLoadingReturn {
  const {
    minLoadingTime = 300,
    maxLoadingTime = 10000,
    immediate = false
  } = options;

  const [isLoading, setIsLoading] = useState(immediate);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setHasLoaded(false);
    setStartTime(Date.now());
  };

  const stopLoading = () => {
    if (!startTime) {
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    const elapsed = Date.now() - startTime;
    
    if (elapsed >= minLoadingTime) {
      // Minimum time has passed, stop immediately
      setIsLoading(false);
      setHasLoaded(true);
    } else {
      // Wait for minimum time to prevent flashing
      setTimeout(() => {
        setIsLoading(false);
        setHasLoaded(true);
      }, minLoadingTime - elapsed);
    }
  };

  const reset = () => {
    setIsLoading(immediate);
    setHasLoaded(false);
    setStartTime(null);
  };

  // Auto-timeout after max loading time
  useEffect(() => {
    if (!isLoading || !startTime) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
      setHasLoaded(true);
    }, maxLoadingTime);

    return () => clearTimeout(timeout);
  }, [isLoading, startTime, maxLoadingTime]);

  return {
    isLoading,
    hasLoaded,
    startLoading,
    stopLoading,
    reset
  };
}

/**
 * Hook specifically for skeleton loading patterns
 */
export function useSkeletonLoading(hasData: boolean, minLoadingTime = 200) {
  const [showSkeleton, setShowSkeleton] = useState(!hasData);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (hasData) {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= minLoadingTime) {
        setShowSkeleton(false);
      } else {
        setTimeout(() => {
          setShowSkeleton(false);
        }, minLoadingTime - elapsed);
      }
    }
  }, [hasData, startTime, minLoadingTime]);

  return showSkeleton;
}

/**
 * Hook for progressive loading with staggered delays
 */
export function useStaggeredLoading(itemCount: number, staggerDelay = 50) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= itemCount) return;

    const timer = setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 1, itemCount));
    }, staggerDelay);

    return () => clearTimeout(timer);
  }, [visibleCount, itemCount, staggerDelay]);

  const isItemVisible = (index: number) => index < visibleCount;

  return {
    visibleCount,
    isItemVisible,
    reset: () => setVisibleCount(0)
  };
}