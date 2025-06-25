"use client";

import { useMemo } from 'react';
import { Body, GeoVector } from 'astronomy-engine';

export interface DailyAspect {
  aspect: string;
  planets: string;
  type: 'harmonious' | 'challenging' | 'neutral';
  interpretation: string;
  startTime?: string;    // When aspect comes within orb
  exactTime?: string;    // When aspect is exact
  endTime?: string;      // When aspect leaves orb
  isAllDay?: boolean;    // True if aspect lasts most of the day
  strength?: number;     // 0-100 indicating how close to exact
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

// Aspect definitions with orbs (degrees)
const ASPECTS = {
  conjunction: { angle: 0, orb: 8, type: 'neutral' as const },
  sextile: { angle: 60, orb: 6, type: 'harmonious' as const },
  square: { angle: 90, orb: 8, type: 'challenging' as const },
  trine: { angle: 120, orb: 8, type: 'harmonious' as const },
  opposition: { angle: 180, orb: 8, type: 'challenging' as const }
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

// Helper to get planetary speed (degrees per day)
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
            
            // Check for aspects
            for (const [aspectName, aspectData] of Object.entries(ASPECTS)) {
              const diff = Math.abs(angleDiff - aspectData.angle);
              if (diff <= aspectData.orb) {
                const planetPair = `${planet1.name}-${planet2.name}`;
                const reversePair = `${planet2.name}-${planet1.name}`;
                
                // Calculate how long the aspect lasts based on combined planetary speeds
                const combinedSpeed = planet1.speed + planet2.speed;
                const hoursInOrb = (aspectData.orb * 2) / combinedSpeed * 24;
                const isAllDay = hoursInOrb >= 20; // Aspect lasts at least 20 hours
                
                // Calculate strength (0-100, where 100 is exact)
                const strength = Math.round((1 - diff / aspectData.orb) * 100);
                
                // Estimate time windows (simplified - in production would calculate exact times)
                const exactOffsetHours = diff / combinedSpeed * 24;
                const orbHours = aspectData.orb / combinedSpeed * 24;
                
                let startTime: string | undefined;
                let exactTime: string | undefined;
                let endTime: string | undefined;
                
                if (!isAllDay) {
                  const baseHour = calculationDate.getHours();
                  const exactHour = baseHour - exactOffsetHours;
                  const startHour = exactHour - orbHours;
                  const endHour = exactHour + orbHours;
                  
                  const formatHour = (hour: number) => {
                    const h = Math.floor((hour + 24) % 24);
                    const period = h >= 12 ? 'PM' : 'AM';
                    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return `${displayHour}:00 ${period}`;
                  };
                  
                  if (startHour >= 0 && startHour < 24) startTime = formatHour(startHour);
                  if (exactHour >= 0 && exactHour < 24) exactTime = formatHour(exactHour);
                  if (endHour >= 0 && endHour < 24) endTime = formatHour(endHour);
                }
                
                // Get interpretation
                const specificInterpretation = 
                  ASPECT_INTERPRETATIONS[aspectName]?.[planetPair] ||
                  ASPECT_INTERPRETATIONS[aspectName]?.[reversePair] ||
                  ASPECT_INTERPRETATIONS[aspectName]?.default ||
                  `${planet1.name} and ${planet2.name} in ${aspectName} aspect`;
                
                const aspect: DailyAspect = {
                  aspect: aspectName,
                  planets: planetPair,
                  type: aspectData.type,
                  interpretation: specificInterpretation,
                  strength,
                  isAllDay,
                  ...(startTime && { startTime }),
                  ...(exactTime && { exactTime }),
                  ...(endTime && { endTime })
                };
                
                // Skip if only showing all-day aspects and this isn't one
                if (options?.showOnlyAllDay && !isAllDay) {
                  continue;
                }
                
                aspects.push(aspect);
              }
            }
          }
        }
        
        // Sort by strength (stronger aspects first)
        aspects.sort((a, b) => (b.strength || 0) - (a.strength || 0));
        
        // Limit to 5 strongest aspects per day (increased from 3)
        return aspects.slice(0, 5);
        
      } catch (error) {
        console.error('Error calculating real aspects, falling back to mock data:', error);
        
        // Enhanced fallback mock data
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
        const mockAspects: DailyAspect[] = [
          { 
            aspect: 'trine', 
            planets: 'Sun-Jupiter', 
            type: 'harmonious', 
            interpretation: 'Optimistic energy and growth opportunities',
            isAllDay: true,
            strength: 85
          },
          { 
            aspect: 'square', 
            planets: 'Mars-Saturn', 
            type: 'challenging', 
            interpretation: 'Tension between action and structure requires patience',
            startTime: '8:00 AM',
            exactTime: '2:00 PM',
            endTime: '8:00 PM',
            isAllDay: false,
            strength: 70
          },
          { 
            aspect: 'conjunction', 
            planets: 'Venus-Mercury', 
            type: 'neutral', 
            interpretation: 'Communication enhanced by charm and diplomacy',
            isAllDay: true,
            strength: 95
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