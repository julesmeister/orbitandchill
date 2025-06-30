/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { HoraryQuestion } from '@/store/horaryStore';
import { 
  calculateAccidentalDignity,
  analyzeLunarConditions,
  getAccidentalDignityDescription,
  compareAccidentalStrengths,
  contextualAccidentalInterpretation,
  getHousePlacement,
  getHouseStrength,
  PLANETARY_JOYS,
  PLANETARY_SPEEDS,
  FIXED_STARS
} from '@/utils/horary/accidentalDignityInterpretations';
import {
  getStrengthStyle,
  CONDITION_COLORS,
  CONFIDENCE_COLORS,
  LUNAR_COLORS,
  INFO_BOX_COLORS,
  ASPECT_TYPE_COLORS,
  getAspectTypeStyle,
  getStrengthAssessmentStyle
} from '@/utils/horary/colorConfigurations';
import {
  ColoredBox,
  Badge,
  StatCard,
  InfoBox,
  SectionHeader,
  TabConfig
} from '@/components/horary/common/HoraryComponents';

interface AccidentalDignityTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function AccidentalDignityTab({ chartData, analysisData, question }: AccidentalDignityTabProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'houses' | 'motion' | 'solar' | 'lunar' | 'context'>('overview');
  
  // Extract actual planetary positions from chart data
  const getPlanetaryPositions = () => {
    const positions: { [key: string]: { sign: string; longitude: number; house: number; dailyMotion: number; retrograde: boolean } } = {};
    
    if (!chartData || !chartData.planets || !chartData.houses) {
      return positions;
    }

    // Helper to get sign from longitude
    const getSignFromLongitude = (longitude: number): string => {
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = Math.floor(longitude / 30);
      return signs[signIndex] || 'Unknown';
    };

    // Helper to get house from longitude
    const getHouseFromLongitude = (longitude: number): number => {
      if (!chartData.houses || chartData.houses.length === 0) return 1;
      
      for (let i = 0; i < chartData.houses.length; i++) {
        const currentHouse = chartData.houses[i]?.cusp || (i * 30);
        const nextHouse = chartData.houses[(i + 1) % 12]?.cusp || ((i + 1) * 30);
        
        if (currentHouse <= nextHouse) {
          if (longitude >= currentHouse && longitude < nextHouse) {
            return i + 1;
          }
        } else {
          // Handle wraparound at 360°
          if (longitude >= currentHouse || longitude < nextHouse) {
            return i + 1;
          }
        }
      }
      return 1; // Default to first house
    };

    // Process planets - handle both array and object formats
    if (Array.isArray(chartData.planets)) {
      chartData.planets.forEach((planet: any) => {
        if (planet.name && planet.longitude !== undefined) {
          const capitalizedName = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
          positions[capitalizedName] = {
            sign: getSignFromLongitude(planet.longitude),
            longitude: planet.longitude,
            house: planet.house || getHouseFromLongitude(planet.longitude),
            dailyMotion: planet.dailyMotion || planet.speed || 1, // Use speed if available
            retrograde: planet.retrograde || false
          };
        }
      });
    } else if (typeof chartData.planets === 'object') {
      Object.entries(chartData.planets).forEach(([name, data]) => {
        let longitude: number | undefined;
        let house: number | undefined;
        let retrograde = false;
        let dailyMotion = 1;
        
        if (data && typeof data === 'object') {
          longitude = (data as any).longitude;
          house = (data as any).house;
          retrograde = (data as any).retrograde || false;
          dailyMotion = (data as any).dailyMotion || (data as any).speed || 1;
        } else if (typeof data === 'number') {
          // If data is just a longitude number
          longitude = data;
        }
        
        if (longitude !== undefined) {
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          positions[capitalizedName] = {
            sign: getSignFromLongitude(longitude),
            longitude: longitude,
            house: house || getHouseFromLongitude(longitude),
            dailyMotion: dailyMotion,
            retrograde: retrograde
          };
        }
      });
    }

    return positions;
  };

  // Extract actual house cusps from chart data
  const getHouseCusps = () => {
    const cusps: { [key: number]: { longitude: number; sign: string } } = {};
    
    if (!chartData || !chartData.houses) {
      return cusps;
    }

    chartData.houses.forEach((house: any, index: number) => {
      if (house && house.cusp !== undefined) {
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const signIndex = Math.floor(house.cusp / 30);
        cusps[index + 1] = {
          longitude: house.cusp,
          sign: signs[signIndex] || 'Unknown'
        };
      }
    });

    return cusps;
  };

  const planetaryPositions = getPlanetaryPositions();
  const houseCusps = getHouseCusps();

  // Calculate accidental dignities for all planets
  const planetaryAccidentalDignities = Object.entries(planetaryPositions).map(([planet, pos]) => {
    const houseCusp = houseCusps[pos.house];
    const sunData = planetaryPositions.Sun || { longitude: 0, sign: 'Aries' };
    return calculateAccidentalDignity(
      planet,
      pos.house,
      pos.longitude,
      pos.sign,
      pos.dailyMotion,
      pos.retrograde,
      sunData.longitude,
      sunData.sign,
      houseCusp.longitude,
      houseCusp.sign,
      question.question
    );
  });

  // Sort by accidental strength
  const sortedDignities = compareAccidentalStrengths(planetaryAccidentalDignities);

  // Lunar conditions
  const moonData = planetaryPositions.Moon || { longitude: 0, sign: 'Cancer' };
  const sunData = planetaryPositions.Sun || { longitude: 0, sign: 'Aries' };
  const lunarConditions = analyzeLunarConditions(
    moonData.longitude,
    sunData.longitude,
    moonData.sign,
    15, // Mock next aspect distance
    'Venus' // Mock next aspect planet
  );


  const AccidentalDignityCard = ({ dignity, rank }: { dignity: any; rank: number }) => {
    const strengthInfo = getAccidentalDignityDescription(dignity.overallAssessment);
    const contextual = contextualAccidentalInterpretation(dignity, question.question);

    return (
      <div 
        className={`border border-black p-4 cursor-pointer transition-all duration-200 ${
          selectedPlanet === dignity.planet ? `${getAspectTypeStyle('neutral').badge.replace('border-black', 'border-2')}` : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setSelectedPlanet(dignity.planet)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="font-space-grotesk font-bold text-lg mr-2">{dignity.planet}</span>
            <span className="text-sm text-gray-600">#{rank}</span>
          </div>
          <span 
            className="text-xs px-2 py-1 border border-black"
            style={getStrengthAssessmentStyle(strengthInfo.label)}
          >
            {strengthInfo.label}
          </span>
        </div>
        
        <div className="text-sm mb-2">
          <span className="font-bold">House {dignity.house}</span> ({dignity.housePlacement})
        </div>
        
        <div className="text-xs text-gray-700 mb-2">
          Power Score: {dignity.strengthScore} | {dignity.houseStrength} position
        </div>
        
        <div className="space-y-1">
          {dignity.joy && (
            <Badge 
              label="Joy" 
              backgroundColor={getAspectTypeStyle('harmonious').background} 
              textColor={getAspectTypeStyle('harmonious').text} 
            />
          )}
          {dignity.combustion.cazimi && (
            <Badge 
              label="Cazimi" 
              backgroundColor={getAspectTypeStyle('high').background} 
              textColor={getAspectTypeStyle('high').text} 
            />
          )}
          {dignity.combustion.combust && !dignity.combustion.cazimi && (
            <Badge 
              label="Combust" 
              backgroundColor={getAspectTypeStyle('challenging').background} 
              textColor={getAspectTypeStyle('challenging').text} 
            />
          )}
          {dignity.speed === 'fast' && (
            <Badge 
              label="Fast" 
              backgroundColor={getAspectTypeStyle('medium').background} 
              textColor={getAspectTypeStyle('medium').text} 
            />
          )}
          {dignity.speed === 'slow' && (
            <Badge 
              label="Slow" 
              backgroundColor={getAspectTypeStyle('low').background} 
              textColor={getAspectTypeStyle('low').text} 
            />
          )}
          {dignity.retrograde && (
            <Badge 
              label="Retrograde" 
              backgroundColor={getAspectTypeStyle('neutral').background} 
              textColor={getAspectTypeStyle('neutral').text} 
            />
          )}
        </div>
        
        {contextual.relevantFactors.length > 0 && (
          <div className="text-xs mt-1" style={{ color: getAspectTypeStyle('medium').text }}>
            ⚠ Context relevant
          </div>
        )}
      </div>
    );
  };

  const PlanetDetailPanel = ({ planet }: { planet: string }) => {
    const dignity = planetaryAccidentalDignities.find(d => d.planet === planet);
    if (!dignity) return null;

    const strengthInfo = getAccidentalDignityDescription(dignity.overallAssessment);
    const contextual = contextualAccidentalInterpretation(dignity, question.question);

    return (
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="font-space-grotesk font-bold text-2xl mr-4">{planet}</h3>
            <div 
              className="px-3 py-1 border border-black"
              style={getStrengthAssessmentStyle(strengthInfo.label)}
            >
              {strengthInfo.label}
            </div>
          </div>
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">House & Position</h4>
            <div className="space-y-2 text-sm">
              <div><strong>House:</strong> {dignity.house} ({dignity.housePlacement})</div>
              <div><strong>House Strength:</strong> {dignity.houseStrength}</div>
              <div><strong>Distance from Cusp:</strong> {dignity.distanceFromCusp.toFixed(1)}°</div>
              <div><strong>Same Sign as Cusp:</strong> {dignity.sameSignAsCusp ? 'Yes' : 'No (insulated)'}</div>
              <div><strong>Power Score:</strong> {dignity.strengthScore}</div>
            </div>
            
            <h4 className="font-space-grotesk font-bold mb-3 mt-6">Motion & Speed</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Speed:</strong> {dignity.speed} ({dignity.speedValue.toFixed(3)}°/day)</div>
              <div><strong>Retrograde:</strong> {dignity.retrograde ? 'Yes' : 'No'}</div>
              {dignity.station && <div><strong>Station:</strong> {dignity.station}</div>}
            </div>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Special Conditions</h4>
            
            {dignity.joy && (
              <InfoBox 
                title="Planetary Joy"
                content="Planet feels at home in this house"
                backgroundColor={CONDITION_COLORS.joy}
                textColor="white"
                className="mb-3"
              />
            )}
            
            {dignity.combustion.cazimi && (
              <InfoBox 
                title="Cazimi"
                content="In heart of Sun - invincible royal power"
                backgroundColor={CONDITION_COLORS.cazimi}
                textColor="black"
                className="mb-3"
              />
            )}
            
            {dignity.combustion.combust && !dignity.combustion.cazimi && (
              <InfoBox 
                title="Combust"
                content={`Within ${dignity.combustion.distance.toFixed(1)}° of Sun - severely afflicted`}
                backgroundColor={CONDITION_COLORS.combust}
                textColor="white"
                className="mb-3"
              />
            )}
            
            {dignity.combustion.underSunbeams && (
              <InfoBox 
                title="Under Sunbeams"
                content="Weakened by solar proximity"
                backgroundColor={CONDITION_COLORS.underSunbeams}
                textColor="white"
                className="mb-3"
              />
            )}
            
            {(dignity.fixedStars.regulus || dignity.fixedStars.spica || dignity.fixedStars.algol) && (
              <InfoBox 
                title="Fixed Star Conjunction"
                content={
                  <div>
                    {dignity.fixedStars.regulus && 'Regulus - material success '}
                    {dignity.fixedStars.spica && 'Spica - general fortune '}
                    {dignity.fixedStars.algol && 'Algol - losing head '}
                  </div>
                }
                backgroundColor={CONDITION_COLORS.fixedStar}
                textColor="black"
                className="mb-3"
              />
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-space-grotesk font-bold mb-3">Contextual Analysis</h4>
          <ColoredBox 
            backgroundColor={getAspectTypeStyle('harmonious').text} 
            textColor="white" 
            className="p-4"
          >
            <div className="font-bold text-sm mb-2">For This Question:</div>
            <div className="text-sm">{contextual.interpretation}</div>
            <div className="text-xs mt-2">
              <Badge 
                label={`${contextual.confidence} confidence`}
                backgroundColor={
                  contextual.confidence === 'high' ? getAspectTypeStyle('high').background :
                  contextual.confidence === 'medium' ? getAspectTypeStyle('medium').background :
                  getAspectTypeStyle('low').background
                }
                textColor={
                  contextual.confidence === 'high' ? getAspectTypeStyle('high').text :
                  contextual.confidence === 'medium' ? getAspectTypeStyle('medium').text :
                  getAspectTypeStyle('low').text
                }
              />
            </div>
          </ColoredBox>
          
          {contextual.relevantFactors.length > 0 && (
            <InfoBox 
              title="Relevant Factors:"
              content={
                <ul className="text-sm space-y-1">
                  {contextual.relevantFactors.map((factor, index) => (
                    <li key={index}>• {factor}</li>
                  ))}
                </ul>
              }
              backgroundColor={getAspectTypeStyle('neutral').background}
              textColor={getAspectTypeStyle('neutral').text}
              className="mt-4"
            />
          )}
        </div>
      </div>
    );
  };

  const LunarConditionsPanel = () => (
    <div className="bg-white border border-black p-6">
      <h3 className="font-space-grotesk font-bold text-xl mb-4">Lunar Conditions</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-space-grotesk font-bold mb-3">Phase & Light</h4>
          <div className="space-y-3">
            <InfoBox 
              title={lunarConditions.phase}
              content={lunarConditions.phaseDescription}
              backgroundColor={LUNAR_COLORS.phase}
              textColor="white"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Light:</span>
              <span className="text-sm">{lunarConditions.light}%</span>
            </div>
            
            <div className="w-full bg-gray-200 border border-black h-4">
              <div 
                className="h-full border-r border-black transition-all duration-300"
                style={{ 
                  width: `${lunarConditions.light}%`,
                  backgroundColor: lunarConditions.increasing ? LUNAR_COLORS.increasing : LUNAR_COLORS.decreasing
                }}
              ></div>
            </div>
            
            <div className="text-xs text-center">
              {lunarConditions.increasing ? 'Increasing in Light' : 'Decreasing in Light'}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-space-grotesk font-bold mb-3">Special Conditions</h4>
          <div className="space-y-3">
            {lunarConditions.voidOfCourse && (
              <InfoBox 
                title="Void of Course"
                content='"Nothing will come of the matter"'
                backgroundColor={LUNAR_COLORS.voidOfCourse}
                textColor="white"
              />
            )}
            
            {lunarConditions.viaCombusta && (
              <InfoBox 
                title="Via Combusta"
                content="Emotional turbulence and distress"
                backgroundColor={LUNAR_COLORS.viaCombusta}
                textColor="white"
              />
            )}
            
            {lunarConditions.nextAspect && (
              <InfoBox 
                title="Next Aspect"
                content={`To ${lunarConditions.nextAspect} in ${lunarConditions.distanceToNextAspect.toFixed(1)}°`}
                backgroundColor="#f2e356"
                textColor="black"
              />
            )}
          </div>
        </div>
      </div>
      
      <InfoBox 
        title="Overall Assessment:"
        content={lunarConditions.strengthAssessment}
        backgroundColor={INFO_BOX_COLORS.neutral}
        textColor="black"
        className="mt-6 p-4"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader icon="⚡" title="Accidental Dignity & Power to Act" />
      
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'houses', label: 'Houses', icon: '🏠' },
          { id: 'motion', label: 'Motion', icon: '🔄' },
          { id: 'solar', label: 'Solar', icon: '☀️' },
          { id: 'lunar', label: 'Lunar', icon: '🌙' },
          { id: 'context', label: 'Context', icon: '🎯' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 font-space-grotesk font-bold text-sm transition-colors ${
              activeSection === tab.id 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Planet detail panel */}
      {selectedPlanet && <PlanetDetailPanel planet={selectedPlanet} />}

      {/* Content sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Power ranking */}
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">Planetary Power Ranking</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedDignities.map((dignity, index) => (
                <AccidentalDignityCard key={dignity.planet} dignity={dignity} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard 
              value={sortedDignities.filter(d => d.overallAssessment === 'very strong' || d.overallAssessment === 'strong').length}
              label="Powerful Planets"
              backgroundColor={getAspectTypeStyle('harmonious').text}
              textColor="white"
            />
            <StatCard 
              value={sortedDignities.filter(d => d.combustion.combust && !d.combustion.cazimi).length}
              label="Combust"
              backgroundColor={getAspectTypeStyle('challenging').text}
              textColor="white"
            />
            <StatCard 
              value={sortedDignities.filter(d => d.retrograde).length}
              label="Retrograde"
              backgroundColor={getAspectTypeStyle('medium').text}
              textColor="white"
            />
            <StatCard 
              value={sortedDignities.filter(d => d.joy).length}
              label="In Joy"
              backgroundColor={getAspectTypeStyle('neutral').text}
              textColor="white"
            />
          </div>

          {/* Key principle */}
          <div className="bg-white border-2 border-black p-6">
            <div className="text-center mb-6">
              <h4 className="font-space-grotesk font-bold text-xl text-black mb-2">⚽ The Football Manager Principle</h4>
              <p className="text-sm text-black/70">Understanding the fundamental difference between skill and performance</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border-2 border-black p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="font-space-grotesk font-bold text-lg text-black">Essential Dignity</div>
                </div>
                <div className="text-sm text-black leading-relaxed mb-2">
                  Shows if the player is <span className="font-bold bg-black text-white px-1">skilled</span> (good or bad)
                </div>
                <div className="text-xs text-black/60">
                  Raw talent and ability
                </div>
              </div>
              
              <div className="bg-white border-2 border-black p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <div className="font-space-grotesk font-bold text-lg text-black">Accidental Dignity</div>
                </div>
                <div className="text-sm text-black leading-relaxed mb-2">
                  Shows if the player can <span className="font-bold bg-black text-white px-1">perform</span> (power to act)
                </div>
                <div className="text-xs text-black/60">
                  Current circumstances and state
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 border-2 border-black p-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-black flex items-center justify-center mr-3 mt-1">
                  <span className="text-white text-lg">💭</span>
                </div>
                <div>
                  <div className="font-space-grotesk font-bold text-sm text-black mb-2">Frawley's Example:</div>
                  <div className="text-sm text-black leading-relaxed italic mb-3">
                    "Both have essential dignity (good players), but one is fired up for England selection while the other's mother died last week."
                  </div>
                  <div className="text-xs text-black/70">
                    <span className="font-bold">Key insight:</span> Same skill level, vastly different power to perform
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'lunar' && <LunarConditionsPanel />}
      
      {activeSection === 'context' && (
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">Contextual Analysis</h3>
          
          <div className="space-y-4">
            <ColoredBox
              backgroundColor="#fff3e0"
              textColor="black"
              borderColor="orange-200"
              className="p-4"
            >
              <h4 className="font-bold mb-2">Current Question:</h4>
              <p className="text-sm">"{question.question}"</p>
            </ColoredBox>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">The Golden Rule</h4>
                <InfoBox 
                  title="Essential shows WHAT - Accidental shows POWER"
                  content=""
                  backgroundColor={getAspectTypeStyle('harmonious').text}
                  textColor="white"
                  className="mb-3"
                />
                <InfoBox 
                  title="Both must be considered for complete judgment"
                  content=""
                  backgroundColor={getAspectTypeStyle('challenging').text}
                  textColor="white"
                />
                <p className="text-sm mt-3 text-gray-700">
                  A planet in own sign on Midheaven: knows how to drive AND is in the driving seat.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">Context Examples</h4>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• "Get old job back?" - Retrograde is favorable</li>
                  <li>• "Hidden action?" - Combustion provides invisibility</li>
                  <li>• "Quick decision?" - Fast motion helps timing</li>
                  <li>• "Drag out case?" - Slow motion is beneficial</li>
                </ul>
              </div>
            </div>
            
            <InfoBox 
              title="Law of Sufficient Explanation"
              content={
                <p>
                  If the context of an enquiry explains a "debility," it is no debility. 
                  Retrograde for "going back" questions is actually beneficial.
                </p>
              }
              backgroundColor={getAspectTypeStyle('neutral').text}
              textColor="white"
              className="p-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}