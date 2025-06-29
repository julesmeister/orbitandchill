/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { HoraryQuestion } from '@/store/horaryStore';
import { 
  HOUSE_INTERPRETATIONS, 
  CHART_TURNING_EXAMPLES,
  getHouseInterpretation,
  calculateTurnedHouse,
  HOUSE_BODY_PARTS 
} from '@/utils/horary/housesInterpretations';

interface HousesTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function HousesTab({ chartData, analysisData, question }: HousesTabProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [showChartTurning, setShowChartTurning] = useState(false);
  
  // Extract house data from chart
  const getHouseRuler = (houseNumber: number) => {
    if (!chartData || !chartData.houses || !chartData.houses[houseNumber - 1]) {
      return 'Unknown';
    }
    
    const house = chartData.houses[houseNumber - 1];
    const signIndex = Math.floor(house.cusp / 30);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signName = signs[signIndex];
    
    // Map signs to their rulers
    const signRulers: { [key: string]: string } = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Saturn',
      'Pisces': 'Jupiter'
    };
    
    return signRulers[signName] || 'Unknown';
  };
  
  const getPlanetsInHouse = (houseNumber: number) => {
    if (!chartData || !chartData.planets || !chartData.houses) {
      return [];
    }
    
    const planetsInHouse: string[] = [];
    const house = chartData.houses[houseNumber - 1];
    const nextHouseIndex = houseNumber === 12 ? 0 : houseNumber; // For house 12, next is house 1 (index 0)
    const nextHouse = chartData.houses[nextHouseIndex];
    
    if (!house || !nextHouse) return [];
    
    // Helper to check if a longitude is in this house
    const isInHouse = (longitude: number) => {
      const houseCusp = house.cusp;
      const nextCusp = nextHouse.cusp;
      
      if (houseCusp <= nextCusp) {
        return longitude >= houseCusp && longitude < nextCusp;
      } else {
        // Handle wraparound at 360°
        return longitude >= houseCusp || longitude < nextCusp;
      }
    };
    
    // Check each planet
    if (Array.isArray(chartData.planets)) {
      chartData.planets.forEach((planet: any) => {
        if (planet.name && planet.longitude !== undefined && isInHouse(planet.longitude)) {
          planetsInHouse.push(planet.name.charAt(0).toUpperCase() + planet.name.slice(1));
        }
      });
    } else if (typeof chartData.planets === 'object') {
      Object.entries(chartData.planets).forEach(([name, data]) => {
        let longitude: number | undefined;
        
        if (data && typeof data === 'object' && 'longitude' in data) {
          longitude = (data as any).longitude;
        } else if (typeof data === 'number') {
          longitude = data;
        }
        
        if (longitude !== undefined && isInHouse(longitude)) {
          planetsInHouse.push(name.charAt(0).toUpperCase() + name.slice(1));
        }
      });
    }
    
    return planetsInHouse;
  };

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

  const HouseCard = ({ house, isSelected, onClick }: { 
    house: typeof HOUSE_INTERPRETATIONS[0]; 
    isSelected: boolean; 
    onClick: () => void;
  }) => (
    <div 
      className={`border border-black p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-blue-100 border-2' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-space-grotesk font-bold text-lg">{house.houseNumber}</span>
        <span className="text-xs text-gray-600 text-right ml-2 flex-shrink-0 max-w-[50%]">{house.physicalBody}</span>
      </div>
      <div className="font-space-grotesk font-bold text-sm mb-2">{house.name}</div>
      <div className="text-xs text-gray-700 mb-3">{house.primaryMeaning}</div>
      
      <div className="space-y-1">
        <div className="text-xs">
          <span className="font-bold">Ruler:</span> {getHouseRuler(house.houseNumber)}
        </div>
        {getPlanetsInHouse(house.houseNumber).length > 0 && (
          <div className="text-xs">
            <span className="font-bold">Planets:</span> {getPlanetsInHouse(house.houseNumber).join(', ')}
          </div>
        )}
      </div>
    </div>
  );

  const HouseDetailPanel = ({ houseNumber }: { houseNumber: number }) => {
    const house = getHouseInterpretation(houseNumber);
    if (!house) return null;

    return (
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-space-grotesk font-bold text-xl">
            {house.houseNumber}th House: {house.name}
          </h3>
          <button 
            onClick={() => setSelectedHouse(null)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Key Associations</h4>
            <ul className="space-y-1 text-sm">
              {house.keyAssociations.map((association, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {association}
                </li>
              ))}
            </ul>
            
            <h4 className="font-space-grotesk font-bold mb-3 mt-6">Physical Body</h4>
            <p className="text-sm text-gray-700">{house.physicalBody}</p>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Common Questions</h4>
            <ul className="space-y-1 text-sm">
              {house.commonQuestions.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">?</span>
                  <em>{question}</em>
                </li>
              ))}
            </ul>
            
            <h4 className="font-space-grotesk font-bold mb-3 mt-6">Avoid Common Mistakes</h4>
            <ul className="space-y-1 text-sm">
              {house.avoidCommonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">⚠</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {house.examples.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-space-grotesk font-bold mb-3">Examples</h4>
            <div className="space-y-4">
              {house.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 p-4 border-l-4 border-blue-500">
                  <div className="font-bold text-sm mb-1">{example.scenario}</div>
                  <div className="text-sm text-gray-700 mb-2">{example.explanation}</div>
                  <div className="text-xs text-blue-600 italic">{example.whyThisHouse}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ChartTurningPanel = () => (
    <div className="bg-white border border-black p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk font-bold text-xl">Chart Turning Guide</h3>
        <button 
          onClick={() => setShowChartTurning(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-700 mb-4">
          Chart turning allows us to find houses for people other than the querent. 
          Always count the starting house as "1" and count forward from there.
        </p>
        
        <div className="bg-blue-50 p-4 border border-blue-200">
          <div className="font-bold text-sm mb-2">How to Turn the Chart:</div>
          <ol className="text-sm space-y-1">
            <li>1. Identify the person (e.g., "my daughter" = 5th house)</li>
            <li>2. Identify what you want to know about them (e.g., "her career" = 10th house)</li>
            <li>3. Count from their house: 10th from 5th = 2nd house</li>
            <li>4. Interpret the 2nd house for your daughter's career</li>
          </ol>
        </div>
      </div>

      <h4 className="font-space-grotesk font-bold mb-3">Common Turning Examples</h4>
      <div className="grid md:grid-cols-2 gap-4">
        {CHART_TURNING_EXAMPLES.map((example, index) => (
          <div key={index} className="border border-gray-200 p-4">
            <div className="font-bold text-sm mb-1">{example.from}</div>
            <div className="text-sm text-blue-600 mb-1">{example.to}</div>
            <div className="text-xs text-gray-600 mb-2">{example.calculation}</div>
            <div className="text-xs italic">{example.example}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader icon="🏠" title="House Meanings & Analysis" />
      
      {/* Control buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowChartTurning(true)}
          className="px-4 py-2 bg-blue-600 text-white font-space-grotesk font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          Chart Turning Guide
        </button>
        <button
          onClick={() => setSelectedHouse(null)}
          className="px-4 py-2 bg-gray-600 text-white font-space-grotesk font-bold text-sm hover:bg-gray-700 transition-colors"
        >
          Clear Selection
        </button>
      </div>

      {/* Chart turning panel */}
      {showChartTurning && <ChartTurningPanel />}
      
      {/* House detail panel */}
      {selectedHouse && <HouseDetailPanel houseNumber={selectedHouse} />}

      {/* Houses grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {HOUSE_INTERPRETATIONS.map((house) => (
          <HouseCard
            key={house.houseNumber}
            house={house}
            isSelected={selectedHouse === house.houseNumber}
            onClick={() => setSelectedHouse(house.houseNumber)}
          />
        ))}
      </div>


      {/* Context-specific interpretations */}
      <div className="bg-white border border-black p-6">
        <SectionHeader icon="🎯" title="Question Context" size="sm" />
        <div className="text-sm text-gray-700">
          <p className="mb-3">
            <strong>Current Question:</strong> "{question.question}"
          </p>
          <p className="mb-3">
            Remember that the same person or thing can appear in different houses depending on:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Who is asking the question</li>
            <li>• What specifically is being asked</li>
            <li>• The relationship between querent and the subject</li>
            <li>• The context of the situation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}