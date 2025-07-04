/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import VertexCorners from '@/components/ui/VertexCorners';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading: boolean;
  isActive: boolean;
  progressWidth: number;
  onNavigate: (href: string) => void;
  onHoverSound?: () => void;
}

const NavigationLink = React.memo(({
  href,
  children,
  className = "",
  onClick,
  isLoading,
  isActive,
  progressWidth,
  onNavigate,
  onHoverSound
}: NavigationLinkProps) => {
  const handleClick = () => {
    if (onClick) onClick();
    onNavigate(href);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={onHoverSound}
      disabled={isLoading}
      className={`relative overflow-hidden group ${className} ${
        isActive
          ? 'bg-black text-white font-medium'
          : isLoading 
            ? 'bg-transparent text-black cursor-wait' 
            : 'text-black font-medium transition-colors duration-200'
      } font-space-grotesk text-sm xl:text-base px-3 py-1`}
    >
      {/* Vertex borders on hover - only show when not active and not loading */}
      <VertexCorners show={!isActive && !isLoading} />

      {/* Progress bar */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-black transition-all duration-200 ease-out"
          style={{ width: `${progressWidth}%` }}
        />
      )}
      
      {/* Text with inverted color effect */}
      <span className="relative z-10">
        {isLoading ? (
          <span className="relative">
            {/* Background text (normal color) */}
            <span className="text-black">{children}</span>
            {/* Inverted text (white) that gets revealed by progress bar */}
            <span 
              className="absolute inset-0 text-white overflow-hidden transition-all duration-200 ease-out"
              style={{ width: `${progressWidth}%` }}
            >
              {children}
            </span>
          </span>
        ) : (
          children
        )}
      </span>
    </button>
  );
});

NavigationLink.displayName = 'NavigationLink';

export default NavigationLink;