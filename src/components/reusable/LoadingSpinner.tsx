/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

type LoadingVariant = 'dots' | 'pulse';
type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  title?: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'dots',
  size = 'md',
  title,
  subtitle,
  className = '',
  centered = true,
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      dots: 'w-2 h-2',
      pulse: 'h-6 w-6',
      title: 'text-lg',
      subtitle: 'text-sm',
    },
    md: {
      container: 'py-16',
      dots: 'w-3 h-3',
      pulse: 'h-12 w-12',
      title: 'text-2xl',
      subtitle: 'text-base',
    },
    lg: {
      container: 'py-24',
      dots: 'w-4 h-4',
      pulse: 'h-16 w-16',
      title: 'text-3xl',
      subtitle: 'text-lg',
    },
  };

  const renderDots = () => (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <div 
        className={`${sizeClasses[size].dots} bg-black animate-bounce [animation-delay:-0.3s]`}
      ></div>
      <div 
        className={`${sizeClasses[size].dots} bg-black animate-bounce [animation-delay:-0.15s]`}
      ></div>
      <div 
        className={`${sizeClasses[size].dots} bg-black animate-bounce`}
      ></div>
    </div>
  );

  const renderPulse = () => (
    <div className="mb-4">
      <div 
        className={`${sizeClasses[size].pulse} bg-gray-300 animate-pulse rounded-full mx-auto`}
      ></div>
    </div>
  );

  const renderAnimation = () => {
    switch (variant) {
      case 'pulse':
        return renderPulse();
      case 'dots':
      default:
        return renderDots();
    }
  };

  const containerClasses = `
    ${centered ? 'text-center' : ''}
    ${sizeClasses[size].container}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {renderAnimation()}
      
      {title && (
        <h2 className={`font-space-grotesk font-bold text-black mb-2 ${sizeClasses[size].title}`}>
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className={`text-black/70 font-open-sans ${sizeClasses[size].subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;