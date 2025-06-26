/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface VertexCornersProps {
  /**
   * Whether to show the corner animation
   * @default true
   */
  show?: boolean;
  
  /**
   * Size of the corners in Tailwind units
   * @default 'w-2 h-2' (8px)
   */
  size?: 'w-1 h-1' | 'w-2 h-2' | 'w-3 h-3' | 'w-4 h-4';
  
  /**
   * Border thickness
   * @default 'border-2' (2px)
   */
  thickness?: 'border' | 'border-2' | 'border-4';
  
  /**
   * Border color
   * @default 'border-black'
   */
  color?: string;
  
  /**
   * Animation duration
   * @default 'duration-300'
   */
  duration?: 'duration-200' | 'duration-300' | 'duration-500';
  
  /**
   * Custom className for the container
   */
  className?: string;
}

/**
 * VertexCorners - Reusable vertex corners hover animation component
 * 
 * Creates four L-shaped corner borders that appear on hover with smooth opacity transition.
 * Designed to be used within buttons or interactive elements with `group` class.
 * 
 * Usage:
 * ```tsx
 * <button className="relative group overflow-hidden">
 *   <VertexCorners />
 *   <span className="relative z-10">Button Text</span>
 * </button>
 * ```
 */
const VertexCorners: React.FC<VertexCornersProps> = ({
  show = true,
  size = 'w-2 h-2',
  thickness = 'border-2',
  color = 'border-black',
  duration = 'duration-300',
  className = ''
}) => {
  if (!show) return null;

  const containerClasses = `absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${duration} pointer-events-none ${className}`;

  return (
    <div className={containerClasses}>
      {/* Top-left corner */}
      <span className={`absolute top-0 left-0 ${size} border-t-2 border-l-2 ${color}`}></span>
      
      {/* Top-right corner */}
      <span className={`absolute top-0 right-0 ${size} border-t-2 border-r-2 ${color}`}></span>
      
      {/* Bottom-left corner */}
      <span className={`absolute bottom-0 left-0 ${size} border-b-2 border-l-2 ${color}`}></span>
      
      {/* Bottom-right corner */}
      <span className={`absolute bottom-0 right-0 ${size} border-b-2 border-r-2 ${color}`}></span>
    </div>
  );
};

export default VertexCorners;