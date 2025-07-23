/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface PrivacyFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  showRightBorder?: boolean;
  showBottomBorder?: boolean;
}

export default function PrivacyFeatureCard({ 
  title, 
  description, 
  icon, 
  showRightBorder = false,
  showBottomBorder = false 
}: PrivacyFeatureCardProps) {
  const borderClasses = [
    showRightBorder ? 'border-r' : '',
    showBottomBorder ? 'border-b' : '',
    'border-black'
  ].filter(Boolean).join(' ');

  return (
    <div className={`flex items-start space-x-3 p-6 bg-white ${borderClasses}`}>
      <div className="w-8 h-8 bg-black flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-open-sans font-semibold text-black">{title}</h3>
        <p className="font-open-sans text-sm text-black/70">{description}</p>
      </div>
    </div>
  );
}