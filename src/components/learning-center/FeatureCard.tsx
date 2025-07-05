/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundColor: string;
  badge: {
    text: string;
    animated?: boolean;
  };
  instructions: string[];
  proTip: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  backgroundColor,
  badge,
  instructions,
  proTip,
  ctaText,
  ctaLink,
  className = ''
}: FeatureCardProps) {
  return (
    <div 
      className={`group p-10 transition-all duration-300 relative ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">{title}</h3>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white text-black text-xs font-semibold border border-black">
            <span className={`w-2 h-2 bg-black ${badge.animated ? 'animate-pulse' : ''}`}></span>
            <span>{badge.text}</span>
          </div>
        </div>
      </div>
      
      <p className="font-open-sans text-black/80 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="space-y-4 mb-6">
        <h4 className="font-space-grotesk font-semibold text-black">How to use:</h4>
        <ol className="space-y-3 font-open-sans text-black/80">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex">
              <span className="font-bold text-black mr-3">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white p-4 border border-black">
        <p className="font-open-sans text-sm text-black">
          <strong>💡 Pro tip:</strong> {proTip}
        </p>
      </div>

      <Link
        href={ctaLink}
        className="inline-flex items-center gap-2 mt-6 text-black font-semibold hover:gap-3 transition-all duration-300"
      >
        <span>{ctaText}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}