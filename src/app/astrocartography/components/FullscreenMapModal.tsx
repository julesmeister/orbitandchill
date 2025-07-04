/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import WorldMap from '../../../components/WorldMap';
import { PLANET_COLORS } from '../../../utils/astrocartographyLineRenderer';

interface FullscreenMapModalProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCountryClick: (countryId: string) => void;
  onMapClick: (lat: number, lng: number, countryInfo?: { countryId: string; countryName: string } | null) => void;
  astrocartographyLines: any[];
  parans: any[];
  onLineHover: (planet: string, lineType: string) => void;
  onLineHoverEnd: () => void;
  showReferencePoints: boolean;
  showParans: boolean;
  onToggleParans: () => void;
  onToggleReferencePoints: () => void;
  visiblePlanets: string[];
  onTogglePlanet: (planet: string) => void;
  isCalculating: boolean;
}

export default function FullscreenMapModal({
  isFullscreen,
  onToggleFullscreen,
  onCountryClick,
  onMapClick,
  astrocartographyLines,
  parans,
  onLineHover,
  onLineHoverEnd,
  showReferencePoints,
  showParans,
  onToggleParans,
  onToggleReferencePoints,
  visiblePlanets,
  onTogglePlanet,
  isCalculating
}: FullscreenMapModalProps) {
  if (!isFullscreen) return null;

  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="relative w-full h-full">
        <WorldMap
          onCountryClick={onCountryClick}
          onMapClick={onMapClick}
          className="w-full h-full"
          astrocartographyLines={astrocartographyLines}
          parans={parans}
          onLineHover={onLineHover}
          onLineHoverEnd={onLineHoverEnd}
          lineStyle={{ opacity: 0.8, strokeWidth: 2 }}
          showReferencePoints={showReferencePoints}
          showParans={showParans}
        />

        {/* Exit fullscreen button */}
        <button
          onClick={onToggleFullscreen}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fullscreen controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full p-1">
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
                Parans ({parans.length})
              </button>
            </div>
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full p-1">
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
                Grids
              </button>
            </div>
          </div>

          {/* Planet filters for fullscreen */}
          <div className="flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full p-2">
            {planets.map(planetName => {
              const planetColor = PLANET_COLORS[planetName] || '#6B7280';
              return (
                <button
                  key={planetName}
                  onClick={() => onTogglePlanet(planetName)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${visiblePlanets.includes(planetName)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: planetColor }}
                  />
                  {planetName.charAt(0).toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading overlay for fullscreen */}
        {isCalculating && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-slate-700">Calculating planetary lines...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}