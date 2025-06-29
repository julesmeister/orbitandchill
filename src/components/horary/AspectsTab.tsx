/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { HoraryQuestion } from '@/store/horaryStore';
import { 
  analyzeChartAspects,
  findAllAspects,
  findAllPatterns,
  getAspectSymbol,
  getAspectColor,
  ASPECT_NATURES,
  PlanetaryPosition,
  AspectAnalysis,
  AspectPattern,
  AspectInterpretation
} from '@/utils/horary/aspectsInterpretations';
import {
  RELEVANCE_COLORS,
  OUTCOME_COLORS,
  TONE_COLORS,
  ASPECT_COLORS_DARK,
  INFO_BOX_COLORS
} from '@/utils/horary/colorConfigurations';
import {
  ColoredBox,
  Badge,
  StatCard,
  InfoBox,
  SectionHeader,
  TabConfig
} from '@/components/horary/common/HoraryComponents';


interface AspectsTabProps {
  chartData: any;
  analysisData: any;
  question: HoraryQuestion;
}

export default function AspectsTab({ chartData, analysisData, question }: AspectsTabProps) {
  const [selectedAspect, setSelectedAspect] = useState<AspectAnalysis | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'major' | 'patterns' | 'timing' | 'context'>('overview');
  
  // Extract actual planetary positions from chart data
  const getPlanetaryPositions = (): PlanetaryPosition[] => {
    const positions: PlanetaryPosition[] = [];
    
    if (!chartData || !chartData.planets || !Array.isArray(chartData.planets)) {
      return positions;
    }

    // Convert NatalChartData.planets to PlanetaryPosition format
    chartData.planets.forEach((planet: any) => {
      if (planet.name && planet.longitude !== undefined) {
        const capitalizedName = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
        positions.push({
          planet: capitalizedName,
          longitude: planet.longitude,
          sign: planet.sign || 'Unknown',
          house: planet.house || 1,
          dailyMotion: 1, // Default daily motion - could be enhanced with real calculation
          retrograde: planet.retrograde || false
        });
      }
    });

    return positions;
  };

  // Get significators from actual chart analysis
  const getSignificators = () => {
    // Simple default significators - could be enhanced with actual significator logic
    return {
      querent: 'Sun', // Could extract from 1st house ruler
      quesited: 'Venus', // Could extract from question-specific house ruler
      context: question.question
    };
  };

  const planetaryPositions = getPlanetaryPositions();
  const significators = getSignificators();

  // Comprehensive aspect analysis using real data
  const aspectAnalysis = planetaryPositions.length > 0 ? 
    analyzeChartAspects(planetaryPositions, question.question, significators) :
    { interpretations: [], patterns: [], summary: { totalAspects: 0, applyingAspects: 0, separatingAspects: 0, majorPatterns: 0, overallTone: 'neutral', significance: 'low' } };


  const AspectCard = ({ aspect, interpretation }: { aspect: AspectAnalysis; interpretation: AspectInterpretation }) => (
    <div 
      className={`border border-black p-4 cursor-pointer transition-all duration-200 ${
        selectedAspect?.planet1 === aspect.planet1 && selectedAspect?.planet2 === aspect.planet2 
          ? 'bg-blue-100 border-2' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={() => setSelectedAspect(aspect)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span 
            className="w-6 h-6 flex items-center justify-center text-white text-sm mr-2 border border-black"
            style={{ backgroundColor: getAspectColor(aspect.aspect) }}
          >
            {getAspectSymbol(aspect.aspect)}
          </span>
          <span className="font-space-grotesk font-bold">
            {aspect.planet1} {aspect.aspect} {aspect.planet2}
          </span>
        </div>
        <div className="flex gap-1">
          {aspect.applying && <Badge label="→" backgroundColor="#51bd94" />}
          {aspect.separating && <Badge label="←" backgroundColor="#6b7280" />}
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <span className="font-bold">Orb:</span> {aspect.orb.toFixed(1)}° | 
        <span className="font-bold"> Strength:</span> {aspect.strength}
      </div>
      
      <div className="text-xs mb-2" style={{ color: getAspectColor(aspect.aspect) }}>
        {ASPECT_NATURES[aspect.aspect].keywords.join(' • ')}
      </div>
      
      <div className="flex gap-1 mb-2">
        <Badge 
          label={`${interpretation.questionRelevance} relevance`}
          backgroundColor={RELEVANCE_COLORS[interpretation.questionRelevance as keyof typeof RELEVANCE_COLORS].bg}
          textColor={RELEVANCE_COLORS[interpretation.questionRelevance as keyof typeof RELEVANCE_COLORS].text}
        />
        <Badge 
          label={interpretation.outcome}
          backgroundColor={OUTCOME_COLORS[interpretation.outcome as keyof typeof OUTCOME_COLORS].bg}
        />
      </div>
      
      {interpretation.actionRequired && (
        <div className="text-xs text-purple-600">⚡ Action required</div>
      )}
    </div>
  );

  const PatternCard = ({ pattern }: { pattern: AspectPattern }) => (
    <div className="border border-black p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="font-space-grotesk font-bold text-lg mr-2">
            {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)}
          </span>
          <Badge 
            label={pattern.significance}
            backgroundColor={pattern.significance === 'high' ? '#e74c3c' : 
                   pattern.significance === 'medium' ? '#f2e356' : '#6b7280'}
            textColor={pattern.significance === 'medium' ? 'black' : 'white'}
          />
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <span className="font-bold">Planets:</span> {pattern.planets.join(' → ')}
      </div>
      
      {pattern.mediator && (
        <div className="text-sm mb-2">
          <span className="font-bold">Mediator:</span> {pattern.mediator}
        </div>
      )}
      
      {pattern.collector && (
        <div className="text-sm mb-2">
          <span className="font-bold">Collector:</span> {pattern.collector}
        </div>
      )}
      
      <div className="text-xs text-gray-700 mb-2">{pattern.description}</div>
      
      <InfoBox 
        title="Interpretation:"
        content={pattern.interpretation}
        backgroundColor={INFO_BOX_COLORS.light}
        className="mt-3"
      />
      
      <div className="text-xs mt-2 text-gray-600">
        <span className="font-bold">Timing:</span> {pattern.timing}
      </div>
    </div>
  );

  const AspectDetailPanel = ({ aspect, interpretation }: { aspect: AspectAnalysis; interpretation: AspectInterpretation }) => (
    <div className="bg-white border border-black p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span 
            className="w-8 h-8 flex items-center justify-center text-white text-lg mr-4 border border-black"
            style={{ backgroundColor: getAspectColor(aspect.aspect) }}
          >
            {getAspectSymbol(aspect.aspect)}
          </span>
          <h3 className="font-space-grotesk font-bold text-2xl">
            {aspect.planet1} {aspect.aspect} {aspect.planet2}
          </h3>
        </div>
        <button 
          onClick={() => setSelectedAspect(null)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-space-grotesk font-bold mb-3">Aspect Details</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Type:</strong> {aspect.aspect}</div>
            <div><strong>Exact Degree:</strong> {aspect.exactDegree}°</div>
            <div><strong>Current Orb:</strong> {aspect.orb.toFixed(2)}°</div>
            <div><strong>Strength:</strong> {aspect.strength}</div>
            <div><strong>Direction:</strong> {aspect.applying ? 'Applying (→)' : 'Separating (←)'}</div>
            <div><strong>Significance:</strong> {aspect.significance}</div>
          </div>
          
          <h4 className="font-space-grotesk font-bold mb-3 mt-6">Traditional Nature</h4>
          <InfoBox
            title={ASPECT_NATURES[aspect.aspect].description}
            content={<div className="text-xs">{ASPECT_NATURES[aspect.aspect].interpretation}</div>}
            backgroundColor={getAspectColor(aspect.aspect)}
            textColor="white"
          />
        </div>
        
        <div>
          <h4 className="font-space-grotesk font-bold mb-3">Question Context</h4>
          <div className="space-y-3">
            <InfoBox
              title={`Relevance: ${interpretation.questionRelevance}`}
              content={<div className="text-xs">How important this aspect is for your question</div>}
              backgroundColor="#33ccff"
              textColor="white"
            />
            
            <InfoBox
              title={`Outcome: ${interpretation.outcome}`}
              content={<div className="text-xs">General nature of this influence</div>}
              backgroundColor={OUTCOME_COLORS[interpretation.outcome as keyof typeof OUTCOME_COLORS].bg}
              textColor={OUTCOME_COLORS[interpretation.outcome as keyof typeof OUTCOME_COLORS].text}
            />
            
            <InfoBox
              title={`Timing: ${interpretation.timing}`}
              content={<div className="text-xs">When this influence manifests</div>}
              backgroundColor={INFO_BOX_COLORS.light}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-space-grotesk font-bold mb-3">Detailed Interpretation</h4>
        <ColoredBox backgroundColor="#51bd94" className="p-4">
          <div className="text-sm">{interpretation.contextualMeaning}</div>
        </ColoredBox>
        
        {interpretation.opportunities.length > 0 && (
          <ColoredBox backgroundColor="#f9e20e" textColor="black" className="mt-4 p-4">
            <div className="font-bold text-sm mb-2">Opportunities:</div>
            <ul className="text-sm space-y-1">
              {interpretation.opportunities.map((opp, index) => (
                <li key={index}>• {opp}</li>
              ))}
            </ul>
          </ColoredBox>
        )}
        
        {interpretation.warnings.length > 0 && (
          <ColoredBox backgroundColor={INFO_BOX_COLORS.warning} className="mt-4 p-4">
            <div className="font-bold text-sm mb-2">Warnings:</div>
            <ul className="text-sm space-y-1">
              {interpretation.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </ColoredBox>
        )}
        
        {interpretation.actionRequired && (
          <InfoBox
            title="Action Required"
            content="This aspect requires your active participation to manifest properly"
            backgroundColor="#29c9ff"
            textColor="white"
            className="mt-4 p-4"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader icon="⚹" title="Aspects & Planetary Connections" />
      
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'major', label: 'Major Aspects', icon: '⚹' },
          { id: 'patterns', label: 'Advanced Patterns', icon: '🔗' },
          { id: 'timing', label: 'Timing', icon: '⏰' },
          { id: 'context', label: 'Context', icon: '🎯' }
        ] as TabConfig[]).map((tab) => (
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

      {/* Aspect detail panel */}
      {selectedAspect && (
        <AspectDetailPanel 
          aspect={selectedAspect} 
          interpretation={aspectAnalysis.interpretations.find(
            int => int.aspect.planet1 === selectedAspect.planet1 && 
                   int.aspect.planet2 === selectedAspect.planet2
          )!}
        />
      )}

      {/* Content sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard value={aspectAnalysis.summary.totalAspects} label="Total Aspects" backgroundColor="#29c9ff" />
            <StatCard value={aspectAnalysis.summary.applyingAspects} label="Applying" backgroundColor="#51bd94" />
            <StatCard value={aspectAnalysis.summary.separatingAspects} label="Separating" backgroundColor="#f2e356" textColor="black" />
            <StatCard value={aspectAnalysis.summary.majorPatterns} label="Advanced Patterns" backgroundColor="#e74c3c" />
          </div>

          {/* Overall assessment */}
          <ColoredBox 
            backgroundColor={TONE_COLORS[aspectAnalysis.summary.overallTone as keyof typeof TONE_COLORS] || '#29c9ff'}
            className="p-4"
          >
            <h4 className="font-space-grotesk font-bold mb-2">Overall Aspect Assessment</h4>
            <div className="text-sm">
              Chart shows {aspectAnalysis.summary.overallTone} aspect patterns with {aspectAnalysis.summary.significance} significance. 
              {aspectAnalysis.summary.applyingAspects > 0 && ' Applying aspects indicate developing events.'}
              {aspectAnalysis.summary.majorPatterns > 0 && ' Advanced patterns detected - see Patterns tab for details.'}
            </div>
          </ColoredBox>

          {/* Core principles */}
          <ColoredBox backgroundColor={INFO_BOX_COLORS.light} textColor="black" className="p-4">
            <h4 className="font-space-grotesk font-bold mb-3">Frawley's Core Principles</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                { title: 'Placement vs Aspect', content: '"Placement shows, aspect brings" - aspects facilitate what placements promise' },
                { title: 'No Orbs in Horary', content: 'Either planets aspect or they don\'t - no gradual influence' },
                { title: 'Five Aspects Only', content: 'Conjunction, trine, square, sextile, opposition - no minor aspects' },
                { title: 'Applying = Future', content: 'Only applying aspects show events yet to come' }
              ].map((principle, index) => (
                <div key={index}>
                  <div className="font-bold mb-1">{principle.title}</div>
                  <div>{principle.content}</div>
                </div>
              ))}
            </div>
          </ColoredBox>
        </div>
      )}

      {activeSection === 'major' && (
        <div className="space-y-6">
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">Major Aspects in Chart</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aspectAnalysis.interpretations.map((interpretation, index) => (
                <AspectCard key={index} aspect={interpretation.aspect} interpretation={interpretation} />
              ))}
            </div>
          </div>

          {/* Aspect nature guide */}
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">Traditional Aspect Natures</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(ASPECT_NATURES).map(([aspect, nature]) => {
                // Use centralized darker aspect colors
                const bgColor = ASPECT_COLORS_DARK[aspect as keyof typeof ASPECT_COLORS_DARK] || '#374151';
                
                return (
                  <div key={aspect} className="p-3 border border-black" style={{ backgroundColor: bgColor }}>
                    <div className="flex items-center mb-2">
                      <span className="text-white text-lg mr-2">{getAspectSymbol(aspect)}</span>
                      <span className="font-bold text-white capitalize">{aspect}</span>
                    </div>
                    <div className="text-xs text-white mb-1">{nature.description}</div>
                    <div className="text-xs text-white opacity-90">{nature.keywords.join(' • ')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'patterns' && (
        <div className="space-y-6">
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">Advanced Aspect Patterns</h4>
            {aspectAnalysis.patterns.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {aspectAnalysis.patterns.map((pattern, index) => (
                  <PatternCard key={index} pattern={pattern} />
                ))}
              </div>
            ) : (
                <ColoredBox backgroundColor="#29c9ff" className="p-4">
                <div className="text-center">
                  No advanced patterns detected in this chart
                </div>
              </ColoredBox>
            )}
          </div>

          {/* Pattern explanations */}
          <div className="bg-white border border-black p-6">
            <h4 className="font-space-grotesk font-bold mb-4">Pattern Types Explained</h4>
            <div className="space-y-4">
              {[
                { title: 'Translation of Light', description: 'Planet A aspects Planet C, then Planet C aspects Planet B - C mediates between A and B' },
                { title: 'Collection of Light', description: 'Multiple planets aspect the same planet - unified outcome through single collector' },
                { title: 'Prohibition', description: 'Faster planet intervenes before main aspect completes - event prevented' }
              ].map((pattern, index) => (
                <InfoBox
                  key={index}
                  title={pattern.title}
                  content={pattern.description}
                  backgroundColor={INFO_BOX_COLORS.light}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'context' && (
        <div className="bg-white border border-black p-6">
          <h3 className="font-space-grotesk font-bold text-xl mb-4">Question Context Analysis</h3>
          
          <div className="space-y-4">
            <ColoredBox backgroundColor={INFO_BOX_COLORS.warning} className="p-4">
              <h4 className="font-bold mb-2">Current Question:</h4>
              <p className="text-sm">"{question.question}"</p>
            </ColoredBox>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Aspect Significance Rules</h4>
                <div className="space-y-2 text-sm">
                  <ColoredBox backgroundColor="#51bd94" className="p-2">
                    <span className="font-bold">High relevance:</span> Aspects involving significators
                  </ColoredBox>
                  <ColoredBox backgroundColor="#c6b307" textColor="black" className="p-2">
                    <span className="font-bold">Medium relevance:</span> General planetary aspects
                  </ColoredBox>
                  <ColoredBox backgroundColor="#6b7280" className="p-2">
                    <span className="font-bold">Low relevance:</span> Background planetary activity
                  </ColoredBox>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">Timing Principles</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>Exact aspects:</strong> Immediate influence</div>
                  <div>• <strong>Close aspects:</strong> Short-term (days to weeks)</div>
                  <div>• <strong>Wide aspects:</strong> Long-term (months)</div>
                  <div>• <strong>Applying only:</strong> Future events</div>
                  <div>• <strong>Separating:</strong> Past influences</div>
                </div>
              </div>
            </div>
            
            <InfoBox
              title="The Golden Rule of Aspects"
              content={
                <p>
                  "Placement shows, aspect brings" - Planetary placements show what can happen, 
                  aspects show how and when it actually happens. Always consider both together 
                  for complete interpretation.
                </p>
              }
              backgroundColor="#f2e356"
              textColor="black"
              className="p-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}