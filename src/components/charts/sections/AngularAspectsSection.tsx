/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { angleAspectCombinations } from "@/utils/astrological/angleAspects";
import type { NatalChartData } from "@/types/astrology";

interface AngularAspectsSectionProps {
  chartData: NatalChartData;
  openModal?: (title: string, subtitle: string, text: string, icon: string, iconColor: string) => void;
  isFeaturePremium?: (feature: string) => boolean;
  userIsPremium?: boolean;
  shouldShowFeature?: (feature: string, isPremium: boolean) => boolean;
}

const AngularAspectsSection: React.FC<AngularAspectsSectionProps> = ({
  chartData,
  openModal
}) => {
  // Extract angle positions from chart data
  const ascendant = chartData.ascendant;
  const midheaven = chartData.midheaven;
  const descendant = (ascendant + 180) % 360;
  const ic = (midheaven + 180) % 360;

  // Find Vertex from planets array (it's calculated as a celestial point)
  const vertexPlanet = chartData.planets.find(p => p.name.toLowerCase() === 'vertex');
  const vertex = vertexPlanet?.longitude || 0;

  const angles = [
    { name: 'ascendant', label: 'Ascendant (AC)', longitude: ascendant, symbol: 'AC', description: 'Self-identity, persona' },
    { name: 'midheaven', label: 'Midheaven (MC)', longitude: midheaven, symbol: 'MC', description: 'Career, public image' },
    { name: 'descendant', label: 'Descendant (DC)', longitude: descendant, symbol: 'DC', description: 'Relationships, partnerships' },
    { name: 'ic', label: 'Imum Coeli (IC)', longitude: ic, symbol: 'IC', description: 'Home, roots, foundation' },
    { name: 'vertex', label: 'Vertex (Vx)', longitude: vertex, symbol: 'Vx', description: 'Fated encounters, destiny' }
  ];

  // Calculate aspects between planets and angles
  const calculateAngleAspects = () => {
    const aspects: Array<{
      planet: string;
      angle: string;
      angleLabel: string;
      aspect: string;
      orb: number;
      interpretation: string;
    }> = [];

    const planets = chartData.planets.filter(p =>
      ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
        .includes(p.name.toLowerCase())
    );

    const aspectTypes = [
      { name: 'conjunction', angle: 0, orb: 8 },
      { name: 'sextile', angle: 60, orb: 6 },
      { name: 'square', angle: 90, orb: 8 },
      { name: 'trine', angle: 120, orb: 8 },
      { name: 'opposition', angle: 180, orb: 8 },
      { name: 'quincunx', angle: 150, orb: 3 }
    ];

    planets.forEach(planet => {
      angles.forEach(angle => {
        aspectTypes.forEach(aspectType => {
          let diff = Math.abs(planet.longitude - angle.longitude);
          if (diff > 180) diff = 360 - diff;

          const orb = Math.abs(diff - aspectType.angle);

          if (orb <= aspectType.orb) {
            // Get interpretation from angleAspectCombinations
            const planetKey = planet.name.toLowerCase();
            const angleKey = angle.name.toLowerCase();
            const aspectKey = aspectType.name;

            const interpretation = angleAspectCombinations[planetKey]?.[angleKey]?.[aspectKey] ||
              `${planet.name} ${aspectType.name} ${angle.label}`;

            aspects.push({
              planet: planet.name,
              angle: angle.name,
              angleLabel: angle.label,
              aspect: aspectType.name,
              orb: Math.round(orb * 10) / 10,
              interpretation
            });
          }
        });
      });
    });

    return aspects.sort((a, b) => a.orb - b.orb);
  };

  const angularAspects = calculateAngleAspects();

  const getAspectColor = (aspect: string) => {
    const colors: Record<string, string> = {
      conjunction: 'bg-gray-900',
      sextile: 'bg-blue-600',
      square: 'bg-red-600',
      trine: 'bg-green-600',
      opposition: 'bg-purple-600',
      quincunx: 'bg-orange-600'
    };
    return colors[aspect] || 'bg-gray-600';
  };

  const formatPlanetName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatAspectName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="angular-aspects-section">
      <div className="bg-white border border-black mb-4">
        <div className="flex items-center p-4 border-b border-black">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">
              Angular Aspects
            </h3>
            <p className="font-open-sans text-sm text-black/60">
              Planets aspecting the angles (AC, MC, DC, IC, Vertex)
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {angularAspects.length === 0 ? (
            <p className="text-black/60 font-open-sans">No significant angular aspects found in your chart.</p>
          ) : (
            angularAspects.map((item, index) => (
              <div
                key={index}
                className="border border-black/20 hover:border-black transition-colors cursor-pointer"
                onClick={() => openModal?.(
                  `${formatPlanetName(item.planet)} ${formatAspectName(item.aspect)} ${item.angleLabel}`,
                  `Orb: ${item.orb}°`,
                  item.interpretation,
                  '✨',
                  'from-purple-400 to-blue-500'
                )}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`${getAspectColor(item.aspect)} text-white text-xs font-bold px-2 py-1 font-space-grotesk`}>
                        {formatAspectName(item.aspect)}
                      </span>
                      <span className="font-space-grotesk font-bold text-black">
                        {formatPlanetName(item.planet)} → {item.angleLabel}
                      </span>
                    </div>
                    <span className="text-xs text-black/40 font-open-sans">
                      {item.orb}° orb
                    </span>
                  </div>
                  <p className="font-open-sans text-sm text-black/80 line-clamp-2">
                    {item.interpretation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AngularAspectsSection);
