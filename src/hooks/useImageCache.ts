/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';

interface ImageCache {
  [key: string]: {
    blob: string;
    loaded: boolean;
    error: boolean;
  };
}

export const useImageCache = () => {
  const [cache, setCache] = useState<ImageCache>({});
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(async (src: string): Promise<string> => {
    // Return cached version if available
    if (cache[src]?.loaded) {
      return cache[src].blob;
    }

    // Return original src if already loading
    if (loadingImages.has(src)) {
      return src;
    }

    try {
      setLoadingImages(prev => new Set(prev).add(src));

      const response = await fetch(src);
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      setCache(prev => ({
        ...prev,
        [src]: {
          blob: objectURL,
          loaded: true,
          error: false
        }
      }));

      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });

      return objectURL;
    } catch (error) {
      console.warn('Failed to preload image:', src, error);
      
      setCache(prev => ({
        ...prev,
        [src]: {
          blob: src, // Fallback to original src
          loaded: false,
          error: true
        }
      }));

      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });

      return src; // Return original src on error
    }
  }, [cache, loadingImages]);

  const preloadImages = useCallback(async (sources: string[]) => {
    const promises = sources.map(src => preloadImage(src));
    await Promise.allSettled(promises);
  }, [preloadImage]);

  const getCachedImageSrc = useCallback((originalSrc: string): string => {
    const cached = cache[originalSrc];
    if (cached?.loaded && !cached.error) {
      return cached.blob;
    }
    return originalSrc;
  }, [cache]);

  const isImageLoaded = useCallback((src: string): boolean => {
    return cache[src]?.loaded || false;
  }, [cache]);

  const isImageLoading = useCallback((src: string): boolean => {
    return loadingImages.has(src);
  }, [loadingImages]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(cache).forEach(cached => {
        if (cached.blob.startsWith('blob:')) {
          URL.revokeObjectURL(cached.blob);
        }
      });
    };
  }, []);

  return {
    preloadImage,
    preloadImages,
    getCachedImageSrc,
    isImageLoaded,
    isImageLoading,
    cache
  };
};