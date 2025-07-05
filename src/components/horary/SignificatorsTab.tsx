/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { HoraryQuestion } from '@/store/horaryStore';
import { 
  NATURAL_RULERSHIPS,
  PLANETARY_AGES,
  OUTER_PLANET_ASSOCIATIONS,
  getSignRuler,
  getNaturalRulership,
  searchNaturalRulerships,
  analyzeUnidentifiedPlanet,
  checkMoonRole
} from '@/utils/horary/significatorsInterpretations';

interface SignificatorsTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function SignificatorsTab({ chartData, analysisData, question }: SignificatorsTabProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'natural' | 'search' | 'identification'>('overview');
  
  // Extract actual significators from chart data
  const getSignificators = () => {
    if (!chartData || !chartData.houses || !chartData.planets) {
      // Return default if no chart data
      return {
        querent: { main: 'Unknown', co: 'Moon' },
        quesited: { main: 'Unknown', house: 7, description: 'Unknown' },
        otherPlanets: []
      };
    }

    // Helper to get house ruler
    const getHouseRuler = (houseNumber: number): string => {
      try {
        const house = chartData.houses[houseNumber - 1];
        if (!house) return 'Unknown';
        
        const signIndex = Math.floor(house.cusp / 30);
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const signName = signs[signIndex];
        if (!signName) return 'Unknown';
        
        const signRuler = getSignRuler(signName);
        
        // Debug log
        console.log(`House ${houseNumber}: cusp ${house.cusp}° → ${signName} → ruled by ${signRuler}`);
        
        return signRuler || 'Unknown';
      } catch (e) {
        console.error(`Error getting ruler for house ${houseNumber}:`, e);
        return 'Unknown';
      }
    };

    // Helper to get what houses a planet rules
    const getHousesRuledByPlanet = (planetName: string): number[] => {
      const housesRuled: number[] = [];
      for (let i = 1; i <= 12; i++) {
        if (getHouseRuler(i).toLowerCase() === planetName.toLowerCase()) {
          housesRuled.push(i);
        }
      }
      return housesRuled;
    };

    // Helper to get house description based on question type
    const getQuesitedHouse = (): { house: number; description: string } => {
      const questionLower = question.question.toLowerCase();
      
      // Common horary house attributions
      if (questionLower.includes('partner') || questionLower.includes('spouse') || 
          questionLower.includes('relationship') || questionLower.includes('love')) {
        return { house: 7, description: 'Partner/relationships' };
      } else if (questionLower.includes('job') || questionLower.includes('work') || 
                 questionLower.includes('career')) {
        return { house: 10, description: 'Career/profession' };
      } else if (questionLower.includes('money') || questionLower.includes('income')) {
        return { house: 2, description: 'Money/possessions' };
      } else if (questionLower.includes('health') || questionLower.includes('illness')) {
        return { house: 6, description: 'Health/illness' };
      } else if (questionLower.includes('travel') || questionLower.includes('trip')) {
        return { house: 9, description: 'Travel/journeys' };
      } else if (questionLower.includes('home') || questionLower.includes('house') || 
                 questionLower.includes('property')) {
        return { house: 4, description: 'Home/property' };
      } else if (questionLower.includes('child') || questionLower.includes('pregnancy')) {
        return { house: 5, description: 'Children/creativity' };
      } else if (questionLower.includes('friend')) {
        return { house: 11, description: 'Friends/hopes' };
      } else {
        // Default to 7th house for general questions
        return { house: 7, description: 'The matter asked about' };
      }
    };

    const quesitedInfo = getQuesitedHouse();
    const querentRuler = getHouseRuler(1); // 1st house ruler is always querent
    const quesitedRuler = getHouseRuler(quesitedInfo.house);

    // Get other significant planets
    const otherPlanets: any[] = [];
    const significantHouses = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]; // Exclude 1st and quesited house
    
    for (const houseNum of significantHouses) {
      if (houseNum === quesitedInfo.house) continue; // Skip quesited house
      
      const ruler = getHouseRuler(houseNum);
      if (ruler !== 'Unknown' && ruler !== querentRuler && ruler !== quesitedRuler) {
        // Only add if this planet isn't already in the list
        const existing = otherPlanets.find(p => p.planet === ruler);
        if (!existing) {
          const housesRuled = getHousesRuledByPlanet(ruler);
          let role = '';
          
          // Assign role based on houses ruled
          if (housesRuled.includes(2)) role = 'Money/resources';
          else if (housesRuled.includes(3)) role = 'Communication/siblings';
          else if (housesRuled.includes(4)) role = 'Home/family matters';
          else if (housesRuled.includes(5)) role = 'Children/pleasure';
          else if (housesRuled.includes(6)) role = 'Health/service';
          else if (housesRuled.includes(8)) role = 'Shared resources/transformation';
          else if (housesRuled.includes(9)) role = 'Higher learning/travel';
          else if (housesRuled.includes(10)) role = 'Career/public life';
          else if (housesRuled.includes(11)) role = 'Friends/aspirations';
          else if (housesRuled.includes(12)) role = 'Hidden matters/spirituality';
          
          otherPlanets.push({
            planet: ruler,
            housesRuled: housesRuled,
            role: role
          });
        }
      }
    }

    // Helper to get which house a planet is in
    const getPlanetHouse = (planetName: string): number => {
      if (!chartData || !chartData.planets || !chartData.houses) return 0;
      
      let planetLongitude: number | undefined;
      
      // Find planet's longitude
      if (Array.isArray(chartData.planets)) {
        const planet = chartData.planets.find((p: any) => 
          p.name?.toLowerCase() === planetName.toLowerCase()
        );
        planetLongitude = planet?.longitude;
      } else if (typeof chartData.planets === 'object') {
        const planetData = chartData.planets[planetName] || 
                          chartData.planets[planetName.toLowerCase()] || 
                          chartData.planets[planetName.charAt(0).toUpperCase() + planetName.slice(1)];
        if (typeof planetData === 'number') {
          planetLongitude = planetData;
        } else if (planetData?.longitude !== undefined) {
          planetLongitude = planetData.longitude;
        }
      }
      
      if (planetLongitude === undefined) return 0;
      
      // Find which house it's in
      for (let i = 0; i < chartData.houses.length; i++) {
        const currentHouse = chartData.houses[i]?.cusp || (i * 30);
        const nextHouse = chartData.houses[(i + 1) % 12]?.cusp || ((i + 1) * 30);
        
        if (currentHouse <= nextHouse) {
          if (planetLongitude >= currentHouse && planetLongitude < nextHouse) {
            return i + 1;
          }
        } else {
          // Handle wraparound at 360°
          if (planetLongitude >= currentHouse || planetLongitude < nextHouse) {
            return i + 1;
          }
        }
      }
      return 1;
    };

    return {
      querent: {
        main: querentRuler,
        co: 'Moon', // Moon is always co-significator of querent
        mainHouse: getPlanetHouse(querentRuler),
        coHouse: getPlanetHouse('Moon')
      },
      quesited: {
        main: quesitedRuler,
        house: quesitedInfo.house,
        description: quesitedInfo.description,
        mainHouse: getPlanetHouse(quesitedRuler)
      },
      otherPlanets: otherPlanets.slice(0, 3).map(p => ({
        ...p,
        inHouse: getPlanetHouse(p.planet)
      }))
    };
  };

  const significators = getSignificators();

  const SectionHeader = ({ icon, title, size = 'lg' }: { icon: string; title: string; size?: 'sm' | 'lg' }) => (
    <div className="flex items-center mb-6">
      <div className={`${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'} bg-black flex items-center justify-center mr-4`}>
        <span className={`text-white ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>{icon}</span>
      </div>
      <div>
        <h4 className="font-space-grotesk font-bold text-black text-xl">{title}</h4>
        <div className={`${size === 'lg' ? 'w-16' : 'w-24'} h-0.5 bg-black mt-1`}></div>
      </div>
    </div>
  );

  const SignificatorCard = ({ 
    planet, 
    role, 
    isMain = false, 
    confidence = 'high',
    housesRuled = [],
    inHouse
  }: { 
    planet: string; 
    role: string; 
    isMain?: boolean; 
    confidence?: 'high' | 'medium' | 'low';
    housesRuled?: number[];
    inHouse?: number;
  }) => (
    <div className={`border border-black p-4 ${isMain ? 'bg-blue-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-space-grotesk font-bold text-lg">{planet}</span>
        {inHouse && inHouse > 0 && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            House {inHouse}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-700 mb-2">{role}</div>
      {housesRuled.length > 0 && (
        <div className="text-xs text-gray-600 mb-1">
          Rules houses: {housesRuled.join(', ')}
        </div>
      )}
      {isMain && (
        <div className="text-xs text-blue-600 font-bold">MAIN SIGNIFICATOR</div>
      )}
    </div>
  );

  const PlanetDetailPanel = ({ planet }: { planet: string }) => {
    const rulership = getNaturalRulership(planet);
    if (!rulership) return null;

    return (
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-space-grotesk font-bold text-xl">{planet} - Natural Rulerships</h3>
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Essential Qualities</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Temperament:</strong> {rulership.temperament}</div>
              <div><strong>Gender:</strong> {rulership.gender}</div>
              <div><strong>Sect:</strong> {rulership.sect}</div>
              <div><strong>Age:</strong> {rulership.age}</div>
            </div>
            
            <h4 className="font-space-grotesk font-bold mb-3 mt-6">Physical Attributes</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Colors:</strong> {rulership.colors.join(', ')}</div>
              <div><strong>Metals:</strong> {rulership.metals.join(', ')}</div>
              <div><strong>Gems:</strong> {rulership.gems.join(', ')}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Body Parts</h4>
            <div className="text-sm text-gray-700 mb-4">
              {rulership.bodyParts.join(', ')}
            </div>
            
            <h4 className="font-space-grotesk font-bold mb-3">Key Qualities</h4>
            <div className="flex flex-wrap gap-1">
              {rulership.qualities.slice(0, 8).map((quality, index) => (
                <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {quality}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div>
            <h5 className="font-bold text-sm mb-2">Objects</h5>
            <ul className="text-xs space-y-1">
              {rulership.objects.slice(0, 6).map((obj, index) => (
                <li key={index}>• {obj}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-sm mb-2">People</h5>
            <ul className="text-xs space-y-1">
              {rulership.people.slice(0, 6).map((person, index) => (
                <li key={index}>• {person}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-sm mb-2">Concepts</h5>
            <ul className="text-xs space-y-1">
              {rulership.concepts.slice(0, 6).map((concept, index) => (
                <li key={index}>• {concept}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-sm mb-2">Animals</h5>
            <ul className="text-xs space-y-1">
              {rulership.animals.slice(0, 6).map((animal, index) => (
                <li key={index}>• {animal}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const NaturalRulershipsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {NATURAL_RULERSHIPS.map((rulership) => (
          <div 
            key={rulership.planet}
            className="border border-black p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedPlanet(rulership.planet)}
          >
            <div className="font-space-grotesk font-bold text-lg mb-2">{rulership.planet}</div>
            <div className="text-sm text-gray-600 mb-2">{rulership.temperament}</div>
            <div className="text-xs text-gray-700 mb-3">{rulership.age}</div>
            <div className="space-y-1">
              <div className="text-xs"><strong>Key:</strong> {rulership.qualities.slice(0, 3).join(', ')}</div>
              <div className="text-xs"><strong>Rules:</strong> {rulership.people.slice(0, 2).join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4">
        <h4 className="font-space-grotesk font-bold mb-3">Seven Ages of Man</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANETARY_AGES.map((age, index) => (
            <div key={index} className="text-sm">
              <div className="font-bold">{age.planet}</div>
              <div className="text-xs text-gray-600">{age.age}</div>
              <div className="text-xs">{age.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SearchSection = () => {
    const searchResults = searchTerm ? searchNaturalRulerships(searchTerm) : [];
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Search Natural Rulerships:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter object, person, concept, or animal..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-space-grotesk font-bold">Search Results:</h4>
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{result.planet}</span>
                  <span className="text-sm text-gray-600">{result.category}</span>
                </div>
                <div className="text-sm">
                  <strong>Matches:</strong> {result.matches.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchTerm && searchResults.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No matches found for "{searchTerm}"
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon="🎭" title="Significators & Planetary Rulers" />
      
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'natural', label: 'Natural Rulerships', icon: '🌟' },
          { id: 'search', label: 'Search', icon: '🔍' },
          { id: 'identification', label: 'Planet ID', icon: '🕵️' }
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
          <div className="bg-white border border-black p-6">
            <h3 className="font-space-grotesk font-bold text-xl mb-4">Current Question Significators</h3>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200">
              <div className="font-bold text-sm mb-2">Question: "{question.question}"</div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-space-grotesk font-bold mb-3">Querent (You)</h4>
                <div className="space-y-3">
                  <SignificatorCard 
                    planet={significators.querent.main}
                    role="Main significator (Lord 1)"
                    isMain={true}
                    inHouse={significators.querent.mainHouse}
                  />
                  {significators.querent.co && (
                    <SignificatorCard 
                      planet={significators.querent.co}
                      role="Co-significator (emotions)"
                      inHouse={significators.querent.coHouse}
                    />
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-space-grotesk font-bold mb-3">Quesited (Matter Asked About)</h4>
                <SignificatorCard 
                  planet={significators.quesited.main}
                  role={`${significators.quesited.description} (Lord ${significators.quesited.house})`}
                  isMain={true}
                  inHouse={significators.quesited.mainHouse}
                />
              </div>
            </div>
            
            {significators.otherPlanets.length > 0 && (
              <div className="mt-6">
                <h4 className="font-space-grotesk font-bold mb-3">Other Planetary Roles</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {significators.otherPlanets.map((planet, index) => (
                    <SignificatorCard 
                      key={index}
                      planet={planet.planet}
                      role={planet.role}
                      confidence="medium"
                      housesRuled={planet.housesRuled}
                      inHouse={planet.inHouse}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4">
            <h4 className="font-space-grotesk font-bold mb-2">Moon's Role</h4>
            <p className="text-sm text-gray-700">
              The Moon is co-significator of the querent in this chart, weighted towards emotional aspects of the question.
              Moon aspects are less convincing than those from the main significator and may need supporting testimony.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'natural' && <NaturalRulershipsSection />}
      
      {activeSection === 'search' && <SearchSection />}
      
      {activeSection === 'identification' && (
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">Unidentified Planet Analysis</h3>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-4">
              <h4 className="font-bold mb-2">⚠ Caution Required</h4>
              <p className="text-sm">
                When analyzing unidentified planets, avoid writing your own stories into the chart. 
                Keep imagination on a short lead and consult with the querent when possible.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Identification Steps</h4>
                <ol className="text-sm space-y-2">
                  <li>1. Check what houses the planet rules</li>
                  <li>2. Consider natural associations</li>
                  <li>3. Look for "some other person" involvement</li>
                  <li>4. Choose most concrete interpretation</li>
                  <li>5. Study receptions for confirmation</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">Questions to Ask Querent</h4>
                <ul className="text-sm space-y-1">
                  <li>• "Is there someone else involved in this matter?"</li>
                  <li>• "Do you have any idea who that might be?"</li>
                  <li>• "Are there any third parties affected?"</li>
                  <li>• "Who else has influence over this situation?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outer planets warning */}
      <div className="bg-red-50 border border-red-200 p-4">
        <h4 className="font-space-grotesk font-bold mb-2">Outer Planets (Uranus, Neptune, Pluto)</h4>
        <p className="text-sm text-gray-700 mb-2">
          Use outer planets ONLY when they are right on a relevant house cusp or in immediate aspect with main significators.
          They do not rule signs and have very limited significance in horary.
        </p>
        <div className="grid md:grid-cols-3 gap-3 text-xs">
          {Object.entries(OUTER_PLANET_ASSOCIATIONS).map(([planet, data]) => (
            <div key={planet} className="bg-white p-2 border border-red-300">
              <div className="font-bold">{planet}</div>
              <div>{data.keywords.slice(0, 2).join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}