"use client";

import { useEffect, useState } from 'react';

interface AnimatedZodiacCardProps {
  image?: string;
  category?: string;
  className?: string;
  size?: 'small' | 'normal';
  showParticles?: boolean;
}

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)',
  'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
];

const getZodiacForCategory = (category: string): string => {
  // Map categories to zodiac signs
  const categoryMap: { [key: string]: string } = {
    'Beginner Guides': 'aries',
    'Planetary Movements': 'leo',
    'Chart Interpretation': 'virgo',
    'Planetary Insights': 'scorpio',
    'Lunar Astrology': 'cancer',
    'Relationship Astrology': 'libra',
    'General': 'gemini'
  };
  
  return categoryMap[category] || zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
};

const getGradientForCategory = (category: string): string => {
  // Consistent gradient based on category
  const hash = category.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return gradients[Math.abs(hash) % gradients.length];
};

export default function AnimatedZodiacCard({ image, category = 'General', className = '', size = 'normal', showParticles = true }: AnimatedZodiacCardProps) {
  const [zodiacSign, setZodiacSign] = useState<string>('');
  const [gradient, setGradient] = useState<string>('');

  useEffect(() => {
    setZodiacSign(getZodiacForCategory(category));
    setGradient(getGradientForCategory(category));
  }, [category]);

  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img 
          src={image} 
          alt="Article image" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Adjust sizes based on the size prop
  const isSmall = size === 'small';
  const containerSize = isSmall ? 'w-12 h-12' : 'w-32 h-32';
  const svgSize = isSmall ? 'width="48" height="48"' : 'width="128" height="128"';
  const viewBox = isSmall ? '0 0 80 80' : '0 0 160 160';
  const centerPoint = isSmall ? '40' : '80';
  const orbitRadius = isSmall ? '20' : '50';
  const zodiacContainerSize = isSmall ? 'w-4 h-4' : 'w-12 h-12';
  const zodiacIconSize = isSmall ? 'w-3 h-3' : 'w-8 h-8';
  const particleCount = isSmall ? 4 : 6;

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: gradient }}
    >
      {/* Animated Orbit */}
      <div className={`relative ${containerSize}`}>
        <svg 
          viewBox={viewBox} 
          {...(isSmall ? { width: 48, height: 48 } : { width: 128, height: 128 })}
          className="absolute inset-0"
        >
          {/* Orbit Circle */}
          <circle 
            cx={centerPoint} 
            cy={centerPoint} 
            r={orbitRadius} 
            fill="none" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="1"
            strokeDasharray="2,4"
          />
          
          {/* Orbiting Element */}
          <g transform={`matrix(0.866, -0.5, 0.25, 0.433, ${centerPoint}, ${centerPoint})`}>
            <path 
              d={isSmall ? 
                "M 0,24 A 20,24 0 0,0 20,0 2,2 0 0,1 24,0 24,24 0 0,1 0,24Z" : 
                "M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z"
              }
              fill="rgba(255,255,255,0.6)"
            >
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="360 0 0" 
                to="0 0 0" 
                dur={isSmall ? "6s" : "8s"}
                repeatCount="indefinite" 
              />
            </path>
          </g>
          
          {/* Static Orbit Path */}
          <path 
            d={isSmall ? "M 20,0 A 20,20 0 0,0 -20,0Z" : "M 50,0 A 50,50 0 0,0 -50,0Z"}
            transform={`matrix(0.866, -0.5, 0.5, 0.866, ${centerPoint}, ${centerPoint})`}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </svg>

        {/* Moon in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${zodiacContainerSize} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30`}>
            <svg 
              className={zodiacIconSize} 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="12" 
                cy="12" 
                r="8" 
                fill="white"
                stroke="white" 
                strokeWidth="0.5"
              />
              <circle 
                cx="14" 
                cy="10" 
                r="1.5" 
                fill="rgba(0,0,0,0.2)"
              />
              <circle 
                cx="10" 
                cy="14" 
                r="1" 
                fill="rgba(0,0,0,0.2)"
              />
              <circle 
                cx="16" 
                cy="15" 
                r="0.8" 
                fill="rgba(0,0,0,0.15)"
              />
              <circle 
                cx="8" 
                cy="10" 
                r="0.6" 
                fill="rgba(0,0,0,0.15)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 8)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + (i * 0.3)}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}