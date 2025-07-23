/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface SectionButtonProps {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  hoverColor?: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'compact' | 'horizontal';
  className?: string;
  borderClasses?: string;
}

const SectionButton: React.FC<SectionButtonProps> = ({
  id,
  title,
  description,
  backgroundColor,
  hoverColor,
  icon,
  onClick,
  variant = 'compact',
  className = '',
  borderClasses = ''
}) => {
  if (variant === 'horizontal') {
    return (
      <button
        onClick={onClick}
        className={`flex-1 border border-black p-3 transition-all duration-300 flex items-center gap-3 hover:opacity-90 ${className}`}
        style={{ backgroundColor }}
      >
        <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="font-space-grotesk text-base font-bold text-black">{title}</h3>
          <p className="font-open-sans text-black/80 text-xs">{description}</p>
        </div>
      </button>
    );
  }

  // Compact variant (default)
  return (
    <button
      onClick={onClick}
      className={`group relative p-4 xl:p-3 2xl:p-8 transition-all duration-300 hover:bg-gray-50 ${borderClasses} ${className}`}
      style={{ backgroundColor }}
    >
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
      <div className="relative text-center">
        <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-black flex items-center justify-center mb-2 mx-auto">
          {icon}
        </div>
        <h3 className="font-space-grotesk text-sm lg:text-base xl:text-base 2xl:text-lg font-bold text-black mb-1">
          {title}
        </h3>
        <p className="font-open-sans text-black/80 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default SectionButton;