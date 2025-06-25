/**
 * Map Projection Validation Component
 * 
 * Displays validation results for the geographic zone-based coordinate correction system.
 * Shows accuracy measurements against reference points and correction performance.
 */

import React, { useMemo } from 'react';
import { validateCorrections, GEOGRAPHIC_ZONES } from '../utils/mapProjectionCorrections';

interface MapProjectionValidatorProps {
  showValidation?: boolean;
  className?: string;
}

export default function MapProjectionValidator({
  showValidation = false,
  className = ""
}: MapProjectionValidatorProps) {
  
  // Run validation against all reference points
  const validationResults = useMemo(() => {
    return validateCorrections();
  }, []);
  
  // Calculate overall accuracy statistics
  const accuracyStats = useMemo(() => {
    const errors = validationResults.map(result => result.error.distance);
    const averageError = errors.reduce((sum, error) => sum + error, 0) / errors.length;
    const maxError = Math.max(...errors);
    const minError = Math.min(...errors);
    const within10px = errors.filter(error => error <= 10).length;
    const within5px = errors.filter(error => error <= 5).length;
    
    return {
      averageError,
      maxError,
      minError,
      within10px,
      within5px,
      totalPoints: errors.length,
      accuracyPercentage: (within10px / errors.length) * 100
    };
  }, [validationResults]);
  
  if (!showValidation) {
    return null;
  }
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Map Projection Correction Validation
      </h3>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Average Error</div>
          <div className="text-xl font-bold text-blue-800">
            {accuracyStats.averageError.toFixed(1)}px
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Accuracy</div>
          <div className="text-xl font-bold text-green-800">
            {accuracyStats.accuracyPercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-green-600">within 10px</div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">Max Error</div>
          <div className="text-xl font-bold text-yellow-800">
            {accuracyStats.maxError.toFixed(1)}px
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Precision</div>
          <div className="text-xl font-bold text-purple-800">
            {accuracyStats.within5px}/{accuracyStats.totalPoints}
          </div>
          <div className="text-xs text-purple-600">within 5px</div>
        </div>
      </div>
      
      {/* Zone Performance */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-gray-700">Zone Performance</h4>
        <div className="grid gap-3">
          {GEOGRAPHIC_ZONES.map(zone => {
            const zoneResults = validationResults.filter(result => result.zone === zone.id);
            if (zoneResults.length === 0) return null;
            
            const zoneAvgError = zoneResults.reduce((sum, result) => sum + result.error.distance, 0) / zoneResults.length;
            const zoneAccuracy = (zoneResults.filter(result => result.error.distance <= 10).length / zoneResults.length) * 100;
            
            return (
              <div key={zone.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{zone.name}</div>
                  <div className="text-sm text-gray-600">
                    {zoneResults.length} reference point{zoneResults.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{zoneAvgError.toFixed(1)}px</div>
                  <div className="text-sm text-gray-600">{zoneAccuracy.toFixed(0)}% accurate</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Detailed Results Table */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-gray-700">Detailed Validation Results</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 font-medium text-gray-700">Reference Point</th>
                <th className="text-left p-2 font-medium text-gray-700">Zone</th>
                <th className="text-right p-2 font-medium text-gray-700">Error (px)</th>
                <th className="text-right p-2 font-medium text-gray-700">X Error</th>
                <th className="text-right p-2 font-medium text-gray-700">Y Error</th>
                <th className="text-center p-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {validationResults.map((result, index) => {
                const isAccurate = result.error.distance <= 10;
                const isPrecise = result.error.distance <= 5;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 font-medium text-gray-800">{result.referencePoint}</td>
                    <td className="p-2 text-gray-600 capitalize">{result.zone.replace('_', ' ')}</td>
                    <td className="p-2 text-right font-mono">
                      <span className={`${isPrecise ? 'text-green-600' : isAccurate ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.error.distance.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2 text-right font-mono text-gray-600">
                      {result.error.x > 0 ? '+' : ''}{result.error.x.toFixed(1)}
                    </td>
                    <td className="p-2 text-right font-mono text-gray-600">
                      {result.error.y > 0 ? '+' : ''}{result.error.y.toFixed(1)}
                    </td>
                    <td className="p-2 text-center">
                      {isPrecise ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Precise
                        </span>
                      ) : isAccurate ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Accurate
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Needs Fix
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Improvement Suggestions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-md font-semibold mb-2 text-blue-800">System Status</h4>
        <div className="text-sm text-blue-700">
          {accuracyStats.accuracyPercentage >= 90 ? (
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Excellent accuracy achieved! The coordinate correction system is performing well.
            </div>
          ) : accuracyStats.accuracyPercentage >= 70 ? (
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠</span>
              Good accuracy. Consider fine-tuning corrections for outlier points.
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠</span>
              Accuracy needs improvement. Review zone boundaries and correction factors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { MapProjectionValidator };