/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { NatalChartData, formatAstrologicalDegree } from '../../../utils/natalChart';
import { getSignInterpretation, getComprehensivePlanetaryInterpretation, getPlanetaryDignity } from '../../../utils/astrologicalInterpretations';

interface PlanetaryInfluencesSectionProps {
  chartData: NatalChartData;
  openModal: (title: string, subtitle: string, text: string, icon: string, iconColor: string) => void;
}

const PlanetaryInfluencesSection: React.FC<PlanetaryInfluencesSectionProps> = ({
  chartData,
  openModal
}) => {
  const dignityBadges: Record<string, { label: string; color: string; backgroundColor: string; icon: string }> = {
    rulership: { label: 'Ruler', color: 'text-black border-black', backgroundColor: '#4ade80', icon: '👑' },
    exaltation: { label: 'Exalted', color: 'text-black border-black', backgroundColor: '#f0e3ff', icon: '⚡' },
    detriment: { label: 'Detriment', color: 'text-black border-black', backgroundColor: '#fffbed', icon: '⚠️' },
    fall: { label: 'Fall', color: 'text-black border-black', backgroundColor: '#ff91e9', icon: '📉' }
  };

  const getFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : text.substring(0, 80) + '...';
  };

  const planetIcons: Record<string, string> = {
    mercury: '☿',
    venus: '♀',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
    uranus: '♅',
    neptune: '♆',
    pluto: '♇'
  };

  const planetColors: Record<string, string> = {
    mercury: 'from-gray-400 to-slate-500',
    venus: 'from-green-400 to-emerald-500',
    mars: 'from-red-400 to-rose-500',
    jupiter: 'from-purple-400 to-violet-500',
    saturn: 'from-amber-400 to-yellow-500',
    uranus: 'from-cyan-400 to-blue-500',
    neptune: 'from-teal-400 to-cyan-500',
    pluto: 'from-indigo-400 to-purple-500'
  };

  return (
    <div className="pb-6">
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">🪐</span>
            </div>
            <div>
              <h5 className="font-space-grotesk text-xl font-bold text-black">
                Planetary Influences
              </h5>
              <p className="font-open-sans text-sm text-black/60">How different areas of life are expressed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {chartData.planets
          .filter(planet => !['sun', 'moon'].includes(planet.name))
          .map((planet) => {
            const dignity = getPlanetaryDignity(planet.name, planet.sign);

            return (
              <div key={planet.name} className="bg-white border border-black p-4">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-black flex items-center justify-center mr-3">
                    <span className="text-white text-sm">{planetIcons[planet.name] || '●'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h6 className="font-space-grotesk text-md font-semibold text-black capitalize">
                            {planet.name} in {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}
                            {planet.retrograde && <span className="text-red-500 ml-1 text-xs">R</span>}
                          </h6>
                          {dignity !== 'neutral' && dignityBadges[dignity] && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${dignityBadges[dignity].color}`}
                              style={{ backgroundColor: dignityBadges[dignity].backgroundColor }}
                            >
                              <span>{dignityBadges[dignity].icon}</span>
                              <span>{dignityBadges[dignity].label}</span>
                            </span>
                          )}
                        </div>
                        <p className="font-open-sans text-xs text-black/60">House {planet.house} • {formatAstrologicalDegree(planet.longitude)}</p>
                      </div>
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
                            `${planet.house}th House • ${formatAstrologicalDegree(planet.longitude)}${planet.retrograde ? ' (Retrograde)' : ''}${dignity !== 'neutral' ? ` • ${dignityBadges[dignity].icon} ${dignityBadges[dignity].label}` : ''}`,
                            comprehensiveInterpretation,
                            planetIcons[planet.name] || '●',
                            planetColors[planet.name] || 'from-slate-400 to-gray-500'
                          );
                        }}
                        className="group relative flex items-center gap-2 px-3 py-2 bg-black/10 hover:bg-black transition-all duration-300 border border-black overflow-hidden"
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                        <FontAwesomeIcon icon={faEye} className="relative text-black group-hover:text-white text-sm group-hover:scale-110 transition-all duration-300" />
                        <span className="relative text-black group-hover:text-white text-sm font-medium transition-colors duration-300">View more</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="font-open-sans text-sm text-black leading-relaxed">
                  {getFirstSentence(getSignInterpretation(planet.sign, planet.name))}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlanetaryInfluencesSection;