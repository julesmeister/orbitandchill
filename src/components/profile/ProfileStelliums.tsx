/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface DetailedStellium {
  type: 'sign' | 'house';
  sign?: string;
  house?: number;
  planets: { name: string; sign: string; house: number }[];
}

interface ProfileStelliumsProps {
  detailedStelliums?: DetailedStellium[];
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  sunSign?: string;
}

const ProfileStelliums: React.FC<ProfileStelliumsProps> = ({ detailedStelliums, stelliumSigns, stelliumHouses, sunSign }) => {
  const planetIcons: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };

  // Synapsas color system for zodiac signs
  const getSignColor = (sign: string) => {
    const signColors: Record<string, string> = {
      aries: '#ff91e9',     // Synapsas purple
      taurus: '#51bd94',    // Synapsas green  
      gemini: '#f2e356',    // Synapsas yellow
      cancer: '#6bdbff',    // Synapsas blue
      leo: '#ff91e9',       // Synapsas purple
      virgo: '#51bd94',     // Synapsas green
      libra: '#f2e356',     // Synapsas yellow
      scorpio: '#6bdbff',   // Synapsas blue
      sagittarius: '#ff91e9', // Synapsas purple
      capricorn: '#51bd94', // Synapsas green
      aquarius: '#f2e356',  // Synapsas yellow
      pisces: '#6bdbff'     // Synapsas blue
    };
    return signColors[sign.toLowerCase()] || '#f2e356';
  };

  // Synapsas color system for houses
  const getHouseColor = (num: number) => {
    const houseColorMap: Record<number, string> = {
      1: '#ff91e9', 2: '#51bd94', 3: '#f2e356', 4: '#6bdbff',
      5: '#ff91e9', 6: '#51bd94', 7: '#f2e356', 8: '#6bdbff',
      9: '#ff91e9', 10: '#51bd94', 11: '#f2e356', 12: '#6bdbff'
    };
    return houseColorMap[num] || '#f2e356';
  };

  const houseNames: Record<number, string> = {
    1: 'Self & Identity', 2: 'Values & Possessions', 3: 'Communication',
    4: 'Home & Family', 5: 'Creativity & Romance', 6: 'Work & Health',
    7: 'Partnerships', 8: 'Transformation', 9: 'Philosophy & Learning',
    10: 'Career & Reputation', 11: 'Friendships & Hopes', 12: 'Spirituality'
  };

  // Check if we have any astrological data to display
  const hasDetailedStelliums = detailedStelliums && detailedStelliums.length > 0;
  const hasSimpleStelliums = (stelliumSigns && stelliumSigns.length > 0) || (stelliumHouses && stelliumHouses.length > 0);
  
  if (!sunSign && !hasDetailedStelliums && !hasSimpleStelliums) {
    return (
      <div className="font-inter text-black/80">
        <p>Manage your account information and privacy settings</p>
      </div>
    );
  }

  return (
    <div className="font-inter text-black/80 space-y-3">
      {/* Sun Sign Display */}
      {sunSign && (
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-black flex items-center justify-center" style={{ backgroundColor: getSignColor(sunSign) }}>
            <span className="text-black text-sm font-bold">☉</span>
          </div>
          <div>
            <span className="font-space-grotesk text-sm font-bold text-black capitalize">{sunSign}</span>
            <span className="font-inter text-xs text-black/60 ml-2">Sun Sign</span>
          </div>
        </div>
      )}

      {/* Detailed Stelliums (preferred format) */}
      {hasDetailedStelliums && detailedStelliums!.map((stellium, index) => (
        <div 
          key={`${stellium.type}-${stellium.sign || stellium.house}-${index}`} 
          className="border border-black"
        >
          {/* Header with background color */}
          <div 
            className="p-3 border-b border-black"
            style={{ 
              backgroundColor: stellium.type === 'sign' 
                ? getSignColor(stellium.sign!) 
                : getHouseColor(stellium.house!)
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border border-black bg-white flex items-center justify-center">
                  <span className="text-black text-xs font-bold">
                    {stellium.type === 'sign' ? '★' : 'H'}
                  </span>
                </div>
                <div>
                  <div className="font-space-grotesk text-sm font-bold text-black">
                    {stellium.type === 'sign' 
                      ? `${stellium.sign?.charAt(0).toUpperCase()}${stellium.sign?.slice(1)} Stellium`
                      : `${stellium.house}th House Stellium`
                    }
                  </div>
                </div>
              </div>
              <div className="px-2 py-1 bg-black text-white border border-black">
                <span className="font-inter text-xs font-bold">{stellium.planets.length}</span>
              </div>
            </div>
            <div className="font-inter text-xs text-black/80 mt-1">
              {stellium.type === 'sign' ? `Multiple planets in ${stellium.sign}` : houseNames[stellium.house!]}
            </div>
          </div>

          {/* Planet Grid */}
          <div className="p-3 bg-white">
            <div className="grid grid-cols-3 gap-2">
              {stellium.planets.map((planet, planetIndex) => (
                <div key={`${planet.name}-${planetIndex}`} className="flex items-center space-x-2 p-2 border border-black">
                  <div className="w-4 h-4 bg-black text-white flex items-center justify-center">
                    <span className="text-xs">
                      {planetIcons[planet.name.toLowerCase()] || '●'}
                    </span>
                  </div>
                  <span className="font-inter text-xs font-medium text-black capitalize truncate">
                    {planet.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Fallback: Simple Stelliums with enhanced design */}
      {!hasDetailedStelliums && hasSimpleStelliums && (
        <div className="space-y-2">
          {stelliumSigns && stelliumSigns.length > 0 && (
            <div className="border border-black">
              <div className="p-2 bg-black">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white text-black flex items-center justify-center">
                    <span className="text-xs font-bold">★</span>
                  </span>
                  <span className="font-space-grotesk text-sm font-bold text-white">Sign Stelliums</span>
                </div>
              </div>
              <div className="p-3 bg-white">
                <div className="flex flex-wrap gap-2">
                  {stelliumSigns.map((sign) => (
                    <div key={sign} className="flex items-center space-x-1 p-1 border border-black" style={{ backgroundColor: getSignColor(sign) }}>
                      <span className="font-inter text-xs font-bold text-black capitalize">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {stelliumHouses && stelliumHouses.length > 0 && (
            <div className="border border-black">
              <div className="p-2 bg-black">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-white text-black flex items-center justify-center">
                    <span className="text-xs font-bold">H</span>
                  </span>
                  <span className="font-space-grotesk text-sm font-bold text-white">House Stelliums</span>
                </div>
              </div>
              <div className="p-3 bg-white">
                <div className="flex flex-wrap gap-2">
                  {stelliumHouses.map((house) => {
                    const houseNum = parseInt(house);
                    return (
                      <div key={house} className="flex items-center space-x-1 p-1 border border-black" style={{ backgroundColor: getHouseColor(houseNum) }}>
                        <span className="font-inter text-xs font-bold text-black">{house}th</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileStelliums;