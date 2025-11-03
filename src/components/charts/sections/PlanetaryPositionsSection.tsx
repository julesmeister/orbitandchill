/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NatalChartData } from '../../../utils/natalChart';

interface PlanetaryPositionsSectionProps {
  chartData: NatalChartData;
}

const PlanetaryPositionsSection: React.FC<PlanetaryPositionsSectionProps> = ({ chartData }) => {
  if (!chartData?.planets) {
    return null;
  }

  const planetIcons: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
    // Additional celestial points
    lilith: '⚸',       // Black Moon Lilith
    northNode: '☊',    // North Node
    southNode: '☋',    // South Node
    partOfFortune: '⊕' // Part of Fortune
  };

  const planetDisplayNames: Record<string, string> = {
    sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
    jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
    lilith: 'Lilith', northNode: 'North Node', southNode: 'South Node',
    partOfFortune: 'Part of Fortune'
  };

  return (
    <div className="bg-white sm:border sm:border-black">
      <div className="flex items-center p-2 sm:p-6 sm:border-b sm:border-black">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h5 className="font-space-grotesk text-base sm:text-lg font-bold text-black">Planetary Positions & Points</h5>
      </div>
      <div className="p-1 sm:p-6">
        {/* Mobile: Single column card layout */}
        <div className="sm:hidden space-y-2">
          {chartData.planets.map((planet) => (
            <div key={planet.name} className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-base w-5 text-center">
                  {planetIcons[planet.name] || '●'}
                </span>
                <div>
                  <div className="flex items-center">
                    <span className="font-space-grotesk font-medium text-black text-sm">
                      {planetDisplayNames[planet.name] || planet.name}
                    </span>
                    {planet.retrograde && <span className="text-red-500 ml-1 text-xs">R</span>}
                  </div>
                  <div className="font-open-sans text-xs text-black/60">
                    {planet.sign ? planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1) : 'Unknown'} • House {planet.house}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 2-column grid layout */}
        <div className="hidden sm:grid grid-cols-2 gap-0 border border-black">
          {chartData.planets.map((planet, index) => {
            const isLastRow = index >= chartData.planets.length - 2;
            const needsBottomBorder = !isLastRow;
            
            return (
              <div key={planet.name} className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'border-r' : ''} ${needsBottomBorder ? 'border-b' : ''} border-black`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {planetIcons[planet.name] || '●'}
                  </span>
                  <div>
                    <span className="font-space-grotesk font-medium text-black">{planetDisplayNames[planet.name] || planet.name}</span>
                    {planet.retrograde && <span className="text-red-500 ml-1 text-xs">R</span>}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-space-grotesk font-medium capitalize text-black">{planet.sign || 'Unknown'}</div>
                  <div className="font-open-sans text-black/60">House {planet.house}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanetaryPositionsSection;