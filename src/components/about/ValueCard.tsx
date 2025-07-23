/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import IconBox from './IconBox';

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundColor: string;
  borderRight?: boolean;
}

export default function ValueCard({ 
  title, 
  description, 
  icon, 
  backgroundColor, 
  borderRight = false 
}: ValueCardProps) {
  return (
    <div 
      className={`text-center p-8 ${borderRight ? 'border-r border-black' : ''}`} 
      style={{ backgroundColor }}
    >
      <IconBox size="large" className="mx-auto mb-6">
        {icon}
      </IconBox>
      <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">{title}</h3>
      <p className="font-open-sans text-black/80">{description}</p>
    </div>
  );
}