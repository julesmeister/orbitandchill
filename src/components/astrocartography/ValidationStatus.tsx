/**
 * Validation Status Component
 * 
 * Displays professional validation status and accuracy metrics
 * for astrocartography calculations.
 */

import React, { useState } from 'react';
import { ValidationResult } from '../../utils/astrocartographyValidation';

interface ValidationStatusProps {
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  professionalNote: string;
  details: ValidationResult;
  className?: string;
}

export default function ValidationStatus({
  summary,
  confidence,
  professionalNote,
  details,
  className = ""
}: ValidationStatusProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getConfidenceColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-red-700 bg-red-100 border-red-200';
    }
  };

  const getAccuracyIcon = (accuracy: string) => {
    switch (accuracy) {
      case 'excellent':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'good':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'fair':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'poor':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.586-3.586l-6 6-2.586-2.586" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Professional Validation</h4>
            <p className="text-sm text-slate-600">{summary}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={showDetails ? "Hide validation details" : "Show validation details"}
        >
          <svg 
            className={`w-5 h-5 text-slate-500 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Confidence Level */}
      <div className={`rounded-lg p-3 mb-3 border ${getConfidenceColor(confidence)}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {getAccuracyIcon(details.overallAccuracy)}
          </div>
          <div>
            <h5 className="font-semibold">
              Accuracy: {details.overallAccuracy.charAt(0).toUpperCase() + details.overallAccuracy.slice(1)}
            </h5>
            <p className="text-sm mt-1">
              Validation confidence: {confidence}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Note */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
        <p className="text-sm text-blue-800">{professionalNote}</p>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="space-y-4">
          {/* Accuracy Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <h6 className="font-medium text-slate-800 mb-2">Validation Status</h6>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Overall Accuracy:</span>
                  <span className="font-medium">{details.overallAccuracy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Meets Professional Standards:</span>
                  <span className={`font-medium ${details.isAccurate ? 'text-green-600' : 'text-red-600'}`}>
                    {details.isAccurate ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discrepancies Found:</span>
                  <span className="font-medium">{details.discrepancies.length}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <h6 className="font-medium text-slate-800 mb-2">Technical Standards</h6>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Professional astronomy-engine calculations</li>
                <li>• Empirically calibrated map projections</li>
                <li>• Time zone accuracy validation</li>
                <li>• Reference point cross-validation</li>
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {details.recommendations.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h6 className="font-medium text-emerald-800 mb-2">Recommendations</h6>
              <ul className="text-sm text-emerald-700 space-y-1">
                {details.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discrepancies */}
          {details.discrepancies.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h6 className="font-medium text-yellow-800 mb-2">Validation Discrepancies</h6>
              <div className="space-y-2">
                {details.discrepancies.map((disc, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    <div className="font-medium">{disc.referenceName}</div>
                    <div>Error: {disc.distanceError.toFixed(1)} miles ({disc.severity})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Comparison */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h6 className="font-medium text-slate-800 mb-2">Professional Software Comparison</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-slate-700">Our System</div>
                <div className="text-slate-600">
                  Astronomy-engine + calibrated projections
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Solar Fire</div>
                <div className="text-slate-600">
                  Industry standard for professional astrologers
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-700">AstroMapPro</div>
                <div className="text-slate-600">
                  Specialized astrocartography software
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Our calculations use the same astronomical foundations as professional software
              with additional empirical calibration for maximum accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}