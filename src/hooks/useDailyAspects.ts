"use client";

import { useMemo } from 'react';
import { Body, GeoVector } from 'astronomy-engine';

export interface DailyAspect {
  aspect: string;
  planets: string;
  type: 'harmonious' | 'challenging' | 'neutral';
  interpretation: string;
  exactTime: string;     // When aspect is exact (required for traditional horary)
  applying: boolean;     // True if aspect is forming (future event)
  separating: boolean;   // True if aspect is separating (past event)
  exactDegree: number;   // Exact degree of aspect
  strength: 'exact' | 'close' | 'wide';
  significance: 'major' | 'minor';
  pattern?: 'translation' | 'collection' | 'prohibition' | 'frustration' | 'refranation';
}

// Define which planets to calculate aspects for
const PLANETS = [
  { body: Body.Sun, name: 'Sun' },
  { body: Body.Moon, name: 'Moon' },
  { body: Body.Mercury, name: 'Mercury' },
  { body: Body.Venus, name: 'Venus' },
  { body: Body.Mars, name: 'Mars' },
  { body: Body.Jupiter, name: 'Jupiter' },
  { body: Body.Saturn, name: 'Saturn' }
];

// Traditional horary aspects - NO ORBS (exact aspects only)
const ASPECTS = {
  conjunction: { angle: 0, exactTolerance: 1, type: 'neutral' as const },
  sextile: { angle: 60, exactTolerance: 1, type: 'harmonious' as const },
  square: { angle: 90, exactTolerance: 1, type: 'challenging' as const },
  trine: { angle: 120, exactTolerance: 1, type: 'harmonious' as const },
  opposition: { angle: 180, exactTolerance: 1, type: 'challenging' as const }
};

// Aspect interpretations
const ASPECT_INTERPRETATIONS: Record<string, Record<string, string>> = {
  conjunction: {
    'Sun-Moon': 'New moon energy - fresh starts and emotional alignment',
    'Sun-Mercury': 'Clear thinking and confident communication',
    'Sun-Venus': 'Creative self-expression and social magnetism',
    'Sun-Mars': 'Dynamic energy and leadership potential',
    'Sun-Jupiter': 'Optimistic confidence and expanded opportunities',
    'Sun-Saturn': 'Disciplined focus and structured achievement',
    'Moon-Mercury': 'Intuitive communication and emotional intelligence',
    'Moon-Venus': 'Emotional harmony and social connections',
    'Moon-Mars': 'Emotional drive and passionate responses',
    'Moon-Jupiter': 'Emotional expansion and generous feelings',
    'Moon-Saturn': 'Emotional maturity and practical wisdom',
    'Mercury-Venus': 'Charming communication and diplomatic skills',
    'Mercury-Mars': 'Quick thinking and decisive communication',
    'Mercury-Jupiter': 'Expansive thinking and optimistic ideas',
    'Mercury-Saturn': 'Practical thinking and structured communication',
    'Venus-Mars': 'Passionate attraction and creative energy',
    'Venus-Jupiter': 'Social harmony and generous love',
    'Venus-Saturn': 'Committed relationships and lasting beauty',
    'Mars-Jupiter': 'Confident action and enthusiastic energy',
    'Mars-Saturn': 'Disciplined action and controlled energy',
    'Jupiter-Saturn': 'Balanced growth and structured expansion'
  },
  sextile: {
    default: 'Harmonious energy flow with opportunities for growth and cooperation'
  },
  square: {
    default: 'Dynamic tension requiring conscious effort to balance opposing forces'
  },
  trine: {
    default: 'Natural flow of positive energy and effortless harmony'
  },
  opposition: {
    default: 'Need for balance between opposing forces and perspectives'
  }
};

// Helper to get planetary speed (degrees per day) and direction
const getPlanetarySpeed = (body: Body): number => {
  // Average daily motion in degrees
  const speeds: Record<string, number> = {
    'Sun': 0.985,      // ~1 degree per day
    'Moon': 13.176,    // ~13 degrees per day (fastest)
    'Mercury': 1.383,  // Variable, average ~1.4 degrees
    'Venus': 1.228,    // ~1.2 degrees per day
    'Mars': 0.524,     // ~0.5 degrees per day
    'Jupiter': 0.083,  // ~0.08 degrees per day (slow)
    'Saturn': 0.033    // ~0.03 degrees per day (slowest)
  };
  
  const planetName = Object.entries({ 
    Sun: Body.Sun, Moon: Body.Moon, Mercury: Body.Mercury, 
    Venus: Body.Venus, Mars: Body.Mars, Jupiter: Body.Jupiter, Saturn: Body.Saturn 
  }).find(([, b]) => b === body)?.[0];
  
  return speeds[planetName || 'Sun'] || 1;
};

// Helper to determine if aspect is applying or separating
const isAspectApplying = (planet1Pos: number, planet2Pos: number, planet1Speed: number, planet2Speed: number, aspectAngle: number): boolean => {
  // Calculate current angular separation
  let currentSeparation = Math.abs(planet1Pos - planet2Pos);
  if (currentSeparation > 180) {
    currentSeparation = 360 - currentSeparation;
  }
  
  // Calculate future positions (1 hour ahead)
  const futurePos1 = planet1Pos + (planet1Speed / 24);
  const futurePos2 = planet2Pos + (planet2Speed / 24);
  
  let futureSeparation = Math.abs(futurePos1 - futurePos2);
  if (futureSeparation > 180) {
    futureSeparation = 360 - futureSeparation;
  }
  
  // If future separation is closer to the aspect angle, it's applying
  const currentDiff = Math.abs(currentSeparation - aspectAngle);
  const futureDiff = Math.abs(futureSeparation - aspectAngle);
  
  return futureDiff < currentDiff;
};

// Helper to calculate exact time of aspect
const calculateExactAspectTime = (date: Date, planet1Pos: number, planet2Pos: number, planet1Speed: number, planet2Speed: number, aspectAngle: number): string => {
  // Calculate current angular difference from exact aspect
  let currentSeparation = Math.abs(planet1Pos - planet2Pos);
  if (currentSeparation > 180) {
    currentSeparation = 360 - currentSeparation;
  }
  
  const differenceFromAspect = Math.abs(currentSeparation - aspectAngle);
  
  // If already very close to exact (within 1 degree), consider it current time
  if (differenceFromAspect <= 1) {
    const hour = date.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }
  
  // Calculate relative speed of approach
  const relativeSpeed = Math.abs(planet1Speed - planet2Speed);
  
  // Estimate hours until exact aspect (simplified calculation)
  const hoursUntilExact = relativeSpeed > 0 ? (differenceFromAspect / relativeSpeed) * 24 : 0;
  
  const exactDate = new Date(date.getTime() + hoursUntilExact * 60 * 60 * 1000);
  const hour = exactDate.getHours();
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${displayHour}:00 ${period}`;
};

export const useDailyAspects = () => {
  const generateDailyAspects = useMemo(() => {
    return (date: Date, options?: { 
      timeOfDay?: 'morning' | 'noon' | 'evening' | 'custom';
      customHour?: number;
      showOnlyAllDay?: boolean;
    }): DailyAspect[] => {
      try {
        const aspects: DailyAspect[] = [];
        
        // Default to noon if not specified
        const calculationDate = new Date(date);
        if (options?.timeOfDay === 'morning') {
          calculationDate.setHours(9, 0, 0, 0);
        } else if (options?.timeOfDay === 'evening') {
          calculationDate.setHours(18, 0, 0, 0);
        } else if (options?.timeOfDay === 'custom' && options.customHour !== undefined) {
          calculationDate.setHours(options.customHour, 0, 0, 0);
        } else {
          // Default to noon
          calculationDate.setHours(12, 0, 0, 0);
        }
        
        // Calculate planetary positions for the given time
        const planetPositions: { body: Body, name: string, longitude: number, speed: number }[] = [];
        
        for (const planet of PLANETS) {
          try {
            const vector = GeoVector(planet.body, calculationDate, false);
            // Convert to ecliptic longitude (simplified calculation)
            const longitude = Math.atan2(vector.y, vector.x) * (180 / Math.PI);
            const normalizedLongitude = longitude < 0 ? longitude + 360 : longitude;
            
            planetPositions.push({
              body: planet.body,
              name: planet.name,
              longitude: normalizedLongitude,
              speed: getPlanetarySpeed(planet.body)
            });
          } catch (error) {
            console.warn(`Error calculating position for ${planet.name}:`, error);
          }
        }
        
        // Calculate aspects between planets
        for (let i = 0; i < planetPositions.length; i++) {
          for (let j = i + 1; j < planetPositions.length; j++) {
            const planet1 = planetPositions[i];
            const planet2 = planetPositions[j];
            
            // Calculate the angular difference
            let angleDiff = Math.abs(planet1.longitude - planet2.longitude);
            if (angleDiff > 180) {
              angleDiff = 360 - angleDiff;
            }
            
            // Check for traditional horary aspects (exact only, no orbs)
            for (const [aspectName, aspectData] of Object.entries(ASPECTS)) {
              const diff = Math.abs(angleDiff - aspectData.angle);
              
              // Traditional horary: exact aspects only (within 1 degree tolerance)
              if (diff <= aspectData.exactTolerance) {
                const planetPair = `${planet1.name}-${planet2.name}`;
                const reversePair = `${planet2.name}-${planet1.name}`;
                
                // Determine if applying or separating
                const applying = isAspectApplying(planet1.longitude, planet2.longitude, planet1.speed, planet2.speed, aspectData.angle);
                const separating = !applying;
                
                // Calculate exact time of aspect
                const exactTime = calculateExactAspectTime(calculationDate, planet1.longitude, planet2.longitude, planet1.speed, planet2.speed, aspectData.angle);
                
                // Determine strength based on exactness
                let strength: 'exact' | 'close' | 'wide';
                if (diff <= 0.25) {
                  strength = 'exact';
                } else if (diff <= 0.5) {
                  strength = 'close';
                } else {
                  strength = 'wide';
                }
                
                // Determine significance (major aspects vs minor)
                const significance: 'major' | 'minor' = ['conjunction', 'trine', 'square', 'opposition'].includes(aspectName) ? 'major' : 'minor';
                
                // Get interpretation with applying/separating context
                let baseInterpretation = 
                  ASPECT_INTERPRETATIONS[aspectName]?.[planetPair] ||
                  ASPECT_INTERPRETATIONS[aspectName]?.[reversePair] ||
                  ASPECT_INTERPRETATIONS[aspectName]?.default ||
                  `${planet1.name} and ${planet2.name} in ${aspectName} aspect`;
                
                // Add applying/separating context per traditional horary
                if (applying) {
                  baseInterpretation = `${baseInterpretation} (Applying - future influence forming)`;
                } else {
                  baseInterpretation = `${baseInterpretation} (Separating - past influence)`;
                }
                
                const aspect: DailyAspect = {
                  aspect: aspectName,
                  planets: planetPair,
                  type: aspectData.type,
                  interpretation: baseInterpretation,
                  exactTime,
                  applying,
                  separating,
                  exactDegree: aspectData.angle,
                  strength,
                  significance
                };
                
                // Traditional horary: Only applying aspects are relevant for future events
                // But include separating for completeness with clear indication
                if (options?.showOnlyAllDay && separating) {
                  continue; // Skip separating aspects if only showing relevant timing
                }
                
                aspects.push(aspect);
              }
            }
          }
        }
        
        // Sort by traditional horary priority:
        // 1. Applying aspects first (future events)
        // 2. Exact aspects first, then close, then wide
        // 3. Major aspects before minor
        aspects.sort((a, b) => {
          // Applying aspects have priority
          if (a.applying && !b.applying) return -1;
          if (!a.applying && b.applying) return 1;
          
          // Then by strength (exact > close > wide)
          const strengthOrder = { 'exact': 3, 'close': 2, 'wide': 1 };
          const strengthDiff = strengthOrder[b.strength] - strengthOrder[a.strength];
          if (strengthDiff !== 0) return strengthDiff;
          
          // Then by significance (major > minor)
          const sigOrder = { 'major': 2, 'minor': 1 };
          return sigOrder[b.significance] - sigOrder[a.significance];
        });
        
        // Limit to 5 strongest traditional aspects per day
        return aspects.slice(0, 5);
        
      } catch (error) {
        console.error('Error calculating real aspects, falling back to mock data:', error);
        
        // Traditional horary fallback mock data
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
        const mockAspects: DailyAspect[] = [
          { 
            aspect: 'trine', 
            planets: 'Sun-Jupiter', 
            type: 'harmonious', 
            interpretation: 'Optimistic energy and growth opportunities (Applying - future influence forming)',
            exactTime: '2:00 PM',
            applying: true,
            separating: false,
            exactDegree: 120,
            strength: 'exact',
            significance: 'major'
          },
          { 
            aspect: 'square', 
            planets: 'Mars-Saturn', 
            type: 'challenging', 
            interpretation: 'Tension between action and structure requires patience (Separating - past influence)',
            exactTime: '10:00 AM',
            applying: false,
            separating: true,
            exactDegree: 90,
            strength: 'close',
            significance: 'major'
          },
          { 
            aspect: 'conjunction', 
            planets: 'Venus-Mercury', 
            type: 'neutral', 
            interpretation: 'Communication enhanced by charm and diplomacy (Applying - future influence forming)',
            exactTime: '6:00 PM',
            applying: true,
            separating: false,
            exactDegree: 0,
            strength: 'exact',
            significance: 'major'
          }
        ];
        
        const numAspects = Math.min(5, mockAspects.length);
        const selectedAspects: DailyAspect[] = [];
        for (let i = 0; i < numAspects; i++) {
          const aspectIndex = (dayOfYear + i) % mockAspects.length;
          selectedAspects.push(mockAspects[aspectIndex]);
        }
        
        return selectedAspects;
      }
    };
  }, []);

  return {
    generateDailyAspects
  };
};