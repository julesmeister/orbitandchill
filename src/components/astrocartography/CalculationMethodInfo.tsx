/**
 * Calculation Method Information Component
 * 
 * Displays information about the astrocartography calculation method being used
 * and provides transparency about the technical approach.
 */

import React, { useState } from 'react';
import { CalculationMethod, CALCULATION_METHODS, getCalculationMethodExplanation } from '../../types/astrocartographyCalculation';

interface CalculationMethodInfoProps {
  currentMethod: CalculationMethod;
  className?: string;
}

export default function CalculationMethodInfo({ 
  currentMethod, 
  className = "" 
}: CalculationMethodInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const methodInfo = CALCULATION_METHODS[currentMethod];
  const explanation = getCalculationMethodExplanation(currentMethod);

  return (
    <div className={`rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              Calculation Method: {methodInfo.name}
            </h4>
            <p className="text-sm text-slate-600">
              {explanation.summary}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={isExpanded ? "Hide details" : "Show details"}
        >
          <svg 
            className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* User Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>What this means for you:</strong> {explanation.userNote}
            </p>
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Technical Approach</h5>
                <p className="text-sm text-slate-600">{explanation.technical}</p>
              </div>
              
              <div>
                <h5 className="font-medium text-slate-800 mb-2">When to Use</h5>
                <p className="text-sm text-slate-600">{methodInfo.whenToUse}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Advantages</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  {methodInfo.advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Considerations</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  {methodInfo.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Method Comparison */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h5 className="font-medium text-slate-800 mb-2">Method Comparison</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h6 className="font-medium text-slate-700 mb-1">Zodiacal Method</h6>
                <p className="text-slate-600">
                  Based on tropical zodiac signs. Aligns with traditional natal chart calculations.
                  Most commonly used in astrology software.
                </p>
              </div>
              <div>
                <h6 className="font-medium text-slate-700 mb-1">In Mundo Method</h6>
                <p className="text-slate-600">
                  Based on actual sky positions (RA/Dec). Astronomically precise but may differ 
                  slightly from zodiacal interpretations.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Note */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h6 className="font-medium text-emerald-800 mb-1">Professional Standard</h6>
                <p className="text-sm text-emerald-700">
                  Our system uses the same calculation method as professional astrology software
                  like Solar Fire and AstroMapPro. Lines are calculated with professional-grade
                  astronomy-engine library for maximum accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}