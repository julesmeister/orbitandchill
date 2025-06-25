"use client";

import { useEffect } from 'react';

const CircularNatalHoroscopeLoader = () => {
  useEffect(() => {
    // Load CircularNatalHoroscopeJS library
    const script = document.createElement('script');
    script.src = '/CircularNatalHoroscopeJS/index.js';
    script.defer = true;
    script.onload = () => {
      // Initialize the global object when library loads
      if (typeof window !== 'undefined') {
        // @ts-expect-error - CircularNatalHoroscope globals
        if (typeof Origin !== 'undefined' && typeof Horoscope !== 'undefined') {
          // @ts-expect-error - CircularNatalHoroscope globals
          window.CircularNatalHoroscope = { Origin, Horoscope };
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="/CircularNatalHoroscopeJS/index.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CircularNatalHoroscopeLoader;