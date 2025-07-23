/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import IconBox from './IconBox';

interface FeatureItemProps {
  title: string;
  description: string;
}

export default function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <IconBox size="small" className="mt-1">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </IconBox>
      <div>
        <h4 className="font-open-sans font-semibold text-black">{title}</h4>
        <p className="font-open-sans text-sm text-black/80">{description}</p>
      </div>
    </div>
  );
}