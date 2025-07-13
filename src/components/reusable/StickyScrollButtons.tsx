/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';

interface StickyScrollButtonsProps {
  className?: string;
}

export default function StickyScrollButtons({ className = "" }: StickyScrollButtonsProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show buttons when not at the very top
      setShowButtons(scrollTop > 100);
      
      // Track position for button states
      setIsAtTop(scrollTop < 50);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!showButtons) return null;

  return (
    <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2 ${className}`}>
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        disabled={isAtTop}
        className={`
          w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white
          transition-all duration-200 group
          ${isAtTop ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
        `}
        title="Scroll to top"
      >
        <svg 
          className="w-6 h-6 mx-auto transform group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Scroll to Bottom */}
      <button
        onClick={scrollToBottom}
        disabled={isAtBottom}
        className={`
          w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white
          transition-all duration-200 group
          ${isAtBottom ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
        `}
        title="Scroll to bottom"
      >
        <svg 
          className="w-6 h-6 mx-auto transform group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Current Position Indicator */}
      <div className="w-12 h-1 bg-white border border-black mt-2">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ 
            width: `${Math.min(100, Math.max(0, (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100))}%` 
          }}
        />
      </div>
    </div>
  );
}