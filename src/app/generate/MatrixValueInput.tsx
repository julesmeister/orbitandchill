/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface MatrixValueInputProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const MatrixValueInput: React.FC<MatrixValueInputProps> = ({
  label,
  description,
  value,
  onChange,
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: {
      container: 'p-4',
      input: 'w-16 px-2 py-1 text-sm',
      title: 'text-xs',
      description: 'text-xs mb-2'
    },
    medium: {
      container: 'p-6',
      input: 'w-20 px-3 py-2',
      title: 'text-sm',
      description: 'text-xs mb-3'
    },
    large: {
      container: 'p-8',
      input: 'w-24 px-4 py-3',
      title: 'text-base',
      description: 'text-sm mb-4'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`group hover:bg-gray-50 transition-all duration-300 relative ${classes.container} ${className}`}>
      <div className="text-center h-full flex flex-col">
        <h6 className={`font-space-grotesk font-bold text-black mb-1 ${classes.title}`}>
          {label}
        </h6>
        <p className={`text-black/70 leading-tight flex-1 ${classes.description}`}>
          {description}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className={`${classes.input} border border-black text-center font-bold bg-white focus:outline-none focus:bg-gray-50 transition-colors mx-auto`}
          style={{ borderRadius: '0' }}
        />
      </div>
    </div>
  );
};

export default MatrixValueInput;