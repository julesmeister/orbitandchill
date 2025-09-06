/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NatalChartData } from '../../../utils/natalChart';
import { getComprehensivePlanetaryInterpretation, getPlanetaryDignity } from '../../../utils/astrologicalInterpretations';

interface PlanetaryDignitiesSectionProps {
  chartData: NatalChartData;
  openModal: (title: string, subtitle: string, text: string, icon: string, iconColor: string) => void;
}

const PlanetaryDignitiesSection: React.FC<PlanetaryDignitiesSectionProps> = ({ 
  chartData, 
  openModal 
}) => {
  if (!chartData?.planets) {
    return null;
  }

  const dignityBadges: Record<string, { label: string; color: string; backgroundColor: string; icon: string }> = {
    rulership: { label: 'Ruler', color: 'text-black border-black', backgroundColor: '#4ade80', icon: '👑' },
    exaltation: { label: 'Exalted', color: 'text-black border-black', backgroundColor: '#f0e3ff', icon: '⚡' },
    detriment: { label: 'Detriment', color: 'text-black border-black', backgroundColor: '#fffbed', icon: '⚠️' },
    fall: { label: 'Fall', color: 'text-black border-black', backgroundColor: '#ff91e9', icon: '📉' }
  };

  const planetSymbols: Record<string, string> = {
    sun: '☉',
    moon: '☽',
    mercury: '☿',
    venus: '♀',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
    uranus: '♅',
    neptune: '♆',
    pluto: '♇',
    // Additional celestial points
    lilith: '⚸',
    chiron: '⚷',
    northNode: '☊',
    southNode: '☋',
    partOfFortune: '⊕'
  };

  const getDignityDescription = (dignity: string) => {
    switch(dignity) {
      case 'rulership': return 'Operating at full strength';
      case 'exaltation': return 'Enhanced and elevated';
      case 'detriment': return 'Facing challenges';
      case 'fall': return 'Requires conscious effort';
      default: return 'Balanced expression';
    }
  };

  return (
    <div className="bg-white sm:border sm:border-black">
      <div className="flex items-center p-3 sm:p-6 sm:border-b sm:border-black">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black flex items-center justify-center mr-2 sm:mr-3">
          <span className="text-white text-sm sm:text-lg">✨</span>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-space-grotesk text-base sm:text-lg font-bold text-black">Planetary Dignities & Debilities</h5>
          <p className="font-open-sans text-xs sm:text-sm text-black/60">How well each planet expresses its energy in its current sign</p>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden p-3 space-y-3">
        {chartData.planets.map((planet) => {
          const dignity = getPlanetaryDignity(planet.name, planet.sign);
          const dignityBadge = dignityBadges[dignity];

          return (
            <div key={planet.name} className="sm:border sm:border-black p-2 sm:p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{planetSymbols[planet.name] || '●'}</span>
                <span className="font-space-grotesk font-medium capitalize text-sm">{planet.name}</span>
                {planet.retrograde && <span className="text-red-500 text-xs font-bold">R</span>}
                <span className="font-open-sans text-xs text-black/60">in {planet.sign ? planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1) : 'Unknown'}</span>
              </div>
              
              <div className="mb-2">
                {dignity !== 'neutral' && dignityBadge ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border ${dignityBadge.color}`}
                    style={{ backgroundColor: dignityBadge.backgroundColor }}
                  >
                    <span>{dignityBadge.icon}</span>
                    <span>{dignityBadge.label}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white text-black border border-black">
                    <span>✓</span>
                    <span>Neutral</span>
                  </span>
                )}
              </div>
              
              <p className="font-open-sans text-xs text-black/80 mb-2">
                {getDignityDescription(dignity)}
              </p>
              
              <button
                onClick={() => {
                  const comprehensiveInterpretation = getComprehensivePlanetaryInterpretation(
                    planet.name,
                    planet.sign,
                    planet.house,
                    dignity
                  );

                  openModal(
                    `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} in ${planet.sign ? planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1) : 'Unknown'}`,
                    `${dignity !== 'neutral' && dignityBadge ? `${dignityBadge.icon} ${dignityBadge.label} • ` : ''}${planet.house}th House`,
                    comprehensiveInterpretation,
                    planetSymbols[planet.name] || '●',
                    'from-purple-400 to-pink-500'
                  );
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-black text-white border border-black hover:bg-gray-800 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View more
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-3 px-4 font-space-grotesk text-sm font-semibold text-black">Planet</th>
              <th className="text-left py-3 px-4 font-space-grotesk text-sm font-semibold text-black">Sign</th>
              <th className="text-left py-3 px-4 font-space-grotesk text-sm font-semibold text-black">Dignity Status</th>
              <th className="text-left py-3 px-4 font-space-grotesk text-sm font-semibold text-black">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {chartData.planets.map((planet) => {
              const dignity = getPlanetaryDignity(planet.name, planet.sign);
              const dignityBadge = dignityBadges[dignity];

              return (
                <tr key={planet.name} className="border-b border-black hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{planetSymbols[planet.name] || '●'}</span>
                      <span className="font-medium capitalize">{planet.name}</span>
                      {planet.retrograde && <span className="text-red-500 text-xs font-bold">R</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{planet.sign}</span>
                  </td>
                  <td className="py-3 px-4">
                    {dignity !== 'neutral' && dignityBadge ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border ${dignityBadge.color}`}
                        style={{ backgroundColor: dignityBadge.backgroundColor }}
                      >
                        <span>{dignityBadge.icon}</span>
                        <span>{dignityBadge.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white text-black border border-black">
                        <span>✓</span>
                        <span>Neutral</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        const comprehensiveInterpretation = getComprehensivePlanetaryInterpretation(
                          planet.name,
                          planet.sign,
                          planet.house,
                          dignity
                        );

                        openModal(
                          `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} in ${planet.sign ? planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1) : 'Unknown'}`,
                          `${dignity !== 'neutral' && dignityBadge ? `${dignityBadge.icon} ${dignityBadge.label} • ` : ''}${planet.house}th House`,
                          comprehensiveInterpretation,
                          planetSymbols[planet.name] || '●',
                          'from-purple-400 to-pink-500'
                        );
                      }}
                      className="text-sm text-slate-600 hover:text-slate-800 font-medium hover:underline"
                    >
                      {getDignityDescription(dignity)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-3 sm:p-4 bg-gray-50 border-t border-black">
        <h6 className="font-space-grotesk text-xs sm:text-sm font-semibold text-black mb-2 sm:mb-3">Understanding Planetary Dignities</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black flex-shrink-0"
              style={{ backgroundColor: '#4ade80' }}
            >
              <span>👑</span>
              <span>Ruler</span>
            </span>
            <p className="text-black/60 flex-1">Planet is in its home sign, expressing naturally and powerfully</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black flex-shrink-0"
              style={{ backgroundColor: '#f0e3ff' }}
            >
              <span>⚡</span>
              <span>Exalted</span>
            </span>
            <p className="text-black/60 flex-1">Planet&apos;s best qualities are enhanced and refined</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black flex-shrink-0"
              style={{ backgroundColor: '#fffbed' }}
            >
              <span>⚠️</span>
              <span>Detriment</span>
            </span>
            <p className="text-black/60 flex-1">Planet struggles to express its nature, requiring adaptation</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black flex-shrink-0"
              style={{ backgroundColor: '#ff91e9' }}
            >
              <span>📉</span>
              <span>Fall</span>
            </span>
            <p className="text-black/60 flex-1">Planet&apos;s energy is weakened, offering growth opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetaryDignitiesSection;