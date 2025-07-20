/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from 'react';
import { 
  AstrocartographyAnalysis, 
  formatCoordinates,
  LineProximityResult
} from '../../utils/astrocartographyDistanceCalculator';
import { getLocationDescription, cachedReverseGeocode, LocationInfo } from '../../utils/reverseGeocoding';
import { ParanProximity } from '../../utils/paranCalculations';
import { getAstrocartographyInterpretation } from '../../utils/astrocartographyInterpretations';

interface AstrocartographyAnalysisProps {
  analysis: AstrocartographyAnalysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
}

// Skeleton loading component - Sharp modern style
const SkeletonLine: React.FC<{ width?: string }> = ({ width = "w-full" }) => (
  <div className={`h-4 bg-gray-200 animate-pulse ${width}`}></div>
);

const AstrocartographyAnalysisComponent: React.FC<AstrocartographyAnalysisProps> = ({
  analysis,
  isAnalyzing,
  onClose
}) => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Load location info in background if not already available
  useEffect(() => {
    if (!analysis || analysis.locationInfo) {
      if (analysis?.locationInfo) {
        setLocationInfo(analysis.locationInfo);
      }
      return;
    }
    
    if (!loadingLocation) {
      setLoadingLocation(true);
      cachedReverseGeocode(analysis.clickedPoint.lat, analysis.clickedPoint.lng)
        .then(result => {
          setLocationInfo(result);
        })
        .catch(error => {
          console.error('Failed to load location info:', error);
        })
        .finally(() => {
          setLoadingLocation(false);
        });
    }
  }, [analysis?.locationInfo, analysis?.clickedPoint.lat, analysis?.clickedPoint.lng, loadingLocation]);
  
  if (!analysis) return null;

  const { clickedPoint, countryInfo, nearbyLines, crossings, parans } = analysis;
  const coordString = formatCoordinates(clickedPoint.lat, clickedPoint.lng);
  
  const locationDescription = getLocationDescription(clickedPoint.lat, clickedPoint.lng, locationInfo);
  
  // Use country info from SVG detection if available, otherwise fall back to reverse geocoding
  const displayCountry = countryInfo?.countryName || locationInfo?.country;
  const displayCity = locationInfo?.city;
  const displayState = locationInfo?.state;
  
  // Prioritize city over country for main display
  const displayLocation = displayCity 
    ? `${displayCity}${displayState && displayState !== displayCity ? `, ${displayState}` : ''}`
    : countryInfo?.countryName || locationDescription;


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden border-2 border-slate-900">
        {/* Compact header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3a4 4 0 01-4 4H5m0 0a4 4 0 01-4-4v-1h4v1z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight uppercase">
                  Astrocartography Analysis
                </h2>
                <div className="text-xs text-cyan-300 font-mono tracking-wider">
                  COORDINATE ANALYSIS
                </div>
              </div>
              {loadingLocation && (
                <div className="flex items-center gap-2 ml-4 mr-4">
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-r-transparent animate-spin"></div>
                  </div>
                  <span className="text-cyan-300 font-mono tracking-wider text-xs">PROCESSING</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="group relative px-3 py-1.5 bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-500 hover:border-slate-400"
            >
              <span className="text-xs font-mono text-white uppercase tracking-wider">CLOSE</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-70px)] bg-gray-50">
          {/* Location Header - Geometric Modern Design */}
          <div className="bg-white border-l-4 border-emerald-500 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold uppercase tracking-wider text-xs">Location Matrix</h3>
              </div>
            </div>
            <div className="px-4 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  {/* City Display */}
                  {displayCity ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500"></div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                          {displayCity}
                        </h3>
                      </div>
                      {displayState && displayState !== displayCity && (
                        <p className="text-base font-semibold text-slate-700 ml-4">
                          {displayState}
                        </p>
                      )}
                      {displayCountry && (
                        <p className="text-base text-slate-600 ml-4 uppercase tracking-wider font-medium">
                          {displayCountry}
                        </p>
                      )}
                    </div>
                  ) : loadingLocation ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gray-300"></div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900">
                            {countryInfo?.countryName || 'Analyzing...'}
                          </h3>
                          <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-r-transparent animate-spin"></div>
                        </div>
                      </div>
                      <div className="ml-4 space-y-2">
                        <SkeletonLine width="w-32" />
                        <SkeletonLine width="w-24" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gray-400"></div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {countryInfo?.countryName || locationDescription || 'Unknown Location'}
                      </h3>
                    </div>
                  )}

                  {/* Coordinate Information */}
                  <div className="bg-slate-50 border-l-2 border-slate-300 pl-3 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Coordinates</span>
                        <div className="h-px bg-slate-300 flex-1"></div>
                      </div>
                      <p className="font-mono text-base text-slate-800 tracking-wider">
                        {coordString}
                      </p>
                      {locationInfo?.formattedAddress && (
                        <p className="text-sm text-slate-600">
                          {locationInfo.formattedAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="bg-slate-100 p-3 border-l-2 border-slate-400">
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                      System Status
                    </div>
                    
                    {locationInfo ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500"></div>
                          <span className="text-xs font-medium text-slate-700">GEOCODING ACTIVE</span>
                        </div>
                        <div className="text-xs text-slate-500">OpenStreetMap</div>
                      </div>
                    ) : loadingLocation ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 animate-pulse"></div>
                          <span className="text-xs font-medium text-slate-700">PROCESSING</span>
                        </div>
                        <div className="text-xs text-slate-500">Reverse geocoding...</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500"></div>
                          <span className="text-xs font-medium text-slate-700">MAP DETECTION</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {countryInfo ? countryInfo.countryName : 'Coordinate-based'}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Power Lines */}
          {nearbyLines.length > 0 && (
            <div className="bg-white border-l-4 border-blue-500 shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-xs">Nearby Power Lines</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {nearbyLines.map((proximityResult, index) => {
                    const distance = proximityResult.distanceKm;
                    const getInfluenceStrength = (km: number) => {
                      if (km <= 50) return { label: 'STRONG', color: 'bg-red-500', textColor: 'text-red-700' };
                      if (km <= 150) return { label: 'MODERATE', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
                      return { label: 'WEAK', color: 'bg-gray-400', textColor: 'text-gray-600' };
                    };
                    const influence = getInfluenceStrength(distance);
                    
                    return (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 border-l-2 hover:bg-slate-100 transition-colors"
                        style={{ borderLeftColor: proximityResult.line.color }}
                      >
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 border-2 border-white shadow-sm"
                            style={{ backgroundColor: proximityResult.line.color }}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium uppercase tracking-wide text-sm text-slate-800">
                              {proximityResult.line.planet} / {proximityResult.line.lineType} LINE
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${influence.color}`}></div>
                              <span className={`text-xs font-medium uppercase tracking-wider ${influence.textColor}`}>
                                {influence.label} INFLUENCE
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-lg font-bold text-slate-800">
                            {Math.round(distance)}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">KM</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Parans (Latitude Crossings) */}
          {parans && parans.length > 0 && (
            <div className="bg-white border-l-4 border-purple-500 shadow-sm">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-xs">Parans (Crossings)</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {parans.map((paranProximity, index) => (
                    <div 
                      key={index}
                      className="bg-slate-50 border-l-4 p-3"
                      style={{ borderLeftColor: paranProximity.paran.color }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 border-2 border-white shadow-sm"
                            style={{ backgroundColor: paranProximity.paran.color }}
                          />
                          <span className="font-bold uppercase tracking-wide text-sm text-slate-800">
                            {paranProximity.paran.planet1} × {paranProximity.paran.planet2}
                          </span>
                          <span className="bg-slate-200 text-slate-700 px-2 py-1 text-xs font-mono uppercase">
                            {paranProximity.paran.crossingType}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg font-bold text-slate-800">
                            {Math.round(paranProximity.distanceFromLatitude)}
                            <span className="text-xs text-slate-500 ml-1">MI</span>
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">
                            {paranProximity.influenceStrength} influence
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-3 border-l-2 border-slate-300">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {paranProximity.paran.combinedEnergy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Line Crossings */}
          {crossings.length > 0 && (
            <div className="bg-white border-l-4 border-orange-500 shadow-sm">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12l4-4 4 4m0 6l-4-4-4 4" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-xs">Line Crossings</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {crossings.map((crossing, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 border-l-2 border-orange-300"
                    >
                      <div>
                        <span className="font-bold uppercase tracking-wide text-sm text-slate-800">
                          {crossing.planet1} × {crossing.planet2}
                        </span>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          {crossing.lineType1} × {crossing.lineType2}
                        </p>
                      </div>
                      <div className="font-mono text-lg font-bold text-slate-800">
                        {Math.round(crossing.distanceKm)}
                        <span className="text-xs text-slate-500 ml-1">KM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Astrological Interpretations */}
          {nearbyLines.length > 0 && (
            <div className="bg-white border-l-4 border-indigo-500 shadow-sm">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-xs">Astrological Influences</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {nearbyLines.slice(0, 2).map((proximityResult, index) => {
                    const distance = proximityResult.distanceKm;
                    const getInfluenceStrength = (km: number) => {
                      if (km <= 50) return { label: 'STRONG', color: 'bg-red-500', textColor: 'text-red-700' };
                      if (km <= 150) return { label: 'MODERATE', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
                      return { label: 'WEAK', color: 'bg-gray-400', textColor: 'text-gray-600' };
                    };
                    const influence = getInfluenceStrength(distance);
                    
                    return (
                      <div key={index} className="bg-slate-50 border-l-4 p-3" style={{ borderLeftColor: proximityResult.line.color }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <h4 className="font-bold uppercase tracking-wide text-slate-800">
                              {proximityResult.line.planet} / {proximityResult.line.lineType} Line
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${influence.color}`}></div>
                              <span className={`text-xs font-medium uppercase tracking-wider ${influence.textColor}`}>
                                {influence.label} INFLUENCE
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-sm text-slate-600">
                            {Math.round(distance)} KM
                          </span>
                        </div>
                        <div className="bg-white p-3 border-l-2 border-slate-300">
                          <p className="text-sm text-slate-700 leading-snug">
                            {getLineInterpretation(proximityResult.line.planet, proximityResult.line.lineType)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* No Significant Influences */}
          {nearbyLines.length === 0 && crossings.length === 0 && (!parans || parans.length === 0) && (
            <div className="bg-white border-l-4 border-gray-400 shadow-sm">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-2 uppercase tracking-wide">No Active Influences</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  No significant astrocartography influences detected within 300km of this location. This area appears to be neutral territory.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Get interpretation for a planetary line using the centralized interpretations
 */
function getLineInterpretation(planet: string, lineType: string): string {
  const interpretation = getAstrocartographyInterpretation(planet, lineType as 'MC' | 'IC' | 'AC' | 'DC');
  
  if (interpretation) {
    return interpretation.detailedDescription;
  }

  // Fallback for any missing interpretations
  return `The ${planet} ${lineType} line brings the energy of ${planet} through the lens of ${lineType === 'AC' ? 'personal identity' : lineType === 'DC' ? 'relationships' : lineType === 'MC' ? 'career and public life' : 'home and family'}.`;
}

export default AstrocartographyAnalysisComponent;