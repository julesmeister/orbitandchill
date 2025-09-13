/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Parans (Paranatellonta) Calculation Utilities
 * 
 * Parans are critical latitudinal crossing points where two different astrocartography 
 * lines intersect, representing a fusion of planetary energies within ~70-75 miles.
 * This is the missing professional feature that provides geographic specificity.
 */

import { AstrocartographyData, AstrocartographyLine } from './astrocartography';

export interface Paran {
  planet1: string;              // First planet name
  planet2: string;              // Second planet name  
  latitude: number;             // Exact latitude of crossing (-90 to +90)
  longitude?: number;           // Longitude if meridian crossing
  crossingType: ParanType;      // Type of line intersection
  combinedEnergy: string;       // Astrological interpretation
  orbOfInfluence: number;       // ~70-75 miles (1° latitude)
  strength: 'major' | 'minor';  // Based on planetary importance
  color: string;                // Visual color for map display
}

export type ParanType = 
  | 'MC-AC'     // Meridian crosses Ascendant (career meets identity)
  | 'MC-DC'     // Meridian crosses Descendant (career meets relationships)  
  | 'IC-AC'     // IC crosses Ascendant (home meets identity)
  | 'IC-DC'     // IC crosses Descendant (home meets relationships)
  | 'AC-AC'     // Two Ascendant lines cross (identity fusion)
  | 'DC-DC'     // Two Descendant lines cross (relationship fusion)
  | 'AC-DC';    // Ascendant crosses Descendant (self meets other)

export interface ParanProximity {
  paran: Paran;
  distanceFromLatitude: number;     // Miles from paran latitude
  isWithinOrb: boolean;             // Within 75-mile influence zone
  influenceStrength: 'direct' | 'strong' | 'moderate' | 'weak';
}

/**
 * Calculate all paran intersections from astrocartography data
 */
export function calculateParans(
  astrocartographyData: AstrocartographyData
): Paran[] {
  const parans: Paran[] = [];
  
  
  // Find intersections between different planetary lines
  astrocartographyData.planets.forEach(planet1 => {
    astrocartographyData.planets.forEach(planet2 => {
      if (planet1.planet >= planet2.planet) return; // Avoid duplicates and self-intersections
      
      // MC line intersections with AC/DC lines
      if (planet1.lines.mc && planet2.lines.ac) {
        const intersection = findLineIntersection(planet1.lines.mc, planet2.lines.ac);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'MC-AC'
          ));
        }
      }
      
      if (planet1.lines.mc && planet2.lines.dc) {
        const intersection = findLineIntersection(planet1.lines.mc, planet2.lines.dc);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'MC-DC'
          ));
        }
      }
      
      // IC line intersections with AC/DC lines
      if (planet1.lines.ic && planet2.lines.ac) {
        const intersection = findLineIntersection(planet1.lines.ic, planet2.lines.ac);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'IC-AC'
          ));
        }
      }
      
      if (planet1.lines.ic && planet2.lines.dc) {
        const intersection = findLineIntersection(planet1.lines.ic, planet2.lines.dc);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'IC-DC'
          ));
        }
      }
      
      // AC line intersections with other AC lines
      if (planet1.lines.ac && planet2.lines.ac) {
        const intersection = findHorizonLineIntersection(planet1.lines.ac, planet2.lines.ac);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'AC-AC'
          ));
        }
      }
      
      // DC line intersections with other DC lines
      if (planet1.lines.dc && planet2.lines.dc) {
        const intersection = findHorizonLineIntersection(planet1.lines.dc, planet2.lines.dc);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'DC-DC'
          ));
        }
      }
      
      // AC line intersections with DC lines
      if (planet1.lines.ac && planet2.lines.dc) {
        const intersection = findHorizonLineIntersection(planet1.lines.ac, planet2.lines.dc);
        if (intersection) {
          parans.push(createParan(
            planet1.planet, planet2.planet, intersection, 'AC-DC'
          ));
        }
      }
    });
  });
  
  
  // Sort by distance from equator (more impactful parans closer to equator)
  return parans.sort((a, b) => Math.abs(a.latitude) - Math.abs(b.latitude));
}

/**
 * Create a paran object with full interpretation
 */
function createParan(
  planet1: string,
  planet2: string,
  intersection: { lat: number; lng: number },
  crossingType: ParanType
): Paran {
  return {
    planet1,
    planet2,
    latitude: intersection.lat,
    longitude: intersection.lng,
    crossingType,
    combinedEnergy: interpretParanCombination(planet1, planet2, crossingType),
    orbOfInfluence: 75, // miles (1° latitude approximately)
    strength: getPlanetaryStrength(planet1, planet2),
    color: getParanColor(planet1, planet2)
  };
}

/**
 * Find intersection between a meridian line (MC/IC) and horizon line (AC/DC)
 */
function findLineIntersection(
  meridianLine: AstrocartographyLine,
  horizonLine: AstrocartographyLine
): { lat: number; lng: number } | null {
  
  if (meridianLine.type !== 'meridian' || horizonLine.type !== 'horizon') {
    return null;
  }
  
  // Meridian lines are vertical (constant longitude)
  const meridianLng = meridianLine.coordinates[0]?.lng;
  if (meridianLng === undefined) return null;
  
  // Find where horizon line crosses this longitude
  for (let i = 0; i < horizonLine.coordinates.length - 1; i++) {
    const coord1 = horizonLine.coordinates[i];
    const coord2 = horizonLine.coordinates[i + 1];
    
    if (!coord1 || !coord2) continue;
    
    // Check if meridian longitude is between these two horizon points
    const lngMin = Math.min(coord1.lng, coord2.lng);
    const lngMax = Math.max(coord1.lng, coord2.lng);
    
    // Handle antimeridian crossing
    if (lngMax - lngMin > 180) {
      // Line crosses antimeridian, check both segments
      if (meridianLng >= lngMax || meridianLng <= lngMin) {
        // Interpolate across antimeridian
        const intersectionLat = interpolateLatitudeAtLongitude(
          coord1, coord2, meridianLng, true
        );
        if (intersectionLat !== null) {
          return { lat: intersectionLat, lng: meridianLng };
        }
      }
    } else {
      // Normal case - no antimeridian crossing
      if (meridianLng >= lngMin && meridianLng <= lngMax) {
        const intersectionLat = interpolateLatitudeAtLongitude(
          coord1, coord2, meridianLng, false
        );
        if (intersectionLat !== null) {
          return { lat: intersectionLat, lng: meridianLng };
        }
      }
    }
  }
  
  return null;
}

/**
 * Find intersection between two horizon lines (AC/DC with AC/DC)
 * This is more complex as it involves finding where two curves cross
 */
function findHorizonLineIntersection(
  line1: AstrocartographyLine,
  line2: AstrocartographyLine
): { lat: number; lng: number } | null {
  
  if (line1.type !== 'horizon' || line2.type !== 'horizon') {
    return null;
  }
  
  // Sample both lines at regular intervals and find closest approach
  const samples = 100;
  let closestDistance = Infinity;
  let closestIntersection: { lat: number; lng: number } | null = null;
  
  for (let i = 0; i <= samples; i++) {
    const progress = i / samples;
    
    // Sample points from both lines
    const point1 = sampleLineAtProgress(line1, progress);
    const point2 = sampleLineAtProgress(line2, progress);
    
    if (!point1 || !point2) continue;
    
    // Calculate distance between sample points
    const distance = Math.sqrt(
      Math.pow(point1.lat - point2.lat, 2) + 
      Math.pow(point1.lng - point2.lng, 2)
    );
    
    // If points are very close (within 1°), consider this an intersection
    if (distance < 1.0 && distance < closestDistance) {
      closestDistance = distance;
      closestIntersection = {
        lat: (point1.lat + point2.lat) / 2,
        lng: (point1.lng + point2.lng) / 2
      };
    }
  }
  
  return closestIntersection;
}

/**
 * Interpolate latitude at a specific longitude between two points
 */
function interpolateLatitudeAtLongitude(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number },
  targetLng: number,
  crossesAntimeridian: boolean
): number | null {
  
  if (crossesAntimeridian) {
    // Handle antimeridian crossing
    const lng1 = coord1.lng;
    let lng2 = coord2.lng;
    
    if (lng1 > lng2) {
      lng2 += 360; // Normalize to continuous range
    }
    
    let adjustedTargetLng = targetLng;
    if (targetLng < lng1) {
      adjustedTargetLng += 360;
    }
    
    const t = (adjustedTargetLng - lng1) / (lng2 - lng1);
    if (t >= 0 && t <= 1) {
      return coord1.lat + t * (coord2.lat - coord1.lat);
    }
  } else {
    // Normal interpolation
    const t = (targetLng - coord1.lng) / (coord2.lng - coord1.lng);
    if (t >= 0 && t <= 1) {
      return coord1.lat + t * (coord2.lat - coord1.lat);
    }
  }
  
  return null;
}

/**
 * Sample a line at a specific progress (0-1) along its length
 */
function sampleLineAtProgress(
  line: AstrocartographyLine,
  progress: number
): { lat: number; lng: number } | null {
  
  if (line.coordinates.length === 0) return null;
  
  const totalSegments = line.coordinates.length - 1;
  const segmentIndex = Math.floor(progress * totalSegments);
  const segmentProgress = (progress * totalSegments) - segmentIndex;
  
  if (segmentIndex >= totalSegments) {
    return line.coordinates[line.coordinates.length - 1];
  }
  
  const coord1 = line.coordinates[segmentIndex];
  const coord2 = line.coordinates[segmentIndex + 1];
  
  if (!coord1 || !coord2) return null;
  
  return {
    lat: coord1.lat + segmentProgress * (coord2.lat - coord1.lat),
    lng: coord1.lng + segmentProgress * (coord2.lng - coord1.lng)
  };
}

/**
 * Get planetary strength rating for paran importance
 */
function getPlanetaryStrength(planet1: string, planet2: string): 'major' | 'minor' {
  const majorPlanets = ['sun', 'moon', 'mars', 'venus', 'jupiter', 'saturn'];
  const p1Major = majorPlanets.includes(planet1.toLowerCase());
  const p2Major = majorPlanets.includes(planet2.toLowerCase());
  
  return (p1Major && p2Major) ? 'major' : 'minor';
}

/**
 * Color coding for paran combinations based on astrological nature
 */
function getParanColor(planet1: string, planet2: string): string {
  const beneficPlanets = ['venus', 'jupiter'];
  const maleficPlanets = ['mars', 'saturn'];
  const luminaries = ['sun', 'moon'];
  
  const p1Benefic = beneficPlanets.includes(planet1.toLowerCase());
  const p2Benefic = beneficPlanets.includes(planet2.toLowerCase());
  const p1Malefic = maleficPlanets.includes(planet1.toLowerCase());
  const p2Malefic = maleficPlanets.includes(planet2.toLowerCase());
  const p1Luminary = luminaries.includes(planet1.toLowerCase());
  const p2Luminary = luminaries.includes(planet2.toLowerCase());
  
  // Highly beneficial combinations
  if (p1Benefic && p2Benefic) return '#22c55e'; // Green - very beneficial
  if ((p1Benefic && p2Luminary) || (p1Luminary && p2Benefic)) return '#3b82f6'; // Blue - beneficial
  
  // Challenging combinations
  if (p1Malefic && p2Malefic) return '#ef4444'; // Red - challenging
  
  // Mixed combinations
  if ((p1Benefic && p2Malefic) || (p1Malefic && p2Benefic)) return '#f59e0b'; // Orange - mixed
  
  // Luminary combinations
  if (p1Luminary && p2Luminary) return '#8b5cf6'; // Purple - important balance
  
  // Default neutral
  return '#6b7280'; // Gray - neutral
}

/**
 * Comprehensive paran interpretation database
 */
function interpretParanCombination(
  planet1: string, 
  planet2: string, 
  crossingType: ParanType
): string {
  
  // Create sorted combination key for consistent lookup
  const planets = [planet1.toLowerCase(), planet2.toLowerCase()].sort();
  const comboKey = `${planets[0]}-${planets[1]}`;
  
  const combinations: {[key: string]: {[key: string]: string}} = {
    'jupiter-venus': {
      'MC-AC': 'Exceptional charisma and success. Natural leadership with diplomatic grace.',
      'IC-DC': 'Harmonious family life attracts beneficial partnerships. Domestic abundance.',
      'MC-DC': 'Career advancement through charming partnerships. Diplomatic success.',
      'IC-AC': 'Personal growth through beautiful, secure home environment.',
      'AC-AC': 'Magnetic personality that attracts opportunities and love.',
      'DC-DC': 'Blessed partnerships and marriages. Natural relationship harmony.',
      'AC-DC': 'Perfect balance between self-love and loving relationships.'
    },
    'mars-saturn': {
      'MC-AC': 'Career demands intense discipline. Success through persistent effort.',
      'IC-DC': 'Family responsibilities create relationship tensions. Duty vs desire.',
      'MC-DC': 'Professional partnerships require careful management. Potential conflicts.',
      'IC-AC': 'Home environment teaches discipline and responsibility.',
      'AC-AC': 'Internal tension between impulse and restraint. Character building.',
      'DC-DC': 'Serious, karmic relationships. Learning through relationship challenges.',
      'AC-DC': 'Attraction to mature, responsible partners who challenge growth.'
    },
    'moon-sun': {
      'MC-AC': 'Public recognition aligns with authentic self-expression.',
      'IC-DC': 'Emotional security attracts supportive partnerships.',
      'MC-DC': 'Career partnerships based on emotional understanding.',
      'IC-AC': 'Strong sense of belonging and personal identity.',
      'AC-AC': 'Integrated conscious and unconscious self. Authentic presence.',
      'DC-DC': 'Relationships that honor both emotional and rational needs.',
      'AC-DC': 'Partnerships that balance individual identity with emotional bonding.'
    },
    'jupiter-mars': {
      'MC-AC': 'Bold leadership and entrepreneurial success. Confident action.',
      'IC-DC': 'Energetic home life attracts adventurous partnerships.',
      'MC-DC': 'Business partnerships involving expansion and risk-taking.',
      'IC-AC': 'Home environment encourages courage and growth.',
      'AC-AC': 'Optimistic, action-oriented personality. Natural enthusiasm.',
      'DC-DC': 'Partnerships involving shared adventures and growth.',
      'AC-DC': 'Attraction to confident, expansive partners.'
    },
    'saturn-venus': {
      'MC-AC': 'Career in beauty, art, or luxury goods through disciplined effort.',
      'IC-DC': 'Traditional family values create stable but formal relationships.',
      'MC-DC': 'Professional partnerships requiring commitment and patience.',
      'IC-AC': 'Beautiful but structured home environment. Classic aesthetic.',
      'AC-AC': 'Reserved charm and timeless appeal. Serious about beauty.',
      'DC-DC': 'Long-term, committed relationships. Marriage-minded partnerships.',
      'AC-DC': 'Attraction to mature, stable, financially secure partners.'
    },
    'mercury-venus': {
      'MC-AC': 'Career in communication, arts, or beauty. Charming public presence.',
      'IC-DC': 'Beautiful communication in home and relationships.',
      'MC-DC': 'Professional partnerships involving creativity and communication.',
      'IC-AC': 'Articulate, aesthetically pleasing home environment.',
      'AC-AC': 'Charming communication style. Natural grace in expression.',
      'DC-DC': 'Relationships built on beautiful communication and shared aesthetics.',
      'AC-DC': 'Attraction to articulate, aesthetically minded partners.'
    }
  };
  
  const interpretation = combinations[comboKey]?.[crossingType];
  if (interpretation) {
    return interpretation;
  }
  
  // Fallback interpretation based on crossing type
  const typeInterpretations: {[key: string]: string} = {
    'MC-AC': `Career energies of ${planet1} blend with personal identity of ${planet2}.`,
    'IC-DC': `Home/family energies of ${planet1} influence relationships through ${planet2}.`,
    'MC-DC': `Professional life combines ${planet1} energy with ${planet2} partnership qualities.`,
    'IC-AC': `Private foundation of ${planet1} supports personal expression of ${planet2}.`,
    'AC-AC': `Dual identity expression combining ${planet1} and ${planet2} energies.`,
    'DC-DC': `Partnership patterns merge ${planet1} and ${planet2} relationship styles.`,
    'AC-DC': `Personal identity of ${planet1} attracts ${planet2} qualities in partnerships.`
  };
  
  return typeInterpretations[crossingType] || 
         `Combined influence of ${planet1} and ${planet2} through ${crossingType} axis.`;
}

/**
 * Find parans affecting a specific latitude within orb of influence
 */
export function findParansAtLatitude(
  parans: Paran[],
  latitude: number,
  orbMiles: number = 75
): ParanProximity[] {
  
  return parans.map(paran => {
    const latDistance = Math.abs(latitude - paran.latitude);
    const distanceMiles = latDistance * 69; // Approximate miles per degree latitude
    
    let influenceStrength: 'direct' | 'strong' | 'moderate' | 'weak';
    if (distanceMiles <= 10) influenceStrength = 'direct';
    else if (distanceMiles <= 25) influenceStrength = 'strong';
    else if (distanceMiles <= 50) influenceStrength = 'moderate';
    else influenceStrength = 'weak';
    
    return {
      paran,
      distanceFromLatitude: distanceMiles,
      isWithinOrb: distanceMiles <= orbMiles,
      influenceStrength
    };
  })
  .filter(p => p.isWithinOrb)
  .sort((a, b) => a.distanceFromLatitude - b.distanceFromLatitude);
}

/**
 * Get influence strength based on distance
 */
function getInfluenceStrength(distanceMiles: number): 'direct' | 'strong' | 'moderate' | 'weak' {
  if (distanceMiles <= 10) return 'direct';
  if (distanceMiles <= 25) return 'strong';
  if (distanceMiles <= 50) return 'moderate';
  return 'weak';
}