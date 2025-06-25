/**
 * Time Zone Warnings Component
 * 
 * Displays critical warnings about birth time accuracy and time zone handling
 * for astrocartography calculations. Educates users about the importance of
 * precise birth time data for accurate astrological lines.
 */

import React from 'react';

export interface TimeZoneWarning {
  level: 'info' | 'warning' | 'error';
  message: string;
}

interface TimeZoneWarningsProps {
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
  timeZone?: string;
  className?: string;
}

export default function TimeZoneWarnings({ 
  warnings, 
  confidence, 
  timeZone,
  className = "" 
}: TimeZoneWarningsProps) {
  if (warnings.length === 0 && confidence === 'high') {
    return null; // No warnings to display
  }

  const getConfidenceColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-red-700 bg-red-100 border-red-200';
    }
  };

  const getWarningLevel = (warning: string): 'info' | 'warning' | 'error' => {
    if (warning.includes('ERROR') || warning.includes('CRITICAL')) return 'error';
    if (warning.includes('WARNING') || warning.includes('verify') || warning.includes('low confidence')) return 'warning';
    return 'info';
  };

  const getWarningIcon = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      {/* Confidence Level Header */}
      <div className={`rounded-lg p-3 mb-3 border ${getConfidenceColor(confidence)}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {confidence === 'high' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : confidence === 'medium' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-semibold">
              Time Zone Confidence: {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
            </h4>
            {timeZone && (
              <p className="text-sm mt-1">Detected time zone: {timeZone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Individual Warnings - Only show critical errors */}
      {warnings.filter(warning => 
        warning.includes('ERROR') || 
        warning.includes('CRITICAL') || 
        warning.includes('low confidence')
      ).length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-slate-700 mb-2">Critical Issues:</h5>
          {warnings.filter(warning => 
            warning.includes('ERROR') || 
            warning.includes('CRITICAL') || 
            warning.includes('low confidence')
          ).map((warning, index) => {
            const level = getWarningLevel(warning);
            return (
              <div key={index} className={`flex items-start p-2 rounded-lg ${
                level === 'error' ? 'bg-red-50 border border-red-200' :
                level === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  {getWarningIcon(level)}
                </div>
                <div className={`text-sm ${
                  level === 'error' ? 'text-red-700' :
                  level === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {warning}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Professional Accuracy Note */}
      {confidence === 'low' && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <h5 className="font-medium text-slate-800 mb-2">Professional Accuracy Requirements</h5>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Birth time accurate to the minute (Ascendant changes ~1° every 4 minutes)</li>
            <li>• Time zone must account for historical DST and local variations</li>
            <li>• Source: Long-form birth certificate or hospital records preferred</li>
            <li>• Approximate times can shift astrocartography lines by hundreds of miles</li>
          </ul>
        </div>
      )}

      {/* Action Items */}
      {confidence !== 'high' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Recommended Actions</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Verify birth time from official birth certificate</li>
            <li>• Check if birth location observed DST on birth date</li>
            <li>• Consider consulting local historical time zone records</li>
            <li>• If birth time is approximate, interpret results with caution</li>
          </ul>
        </div>
      )}
    </div>
  );
}