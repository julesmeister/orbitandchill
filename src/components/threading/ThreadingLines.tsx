import React from 'react';

export interface ThreadingLinesProps {
  isNested: boolean;
  isLastChild: boolean;
  hasMoreSiblings: boolean;
}

export const ThreadingLines: React.FC<ThreadingLinesProps> = ({
  isNested,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLastChild,
  hasMoreSiblings,
}) => {
  if (!isNested) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Main SVG for the threading lines */}
      <svg 
        className="absolute"
        style={{
          left: '-32px',
          top: '-10px',
          width: '32px',
          height: hasMoreSiblings ? 'calc(100% + 32px)' : '42px',
        }}
      >
        {/* Continuous vertical line */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2={hasMoreSiblings ? "100%" : "24"}
          stroke="#000000"
          strokeWidth="1.5"
        />
        
        {/* Curved transition connecting to dot */}
        <path
          d="M 1 24 Q 1 32 8 32 L 26 32"
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      
      {/* Connection dot positioned at end of curve */}
      <div 
        className="absolute"
        style={{
          left: '-6px',
          top: '16px',
          width: '10px',
          height: '10px',
          backgroundColor: '#6366f1',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
};

export default ThreadingLines;