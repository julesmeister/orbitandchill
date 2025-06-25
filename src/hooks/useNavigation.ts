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
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = useCallback((href: string) => {
    // Clear any existing timers
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    
    setLoadingLink(href);
    setProgressWidth(0);
    
    // Progress animation using refs to persist across re-renders
    const startTime = Date.now();
    const duration = 500;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 85);
      setProgressWidth(progress);
      
      if (progress >= 85) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, 16);

    // Navigate
    router.push(href);
    
    // Complete progress after navigation
    completeTimeoutRef.current = setTimeout(() => {
      setProgressWidth(100);
      setTimeout(() => {
        setLoadingLink(null);
        setProgressWidth(0);
      }, 200);
    }, 300);
  }, [router]);

  const isActiveLink = useCallback((href: string) => {
    return pathname === href;
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    };
  }, []);

  return {
    loadingLink,
    progressWidth,
    isActiveLink,
    handleNavigation
  };
};