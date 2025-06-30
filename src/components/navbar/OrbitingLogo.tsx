/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface OrbitingLogoProps {
  className?: string;
  size?: 'small' | 'normal';
}

export default function OrbitingLogo({ className = '', size = 'small' }: OrbitingLogoProps) {
  // Adjust sizes based on the size prop
  const isSmall = size === 'small';
  const containerSize = isSmall ? 'w-8 h-8' : 'w-12 h-12';
  const svgSize = isSmall ? { width: 32, height: 32 } : { width: 48, height: 48 };
  const viewBox = isSmall ? '0 0 64 64' : '0 0 96 96';
  const centerPoint = isSmall ? '32' : '48';
  const orbitRadius = isSmall ? '16' : '24';
  const moonSize = isSmall ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* Animated Orbit */}
      <div className={`relative ${containerSize}`}>
        <svg 
          viewBox={viewBox} 
          {...svgSize}
          className="absolute inset-0"
        >
          {/* Orbit Circle */}
          <circle 
            cx={centerPoint} 
            cy={centerPoint} 
            r={orbitRadius} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeDasharray="1,2"
            opacity="0.3"
          />
          
          {/* Orbiting Element */}
          <g transform={`matrix(0.866, -0.5, 0.25, 0.433, ${centerPoint}, ${centerPoint})`}>
            <path 
              d={isSmall ? 
                "M 0,20 A 16,20 0 0,0 16,0 2,2 0 0,1 20,0 20,20 0 0,1 0,20Z" : 
                "M 0,30 A 24,30 0 0,0 24,0 3,3 0 0,1 30,0 30,30 0 0,1 0,30Z"
              }
              fill="currentColor"
              opacity="0.6"
            >
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="360 0 0" 
                to="0 0 0" 
                dur={isSmall ? "8s" : "10s"}
                repeatCount="indefinite" 
              />
            </path>
          </g>
          
          {/* Static Orbit Path */}
          <path 
            d={isSmall ? "M 16,0 A 16,16 0 0,0 -16,0Z" : "M 24,0 A 24,24 0 0,0 -24,0Z"}
            transform={`matrix(0.866, -0.5, 0.5, 0.866, ${centerPoint}, ${centerPoint})`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>

        {/* Moon/Planet in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${moonSize} rounded-full flex items-center justify-center`}>
            <svg 
              className="w-full h-full" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="12" 
                cy="12" 
                r="8" 
                fill="currentColor"
                stroke="currentColor" 
                strokeWidth="0.5"
              />
              <circle 
                cx="14" 
                cy="10" 
                r="1.5" 
                fill="currentColor"
                opacity="0.3"
              />
              <circle 
                cx="10" 
                cy="14" 
                r="1" 
                fill="currentColor"
                opacity="0.3"
              />
              <circle 
                cx="16" 
                cy="15" 
                r="0.8" 
                fill="currentColor"
                opacity="0.2"
              />
              <circle 
                cx="8" 
                cy="10" 
                r="0.6" 
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}