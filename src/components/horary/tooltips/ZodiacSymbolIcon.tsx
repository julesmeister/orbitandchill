/**
 * Reusable zodiac symbol icon component for tooltips and UI
 */

import React from 'react';
import { renderZodiacSymbol } from '../ZodiacSymbols';

export interface ZodiacSymbolIconProps {
  symbol: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  asInlineSVG?: boolean;
}

const SIZE_CONFIGS = {
  small: {
    containerClass: 'w-4 h-4',
    svgWidth: 16,
    svgHeight: 16,
    viewBox: '0 0 16 16',
    transform: 'translate(10, 12) scale(0.4) translate(-10, -10)'
  },
  medium: {
    containerClass: 'w-5 h-5',
    svgWidth: 20,
    svgHeight: 20,
    viewBox: '0 0 20 20',
    transform: 'translate(12, 14) scale(0.5) translate(-10, -10)'
  },
  large: {
    containerClass: 'w-6 h-6',
    svgWidth: 24,
    svgHeight: 24,
    viewBox: '0 0 24 24',
    transform: 'translate(14, 16) scale(0.6) translate(-10, -10)'
  }
};

export const ZodiacSymbolIcon: React.FC<ZodiacSymbolIconProps> = ({ 
  symbol, 
  size = 'medium', 
  className = '',
  asInlineSVG = false
}) => {
  const config = SIZE_CONFIGS[size];
  
  // For inline SVG usage (inside another SVG element)
  if (asInlineSVG) {
    return (
      <g transform={config.transform}>
        {renderZodiacSymbol(symbol)}
      </g>
    );
  }
  
  // For regular DOM usage
  return (
    <div className={`${config.containerClass} flex items-center justify-center ${className}`}>
      <svg 
        width={config.svgWidth} 
        height={config.svgHeight} 
        viewBox={config.viewBox}
      >
        <g transform={config.transform}>
          {renderZodiacSymbol(symbol)}
        </g>
      </svg>
    </div>
  );
};

export default ZodiacSymbolIcon;