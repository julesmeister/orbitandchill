/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface QuickStartStepProps {
  stepNumber: number;
  title: string;
  description: string;
  className?: string;
}

export default function QuickStartStep({
  stepNumber,
  title,
  description,
  className = ''
}: QuickStartStepProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold font-space-grotesk text-white">{stepNumber}</span>
      </div>
      <h4 className="font-space-grotesk font-semibold text-black mb-2">{title}</h4>
      <p className="font-inter text-sm text-black/80">
        {description}
      </p>
    </div>
  );
}