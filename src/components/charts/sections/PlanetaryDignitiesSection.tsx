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
    pluto: '♇'
  };

  return (
    <div className="bg-white border border-black">
      <div className="flex items-center p-6 border-b border-black">
        <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
          <span className="text-white text-lg">✨</span>
        </div>
        <div>
          <h5 className="font-space-grotesk text-lg font-bold text-black">Planetary Dignities & Debilities</h5>
          <p className="font-open-sans text-sm text-black/60">How well each planet expresses its energy in its current sign</p>
        </div>
      </div>

      <div className="overflow-x-auto">
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
                          `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} in ${planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}`,
                          `${dignity !== 'neutral' && dignityBadge ? `${dignityBadge.icon} ${dignityBadge.label} • ` : ''}${planet.house}th House`,
                          comprehensiveInterpretation,
                          planetSymbols[planet.name] || '●',
                          'from-purple-400 to-pink-500'
                        );
                      }}
                      className="text-sm text-slate-600 hover:text-slate-800 font-medium hover:underline"
                    >
                      {dignity === 'rulership' && 'Operating at full strength'}
                      {dignity === 'exaltation' && 'Enhanced and elevated'}
                      {dignity === 'detriment' && 'Facing challenges'}
                      {dignity === 'fall' && 'Requires conscious effort'}
                      {dignity === 'neutral' && 'Balanced expression'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 border-t border-black">
        <h6 className="font-space-grotesk text-sm font-semibold text-black mb-3">Understanding Planetary Dignities</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black"
              style={{ backgroundColor: '#4ade80' }}
            >
              <span>👑</span>
              <span>Ruler</span>
            </span>
            <p className="text-black/60 flex-1">Planet is in its home sign, expressing naturally and powerfully</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black"
              style={{ backgroundColor: '#f0e3ff' }}
            >
              <span>⚡</span>
              <span>Exalted</span>
            </span>
            <p className="text-black/60 flex-1">Planet&apos;s best qualities are enhanced and refined</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black"
              style={{ backgroundColor: '#fffbed' }}
            >
              <span>⚠️</span>
              <span>Detriment</span>
            </span>
            <p className="text-black/60 flex-1">Planet struggles to express its nature, requiring adaptation</p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-black text-black"
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