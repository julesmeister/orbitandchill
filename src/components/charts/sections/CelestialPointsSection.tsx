/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NatalChartData } from '../../../utils/natalChart';
import { getSignInterpretation } from '../../../utils/astrologicalInterpretations';
import { capitalizeFirst } from '../../../utils/stringHelpers';

interface CelestialPointsSectionProps {
  chartData: NatalChartData;
}

const CelestialPointsSection: React.FC<CelestialPointsSectionProps> = ({ chartData }) => {
  
  if (!chartData?.planets) {
    return null;
  }

  // Filter to show only celestial points (not traditional planets)
  // Since isPlanet might be undefined, we need to filter by name instead
  const traditionalPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const celestialPoints = chartData.planets.filter(point => 
    point.name && !traditionalPlanets.includes(point.name.toLowerCase())
  );
  
  
  if (celestialPoints.length === 0) {
    return null;
  }

  const pointDescriptions: Record<string, { description: string; meaning: string }> = {
    lilith: {
      description: "Black Moon Lilith represents your shadow self, repressed desires, and hidden strengths.",
      meaning: "Shows where you need to embrace your authentic power and break free from societal expectations."
    },
    chiron: {
      description: "Chiron, the wounded healer, represents where you've been deeply wounded and where you can help others heal.",
      meaning: "Your greatest wound becomes your greatest strength and source of wisdom for helping others."
    },
    northNode: {
      description: "The North Node represents your soul's purpose and the qualities you're developing in this lifetime.",
      meaning: "This is your karmic direction - the path toward growth, fulfillment, and spiritual evolution."
    },
    southNode: {
      description: "The South Node represents past-life gifts and patterns you're moving away from.",
      meaning: "These are talents you already possess but shouldn't over-rely on - use them to support your North Node growth."
    },
    partOfFortune: {
      description: "The Part of Fortune shows where you can find joy, success, and material prosperity.",
      meaning: "This point reveals how to integrate your conscious will (Sun) with your emotional needs (Moon) through your identity (Ascendant)."
    }
  };

  const pointIcons: Record<string, string> = {
    lilith: '⚸',
    chiron: '⚷', 
    northNode: '☊',
    southNode: '☋',
    partOfFortune: '⊕'
  };

  const pointColors: Record<string, string> = {
    lilith: 'from-purple-500 to-purple-700',
    chiron: 'from-green-600 to-green-800',
    northNode: 'from-blue-500 to-blue-700',
    southNode: 'from-gray-500 to-gray-700',
    partOfFortune: 'from-yellow-500 to-amber-600'
  };

  const displayNames: Record<string, string> = {
    lilith: 'Black Moon Lilith',
    chiron: 'Chiron',
    northNode: 'North Node',
    southNode: 'South Node', 
    partOfFortune: 'Part of Fortune'
  };

  return (
    <div className="bg-white sm:border sm:border-black sm:border-b-0">
      <div className="flex items-center p-2 sm:p-6 sm:border-b sm:border-black">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-space-grotesk text-base sm:text-lg font-bold text-black">Celestial Points & Nodes</h5>
          <p className="font-open-sans text-xs sm:text-sm text-black/60">Important astrological points beyond the planets</p>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-4">
        {celestialPoints.map((point) => {
          const info = pointDescriptions[point.name];
          if (!info) return null;

          return (
            <div key={point.name} className="border border-gray-200 sm:border-black p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pointColors[point.name] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
                    <span className="text-white text-lg font-bold">
                      {pointIcons[point.name] || '●'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1">
                      <h6 className="font-space-grotesk font-bold text-base sm:text-lg text-black">
                        {displayNames[point.name] || point.name}
                        {point.retrograde && <span className="text-red-500 ml-2 text-sm">R</span>}
                      </h6>
                      <div className="font-open-sans text-sm text-black/70 mt-1">
                        {point.longitude.toFixed(1)}° {capitalizeFirst(point.sign)} • House {point.house}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <p className="font-open-sans text-sm text-black/80 leading-relaxed">
                      <strong>What it represents:</strong> {info.description}
                    </p>
                    <p className="font-open-sans text-sm text-black/70 leading-relaxed">
                      <strong>In your chart:</strong> {info.meaning}
                    </p>
                    
                    {/* Dynamic interpretation based on sign */}
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="font-open-sans text-sm text-blue-800 leading-relaxed">
                        <strong>{displayNames[point.name] || point.name} in {capitalizeFirst(point.sign)}:</strong>
                      </p>
                      <p className="font-open-sans text-xs text-blue-700 leading-relaxed mt-1">
                        {getSignInterpretation(point.sign, point.name)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <p className="font-open-sans text-xs sm:text-sm text-blue-800">
            <strong>💡 Note:</strong> These celestial points provide additional layers of meaning to your chart. 
            While not planets themselves, they represent important mathematical points and calculated positions 
            that reveal deeper insights about your spiritual path, healing journey, and life purpose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelestialPointsSection;