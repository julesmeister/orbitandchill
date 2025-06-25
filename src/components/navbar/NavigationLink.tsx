/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading: boolean;
  isActive: boolean;
  progressWidth: number;
  onNavigate: (href: string) => void;
}

const NavigationLink = React.memo(({
  href,
  children,
  className = "",
  onClick,
  isLoading,
  isActive,
  progressWidth,
  onNavigate
}: NavigationLinkProps) => {
  const handleClick = () => {
    if (onClick) onClick();
    onNavigate(href);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`relative overflow-hidden ${className} ${
        isActive
          ? 'bg-black text-white font-medium'
          : isLoading 
            ? 'bg-transparent text-black cursor-wait' 
            : 'text-black font-medium hover:bg-black hover:text-white transition-colors duration-200'
      } font-inter text-sm xl:text-base px-3 py-1`}
    >
      {/* Progress bar */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-black transition-all duration-75 ease-out"
          style={{ width: `${progressWidth}%` }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </button>
  );
});

NavigationLink.displayName = 'NavigationLink';

export default NavigationLink;