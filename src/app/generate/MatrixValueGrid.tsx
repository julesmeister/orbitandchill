/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import MatrixValueInput from './MatrixValueInput';

interface MatrixPosition {
  key: string;
  label: string;
  description: string;
}

interface MatrixValueGridProps {
  positions: MatrixPosition[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  size?: 'small' | 'medium' | 'large';
}

const MatrixValueGrid: React.FC<MatrixValueGridProps> = ({
  positions,
  values,
  onChange,
  columns,
  size = 'medium'
}) => {
  const { mobile, tablet, desktop } = columns;

  const getBorderClasses = (index: number) => {
    // Desktop borders (lg)
    const isLastColumnLg = (index + 1) % desktop === 0;
    const isInFirstRowLg = index < desktop;
    
    // Tablet borders (md) 
    const isLastColumnMd = (index + 1) % tablet === 0;
    const isInFirstRowMd = index < tablet;
    
    // Mobile borders
    const isLastColumnSm = (index + 1) % mobile === 0;
    
    // Calculate if we need row borders
    const needsRowBorderLg = Math.ceil(positions.length / desktop) > 1 && isInFirstRowLg;
    const needsRowBorderMd = Math.ceil(positions.length / tablet) > 1 && isInFirstRowMd;

    return [
      // Desktop column borders
      !isLastColumnLg ? 'lg:border-r border-black' : '',
      // Desktop row borders (only if multiple rows)
      needsRowBorderLg ? 'lg:border-b border-black' : '',
      // Tablet column borders  
      !isLastColumnMd ? 'md:border-r border-black' : '',
      // Tablet row borders (only if multiple rows)
      needsRowBorderMd ? 'md:border-b border-black' : '',
      // Mobile column borders
      !isLastColumnSm ? 'border-r border-black' : ''
    ].filter(Boolean).join(' ');
  };

  const getGridClasses = () => {
    const mobileClass = `grid-cols-${mobile}`;
    const tabletClass = `md:grid-cols-${tablet}`;
    const desktopClass = `lg:grid-cols-${desktop}`;
    return `grid gap-0 bg-white rounded-2xl overflow-hidden border border-black mb-8 ${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  return (
    <div className={getGridClasses()}>
      {positions.map((position, index) => (
        <MatrixValueInput
          key={position.key}
          label={position.label}
          description={position.description}
          value={values[position.key] || 1}
          onChange={(value) => onChange(position.key, value)}
          size={size}
          className={getBorderClasses(index)}
        />
      ))}
    </div>
  );
};

export default MatrixValueGrid;