/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useRouter } from 'next/navigation';

interface ChartNotFoundProps {
  onNavigateHome?: () => void;
}

export default function ChartNotFound({ onNavigateHome }: ChartNotFoundProps) {
  const router = useRouter();

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="border border-black bg-white">
      <div className="p-12 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
          Chart Not Found
        </h2>

        {/* Description */}
        <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto mb-12">
          This chart link is invalid or no longer available. The chart may have been deleted or the link may be incorrect.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNavigateHome}
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
          >
            Create Your Own Chart
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}