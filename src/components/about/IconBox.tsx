/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface IconBoxProps {
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  small: 'w-6 h-6',
  medium: 'w-10 h-10',
  large: 'w-16 h-16',
};

export default function IconBox({ size = 'medium', children, className = '' }: IconBoxProps) {
  return (
    <div className={`${sizeClasses[size]} bg-black flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}