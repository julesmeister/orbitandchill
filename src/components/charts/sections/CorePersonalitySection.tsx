/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { NatalChartData, formatAstrologicalDegree } from '../../../utils/natalChart';
import { getSignInterpretation, getRisingSignInterpretation, getComprehensivePlanetaryInterpretation, getPlanetaryDignity } from '../../../utils/astrologicalInterpretations';

interface CorePersonalitySectionProps {
  chartData: NatalChartData;
  openModal: (title: string, subtitle: string, text: string, icon: string, iconColor: string) => void;
  isFeaturePremium: (feature: string) => boolean;
  userIsPremium: boolean;
}

const CorePersonalitySection: React.FC<CorePersonalitySectionProps> = ({
  chartData,
  openModal,
  isFeaturePremium,
  userIsPremium
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

  const sunPlanet = chartData?.planets?.find(p => p.name === 'sun');
  const moonPlanet = chartData?.planets?.find(p => p.name === 'moon');
  const ascendantSign = chartData?.houses?.[0]?.sign;

  return (
    <div className="pb-6">
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
            </div>
            <div>
              <h5 className="font-space-grotesk text-xl font-bold text-black">
                Core Personality
              </h5>
              <p className="font-open-sans text-sm text-black/60">Your fundamental self-expression</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sun Sign */}
        {sunPlanet && (() => {
          const sunDignity = getPlanetaryDignity('sun', sunPlanet.sign);
          const dignityBadge = dignityBadges[sunDignity];

          return (
            <div className="bg-white sm:border sm:border-black p-3 sm:p-5" style={{ backgroundColor: '#f2e356' }}>
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-black flex items-center justify-center mr-3">
                  <span className="text-white text-sm">☉</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h6 className="font-space-grotesk text-md font-semibold text-black">Sun</h6>
                      {sunDignity !== 'neutral' && dignityBadge && (
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium border ${dignityBadge.color}`}
                          style={{ backgroundColor: dignityBadge.backgroundColor }}
                        >
                          <span className="text-xs">{dignityBadge.icon}</span>
                          <span>{dignityBadge.label}</span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const comprehensiveInterpretation = getComprehensivePlanetaryInterpretation(
                          'sun',
                          sunPlanet.sign,
                          sunPlanet.house,
                          sunDignity
                        );

                        openModal(
                          `Sun in ${sunPlanet.sign ? sunPlanet.sign.charAt(0).toUpperCase() + sunPlanet.sign.slice(1) : 'Unknown'}`,
                          `${sunPlanet.house}th House • Your Core Identity${sunDignity !== 'neutral' && dignityBadge ? ` • ${dignityBadge.icon} ${dignityBadge.label}` : ''}`,
                          comprehensiveInterpretation,
                          '☉',
                          'from-yellow-400 to-orange-500'
                        );
                      }}
                      className="group relative w-6 h-6 bg-black/10 hover:bg-black border border-black transition-all duration-300 flex items-center justify-center overflow-hidden"
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <FontAwesomeIcon 
                        icon={isFeaturePremium('detailed-modals') && !userIsPremium ? faLock : faEye} 
                        className="relative text-black group-hover:text-white text-xs group-hover:scale-110 transition-all duration-300" 
                      />
                    </button>
                  </div>
                  <p className="font-open-sans text-xs text-black/60">{sunPlanet.sign ? sunPlanet.sign.charAt(0).toUpperCase() + sunPlanet.sign.slice(1) : 'Unknown'} • House {sunPlanet.house}</p>
                </div>
              </div>
              <p className="font-open-sans text-sm text-black leading-relaxed">
                {getFirstSentence(getSignInterpretation(sunPlanet.sign, 'sun'))}
              </p>
            </div>
          );
        })()}

        {/* Moon Sign */}
        {moonPlanet && (() => {
          const moonDignity = getPlanetaryDignity('moon', moonPlanet.sign);
          const dignityBadge = dignityBadges[moonDignity];

          return (
            <div className="bg-white sm:border sm:border-black p-3 sm:p-5" style={{ backgroundColor: '#6bdbff' }}>
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-black flex items-center justify-center mr-3">
                  <span className="text-white text-sm">☽</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h6 className="font-space-grotesk text-md font-semibold text-black">Moon</h6>
                      {moonDignity !== 'neutral' && dignityBadge && (
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium border ${dignityBadge.color}`}
                          style={{ backgroundColor: dignityBadge.backgroundColor }}
                        >
                          <span className="text-xs">{dignityBadge.icon}</span>
                          <span>{dignityBadge.label}</span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const comprehensiveInterpretation = getComprehensivePlanetaryInterpretation(
                          'moon',
                          moonPlanet.sign,
                          moonPlanet.house,
                          moonDignity
                        );

                        openModal(
                          `Moon in ${moonPlanet.sign ? moonPlanet.sign.charAt(0).toUpperCase() + moonPlanet.sign.slice(1) : 'Unknown'}`,
                          `${moonPlanet.house}th House • Your Emotional Nature${moonDignity !== 'neutral' && dignityBadge ? ` • ${dignityBadge.icon} ${dignityBadge.label}` : ''}`,
                          comprehensiveInterpretation,
                          '☽',
                          'from-blue-400 to-indigo-500'
                        );
                      }}
                      className="group relative w-6 h-6 bg-black/10 hover:bg-black border border-black transition-all duration-300 flex items-center justify-center overflow-hidden"
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <FontAwesomeIcon icon={faEye} className="relative text-black group-hover:text-white text-xs group-hover:scale-110 transition-all duration-300" />
                    </button>
                  </div>
                  <p className="font-open-sans text-xs text-black/60">{moonPlanet.sign ? moonPlanet.sign.charAt(0).toUpperCase() + moonPlanet.sign.slice(1) : 'Unknown'} • House {moonPlanet.house}</p>
                </div>
              </div>
              <p className="font-open-sans text-sm text-black leading-relaxed">
                {getFirstSentence(getSignInterpretation(moonPlanet.sign, 'moon'))}
              </p>
            </div>
          );
        })()}

        {/* Rising Sign */}
        {ascendantSign && (
          <div className="bg-white sm:border sm:border-black p-3 sm:p-5" style={{ backgroundColor: '#ff91e9' }}>
            <div className="flex items-center mb-3">
              <div className="w-7 h-7 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-sm">↗</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h6 className="font-space-grotesk text-md font-semibold text-black">Rising</h6>
                  <button
                    onClick={() => openModal(
                      `${ascendantSign ? ascendantSign.charAt(0).toUpperCase() + ascendantSign.slice(1) : 'Unknown'} Rising`,
                      `${formatAstrologicalDegree(chartData.ascendant)} • Your Public Persona`,
                      getRisingSignInterpretation(ascendantSign),
                      '↗',
                      'from-pink-400 to-rose-500'
                    )}
                    className="group relative w-6 h-6 bg-black/10 hover:bg-black border border-black transition-all duration-300 flex items-center justify-center overflow-hidden"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <FontAwesomeIcon icon={faEye} className="relative text-black group-hover:text-white text-xs group-hover:scale-110 transition-all duration-300" />
                  </button>
                </div>
                <p className="font-open-sans text-xs text-black/60">{ascendantSign ? ascendantSign.charAt(0).toUpperCase() + ascendantSign.slice(1) : 'Unknown'} • {formatAstrologicalDegree(chartData.ascendant)}</p>
              </div>
            </div>
            <p className="font-open-sans text-sm text-black leading-relaxed">
              {getFirstSentence(getRisingSignInterpretation(ascendantSign))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorePersonalitySection;