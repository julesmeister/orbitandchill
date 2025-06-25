/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from 'react';

interface UseCarouselProps {
  itemCount: number;
  autoScrollInterval?: number;
  pauseOnInteraction?: number;
}

interface UseCarouselReturn {
  currentIndex: number;
  carouselRef: React.RefObject<HTMLDivElement>;
  goToIndex: (index: number) => void;
}

export function useCarousel({ 
  itemCount, 
  autoScrollInterval = 5000,
  pauseOnInteraction = 10000 
}: UseCarouselProps): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (itemCount <= 1) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === itemCount - 1 ? 0 : prevIndex + 1
        );
      }, autoScrollInterval);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();

    return () => stopAutoScroll();
  }, [itemCount, autoScrollInterval]);

  // Handle manual navigation
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    
    // Reset auto-scroll timer
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    
    // Restart auto-scroll after specified pause duration
    setTimeout(() => {
      if (itemCount > 1) {
        autoScrollRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === itemCount - 1 ? 0 : prevIndex + 1
          );
        }, autoScrollInterval);
      }
    }, pauseOnInteraction);
  };

  // Scroll carousel to current index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollLeft = currentIndex * carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return {
    currentIndex,
    carouselRef,
    goToIndex,
  };
}