/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from 'next/navigation';
import { Person } from '../../../types/people';

interface AstrocartographyHeaderProps {
  currentPerson: Person | null;
  hasAstroData: boolean;
  isCalculating: boolean;
  visibleLineTypes: {
    MC: boolean;
    IC: boolean;
    AC: boolean;
    DC: boolean;
  };
  onToggleLineType: (lineType: 'MC' | 'IC' | 'AC' | 'DC') => void;
}

export default function AstrocartographyHeader({
  currentPerson,
  hasAstroData,
  isCalculating,
  visibleLineTypes,
  onToggleLineType
}: AstrocartographyHeaderProps) {
  const router = useRouter();

  return (
    <div className="px-6 md:px-12 lg:px-20 py-8">
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Astrocartography Explorer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how your birth chart energy shifts across different locations around the world.
            Click on any country to explore potential influences.
          </p>

          {/* Line Type Filters in Header */}
          {(hasAstroData || isCalculating) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm font-medium text-slate-700 mr-2">Line Types:</span>
              {Object.entries(visibleLineTypes).map(([lineType, isVisible]) => (
                <button
                  key={lineType}
                  onClick={() => onToggleLineType(lineType as 'MC' | 'IC' | 'AC' | 'DC')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isVisible
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  {lineType} {lineType === 'MC' ? '(Career)' : lineType === 'IC' ? '(Home)' : lineType === 'AC' ? '(Identity)' : '(Relationships)'}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => router.push('/chart')}
                className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">
                  {currentPerson ? 'Back to Chart' : 'Go to Chart and Pick a Person to Analyze'}
                </span>
              </button>
              {currentPerson && (
                <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-slate-700">
                    Viewing chart for: {currentPerson.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}