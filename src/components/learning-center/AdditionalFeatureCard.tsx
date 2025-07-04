/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';

interface AdditionalFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export default function AdditionalFeatureCard({
  title,
  description,
  icon,
  ctaText,
  ctaLink,
  className = ''
}: AdditionalFeatureCardProps) {
  return (
    <div className={`group p-8 hover:bg-gray-50 transition-all duration-300 relative ${className}`}>
      <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300" style={{ backgroundColor: '#19181a' }}></div>
      <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-space-grotesk font-semibold text-black mb-2">{title}</h4>
      <p className="font-inter text-sm text-black/80 mb-4">
        {description}
      </p>
      <Link href={ctaLink} className="font-inter text-black font-semibold hover:text-gray-700 text-sm transition-colors">
        {ctaText} →
      </Link>
    </div>
  );
}