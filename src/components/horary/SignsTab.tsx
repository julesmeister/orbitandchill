/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { HoraryQuestion } from '@/store/horaryStore';
import { 
  SIGN_CHARACTERISTICS,
  ELEMENT_CHARACTERISTICS,
  MODE_CHARACTERISTICS,
  getSignCharacteristics,
  getSignsByElement,
  getSignsByMode,
  getSignsByGender,
  getFertileSigns,
  getBarrenSigns,
  getDoubleBodydiedSigns,
  getMuteSigns,
  getLoudVoicedSigns,
  getHumaneSigns,
  getBestialSigns,
  getFeralSigns,
  getMaimedSigns,
  analyzeSignForQuestion,
  searchSignCharacteristics,
  getElementCharacteristics,
  getModeCharacteristics
} from '@/utils/horary/signsInterpretations';

interface SignsTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function SignsTab({ chartData, analysisData, question }: SignsTabProps) {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [activeClassification, setActiveClassification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'classifications' | 'search' | 'context'>('overview');
  
  // Extract actual planetary positions from chart data
  const getPlanetaryPositions = () => {
    const positions: { [key: string]: string } = {};
    
    if (!chartData || !chartData.planets) {
      return positions;
    }

    // Helper to get sign from longitude
    const getSignFromLongitude = (longitude: number): string => {
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = Math.floor(longitude / 30);
      return signs[signIndex] || 'Unknown';
    };

    // Process planets - handle both array and object formats
    if (Array.isArray(chartData.planets)) {
      chartData.planets.forEach((planet: any) => {
        if (planet.name && planet.longitude !== undefined) {
          const capitalizedName = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
          positions[capitalizedName] = getSignFromLongitude(planet.longitude);
        }
      });
    } else if (typeof chartData.planets === 'object') {
      Object.entries(chartData.planets).forEach(([name, data]) => {
        if (data && typeof data === 'object' && 'longitude' in data) {
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          positions[capitalizedName] = getSignFromLongitude((data as any).longitude);
        } else if (typeof data === 'number') {
          // If data is just a longitude number
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          positions[capitalizedName] = getSignFromLongitude(data);
        }
      });
    }

    return positions;
  };

  const planetaryPositions = getPlanetaryPositions();

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

  const SignCard = ({ 
    sign, 
    isSelected = false, 
    hasPlanet = false,
    planetName = ''
  }: { 
    sign: string; 
    isSelected?: boolean; 
    hasPlanet?: boolean;
    planetName?: string;
  }) => {
    const signData = getSignCharacteristics(sign);
    if (!signData) return null;

    return (
      <div 
        className={`border border-black p-3 cursor-pointer transition-all duration-200 ${
          isSelected ? 'bg-blue-100 border-2' : 
          hasPlanet ? 'bg-yellow-50 hover:bg-blue-50' : 
          'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setSelectedSign(sign)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{signData.symbol}</span>
          {hasPlanet && (
            <span className="text-xs bg-yellow-200 px-1 py-0.5 rounded">{planetName}</span>
          )}
        </div>
        <div className="font-space-grotesk font-bold text-sm mb-1">{sign}</div>
        <div className="text-xs text-gray-600 mb-2">{signData.element} | {signData.mode}</div>
        <div className="text-xs">
          <div><strong>Body:</strong> {signData.bodyPart}</div>
          <div><strong>Voice:</strong> {signData.voice}</div>
        </div>
      </div>
    );
  };

  const SignDetailPanel = ({ sign }: { sign: string }) => {
    const signData = getSignCharacteristics(sign);
    if (!signData) return null;

    const questionAnalysis = analyzeSignForQuestion(sign, question.question);

    return (
      <div className="bg-white border border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">{signData.symbol}</span>
            <div>
              <h3 className="font-space-grotesk font-bold text-2xl">{sign}</h3>
              <div className="text-gray-600">{signData.elementalQualities}</div>
            </div>
          </div>
          <button 
            onClick={() => setSelectedSign(null)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Core Characteristics</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Gender:</strong> {signData.gender}</div>
              <div><strong>Element:</strong> {signData.element}</div>
              <div><strong>Mode:</strong> {signData.mode}</div>
              <div><strong>Fertility:</strong> {signData.fertility}</div>
              <div><strong>Voice:</strong> {signData.voice}</div>
              <div><strong>Humanity:</strong> {signData.humanity}</div>
              {signData.isDoubleBodydied && <div className="text-blue-600"><strong>Double-bodied</strong></div>}
              {signData.isMaimed && <div className="text-orange-600"><strong>Maimed</strong></div>}
            </div>
            
            <h4 className="font-space-grotesk font-bold mb-3 mt-6">Body & Health</h4>
            <div className="text-sm">
              <div><strong>Body Part:</strong> {signData.bodyPart}</div>
              <div className="mt-2"><strong>Medical Significance:</strong></div>
              <ul className="text-xs mt-1 space-y-1">
                {signData.medicalSignificance.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-bold mb-3">Practical Applications</h4>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">Vocations:</div>
              <div className="text-xs text-gray-700">
                {signData.vocationaApplications.join(', ')}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">Location Clues:</div>
              <div className="text-xs text-gray-700">
                {signData.locationClues.join(', ')}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-1">Weather:</div>
              <div className="text-xs text-gray-700">
                {signData.weatherIndications.join(', ')}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-bold mb-1">Behavioral Traits:</div>
              <div className="text-xs text-gray-700">
                {signData.behavioralTraits.join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-space-grotesk font-bold mb-3">Key Qualities</h4>
          <div className="flex flex-wrap gap-2">
            {signData.qualities.map((quality, index) => (
              <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {quality}
              </span>
            ))}
          </div>
        </div>

        {questionAnalysis.relevantCharacteristics.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-space-grotesk font-bold mb-3">Relevance to Current Question</h4>
            <div className="bg-blue-50 p-4 border border-blue-200">
              <div className="text-sm mb-2">
                <strong>Interpretation:</strong> {questionAnalysis.interpretation}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Relevant characteristics:</strong> {questionAnalysis.relevantCharacteristics.join('; ')}
              </div>
              <div className="text-xs mt-2">
                <span className={`px-2 py-1 rounded ${
                  questionAnalysis.confidence === 'high' ? 'bg-green-200 text-green-800' :
                  questionAnalysis.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {questionAnalysis.confidence} confidence
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ClassificationsSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Elements */}
        <div className="border border-black p-4">
          <h4 className="font-space-grotesk font-bold mb-3">Elements</h4>
          {ELEMENT_CHARACTERISTICS.map((element) => (
            <div 
              key={element.element}
              className="mb-3 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification(`element-${element.element}`)}
            >
              <div className="font-bold text-sm capitalize">{element.element}</div>
              <div className="text-xs text-gray-600">{element.qualities}</div>
              <div className="text-xs">{element.signs.join(', ')}</div>
            </div>
          ))}
        </div>

        {/* Modes */}
        <div className="border border-black p-4">
          <h4 className="font-space-grotesk font-bold mb-3">Modes</h4>
          {MODE_CHARACTERISTICS.map((mode) => (
            <div 
              key={mode.mode}
              className="mb-3 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification(`mode-${mode.mode}`)}
            >
              <div className="font-bold text-sm capitalize">{mode.mode}</div>
              <div className="text-xs text-gray-600">{mode.actionType}</div>
              <div className="text-xs">{mode.signs.join(', ')}</div>
            </div>
          ))}
        </div>

        {/* Special Classifications */}
        <div className="border border-black p-4">
          <h4 className="font-space-grotesk font-bold mb-3">Special Groups</h4>
          <div className="space-y-2 text-sm">
            <div 
              className="p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification('fertility')}
            >
              <div className="font-bold">Fertility</div>
              <div className="text-xs">Fertile: {getFertileSigns().join(', ')}</div>
              <div className="text-xs">Barren: {getBarrenSigns().join(', ')}</div>
            </div>
            
            <div 
              className="p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification('voice')}
            >
              <div className="font-bold">Voice</div>
              <div className="text-xs">Mute: {getMuteSigns().join(', ')}</div>
              <div className="text-xs">Loud: {getLoudVoicedSigns().join(', ')}</div>
            </div>
            
            <div 
              className="p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification('humanity')}
            >
              <div className="font-bold">Humanity</div>
              <div className="text-xs">Humane: {getHumaneSigns().join(', ')}</div>
              <div className="text-xs">Bestial: {getBestialSigns().join(', ')}</div>
              <div className="text-xs">Feral: {getFeralSigns().join(', ')}</div>
            </div>
            
            <div 
              className="p-2 border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveClassification('special')}
            >
              <div className="font-bold">Other</div>
              <div className="text-xs">Double-bodied: {getDoubleBodydiedSigns().join(', ')}</div>
              <div className="text-xs">Maimed: {getMaimedSigns().join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SearchSection = () => {
    const searchResults = searchTerm ? searchSignCharacteristics(searchTerm) : [];
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Search Sign Characteristics:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter vocation, location, trait, or medical condition..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-space-grotesk font-bold">Search Results:</h4>
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{result.sign}</span>
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
      <SectionHeader icon="♈" title="Zodiacal Sign Characteristics" />
      
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'classifications', label: 'Classifications', icon: '🏷️' },
          { id: 'search', label: 'Search', icon: '🔍' },
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

      {/* Sign detail panel */}
      {selectedSign && <SignDetailPanel sign={selectedSign} />}

      {/* Content sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Current planetary positions */}
          <div className="bg-blue-50 border border-blue-200 p-4">
            <h4 className="font-space-grotesk font-bold mb-3">Current Planetary Positions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {Object.entries(planetaryPositions).map(([planet, sign]) => (
                <div key={planet} className="bg-white p-2 border border-blue-300">
                  <div className="font-bold">{planet}</div>
                  <div className="text-gray-600">in {sign}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signs grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SIGN_CHARACTERISTICS.map((sign) => {
              const planetInSign = Object.entries(planetaryPositions).find(([planet, signName]) => signName === sign.sign);
              return (
                <SignCard
                  key={sign.sign}
                  sign={sign.sign}
                  isSelected={selectedSign === sign.sign}
                  hasPlanet={!!planetInSign}
                  planetName={planetInSign ? planetInSign[0] : ''}
                />
              );
            })}
          </div>
        </div>
      )}

      {activeSection === 'classifications' && <ClassificationsSection />}
      
      {activeSection === 'search' && <SearchSection />}
      
      {activeSection === 'context' && (
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">Question Context Analysis</h3>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-4">
              <h4 className="font-bold mb-2">Current Question:</h4>
              <p className="text-sm">"{question.question}"</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Traditional Principle</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Signs are adjectives that describe planets. In astrological sentences:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Planets</strong> = Nouns (what acts)</li>
                  <li>• <strong>Signs</strong> = Adjectives (how they act)</li>
                  <li>• <strong>Aspects</strong> = Verbs (the action itself)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">Important Notes</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Signs describe planets but have no power to act</li>
                  <li>• Traditional meanings, not modern "personalities"</li>
                  <li>• Context determines which quality manifests</li>
                  <li>• All testimonies are "all things being equal"</li>
                  <li>• Any single testimony can be outweighed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important warnings */}
      <div className="bg-yellow-50 border border-yellow-200 p-4">
        <h4 className="font-space-grotesk font-bold mb-2">Traditional vs. Modern Astrology</h4>
        <p className="text-sm text-gray-700">
          Traditional signs do NOT have the "rounded personalities" of modern astrology. 
          For example, a planet in Leo behaves in a "feral" way (like a wild beast), NOT in a regal fashion. 
          It cannot be both feral and regal simultaneously. Context determines which quality manifests.
        </p>
      </div>
    </div>
  );
}