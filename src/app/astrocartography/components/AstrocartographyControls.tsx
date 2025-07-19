/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PLANET_COLORS } from '../../../utils/astrocartographyLineRenderer';

interface AstrocartographyControlsProps {
  hasAstroData: boolean;
  isCalculating: boolean;
  visiblePlanets: string[];
  astrocartographyLines: any[];
  astroError: string | null;
  onTogglePlanet: (planet: string) => void;
  showParans: boolean;
  onToggleParans: () => void;
  showReferencePoints: boolean;
  onToggleReferencePoints: () => void;
  onToggleFullscreen: () => void;
  parans?: any[];
}

export default function AstrocartographyControls({
  hasAstroData,
  isCalculating,
  visiblePlanets,
  astrocartographyLines,
  astroError,
  onTogglePlanet,
  showParans,
  onToggleParans,
  showReferencePoints,
  onToggleReferencePoints,
  onToggleFullscreen,
  parans
}: AstrocartographyControlsProps) {
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

  return (
    <>
      {/* Map Controls */}
      <div className="px-6 md:px-12 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Interactive World Map</h2>
            <p className="text-slate-600">Click on any country to explore astrological influences</p>
          </div>
          <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
            <button
              onClick={onToggleParans}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showParans
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              Parans
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${showParans ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                {parans?.length || 0}
              </span>
            </button>
          </div>
          <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
            <button
              onClick={onToggleReferencePoints}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${showReferencePoints
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Grid
            </button>
          </div>
          <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full p-1">
            <button
              onClick={onToggleFullscreen}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Planet Controls */}
      {(hasAstroData || isCalculating) && (
        <div className="px-6 md:px-12 lg:px-20 py-4 bg-white/70 backdrop-blur-sm border-t border-slate-200">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-700 mr-2">Toggle Planets:</span>
                {planets.map(planetName => {
                  const planetColor = PLANET_COLORS[planetName] || '#6B7280';
                  return (
                    <button
                      key={planetName}
                      onClick={() => onTogglePlanet(planetName)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${visiblePlanets.includes(planetName)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: planetColor }}
                      />
                      {planetName.charAt(0).toUpperCase() + planetName.slice(1)}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                {astroError ? (
                  <span className="text-red-600">Error calculating lines</span>
                ) : hasAstroData ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{astrocartographyLines.length} lines calculated</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>No birth data available</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}