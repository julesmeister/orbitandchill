/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import AnimatedZodiacCard from './AnimatedZodiacCard';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackCategory?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackCategory = 'Astrology',
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  quality = 75
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // If there's an error or no src, show fallback
  if (!src || imageError) {
    return (
      <AnimatedZodiacCard 
        category={fallbackCategory}
        className={`w-full h-full ${className}`}
        showParticles={true}
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${fill ? 'absolute inset-0' : ''}`}>
      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${fill ? 'w-full h-full absolute inset-0' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export default SafeImage;