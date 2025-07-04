/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseNavigationReturn {
  loadingLink: string | null;
  progressWidth: number;
  isActiveLink: (href: string) => boolean;
  handleNavigation: (href: string) => void;
}

export const useNavigation = (): UseNavigationReturn => {
  const [loadingLink, setLoadingLink] = useState<string | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  const handleNavigation = useCallback((href: string) => {
    // Clear any existing timers
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    
    setLoadingLink(href);
    setProgressWidth(0);
    
    // Multi-stage progress animation for more realistic loading
    const startTime = Date.now();
    let stage = 1;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let progress = 0;
      
      // Stage 1: Quick initial progress (0-30%) - first 200ms
      if (elapsed < 200) {
        progress = (elapsed / 200) * 30;
      }
      // Stage 2: Slow middle progress (30-70%) - next 1000ms
      else if (elapsed < 1200) {
        progress = 30 + ((elapsed - 200) / 1000) * 40;
      }
      // Stage 3: Very slow final progress (70-85%) - next 800ms
      else if (elapsed < 2000) {
        progress = 70 + ((elapsed - 1200) / 800) * 15;
      }
      // Stage 4: Hold at 85% until navigation completes
      else {
        progress = 85;
      }
      
      setProgressWidth(Math.min(progress, 85));
    }, 16);

    // Navigate after a brief delay to show initial progress
    navigationTimeoutRef.current = setTimeout(() => {
      router.push(href);
    }, 100);
    
    // Store the current pathname to detect when navigation completes
    previousPathnameRef.current = pathname;
  }, [router, pathname]);

  const isActiveLink = useCallback((href: string) => {
    return pathname === href;
  }, [pathname]);

  // Listen for pathname changes to detect when navigation completes
  useEffect(() => {
    // If we have a loading link and pathname has changed, complete the progress
    if (loadingLink && previousPathnameRef.current && pathname !== previousPathnameRef.current) {
      // Clear any existing timers
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
        completeTimeoutRef.current = null;
      }
      
      // Quick final progress to 100%
      setProgressWidth(100);
      
      // Hide loading state after showing completion
      setTimeout(() => {
        setLoadingLink(null);
        setProgressWidth(0);
      }, 300);
      
      // Update previous pathname
      previousPathnameRef.current = pathname;
    }
  }, [pathname, loadingLink]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, []);

  return {
    loadingLink,
    progressWidth,
    isActiveLink,
    handleNavigation
  };
};