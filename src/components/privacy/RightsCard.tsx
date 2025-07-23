/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface RightsCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  borderClasses?: string;
}

export default function RightsCard({ 
  title, 
  description, 
  backgroundColor, 
  borderClasses = 'border border-black' 
}: RightsCardProps) {
  return (
    <div className={`p-6 ${borderClasses}`} style={{ backgroundColor }}>
      <h3 className="font-open-sans font-semibold text-black mb-2">{title}</h3>
      <p className="font-open-sans text-sm text-black/80">{description}</p>
    </div>
  );
}