/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astrological Event Detection Utilities
 * 
 * This module contains all the logic for detecting various types of astrological events
 * from planetary positions. Each function takes a date and returns an array of events
 * detected for that date.
 */

import { calculatePlanetaryPositions, PlanetPosition } from './natalChart';
import { 
  getSignThemes, 
  getElementFromSign, 
  getElementThemes, 
  getConjunctionRarity, 
  getConjunctionImpact, 
  getNextSign 
} from './astrological/eventData';

export interface AstrologicalEvent {
  id: string;
  name: string;
  date: Date;
  type: 'eclipse' | 'stellium' | 'grandTrine' | 'alignment' | 'retrograde' | 'conjunction' | 'moonPhase' | 'voidMoon' | 'planetSignChange' | 'planetInSign';
  description: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'veryRare';
  impact: string;
  // Duration information
  endDate?: Date;
  startDate?: Date; // For ongoing transits, when they actually started
  duration?: {
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
    isOngoing?: boolean; // For events like retrogrades that last weeks/months
  };
}

/**
 * Detects planetary retrogrades for a given date
 */
export const detectRetrogrades = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0); // Use Greenwich for global events
  
  positions.planets.forEach(planet => {
    if (planet.retrograde && ['mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(planet.name.toLowerCase())) {
      // Retrograde durations vary by planet
      const getDuration = (planetName: string) => {
        switch(planetName.toLowerCase()) {
          case 'mercury': return { weeks: 3 };
          case 'venus': return { weeks: 6 };
          case 'mars': return { weeks: 10 };
          case 'jupiter': return { weeks: 16 };
          case 'saturn': return { weeks: 20 };
          default: return { weeks: 3 };
        }
      };
      
      const duration = getDuration(planet.name);
      const endDate = new Date(date);
      if (duration.weeks) {
        endDate.setDate(endDate.getDate() + (duration.weeks * 7));
      }
      
      events.push({
        id: `retro_${planet.name}_${date.getTime()}`,
        name: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} Retrograde in ${planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}`,
        date: new Date(date),
        type: 'retrograde',
        description: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} appears to move backward through ${planet.sign}`,
        emoji: planet.name.toLowerCase() === 'mercury' ? '⏪' : '🌀',
        rarity: planet.name.toLowerCase() === 'mercury' ? 'common' : 'uncommon',
        impact: planet.name.toLowerCase() === 'mercury' 
          ? 'Review communications, back up data, reconnect with the past'
          : `Reassess ${planet.name.toLowerCase()} themes in your life`,
        endDate,
        duration: { ...duration, isOngoing: true }
      });
    }
  });
  
  return events;
};

/**
 * Detects stelliums (3+ planets in the same sign) for a given date
 */
export const detectStelliums = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Group planets by sign
  const planetsBySign: { [sign: string]: PlanetPosition[] } = {};
  positions.planets.forEach(planet => {
    if (!planetsBySign[planet.sign]) planetsBySign[planet.sign] = [];
    planetsBySign[planet.sign].push(planet);
  });
  
  // Find stelliums (3+ planets in same sign)
  Object.entries(planetsBySign).forEach(([sign, planets]) => {
    if (planets.length >= 3) {
      const planetNames = planets.map(p => p.name).join(', ');
      
      // Stelliums last weeks to months depending on planet speeds
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 21); // ~3 weeks average
      
      // Create unique ID based on planets involved
      const planetList = planets.map(p => p.name.toLowerCase()).sort().join('-');
      
      events.push({
        id: `stellium_${sign}_${planetList}_${date.getTime()}`,
        name: `Stellium in ${sign.charAt(0).toUpperCase() + sign.slice(1)}`,
        date: new Date(date),
        type: 'stellium',
        description: `${planets.length} planets gather in ${sign}: ${planetNames}`,
        emoji: '✨',
        rarity: planets.length >= 4 ? 'rare' : 'uncommon',
        impact: `Intense focus on ${sign} themes: ${getSignThemes(sign)}`,
        endDate,
        duration: { weeks: 3, isOngoing: true }
      });
    }
  });
  
  return events;
};

/**
 * Detects grand trines (3 planets ~120° apart) for a given date
 */
export const detectGrandTrines = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Check for grand trines (3 planets ~120° apart)
  const planets = positions.planets;
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      for (let k = j + 1; k < planets.length; k++) {
        const angle1 = Math.abs(planets[i].longitude - planets[j].longitude);
        const angle2 = Math.abs(planets[j].longitude - planets[k].longitude);
        const angle3 = Math.abs(planets[k].longitude - planets[i].longitude);
        
        // Check if angles are close to 120° (within 8° orb)
        if ([angle1, angle2, angle3].every(angle => Math.abs(angle - 120) <= 8 || Math.abs(angle - 240) <= 8)) {
          const element = getElementFromSign(planets[i].sign);
          
          // Grand trine duration depends on the planets involved
          const getGrandTrineDuration = (planet1: string, planet2: string, planet3: string) => {
            const slowPlanets = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
            const fastPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars'];
            
            const planetsInvolved = [planet1, planet2, planet3];
            const slowCount = planetsInvolved.filter(p => slowPlanets.includes(p.toLowerCase())).length;
            
            if (slowCount >= 2) {
              // Multiple slow planets: grand trine lasts weeks/months
              return { weeks: 6 };
            } else if (slowCount === 1) {
              // One slow planet: grand trine lasts days/weeks
              return { weeks: 2 };
            } else {
              // All fast planets: grand trine lasts days
              return { days: 5 };
            }
          };
          
          const duration = getGrandTrineDuration(planets[i].name, planets[j].name, planets[k].name);
          const endDate = new Date(date);
          
          if (duration.weeks) {
            endDate.setDate(endDate.getDate() + (duration.weeks * 7));
          } else if (duration.days) {
            endDate.setDate(endDate.getDate() + duration.days);
          }
          
          events.push({
            id: `trine_${i}_${j}_${k}_${date.getTime()}`,
            name: `Grand ${element} Trine`,
            date: new Date(date),
            type: 'grandTrine',
            description: `${planets[i].name}, ${planets[j].name}, and ${planets[k].name} form a perfect triangle`,
            emoji: '🔺',
            rarity: 'rare',
            impact: `Harmonious flow of ${element.toLowerCase()} energy enhancing ${getElementThemes(element)}`,
            endDate,
            duration: { ...duration, isOngoing: duration.weeks ? true : false }
          });
          break;
        }
      }
    }
  }
  
  return events;
};

/**
 * Detects significant planetary conjunctions for a given date
 */
export const detectConjunctions = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Check for significant conjunctions (within 5°)
  const planets = positions.planets;
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const angle = Math.abs(planets[i].longitude - planets[j].longitude);
      if (angle <= 5 || angle >= 355) {
        // Skip common moon conjunctions
        if (planets[i].name.toLowerCase() === 'moon' || planets[j].name.toLowerCase() === 'moon') continue;
        
        const rarity = getConjunctionRarity(planets[i].name, planets[j].name);
        
        // Conjunction duration depends on planet speeds
        const getConjunctionDuration = (planet1: string, planet2: string) => {
          const slowPlanets = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
          const fastPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars'];
          
          const p1Slow = slowPlanets.includes(planet1.toLowerCase());
          const p2Slow = slowPlanets.includes(planet2.toLowerCase());
          
          if (p1Slow && p2Slow) {
            // Both slow planets: conjunction lasts weeks/months
            return { weeks: 4 };
          } else if (p1Slow || p2Slow) {
            // One slow, one fast: conjunction lasts days/weeks
            return { weeks: 1 };
          } else {
            // Both fast planets: conjunction lasts hours/days
            return { days: 2 };
          }
        };
        
        const duration = getConjunctionDuration(planets[i].name, planets[j].name);
        const endDate = new Date(date);
        
        if (duration.weeks) {
          endDate.setDate(endDate.getDate() + (duration.weeks * 7));
        } else if (duration.days) {
          endDate.setDate(endDate.getDate() + duration.days);
        }
        
        events.push({
          id: `conj_${i}_${j}_${date.getTime()}`,
          name: `${planets[i].name}-${planets[j].name} Conjunction`,
          date: new Date(date),
          type: 'conjunction',
          description: `${planets[i].name} and ${planets[j].name} unite in ${planets[i].sign}`,
          emoji: '🌊',
          rarity,
          impact: getConjunctionImpact(planets[i].name, planets[j].name),
          endDate,
          duration: { ...duration, isOngoing: duration.weeks ? true : false }
        });
      }
    }
  }
  
  return events;
};

/**
 * Detects moon phases for a given date
 */
export const detectMoonPhases = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Find moon and sun positions
  const moon = positions.planets.find(p => p.name.toLowerCase() === 'moon');
  const sun = positions.planets.find(p => p.name.toLowerCase() === 'sun');
  
  if (!moon || !sun) return events;
  
  // Calculate moon phase based on sun-moon angle
  let moonSunAngle = moon.longitude - sun.longitude;
  if (moonSunAngle < 0) moonSunAngle += 360;
  if (moonSunAngle > 360) moonSunAngle -= 360;
  
  // Detect major moon phases (within 5 degrees for better detection)
  const phaseThreshold = 5;
  
  if (moonSunAngle <= phaseThreshold || moonSunAngle >= (360 - phaseThreshold)) {
    // New Moon (0 degrees)
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 8);
    events.push({
      id: `new_moon_${date.getTime()}`,
      name: `New Moon in ${moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1)}`,
      date: new Date(date),
      type: 'moonPhase',
      description: `The Moon and Sun unite in ${moon.sign}, bringing fresh starts and new intentions`,
      emoji: '🌑',
      rarity: 'common',
      impact: 'Perfect for setting intentions, starting new projects, and planting seeds for future growth',
      endDate,
      duration: { hours: 8 }
    });
  } else if (Math.abs(moonSunAngle - 90) <= phaseThreshold) {
    // First Quarter (90 degrees - waxing)
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 8);
    events.push({
      id: `first_quarter_${date.getTime()}`,
      name: `First Quarter Moon in ${moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1)}`,
      date: new Date(date),
      type: 'moonPhase',
      description: `The Moon reaches first quarter in ${moon.sign}, bringing challenges and decisions`,
      emoji: '🌓',
      rarity: 'common',
      impact: 'Time to take action, overcome obstacles, and make important decisions',
      endDate,
      duration: { hours: 8 }
    });
  } else if (Math.abs(moonSunAngle - 180) <= phaseThreshold) {
    // Full Moon (180 degrees)
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 8);
    events.push({
      id: `full_moon_${date.getTime()}`,
      name: `Full Moon in ${moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1)}`,
      date: new Date(date),
      type: 'moonPhase',
      description: `The Moon reaches fullness in ${moon.sign}, illuminating emotions and bringing clarity`,
      emoji: '🌕',
      rarity: 'common',
      impact: 'Time for completion, releasing what no longer serves, and emotional breakthroughs',
      endDate,
      duration: { hours: 8 }
    });
  } else if (Math.abs(moonSunAngle - 270) <= phaseThreshold) {
    // Last Quarter (270 degrees - waning)
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 8);
    events.push({
      id: `last_quarter_${date.getTime()}`,
      name: `Last Quarter Moon in ${moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1)}`,
      date: new Date(date),
      type: 'moonPhase',
      description: `The Moon reaches last quarter in ${moon.sign}, encouraging release and forgiveness`,
      emoji: '🌗',
      rarity: 'common',
      impact: 'Time to let go, forgive, and clear away what no longer serves your growth',
      endDate,
      duration: { hours: 8 }
    });
  }
  
  return events;
};

/**
 * Detects void of course moon periods for a given date
 */
export const detectVoidMoon = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  const moon = positions.planets.find(p => p.name.toLowerCase() === 'moon');
  if (!moon) return events;
  
  // Calculate if moon is void of course
  // Moon is void when it makes no more major aspects before changing signs
  const moonSignBoundary = Math.floor(moon.longitude / 30) * 30;
  const nextSignBoundary = moonSignBoundary + 30;
  const degreesToNextSign = nextSignBoundary - moon.longitude;
  
  // Simple void detection: if moon is in the last 5 degrees of a sign
  // In reality, this would require checking future aspects, but this is a simplified version
  if (degreesToNextSign <= 5) {
    const nextSign = getNextSign(moon.sign);
    
    // Void moon periods typically last a few hours to a day
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 12); // Average 12 hours
    
    events.push({
      id: `void_moon_${date.getTime()}`,
      name: `Void of Course Moon in ${moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1)}`,
      date: new Date(date),
      type: 'voidMoon',
      description: `The Moon is void of course in ${moon.sign} before entering ${nextSign}`,
      emoji: '🌫️',
      rarity: 'common',
      impact: 'Avoid making important decisions. Focus on routine tasks, rest, and reflection',
      endDate,
      duration: { hours: 12 }
    });
  }
  
  return events;
};

/**
 * Find when a planet entered its current sign by scanning backwards
 */
const findSignChangeDate = async (planetName: string, currentSign: string, currentDate: Date): Promise<Date> => {
  // Estimate how far back to scan based on planet speed
  const scanDays = {
    sun: 35,
    mercury: 60, // Can vary due to retrogrades
    venus: 35,
    mars: 70,
    jupiter: 400, // ~13 months
    saturn: 1000, // ~2.5 years
    uranus: 2800, // ~7-8 years
    neptune: 5500, // ~14-15 years
    pluto: 8000 // ~20+ years
  }[planetName.toLowerCase()] || 400;
  
  // Scan backwards day by day to find when planet entered this sign
  for (let i = 1; i <= scanDays; i++) {
    const testDate = new Date(currentDate);
    testDate.setDate(testDate.getDate() - i);
    
    try {
      const positions = await calculatePlanetaryPositions(testDate, 0, 0);
      const planet = positions.planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());
      
      if (planet && planet.sign.toLowerCase() !== currentSign.toLowerCase()) {
        // Found the boundary - planet was in different sign on this date
        // So it entered current sign on the next day
        const entryDate = new Date(testDate);
        entryDate.setDate(entryDate.getDate() + 1);
        return entryDate;
      }
    } catch (error) {
      console.warn(`Error checking position for ${planetName} on ${testDate.toDateString()}`);
    }
  }
  
  // Fallback if we can't find the entry date
  const fallbackDate = new Date(currentDate);
  fallbackDate.setDate(fallbackDate.getDate() - Math.floor(scanDays / 2));
  return fallbackDate;
};

/**
 * Find when a planet will leave its current sign by scanning forwards
 */
const findSignExitDate = async (planetName: string, currentSign: string, currentDate: Date): Promise<Date> => {
  // Estimate how far forward to scan based on planet speed
  const scanDays = {
    sun: 35,
    mercury: 60,
    venus: 35, 
    mars: 70,
    jupiter: 400,
    saturn: 1000,
    uranus: 2800,
    neptune: 5500, // ~14 years per sign
    pluto: 8000
  }[planetName.toLowerCase()] || 400;
  
  // For very slow planets, scan less frequently to avoid performance issues
  const stepSize = planetName.toLowerCase() === 'neptune' || planetName.toLowerCase() === 'pluto' ? 30 : 1;
  
  // Scan forwards to find when planet will leave this sign
  for (let i = stepSize; i <= scanDays; i += stepSize) {
    const testDate = new Date(currentDate);
    testDate.setDate(testDate.getDate() + i);
    
    try {
      const positions = await calculatePlanetaryPositions(testDate, 0, 0);
      const planet = positions.planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());
      
      if (planet && planet.sign.toLowerCase() !== currentSign.toLowerCase()) {
        // Found when planet will be in different sign
        // For slow planets, backtrack daily to find exact date
        if (stepSize > 1) {
          for (let j = Math.max(1, i - stepSize + 1); j <= i; j++) {
            const exactDate = new Date(currentDate);
            exactDate.setDate(exactDate.getDate() + j);
            
            const exactPositions = await calculatePlanetaryPositions(exactDate, 0, 0);
            const exactPlanet = exactPositions.planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());
            
            if (exactPlanet && exactPlanet.sign.toLowerCase() !== currentSign.toLowerCase()) {
              return exactDate;
            }
          }
        }
        return testDate;
      }
    } catch (error) {
      console.warn(`Error checking future position for ${planetName} on ${testDate.toDateString()}`);
    }
  }
  
  // Fallback if we can't find the exit date
  const fallbackDate = new Date(currentDate);
  fallbackDate.setDate(fallbackDate.getDate() + Math.floor(scanDays / 2));
  return fallbackDate;
};

/**
 * Detects current planetary positions (ongoing transits) using astronomy engine
 */
export const detectCurrentPlanetaryPositions = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  
  // Only show this once - check if it's within the first few days of scanning
  const today = new Date();
  const daysDifference = Math.abs((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Only show on today or very close to today (within 3 days)
  if (daysDifference > 3) return events;
  
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Check major planets (exclude sun, moon as they change too frequently)
  const planetsToCheck = positions.planets.filter(p => 
    ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.name.toLowerCase())
  );
  
  for (const planet of planetsToCheck) {
    try {
      // Use astronomy engine to find actual entry and exit dates
      const entryDate = await findSignChangeDate(planet.name, planet.sign, today);
      const exitDate = await findSignExitDate(planet.name, planet.sign, today);
      
      // Calculate remaining time dynamically
      const timeRemaining = exitDate.getTime() - today.getTime();
      const daysRemaining = Math.max(1, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
      const monthsRemaining = Math.floor(daysRemaining / 30.44);
      const yearsRemaining = monthsRemaining / 12;
      
      // Smart duration display - be more generous with year thresholds
      const smartDuration = yearsRemaining >= 1 
        ? { years: Math.round(yearsRemaining), isOngoing: true }
        : monthsRemaining >= 1 
          ? { months: Math.round(monthsRemaining), isOngoing: true }
          : { days: daysRemaining, isOngoing: true };
      
      // Determine rarity based on planet
      const getRarity = (planetName: string) => {
        switch(planetName.toLowerCase()) {
          case 'jupiter': return 'uncommon';
          case 'saturn': return 'rare';
          case 'uranus':
          case 'neptune':
          case 'pluto': return 'veryRare';
          default: return 'common';
        }
      };
      
      const planetEmoji = {
        jupiter: '♃',
        saturn: '♄', 
        uranus: '♅',
        neptune: '♆',
        pluto: '♇'
      }[planet.name.toLowerCase()] || '🪐';
      
      events.push({
        id: `planet_in_sign_${planet.name}_${planet.sign}_current`,
        name: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} in ${planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}`,
        date: today, // Set to today so "Time until event" shows "Now"
        type: 'planetInSign',
        description: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} is currently transiting through ${planet.sign}`,
        emoji: planetEmoji,
        rarity: getRarity(planet.name),
        impact: `Current ${planet.name.toLowerCase()} themes: ${getSignThemes(planet.sign)}`,
        endDate: exitDate, // When planet will leave this sign
        startDate: entryDate, // When planet actually entered this sign
        duration: smartDuration
      });
    } catch (error) {
      console.warn(`Error processing ${planet.name} in ${planet.sign}:`, error);
    }
  }
  
  return events;
};

/**
 * Detects upcoming planetary sign changes for all planets
 */
export const detectUpcomingPlanetarySignChanges = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  
  // Only scan for upcoming sign changes, not past ones
  const today = new Date();
  if (date < today) return events;
  
  // Check if this date is within 90 days from today
  const daysFromToday = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysFromToday > 90) return events;
  
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  // Check ALL planets for sign changes (including faster ones)
  const planetsToCheck = positions.planets.filter(p => 
    ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.name.toLowerCase())
  );
  
  for (const planet of planetsToCheck) {
    try {
      // Check if planet is changing signs on this date by comparing with previous day
      const previousDay = new Date(date);
      previousDay.setDate(previousDay.getDate() - 1);
      
      const prevPositions = await calculatePlanetaryPositions(previousDay, 0, 0);
      const prevPlanet = prevPositions.planets.find(p => p.name.toLowerCase() === planet.name.toLowerCase());
      
      if (prevPlanet && prevPlanet.sign.toLowerCase() !== planet.sign.toLowerCase()) {
        // Planet changed signs! This is a sign ingress
        
        // Calculate how long this planet will stay in the new sign
        const exitDate = await findSignExitDate(planet.name, planet.sign, date);
        const timeInSign = exitDate.getTime() - date.getTime();
        const daysInSign = Math.floor(timeInSign / (1000 * 60 * 60 * 24));
        const monthsInSign = Math.floor(daysInSign / 30.44);
        const yearsInSign = monthsInSign / 12;
        
        // Smart duration display
        const smartDuration = yearsInSign > 1.5 
          ? { years: Math.round(yearsInSign), isOngoing: true }
          : monthsInSign > 0 
            ? { months: monthsInSign, isOngoing: true }
            : daysInSign > 0
              ? { days: daysInSign, isOngoing: true }
              : { days: 1, isOngoing: true };
        
        // Determine rarity based on planet
        const getRarity = (planetName: string) => {
          switch(planetName.toLowerCase()) {
            case 'sun':
            case 'mercury':
            case 'venus':
            case 'mars': return 'common';
            case 'jupiter': return 'uncommon';
            case 'saturn': return 'rare';
            case 'uranus':
            case 'neptune':
            case 'pluto': return 'veryRare';
            default: return 'common';
          }
        };
        
        const planetEmoji = {
          sun: '☀️',
          mercury: '☿️',
          venus: '♀️',
          mars: '♂️',
          jupiter: '♃',
          saturn: '♄',
          uranus: '♅',
          neptune: '♆',
          pluto: '♇'
        }[planet.name.toLowerCase()] || '🪐';
        
        events.push({
          id: `planet_enters_${planet.name}_${planet.sign}_${date.getTime()}`,
          name: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} Enters ${planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}`,
          date: new Date(date),
          type: 'planetSignChange',
          description: `${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)} transitions from ${prevPlanet.sign} into ${planet.sign}`,
          emoji: planetEmoji,
          rarity: getRarity(planet.name),
          impact: `New ${planet.name.toLowerCase()} themes: ${getSignThemes(planet.sign)}`,
          endDate: exitDate,
          startDate: new Date(date), // This is when it starts in the new sign
          duration: smartDuration
        });
      }
    } catch (error) {
      console.warn(`Error checking sign change for ${planet.name} on ${date.toDateString()}:`, error);
    }
  }
  
  return events;
};

/**
 * Detects moon sign changes for a given date
 */
export const detectMoonSignChanges = async (date: Date): Promise<AstrologicalEvent[]> => {
  const events: AstrologicalEvent[] = [];
  const positions = await calculatePlanetaryPositions(date, 0, 0);
  
  const moon = positions.planets.find(p => p.name.toLowerCase() === 'moon');
  if (!moon) return events;
  
  // Check if moon is near a sign boundary (within 1 degree of entering new sign)
  const moonSignBoundary = Math.floor(moon.longitude / 30) * 30;
  const nextSignBoundary = moonSignBoundary + 30;
  const degreesToNextSign = nextSignBoundary - moon.longitude;
  
  if (degreesToNextSign <= 1) {
    const nextSign = getNextSign(moon.sign);
    
    // Moon spends ~2.5 days in each sign
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(endDate.getHours() + 12); // ~2.5 days
    
    events.push({
      id: `moon_sign_change_${date.getTime()}`,
      name: `Moon Enters ${nextSign.charAt(0).toUpperCase() + nextSign.slice(1)}`,
      date: new Date(date),
      type: 'planetSignChange',
      description: `The Moon transitions from ${moon.sign} into ${nextSign}`,
      emoji: '🌙',
      rarity: 'common',
      impact: `Shift in emotional energy: ${getSignThemes(nextSign)}`,
      endDate,
      duration: { days: 2.5 }
    });
  }
  
  return events;
};

/**
 * Convenience function to detect all event types for a given date
 */
export const detectAllEvents = async (date: Date): Promise<AstrologicalEvent[]> => {
  try {
    const [
      retrogrades,
      stelliums,
      grandTrines,
      conjunctions,
      moonPhases,
      voidMoon,
      moonSignChanges,
      currentPlanetaryPositions,
      upcomingSignChanges
    ] = await Promise.all([
      detectRetrogrades(date),
      detectStelliums(date),
      detectGrandTrines(date),
      detectConjunctions(date),
      detectMoonPhases(date),
      detectVoidMoon(date),
      detectMoonSignChanges(date),
      detectCurrentPlanetaryPositions(date),
      detectUpcomingPlanetarySignChanges(date)
    ]);
    
    return [
      ...retrogrades,
      ...stelliums,
      ...grandTrines,
      ...conjunctions,
      ...moonPhases,
      ...voidMoon,
      ...moonSignChanges,
      ...currentPlanetaryPositions,
      ...upcomingSignChanges
    ];
  } catch (error) {
    console.warn(`Error detecting events for ${date.toDateString()}:`, error);
    return [];
  }
};