/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Event-specific interpretations and actionable advice
 * 
 * This module provides detailed interpretations for astrological events
 * with actionable dos and don'ts for each event type.
 * 
 * Refactored into smaller modules for better maintainability.
 */

// Type definitions
export interface EventActionableAdvice {
  overview: string;
  energy: string;
  timing: string;
  dos: string[];
  donts: string[];
  opportunities: string[];
  warnings: string[];
  rituals?: string[];
  affirmations?: string[];
}

export interface EventInterpretation {
  title: string;
  subtitle: string;
  description: string;
  advice: EventActionableAdvice;
}

// Import all interpretations from their respective modules
import { RETROGRADE_INTERPRETATIONS } from './interpretations/retrogradeInterpretations';
import { MOON_PHASE_INTERPRETATIONS } from './interpretations/moonPhaseInterpretations';
import { PLANETARY_SIGN_INTERPRETATIONS } from './interpretations/planetarySignInterpretations';
import {
  VOID_MOON_INTERPRETATIONS,
  ECLIPSE_INTERPRETATIONS,
  CONJUNCTION_INTERPRETATIONS,
  STELLIUM_INTERPRETATIONS,
  GRAND_TRINE_INTERPRETATIONS
} from './interpretations/otherEventInterpretations';
import { PLANETARY_RETURNS_INTERPRETATIONS } from './interpretations/planetaryReturns';
import { ECLIPSE_TYPE_INTERPRETATIONS } from './interpretations/eclipseTypes';
import { LUNAR_NODES_INTERPRETATIONS } from './interpretations/lunarNodes';
import { SPECIFIC_CONJUNCTION_INTERPRETATIONS } from './interpretations/specificConjunctions';
import { TRANSITING_ASPECTS_INTERPRETATIONS } from './interpretations/transitingAspects';
import { SEASONAL_MARKERS_INTERPRETATIONS } from './interpretations/seasonalMarkers';
import { CRITICAL_DEGREES_INTERPRETATIONS } from './interpretations/criticalDegrees';

// Re-export all interpretation collections
export {
  RETROGRADE_INTERPRETATIONS,
  MOON_PHASE_INTERPRETATIONS,
  PLANETARY_SIGN_INTERPRETATIONS,
  VOID_MOON_INTERPRETATIONS,
  ECLIPSE_INTERPRETATIONS,
  CONJUNCTION_INTERPRETATIONS,
  STELLIUM_INTERPRETATIONS,
  GRAND_TRINE_INTERPRETATIONS,
  PLANETARY_RETURNS_INTERPRETATIONS,
  ECLIPSE_TYPE_INTERPRETATIONS,
  LUNAR_NODES_INTERPRETATIONS,
  SPECIFIC_CONJUNCTION_INTERPRETATIONS,
  TRANSITING_ASPECTS_INTERPRETATIONS,
  SEASONAL_MARKERS_INTERPRETATIONS,
  CRITICAL_DEGREES_INTERPRETATIONS
};

// Function to get event interpretation
export const getEventInterpretation = (eventType: string, eventName: string, description?: string): EventInterpretation | null => {
  // Handle retrograde events
  if (eventType === 'retrograde') {
    const planetName = eventName.toLowerCase().split(' ')[0];
    return RETROGRADE_INTERPRETATIONS[planetName] || null;
  }
  
  // Handle moon phases
  if (eventType === 'moonPhase') {
    if (eventName.toLowerCase().includes('new moon')) {
      return MOON_PHASE_INTERPRETATIONS.newMoon;
    }
    if (eventName.toLowerCase().includes('full moon')) {
      return MOON_PHASE_INTERPRETATIONS.fullMoon;
    }
    if (eventName.toLowerCase().includes('first quarter')) {
      return MOON_PHASE_INTERPRETATIONS.firstQuarter;
    }
    if (eventName.toLowerCase().includes('last quarter')) {
      return MOON_PHASE_INTERPRETATIONS.lastQuarter;
    }
    // Fallback for any other quarter moon variations
    if (eventName.toLowerCase().includes('quarter moon')) {
      return MOON_PHASE_INTERPRETATIONS.firstQuarter; // Default to first quarter
    }
    // Handle moon sign changes that are mislabeled as moonPhase
    if (eventName.toLowerCase().includes('moon enters')) {
      const match = eventName.match(/moon enters (\w+)/i);
      if (match) {
        const [, sign] = match;
        return PLANETARY_SIGN_INTERPRETATIONS.moon('', sign);
      }
    }
  }
  
  // Handle planetary sign changes
  if (eventType === 'planetSignChange' || eventType === 'planetInSign') {
    const match = eventName.match(/(\w+)\s+(?:enters|in)\s+(\w+)/i);
    if (match) {
      const [, planet, sign] = match;
      const planetLower = planet.toLowerCase();
      if (PLANETARY_SIGN_INTERPRETATIONS[planetLower]) {
        return PLANETARY_SIGN_INTERPRETATIONS[planetLower]('', sign);
      }
    }
  }
  
  // Handle conjunctions
  if (eventType === 'conjunction') {
    // Check for specific conjunction types first
    const eventLower = eventName.toLowerCase();
    
    // Venus-Mars conjunction
    if ((eventLower.includes('venus') && eventLower.includes('mars')) || 
        (eventLower.includes('mars') && eventLower.includes('venus'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['venus-mars'];
    }
    
    // Jupiter-Saturn conjunction (Great Conjunction)
    if ((eventLower.includes('jupiter') && eventLower.includes('saturn')) || 
        (eventLower.includes('saturn') && eventLower.includes('jupiter'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['jupiter-saturn'];
    }
    
    // Sun-Mercury conjunction (Cazimi)
    if ((eventLower.includes('sun') && eventLower.includes('mercury')) || 
        (eventLower.includes('mercury') && eventLower.includes('sun'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['sun-mercury'];
    }
    
    // Moon-Venus conjunction
    if ((eventLower.includes('moon') && eventLower.includes('venus')) || 
        (eventLower.includes('venus') && eventLower.includes('moon'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['moon-venus'];
    }
    
    // Mars-Jupiter conjunction
    if ((eventLower.includes('mars') && eventLower.includes('jupiter')) || 
        (eventLower.includes('jupiter') && eventLower.includes('mars'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['mars-jupiter'];
    }
    
    // Venus-Jupiter conjunction
    if ((eventLower.includes('venus') && eventLower.includes('jupiter')) || 
        (eventLower.includes('jupiter') && eventLower.includes('venus'))) {
      return SPECIFIC_CONJUNCTION_INTERPRETATIONS['venus-jupiter'];
    }
    
    // Fallback to general conjunction interpretation
    return CONJUNCTION_INTERPRETATIONS.general;
  }
  
  // Handle stelliums
  if (eventType === 'stellium') {
    return STELLIUM_INTERPRETATIONS.general;
  }
  
  // Handle grand trines
  if (eventType === 'grandTrine') {
    return GRAND_TRINE_INTERPRETATIONS.general;
  }
  
  // Handle void moon
  if (eventType === 'voidMoon') {
    return VOID_MOON_INTERPRETATIONS.general;
  }
  
  // Handle eclipses
  if (eventType === 'eclipse') {
    // Check for specific eclipse types first
    if (eventName.toLowerCase().includes('solar eclipse')) {
      if (eventName.toLowerCase().includes('total')) {
        return ECLIPSE_TYPE_INTERPRETATIONS.totalEclipse;
      }
      return ECLIPSE_TYPE_INTERPRETATIONS.solarEclipse;
    }
    if (eventName.toLowerCase().includes('lunar eclipse')) {
      if (eventName.toLowerCase().includes('total')) {
        return ECLIPSE_TYPE_INTERPRETATIONS.totalEclipse;
      }
      return ECLIPSE_TYPE_INTERPRETATIONS.lunarEclipse;
    }
    // Fallback to general eclipse interpretation
    return ECLIPSE_INTERPRETATIONS.general;
  }
  
  // Handle alignments (use eclipse interpretation as fallback)
  if (eventType === 'alignment') {
    return ECLIPSE_INTERPRETATIONS.general;
  }
  
  // Handle planetary returns
  if (eventType === 'planetaryReturn') {
    if (eventName.toLowerCase().includes('saturn return')) {
      return PLANETARY_RETURNS_INTERPRETATIONS.saturnReturn;
    }
    if (eventName.toLowerCase().includes('jupiter return')) {
      return PLANETARY_RETURNS_INTERPRETATIONS.jupiterReturn;
    }
    if (eventName.toLowerCase().includes('solar return') || eventName.toLowerCase().includes('birthday')) {
      return PLANETARY_RETURNS_INTERPRETATIONS.solarReturn;
    }
  }
  
  // Handle lunar nodes
  if (eventType === 'lunarNode' || eventType === 'node') {
    if (eventName.toLowerCase().includes('north node')) {
      return LUNAR_NODES_INTERPRETATIONS.northNode;
    }
    if (eventName.toLowerCase().includes('south node')) {
      return LUNAR_NODES_INTERPRETATIONS.southNode;
    }
    if (eventName.toLowerCase().includes('nodes') && eventName.toLowerCase().includes('sign')) {
      return LUNAR_NODES_INTERPRETATIONS.nodesSignChange;
    }
  }
  
  // Handle transiting planetary aspects
  if (eventType === 'aspect' || eventType === 'transitAspect') {
    // Check for specific aspect types
    if (eventName.toLowerCase().includes('trine')) {
      return TRANSITING_ASPECTS_INTERPRETATIONS.trine;
    }
    if (eventName.toLowerCase().includes('sextile')) {
      return TRANSITING_ASPECTS_INTERPRETATIONS.sextile;
    }
    if (eventName.toLowerCase().includes('square')) {
      return TRANSITING_ASPECTS_INTERPRETATIONS.square;
    }
    if (eventName.toLowerCase().includes('opposition')) {
      return TRANSITING_ASPECTS_INTERPRETATIONS.opposition;
    }
    if (eventName.toLowerCase().includes('conjunction')) {
      return TRANSITING_ASPECTS_INTERPRETATIONS.conjunction;
    }
  }
  
  // Handle seasonal markers
  if (eventType === 'seasonalMarker' || eventType === 'solstice' || eventType === 'equinox') {
    // Equinoxes
    if (eventName.toLowerCase().includes('spring equinox') || eventName.toLowerCase().includes('vernal equinox')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.springEquinox;
    }
    if (eventName.toLowerCase().includes('autumn equinox') || eventName.toLowerCase().includes('fall equinox')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.autumnEquinox;
    }
    
    // Solstices
    if (eventName.toLowerCase().includes('summer solstice')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.summerSolstice;
    }
    if (eventName.toLowerCase().includes('winter solstice')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.winterSolstice;
    }
    
    // Cross-quarter days
    if (eventName.toLowerCase().includes('imbolc') || eventName.toLowerCase().includes('candlemas')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.imbolc;
    }
    if (eventName.toLowerCase().includes('beltane') || eventName.toLowerCase().includes('may day')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.beltane;
    }
    if (eventName.toLowerCase().includes('lughnasadh') || eventName.toLowerCase().includes('lammas')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.lughnasadh;
    }
    if (eventName.toLowerCase().includes('samhain') || eventName.toLowerCase().includes('halloween')) {
      return SEASONAL_MARKERS_INTERPRETATIONS.samhain;
    }
  }
  
  // Handle critical degrees
  if (eventType === 'criticalDegree' || eventType === 'degree') {
    // Check for 0 degrees
    if (eventName.toLowerCase().includes('0°') || eventName.toLowerCase().includes('0 degrees')) {
      return CRITICAL_DEGREES_INTERPRETATIONS.zeroDegree;
    }
    
    // Check for 29 degrees (Anaretic)
    if (eventName.toLowerCase().includes('29°') || eventName.toLowerCase().includes('29 degrees') || 
        eventName.toLowerCase().includes('anaretic')) {
      return CRITICAL_DEGREES_INTERPRETATIONS.anareticDegree;
    }
  }
  
  return null;
};

// Export function to check if event has interpretation
export const hasEventInterpretation = (eventType: string, eventName: string): boolean => {
  return getEventInterpretation(eventType, eventName) !== null;
};