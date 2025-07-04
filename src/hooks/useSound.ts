/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useRef } from 'react';

export const useSound = (soundPath: string, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
      }
      
      // Reset the audio to the beginning and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        // Silently handle autoplay restrictions
        console.debug('Sound play failed:', error);
      });
    } catch (error) {
      console.debug('Sound initialization failed:', error);
    }
  }, [soundPath, volume]);

  return { play };
};