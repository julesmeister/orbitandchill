/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import VertexCorners from './VertexCorners';

interface VertexButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // VertexCorners props
  cornerSize?: 'w-1 h-1' | 'w-2 h-2' | 'w-3 h-3' | 'w-4 h-4';
  cornerThickness?: 'border' | 'border-2' | 'border-4';
  cornerColor?: string;
  cornerDuration?: 'duration-200' | 'duration-300' | 'duration-500';
  showCorners?: boolean;
}

/**
 * VertexButton - Button component with vertex corners hover animation
 * 
 * A reusable button component that includes the vertex corners animation.
 * Supports different variants, sizes, and full customization of corner appearance.
 * 
 * Examples:
 * ```tsx
 * // Basic button with default corners
 * <VertexButton onClick={handleClick}>
 *   Click Me
 * </VertexButton>
 * 
 * // Secondary button with larger corners
 * <VertexButton variant="secondary" cornerSize="w-3 h-3">
 *   Secondary Action
 * </VertexButton>
 * 
 * // Outline button with custom corner color
 * <VertexButton variant="outline" cornerColor="border-blue-500">
 *   Custom Corners
 * </VertexButton>
 * ```
 */
const VertexButton: React.FC<VertexButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  cornerSize = 'w-2 h-2',
  cornerThickness = 'border-2',
  cornerColor = 'border-black',
  cornerDuration = 'duration-300',
  showCorners = true
}) => {
  // Base classes for all buttons
  const baseClasses = 'relative overflow-hidden group font-inter font-medium transition-all duration-300 focus:outline-none';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-black text-white border-2 border-black hover:bg-gray-800',
    secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Disabled state classes
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabledClasses}
    ${className}
  `.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {/* Vertex corners - only show when not disabled */}
      <VertexCorners
        show={showCorners && !disabled}
        size={cornerSize}
        thickness={cornerThickness}
        color={cornerColor}
        duration={cornerDuration}
      />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default VertexButton;