/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Aspects Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive aspect analysis and interpretation
 * for horary astrology, enhanced with detailed psychological insights
 * while maintaining traditional horary principles.
 */

import { getFullAspectInfo } from '../astrological/aspectInterpretations';

export interface AspectAnalysis {
  planet1: string;
  planet2: string;
  aspect: 'conjunction' | 'trine' | 'square' | 'sextile' | 'opposition' | 'quincunx';
  exactDegree: number;
  orb: number;
  applying: boolean;
  separating: boolean;
  strength: 'exact' | 'close' | 'wide';
  significance: 'major' | 'minor';
  perfectionTime?: string;
  description: string;
}

export interface AspectPattern {
  type: 'translation' | 'collection' | 'prohibition' | 'frustration' | 'refranation';
  planets: string[];
  mediator?: string;
  collector?: string;
  intervener?: string;
  description: string;
  interpretation: string;
  significance: 'high' | 'medium' | 'low';
  timing: string;
}

export interface AspectInterpretation {
  aspect: AspectAnalysis;
  questionRelevance: 'high' | 'medium' | 'low';
  timing: 'immediate' | 'short-term' | 'long-term';
  outcome: 'favorable' | 'challenging' | 'neutral';
  contextualMeaning: string;
  actionRequired: boolean;
  warnings: string[];
  opportunities: string[];
}

export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  sign: string;
  house: number;
  dailyMotion: number;
  retrograde: boolean;
}

// Traditional aspect definitions with reasonable orbs for chart analysis
export const MAJOR_ASPECTS = {
  conjunction: { degrees: 0, tolerance: 8, nature: 'union' },
  trine: { degrees: 120, tolerance: 8, nature: 'harmony' },
  square: { degrees: 90, tolerance: 8, nature: 'tension' },
  sextile: { degrees: 60, tolerance: 6, nature: 'opportunity' },
  opposition: { degrees: 180, tolerance: 8, nature: 'separation' },
  quincunx: { degrees: 150, tolerance: 3, nature: 'adjustment' }
} as const;

// Aspect nature descriptions
export const ASPECT_NATURES = {
  conjunction: {
    description: 'Union and blending of planetary energies',
    keywords: ['unity', 'merger', 'combination', 'blending'],
    interpretation: 'Planets act as one - complete merger of significations',
    context: 'Context determines whether beneficial or challenging'
  },
  trine: {
    description: 'Harmonious flow of energy between planets',
    keywords: ['harmony', 'ease', 'flow', 'natural'],
    interpretation: 'Easy manifestation - things happen naturally and beneficially',
    context: 'Generally favorable - effortless cooperation'
  },
  square: {
    description: 'Dynamic tension and constructive conflict',
    keywords: ['tension', 'challenge', 'obstacle', 'friction'],
    interpretation: 'Challenges that force action and growth - obstacles to overcome',
    context: 'Difficult but can drive progress through necessary friction'
  },
  sextile: {
    description: 'Opportunity requiring effort and activation',
    keywords: ['opportunity', 'potential', 'cooperation', 'talent'],
    interpretation: 'Supportive energy that rewards initiative - help yourself',
    context: 'Favorable if you take action - passive opportunities'
  },
  opposition: {
    description: 'Confrontation and awareness through contrast',
    keywords: ['opposition', 'awareness', 'confrontation', 'balance'],
    interpretation: 'External challenges and open conflicts seeking resolution',
    context: 'Tension that brings awareness - seeing both sides'
  },
  quincunx: {
    description: 'Awkward adjustment requiring constant adaptation',
    keywords: ['adjustment', 'adaptation', 'awkward', 'flexible'],
    interpretation: 'Requires ongoing fine-tuning and conscious modification',
    context: 'Neither easy nor difficult - needs continuous attention'
  }
} as const;

// Calculate exact aspect between two planets
export function calculateAspect(
  planet1: PlanetaryPosition,
  planet2: PlanetaryPosition
): AspectAnalysis | null {
  const longitude1 = planet1.longitude;
  const longitude2 = planet2.longitude;
  
  // Calculate angular separation
  let separation = Math.abs(longitude1 - longitude2);
  if (separation > 180) {
    separation = 360 - separation;
  }
  
  // Check for each major aspect
  for (const [aspectName, aspectData] of Object.entries(MAJOR_ASPECTS)) {
    const difference = Math.abs(separation - aspectData.degrees);
    
    if (difference <= aspectData.tolerance) {
      // Determine if applying or separating
      const fasterPlanet = Math.abs(planet1.dailyMotion) > Math.abs(planet2.dailyMotion) ? planet1 : planet2;
      const slowerPlanet = fasterPlanet === planet1 ? planet2 : planet1;
      
      // Simplified applying/separating logic
      const applying = !fasterPlanet.retrograde && 
                      ((fasterPlanet.longitude < slowerPlanet.longitude && separation < 180) ||
                       (fasterPlanet.longitude > slowerPlanet.longitude && separation > 180));
      
      const strength: 'exact' | 'close' | 'wide' = 
        difference <= 0.5 ? 'exact' : 
        difference <= 1 ? 'close' : 'wide';
      
      const aspectType = aspectName as keyof typeof MAJOR_ASPECTS;
      const nature = ASPECT_NATURES[aspectType];
      
      return {
        planet1: planet1.planet,
        planet2: planet2.planet,
        aspect: aspectType,
        exactDegree: aspectData.degrees,
        orb: difference,
        applying,
        separating: !applying,
        strength,
        significance: strength === 'exact' ? 'major' : 'minor',
        description: `${planet1.planet} ${aspectType} ${planet2.planet} - ${nature.description}`
      };
    }
  }
  
  return null;
}

// Find all aspects in a chart
export function findAllAspects(planets: PlanetaryPosition[]): AspectAnalysis[] {
  const aspects: AspectAnalysis[] = [];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const aspect = calculateAspect(planets[i], planets[j]);
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  return aspects.sort((a, b) => {
    // Sort by significance, then by strength
    if (a.significance !== b.significance) {
      return a.significance === 'major' ? -1 : 1;
    }
    return a.orb - b.orb;
  });
}

// Detect Translation of Light pattern
export function detectTranslationOfLight(planets: PlanetaryPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const allAspects = findAllAspects(planets);
  
  // Find planets that could be mediators (making multiple aspects)
  for (const mediator of planets) {
    const mediatorAspects = allAspects.filter(
      asp => (asp.planet1 === mediator.planet || asp.planet2 === mediator.planet) && asp.applying
    );
    
    if (mediatorAspects.length >= 2) {
      // Check if mediator connects two planets that don't aspect each other
      for (let i = 0; i < mediatorAspects.length; i++) {
        for (let j = i + 1; j < mediatorAspects.length; j++) {
          const aspect1 = mediatorAspects[i];
          const aspect2 = mediatorAspects[j];
          
          const otherPlanet1 = aspect1.planet1 === mediator.planet ? aspect1.planet2 : aspect1.planet1;
          const otherPlanet2 = aspect2.planet1 === mediator.planet ? aspect2.planet2 : aspect2.planet1;
          
          // Check if these two planets don't aspect each other directly
          const directAspect = allAspects.find(
            asp => (asp.planet1 === otherPlanet1 && asp.planet2 === otherPlanet2) ||
                   (asp.planet1 === otherPlanet2 && asp.planet2 === otherPlanet1)
          );
          
          if (!directAspect) {
            patterns.push({
              type: 'translation',
              planets: [otherPlanet1, mediator.planet, otherPlanet2],
              mediator: mediator.planet,
              description: `${mediator.planet} translates light between ${otherPlanet1} and ${otherPlanet2}`,
              interpretation: 'Events unfold through intermediary - third party brings parties together',
              significance: 'high',
              timing: 'Sequential - first aspect, then second aspect completes the pattern'
            });
          }
        }
      }
    }
  }
  
  return patterns;
}

// Detect Collection of Light pattern
export function detectCollectionOfLight(planets: PlanetaryPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const allAspects = findAllAspects(planets);
  
  // Find planets that collect light from multiple sources
  for (const collector of planets) {
    const incomingAspects = allAspects.filter(
      asp => ((asp.planet1 === collector.planet && !asp.applying) || 
              (asp.planet2 === collector.planet && asp.applying))
    );
    
    if (incomingAspects.length >= 2) {
      const sourcePlanets = incomingAspects.map(asp => 
        asp.planet1 === collector.planet ? asp.planet2 : asp.planet1
      );
      
      patterns.push({
        type: 'collection',
        planets: [...sourcePlanets, collector.planet],
        collector: collector.planet,
        description: `${collector.planet} collects light from ${sourcePlanets.join(' and ')}`,
        interpretation: 'Unified outcome - separate forces combine into single result',
        significance: 'high',
        timing: 'Simultaneous - all aspects must perfect for full effect'
      });
    }
  }
  
  return patterns;
}

// Detect Prohibition pattern
export function detectProhibition(planets: PlanetaryPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const allAspects = findAllAspects(planets).filter(asp => asp.applying);
  
  // Check for faster planets intervening between slower aspects
  for (const aspect of allAspects) {
    const planet1 = planets.find(p => p.planet === aspect.planet1)!;
    const planet2 = planets.find(p => p.planet === aspect.planet2)!;
    
    // Find potential intervening planets
    for (const intervener of planets) {
      if (intervener.planet === aspect.planet1 || intervener.planet === aspect.planet2) continue;
      
      // Check if intervener is faster and will aspect one of the planets first
      const fasterMotion = Math.abs(intervener.dailyMotion) > Math.abs(planet1.dailyMotion) &&
                          Math.abs(intervener.dailyMotion) > Math.abs(planet2.dailyMotion);
      
      if (fasterMotion) {
        // Check if intervener will aspect either planet before main aspect completes
        const interventionAspect1 = calculateAspect(intervener, planet1);
        const interventionAspect2 = calculateAspect(intervener, planet2);
        
        if ((interventionAspect1?.applying) || (interventionAspect2?.applying)) {
          patterns.push({
            type: 'prohibition',
            planets: [aspect.planet1, aspect.planet2, intervener.planet],
            intervener: intervener.planet,
            description: `${intervener.planet} prohibits ${aspect.planet1}-${aspect.planet2} ${aspect.aspect}`,
            interpretation: 'Event prevented - faster planet intervenes before aspect completes',
            significance: 'high',
            timing: 'Blocked - intervention occurs before main event'
          });
        }
      }
    }
  }
  
  return patterns;
}

// Analyze aspect relevance to specific question
export function analyzeAspectRelevance(
  aspect: AspectAnalysis,
  questionType: string,
  significators: { querent: string; quesited: string; context?: string }
): AspectInterpretation {
  
  const isSignificatorAspect = 
    aspect.planet1 === significators.querent || aspect.planet2 === significators.querent ||
    aspect.planet1 === significators.quesited || aspect.planet2 === significators.quesited;
  
  const questionRelevance: 'high' | 'medium' | 'low' = 
    isSignificatorAspect ? 'high' : 'medium';
  
  const timing: 'immediate' | 'short-term' | 'long-term' = 
    aspect.strength === 'exact' ? 'immediate' :
    aspect.strength === 'close' ? 'short-term' : 'long-term';
  
  // Get comprehensive aspect interpretation from our detailed dictionary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detailedAspectInfo = getFullAspectInfo({
    planet1: aspect.planet1.toLowerCase(),
    planet2: aspect.planet2.toLowerCase(),
    aspect: aspect.aspect,
    orb: aspect.orb,
    color: '',
    applying: false,
    angle: 0
  } as any);
  
  let outcome: 'favorable' | 'challenging' | 'neutral';
  
  if (aspect.aspect === 'trine' || aspect.aspect === 'sextile') {
    outcome = 'favorable';
  } else if (aspect.aspect === 'square' || aspect.aspect === 'opposition') {
    outcome = 'challenging';
  } else if (aspect.aspect === 'quincunx') {
    outcome = 'neutral'; // Quincunx requires adjustment
  } else {
    outcome = 'neutral'; // Conjunction depends on planets involved
  }
  
  // Start with the comprehensive interpretation as the base
  let contextualMeaning = detailedAspectInfo.interpretation;
  const warnings: string[] = [];
  const opportunities: string[] = [];
  
  // Add horary-specific context
  if (isSignificatorAspect) {
    if (aspect.applying) {
      contextualMeaning += ' **Horary Significance:** This aspect is forming and will directly influence the outcome of your question.';
      if (outcome === 'favorable') {
        opportunities.push('Positive development approaching - significator aspect favors your question');
        opportunities.push('The applying nature indicates this influence is still developing');
      } else if (outcome === 'challenging') {
        warnings.push('Challenge or obstacle approaching through significator connection');
        warnings.push('Monitor this developing aspect as it affects your core concern');
      } else {
        opportunities.push('Neutral but significant development approaching');
      }
    } else {
      contextualMeaning += ' **Horary Significance:** This aspect is separating - represents past influence on the situation that is now waning.';
      warnings.push('Past influence - less relevant to future outcome');
    }
  } else {
    contextualMeaning += ' **Horary Context:** Background planetary activity that provides additional context but is not central to your question.';
  }
  
  // Add timing context specific to horary
  contextualMeaning += ` **Timing:** ${timing === 'immediate' ? 'Immediate influence - exact or very close aspect' : 
    timing === 'short-term' ? 'Short-term influence - within days to weeks' : 
    'Long-term background influence - months timeframe'}.`;
  
  // Question-specific context with horary perspective
  if (questionType.includes('love') || questionType.includes('relationship')) {
    if (aspect.planet1 === 'Venus' || aspect.planet2 === 'Venus' || 
        aspect.planet1 === 'Mars' || aspect.planet2 === 'Mars') {
      contextualMeaning += ' **Relationship Focus:** Venus-Mars connections are particularly significant for love questions in horary.';
      if (outcome === 'favorable') {
        opportunities.push('Romantic or partnership energy supports your question');
      }
    }
  }
  
  if (questionType.includes('career') || questionType.includes('job')) {
    if (aspect.planet1 === 'Sun' || aspect.planet2 === 'Sun' ||
        aspect.planet1 === 'Saturn' || aspect.planet2 === 'Saturn') {
      contextualMeaning += ' **Career Focus:** Sun-Saturn connections relate directly to authority, career, and professional matters.';
      if (outcome === 'favorable') {
        opportunities.push('Professional or authority-related support for your question');
      }
    }
  }
  
  // Horary-specific action requirements
  const actionRequired = aspect.aspect === 'sextile' || 
                        (aspect.aspect === 'square' && aspect.applying) ||
                        (aspect.aspect === 'quincunx' && aspect.applying);
  
  if (actionRequired) {
    opportunities.push('This aspect rewards conscious effort and initiative');
  }
  
  return {
    aspect,
    questionRelevance,
    timing,
    outcome,
    contextualMeaning,
    actionRequired,
    warnings,
    opportunities
  };
}

// Get all advanced patterns in a chart
export function findAllPatterns(planets: PlanetaryPosition[]): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  
  patterns.push(...detectTranslationOfLight(planets));
  patterns.push(...detectCollectionOfLight(planets));
  patterns.push(...detectProhibition(planets));
  
  return patterns.sort((a, b) => {
    const significanceOrder = { high: 0, medium: 1, low: 2 };
    return significanceOrder[a.significance] - significanceOrder[b.significance];
  });
}

// Comprehensive aspect analysis for a chart
export function analyzeChartAspects(
  planets: PlanetaryPosition[],
  questionType: string = '',
  significators: { querent: string; quesited: string; context?: string } = { querent: '', quesited: '' }
): {
  aspects: AspectAnalysis[];
  patterns: AspectPattern[];
  interpretations: AspectInterpretation[];
  summary: {
    totalAspects: number;
    applyingAspects: number;
    separatingAspects: number;
    majorPatterns: number;
    significance: 'high' | 'medium' | 'low';
    overallTone: 'favorable' | 'challenging' | 'mixed';
  };
} {
  
  const aspects = findAllAspects(planets);
  const patterns = findAllPatterns(planets);
  
  const interpretations = aspects.map(aspect => 
    analyzeAspectRelevance(aspect, questionType, significators)
  );
  
  const applyingAspects = aspects.filter(asp => asp.applying).length;
  const separatingAspects = aspects.filter(asp => asp.separating).length;
  
  const favorableCount = interpretations.filter(int => int.outcome === 'favorable').length;
  const challengingCount = interpretations.filter(int => int.outcome === 'challenging').length;
  
  const overallTone: 'favorable' | 'challenging' | 'mixed' = 
    favorableCount > challengingCount ? 'favorable' :
    challengingCount > favorableCount ? 'challenging' : 'mixed';
  
  const significance: 'high' | 'medium' | 'low' = 
    aspects.filter(asp => asp.significance === 'major').length >= 3 ? 'high' :
    aspects.filter(asp => asp.significance === 'major').length >= 1 ? 'medium' : 'low';
  
  return {
    aspects,
    patterns,
    interpretations,
    summary: {
      totalAspects: aspects.length,
      applyingAspects,
      separatingAspects,
      majorPatterns: patterns.length,
      significance,
      overallTone
    }
  };
}

// Helper function to get aspect symbol
export function getAspectSymbol(aspect: string): string {
  const symbols = {
    conjunction: '☌',
    trine: '△',
    square: '□',
    sextile: '⚹',
    opposition: '☍',
    quincunx: '⚻'
  };
  return symbols[aspect as keyof typeof symbols] || '•';
}

// Helper function to get aspect color
export function getAspectColor(aspect: string): string {
  const colors = {
    conjunction: "#1976d2", // Dark blue - neutral union
    trine: "#388e3c", // Dark green - harmonious
    square: "#d32f2f", // Dark red - challenging
    sextile: "#f57c00", // Dark orange - opportunity
    opposition: "#c2185b", // Dark pink - confrontation
    quincunx: "#9c27b0", // Purple - adjustment
  };
  return colors[aspect as keyof typeof colors] || '#19181a';
}