/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from 'react';

interface UseProgressiveLoadOptions {
  /**
   * Delay in ms before starting to load this section
   * Default: 0
   */
  delay?: number;

  /**
   * Whether to use intersection observer to load when visible
   * Default: false
   */
  useIntersection?: boolean;

  /**
   * Root margin for intersection observer
   * Default: '200px' (load 200px before entering viewport)
   */
  rootMargin?: string;

  /**
   * Whether to skip loading entirely (useful for conditional loading)
   * Default: false
   */
  skip?: boolean;
}

interface UseProgressiveLoadReturn {
  /**
   * Whether this section should be rendered
   */
  shouldLoad: boolean;

  /**
   * Ref to attach to the container for intersection observer
   */
  ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for progressively loading heavy sections
 *
 * This prevents all sections from loading simultaneously and blocking the main thread.
 * Sections can load after a delay or when they enter the viewport.
 */
export function useProgressiveLoad(options: UseProgressiveLoadOptions = {}): UseProgressiveLoadReturn {
  const {
    delay = 0,
    useIntersection = false,
    rootMargin = '200px',
    skip = false
  } = options;

  const [shouldLoad, setShouldLoad] = useState(!useIntersection && delay === 0 && !skip);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skip) {
      setShouldLoad(false);
      return;
    }

    // If using intersection observer
    if (useIntersection && ref.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add delay even for intersection if specified
              if (delay > 0) {
                setTimeout(() => setShouldLoad(true), delay);
              } else {
                setShouldLoad(true);
              }
              // Unobserve after loading
              observer.disconnect();
            }
          });
        },
        { rootMargin }
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }

    // If using delay without intersection
    if (delay > 0 && !useIntersection) {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, useIntersection, rootMargin, skip]);

  return { shouldLoad, ref };
}
