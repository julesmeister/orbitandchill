/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Moon Sign Electional Astrology Filtering
 * Based on traditional electional principles for specific activities
 */

import { AstrologicalEvent } from '../store/eventsStore';

// Moon sign groups for different electional purposes
const MOON_SIGN_GROUPS = {
  // Hair growth - water signs for growth, Taurus for strength
  haircut_growth: ['cancer', 'scorpio', 'pisces', 'taurus'],
  
  // Hair maintenance - Virgo for precision
  haircut_maintenance: ['virgo'],
  
  // Travel flexibility - mutable signs for adaptability
  travel_flexible: ['gemini', 'virgo', 'sagittarius', 'pisces'],
  
  // Travel stability - avoid fixed signs if flexibility is needed, cardinal for action
  travel_stable: ['aries', 'cancer', 'libra', 'capricorn'],
  
  // Creative work - Leo for drama, Libra for beauty, Pisces for imagination
  creativity: ['leo', 'libra', 'pisces'],
  
  // Luck and success - Moon in domicile (Cancer) or exaltation (Taurus)
  luck_success: ['cancer', 'taurus']
};

/**
 * Get the Moon sign from an event's planetary positions
 */
const getMoonSignFromEvent = (event: AstrologicalEvent): string | null => {
  if (!event.planetaryPositions) return null;
  
  // Find Moon position in the planetary positions array
  const moonPosition = event.planetaryPositions.find(pos => 
    pos.toLowerCase().includes('moon in ')
  );
  
  if (!moonPosition) return null;
  
  // Extract sign from string like "moon in cancer (4H)"
  const signMatch = moonPosition.match(/moon in (\w+)/i);
  return signMatch ? signMatch[1].toLowerCase() : null;
};

/**
 * Check if Moon is void of course based on event data
 */
const isMoonVoidOfCourse = (event: AstrologicalEvent): boolean => {
  // Check if void moon is mentioned in the description or title
  const text = `${event.title} ${event.description}`.toLowerCase();
  return text.includes('void') && text.includes('moon');
};

/**
 * Filter events based on Moon sign electional criteria
 */
export const filterEventsByMoonSign = (
  events: AstrologicalEvent[], 
  filterValue: string
): AstrologicalEvent[] => {
  if (filterValue === 'all') return events;
  
  return events.filter(event => {
    const moonSign = getMoonSignFromEvent(event);
    
    // Handle void moon filter separately
    if (filterValue === 'avoid_void') {
      return !isMoonVoidOfCourse(event);
    }
    
    // If we can't determine moon sign, exclude from specific filters
    if (!moonSign) return false;
    
    // Check if moon sign matches the selected electional purpose
    const targetSigns = MOON_SIGN_GROUPS[filterValue as keyof typeof MOON_SIGN_GROUPS];
    if (!targetSigns) return true; // Unknown filter, include all
    
    return targetSigns.includes(moonSign);
  });
};

/**
 * Get count of events matching specific Moon sign criteria
 */
export const getMoonSignFilterCounts = (events: AstrologicalEvent[]) => {
  const counts: Record<string, number> = {};
  
  Object.keys(MOON_SIGN_GROUPS).forEach(filterKey => {
    counts[filterKey] = filterEventsByMoonSign(events, filterKey).length;
  });
  
  // Add void moon count
  counts.avoid_void = events.filter(event => !isMoonVoidOfCourse(event)).length;
  
  return counts;
};

/**
 * Get Moon electional context for event title enhancement
 */
export const getMoonElectionalContext = (moonSign: string): string | null => {
  if (!moonSign) return null;
  
  const sign = moonSign.toLowerCase();
  
  // Return electional context based on Moon sign
  if (['cancer', 'scorpio', 'pisces'].includes(sign)) {
    return '🌊 Growth Moon'; // Water signs for growth
  } else if (sign === 'taurus') {
    return '🌱 Strength Moon'; // Earth sign for strength
  } else if (sign === 'virgo') {
    return '✂️ Precision Moon'; // For maintenance/precision work
  } else if (['gemini', 'sagittarius'].includes(sign)) {
    return '✈️ Travel Moon'; // Mutable for flexibility
  } else if (['aries', 'libra', 'capricorn'].includes(sign)) {
    return '🎯 Action Moon'; // Cardinal for initiation
  } else if (sign === 'leo') {
    return '🎨 Creative Moon'; // Fire for creativity
  } else if (sign === 'pisces') {
    return '💫 Intuitive Moon'; // Water for intuition/creativity overlap
  } else if (['taurus', 'leo', 'scorpio', 'aquarius'].includes(sign)) {
    return '🔒 Stable Moon'; // Fixed signs for stability
  }
  
  return null;
};

/**
 * Get descriptive text for Moon sign filter selections
 */
export const getMoonSignFilterDescription = (filterValue: string): string => {
  const descriptions: Record<string, string> = {
    haircut_growth: "Moon in water signs (Cancer, Scorpio, Pisces) or Taurus - best for hair growth and strength",
    haircut_maintenance: "Moon in Virgo - precision and health-focused energy for maintenance cuts",
    travel_flexible: "Moon in mutable signs (Gemini, Virgo, Sagittarius, Pisces) - adaptable energy for flexible travel",
    travel_stable: "Moon in cardinal signs (Aries, Cancer, Libra, Capricorn) - action-oriented energy for planned travel",
    creativity: "Moon in Leo (drama), Libra (beauty), or Pisces (imagination) - enhanced creative expression",
    luck_success: "Moon in Cancer (domicile) or Taurus (exaltation) - strongest lunar positions for success",
    avoid_void: "Excludes void of course Moon periods when projects tend to go nowhere"
  };
  
  return descriptions[filterValue] || "Custom Moon sign timing filter";
};