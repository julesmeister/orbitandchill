/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import WorldMap from '../../../components/WorldMap';

interface AstrocartographyMapProps {
  onCountryClick: (countryId: string) => void;
  onMapClick: (lat: number, lng: number, countryInfo?: { countryId: string; countryName: string } | null) => void;
  astrocartographyLines: any[];
  parans: any[];
  onLineHover: (planet: string, lineType: string) => void;
  onLineHoverEnd: () => void;
  showReferencePoints: boolean;
  showParans: boolean;
  isCalculating: boolean;
}

export default function AstrocartographyMap({
  onCountryClick,
  onMapClick,
  astrocartographyLines,
  parans,
  onLineHover,
  onLineHoverEnd,
  showReferencePoints,
  showParans,
  isCalculating
}: AstrocartographyMapProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-t border-b border-slate-200">
      <div className="w-full relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <WorldMap
            onCountryClick={onCountryClick}
            onMapClick={onMapClick}
            className="w-full"
            astrocartographyLines={astrocartographyLines}
            parans={parans}
            onLineHover={onLineHover}
            onLineHoverEnd={onLineHoverEnd}
            lineStyle={{ opacity: 0.8, strokeWidth: 2 }}
            showReferencePoints={showReferencePoints}
            showParans={showParans}
          />
        </div>

        {/* Loading overlay for astrocartography calculations */}
        {isCalculating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-4 shadow-lg">
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