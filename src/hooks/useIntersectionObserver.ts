/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook for intersection observer - enables lazy loading of components
 * Used for progressive loading of chart sections
 */
export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  root = null,
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): [boolean, (node: Element | null) => void] {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isVisible, setIsVisible] = useState(false);
  const previousY = useRef<number>(0);
  const previousRatio = useRef<number>(0);
  const targetRef = useRef<Element | null>(null);

  const setTargetRef = (node: Element | null) => {
    targetRef.current = node;
  };

  const frozen = freezeOnceVisible && isVisible;

  useEffect(() => {
    const node = targetRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        const {
          isIntersecting,
          intersectionRatio,
          boundingClientRect,
        } = entry;

        const currentY = boundingClientRect.y;
        const currentRatio = intersectionRatio;
        const isScrollingUp = currentY > (previousY.current ?? 0);

        setEntry(entry);

        // Determine if element is visible based on intersection
        if (isIntersecting) {
          setIsVisible(true);
        } else {
          // Only hide if scrolling away and threshold conditions are met
          if (!isScrollingUp && currentRatio < (previousRatio.current ?? 0)) {
            setIsVisible(false);
          }
        }

        previousY.current = currentY;
        previousRatio.current = currentRatio;
      },
      observerParams
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return [isVisible, setTargetRef];
}