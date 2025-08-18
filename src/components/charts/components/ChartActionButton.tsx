/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react';
import { ChartActionButtonProps } from '../types';

const ChartActionButton = memo(function ChartActionButton({
  onClick,
  disabled = false,
  icon,
  title,
  subtitle,
  className = '',
  gradientDirection = 'right'
}: ChartActionButtonProps) {
  const gradientClass = gradientDirection === 'left' 
    ? 'bg-gradient-to-l from-transparent via-blue-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%]'
    : 'bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`${title} - ${subtitle}`}
      aria-describedby={disabled ? `${title.toLowerCase().replace(/\s+/g, '-')}-disabled` : undefined}
      className={`group relative p-4 transition-all duration-300 hover:bg-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${gradientClass} transition-transform duration-700`}></div>

      <div className="relative flex flex-col items-center text-center space-y-2">
        <div className="w-10 h-10 bg-black group-hover:bg-white transition-colors duration-300 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="font-space-grotesk font-semibold text-black group-hover:text-white text-sm transition-colors duration-300">
            {title}
          </div>
          <div className="font-open-sans text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">
            {subtitle}
          </div>
          {disabled && (
            <div id={`${title.toLowerCase().replace(/\s+/g, '-')}-disabled`} className="sr-only">
              This action is currently disabled. Please ensure all requirements are met.
            </div>
          )}
        </div>
      </div>
    </button>
  );
});

ChartActionButton.displayName = 'ChartActionButton';

export default ChartActionButton;