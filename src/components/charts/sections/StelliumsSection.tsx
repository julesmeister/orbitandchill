/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from 'react';
import { NatalChartData } from '../../../utils/natalChart';
import { PLANET_MEANINGS, SIGN_MEANINGS, HOUSE_MEANINGS } from '../../../utils/astrocartographyInterpretations';

interface StelliumsSectionProps {
  chartData: NatalChartData;
}

type Stellium = {
  type: 'sign';
  sign: string;
  planets: NatalChartData['planets'];
} | {
  type: 'house';
  house: number;
  planets: NatalChartData['planets'];
};

const StelliumsSection: React.FC<StelliumsSectionProps> = ({ chartData }) => {
  // Stellium detection
  const stelliums = useMemo(() => {
    if (!chartData?.planets) {
      return { signStelliums: [], houseStelliums: [] };
    }

    const signGroups: Record<string, typeof chartData.planets> = {};
    const houseGroups: Record<string, typeof chartData.planets> = {};

    // Group planets by sign and house
    chartData.planets.forEach(planet => {
      if (!signGroups[planet.sign]) signGroups[planet.sign] = [];
      if (!houseGroups[planet.house]) houseGroups[planet.house] = [];
      
      signGroups[planet.sign].push(planet);
      houseGroups[planet.house].push(planet);
    });

    // Find stelliums (3+ planets in same sign/house)
    const signStelliums = Object.entries(signGroups)
      .filter(([_, planets]) => planets.length >= 3)
      .map(([sign, planets]) => ({ sign, planets, type: 'sign' as const }));

    const houseStelliums = Object.entries(houseGroups)
      .filter(([_, planets]) => planets.length >= 3)
      .map(([house, planets]) => ({ house: parseInt(house), planets, type: 'house' as const }));

    return { signStelliums, houseStelliums };
  }, [chartData]);

  const getStelliumInterpretation = (stellium: Stellium) => {
    if (stellium.type === 'sign') {
      const sign = stellium.sign;
      const planetNames = stellium.planets.map(p => p.name).join(', ');
      
      // Get the primary planet's essence for more dynamic interpretation
      const primaryPlanet = stellium.planets[0];
      const planetInfo = PLANET_MEANINGS[primaryPlanet.name as keyof typeof PLANET_MEANINGS];
      const planetKeywords = planetInfo?.keywords.slice(0, 3).join(', ') || 'concentrated energy';
      
      return `This powerful stellium concentrates ${stellium.planets.length} planets in ${sign.charAt(0).toUpperCase() + sign.slice(1)} (${planetNames}), amplifying themes of ${planetKeywords}. You have ${SIGN_MEANINGS[sign as keyof typeof SIGN_MEANINGS] || 'concentrated energy in this sign'}, making ${sign} a dominant force in your personality and life expression.`;
    } else {
      const house = stellium.house;
      const planetNames = stellium.planets.map(p => p.name).join(', ');
      
      // Get combined planetary themes
      const planetThemes = stellium.planets
        .map(p => PLANET_MEANINGS[p.name as keyof typeof PLANET_MEANINGS]?.keywords[0])
        .filter(Boolean)
        .slice(0, 3)
        .join(', ');
      
      return `This ${stellium.planets.length}-planet stellium in the ${house}th house (${planetNames}) creates intense focus on ${planetThemes}. You have ${HOUSE_MEANINGS[house as keyof typeof HOUSE_MEANINGS] || 'concentrated energy in this life area'}, indicating that these themes will be especially prominent throughout your life journey.`;
    }
  };

  if (!stelliums || !stelliums.signStelliums || !stelliums.houseStelliums || 
      (stelliums.signStelliums.length === 0 && stelliums.houseStelliums.length === 0)) {
    return null;
  }

  const planetIcons: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };

  const stelliumColors: Record<string, string> = {
    aries: '#ffc4c9', taurus: '#9ffdc6', gemini: '#ffa502', cancer: 'rgb(203, 206, 255)',
    leo: '#ffc2b7', virgo: '#b7ffce', libra: '#ff9ff3', scorpio: '#d2d3d4',
    sagittarius: '#d2d2ff', capricorn: '#d1d1d1', aquarius: '#66f5f5', pisces: '#ff9ff3'
  };

  const houseNames: Record<number, string> = {
    1: 'Self & Identity', 2: 'Values & Possessions', 3: 'Communication & Learning',
    4: 'Home & Family', 5: 'Creativity & Romance', 6: 'Work & Health',
    7: 'Partnerships & Marriage', 8: 'Transformation & Shared Resources',
    9: 'Philosophy & Higher Learning', 10: 'Career & Reputation',
    11: 'Friendships & Hopes', 12: 'Spirituality & Subconscious'
  };

  // Vibrant color scheme for different house types
  const getHouseColor = (num: number) => {
    if ([1, 4, 7, 10].includes(num)) {
      // Angular houses - Bright Red/Pink variations
      const colors = ['#ffb2cb', '#ff9ff3', '#ffa8cc', '#ffb3ba'];
      return colors[(num === 1 ? 0 : num === 4 ? 1 : num === 7 ? 2 : 3)];
    }
    if ([2, 5, 8, 11].includes(num)) {
      // Succedent houses - Bright Green/Cyan/Light Blue variations
      const colors = ['#beffd9', '#a3ffff', '#b6d0ff', '#7bed9f'];
      return colors[(num === 2 ? 0 : num === 5 ? 1 : num === 8 ? 2 : 3)];
    }
    // Cadent houses - Orange/Yellow variations
    const colors = ['#ffa502', '#ffeedf', '#ff917d', '#ffb142'];
    return colors[(num === 3 ? 0 : num === 6 ? 1 : num === 9 ? 2 : 3)];
  };

  return (
    <div className="pb-6">
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">🌟</span>
            </div>
            <div>
              <h5 className="font-space-grotesk text-xl font-bold text-black">
                Stelliums
              </h5>
              <p className="font-open-sans text-sm text-black/60">Concentrated planetary energy patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Sign Stelliums */}
        {stelliums?.signStelliums?.map((stellium) => (
          <div key={`sign-${stellium.sign}`} className="bg-white border border-black p-5" 
               style={{ backgroundColor: stelliumColors[stellium.sign] || '#f8f9fa' }}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🔥</span>
              </div>
              <div className="flex-1">
                <h6 className="font-space-grotesk text-lg font-bold text-black">
                  {stellium.sign.charAt(0).toUpperCase() + stellium.sign.slice(1)} Stellium
                </h6>
                <p className="font-open-sans text-sm text-black/70">
                  {stellium.planets.length} planets concentrated in {stellium.sign}
                </p>
              </div>
            </div>

            {/* Planet Icons */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-open-sans text-sm text-black/80 mr-2">Planets:</span>
              {stellium.planets.map(planet => (
                <div key={planet.name} className="flex items-center">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mr-1">
                    {planetIcons[planet.name] || '●'}
                  </span>
                  <span className="font-open-sans text-xs text-black/70 capitalize mr-2">
                    {planet.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-open-sans text-sm text-black leading-relaxed">
              {getStelliumInterpretation(stellium)}
            </p>
          </div>
        ))}

        {/* House Stelliums */}
        {stelliums?.houseStelliums?.map((stellium) => (
          <div key={`house-${stellium.house}`} className="bg-white border border-black p-5" 
               style={{ backgroundColor: getHouseColor(stellium.house) }}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🏠</span>
              </div>
              <div className="flex-1">
                <h6 className="font-space-grotesk text-lg font-bold text-black">
                  {stellium.house}th House Stellium
                </h6>
                <p className="font-open-sans text-sm text-black/70">
                  {stellium.planets.length} planets in {houseNames[stellium.house]}
                </p>
              </div>
            </div>

            {/* Planet Icons */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-open-sans text-sm text-black/80 mr-2">Planets:</span>
              {stellium.planets.map(planet => (
                <div key={planet.name} className="flex items-center">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mr-1">
                    {planetIcons[planet.name] || '●'}
                  </span>
                  <span className="font-open-sans text-xs text-black/70 capitalize mr-2">
                    {planet.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-open-sans text-sm text-black leading-relaxed">
              {getStelliumInterpretation(stellium)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StelliumsSection;