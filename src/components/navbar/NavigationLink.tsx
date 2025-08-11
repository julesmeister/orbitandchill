/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
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
  const handleClick = (e: React.MouseEvent) => {
    // Only prevent default and use custom navigation for left clicks
    // Allow right-click, middle-click, and cmd/ctrl+click to work normally
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      if (onClick) onClick();
      onNavigate(href);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onMouseEnter={onHoverSound}
      className={`relative overflow-hidden group inline-block ${className} ${
        isActive
          ? 'bg-black text-white font-medium'
          : isLoading 
            ? 'bg-transparent text-black cursor-wait pointer-events-none' 
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
    </Link>
  );
});

NavigationLink.displayName = 'NavigationLink';

export default NavigationLink;