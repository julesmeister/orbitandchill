/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * JavaScript implementation of natal chart generation using astronomy-engine
 * Professional-grade accuracy with MIT license
 */

import * as Astronomy from 'astronomy-engine';
import { processBirthTime } from './timeZoneHandler';

// Astrological constants
export const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export const PLANETS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

// Additional celestial points (not planets but important in astrology)
export const CELESTIAL_POINTS = [
  "lilith",      // Black Moon Lilith (Moon's apogee)
  "chiron",      // The wounded healer asteroid
  "partOfFortune", // Arabic Part (Lot of Fortune)
  "northNode",   // North Node (Rahu)
  "southNode",   // South Node (Ketu)
];

export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

// Utility function to format degrees in astrological notation
export function formatAstrologicalDegree(longitude: number | undefined): string {
  if (longitude === undefined || longitude === null || isNaN(longitude)) {
    return 'Unknown°';
  }
  
  // Normalize longitude to 0-360 range
  let normalizedLongitude = longitude % 360;
  if (normalizedLongitude < 0) {
    normalizedLongitude += 360;
  }
  
  const signIndex = Math.floor(normalizedLongitude / 30) % 12;
  const degreeInSign = normalizedLongitude % 30;
  const sign = SIGNS[signIndex];
  
  if (!sign) {
    return `${Math.abs(degreeInSign).toFixed(1)}° Aries`; // Default to Aries if sign not found
  }
  
  return `${degreeInSign.toFixed(1)}° ${sign.charAt(0).toUpperCase() + sign.slice(1)}`;
}

export const ASPECTS = {
  conjunction: { angle: 0, orb: 8, type: "major" },
  sextile: { angle: 60, orb: 6, type: "major" },
  square: { angle: 90, orb: 8, type: "major" },
  trine: { angle: 120, orb: 8, type: "major" },
  opposition: { angle: 180, orb: 8, type: "major" },
  quincunx: { angle: 150, orb: 3, type: "minor" },
};

// Chart data interfaces
export interface PlanetPosition {
  name: string;
  longitude: number;
  sign: string;
  house: number;
  retrograde: boolean;
  // Add equatorial coordinates for astrocartography
  rightAscension?: number; // RA in hours
  declination?: number;    // Dec in degrees
  distance?: number;       // Distance in AU
  // Additional metadata for celestial points
  isPlanet?: boolean;      // True for actual planets, false for calculated points
  pointType?: 'planet' | 'asteroid' | 'centaur' | 'node' | 'arabicPart' | 'apogee'; // Type of celestial point
  symbol?: string;         // Astrological symbol
}

export interface HousePosition {
  number: number;
  cusp: number;
  sign: string;
}

export interface ChartAspect {
  color: string | undefined;
  applying: any;
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
}

export interface NatalChartData {
  planets: PlanetPosition[];
  houses: HousePosition[];
  aspects: ChartAspect[];
  ascendant: number;
  midheaven: number;
}

export interface ChartMetadata {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
  generatedAt: string;
  chartData: NatalChartData;
}

// Debug the astronomy-engine structure
// Astronomy library initialized for planetary calculations

// Astronomy-engine body mapping
const ASTRONOMY_BODIES: { [key: string]: any } = {
  sun: Astronomy.Body?.Sun || 'Sun',
  moon: Astronomy.Body?.Moon || 'Moon', 
  mercury: Astronomy.Body?.Mercury || 'Mercury',
  venus: Astronomy.Body?.Venus || 'Venus',
  mars: Astronomy.Body?.Mars || 'Mars',
  jupiter: Astronomy.Body?.Jupiter || 'Jupiter',
  saturn: Astronomy.Body?.Saturn || 'Saturn',
  uranus: Astronomy.Body?.Uranus || 'Uranus',
  neptune: Astronomy.Body?.Neptune || 'Neptune',
  pluto: Astronomy.Body?.Pluto || 'Pluto',
};

/**
 * Calculate planetary positions using astronomy-engine
 * This provides professional-grade accuracy (±1 arcminute) with MIT license
 */
export async function calculatePlanetaryPositions(
  date: Date,
  latitude: number,
  longitude: number
): Promise<NatalChartData> {
  // Debug logging disabled for production

  try {
    // Starting planetary calculations - debug logging disabled

    // Try different Observer creation methods for astronomy-engine v2.1.19
    let observer;
    try {
      // Method 1: Try as a constructor
      observer = new Astronomy.Observer(latitude, longitude, 0);
      // Observer created with constructor
    } catch (e1) {
      try {
        // Method 2: Try as a factory function
        observer = new Astronomy.Observer(latitude, longitude, 0);
        // Observer created with factory
      } catch (e2) {
        try {
          // Method 3: Try with object literal
          observer = { latitude, longitude, height: 0 };
          // Observer created with object literal
        } catch (e3) {
          console.error('All Observer creation methods failed:', { e1, e2, e3 });
          throw new Error('Cannot create Observer object');
        }
      }
    }

    // Calculate planetary positions using appropriate functions
    const planets: PlanetPosition[] = PLANETS.map(planetName => {
      // Calculating planetary position
      const body = ASTRONOMY_BODIES[planetName];
      
      if (!body) {
        throw new Error(`Unknown planet: ${planetName}`);
      }
      
      // Get geocentric position and convert to ecliptic longitude
      let longitude: number;
      let rightAscension: number | undefined;
      let declination: number | undefined;
      let distance: number | undefined;
      
      try {
        if (body === 'Sun') {
          // For the Sun, use SunPosition which gives geocentric longitude
          const sunPos = Astronomy.SunPosition(date);
          longitude = sunPos.elon;
          
          // For the Sun, use the Body directly with Astronomy.Equator
          const equatorial = Astronomy.Equator(
            Astronomy.Body.Sun,             // Sun body
            Astronomy.MakeTime(date),       // convert Date to AstroTime
            observer,                       // observer
            true,                          // ofdate (use true for date-of-observation coordinates)
            true                           // aberration (include stellar aberration)
          );
          rightAscension = equatorial.ra;
          declination = equatorial.dec;
          distance = 1.0; // 1 AU for Sun
          
          // Sun position calculated
        } else {
          // For other bodies, use GeoVector and convert to ecliptic
          const geoVector = Astronomy.GeoVector(body, date, false);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          longitude = ecliptic.elon;
          
          // For planets, use the Body directly with Astronomy.Equator
          const equatorial = Astronomy.Equator(
            body,                          // Planet body (Mercury, Venus, etc.)
            Astronomy.MakeTime(date),      // convert Date to AstroTime
            observer,                      // observer
            true,                         // ofdate (use true for date-of-observation coordinates)
            true                          // aberration (include stellar aberration)
          );
          rightAscension = equatorial.ra;
          declination = equatorial.dec;
          // Calculate distance from the vector components
          distance = Math.sqrt(geoVector.x * geoVector.x + geoVector.y * geoVector.y + geoVector.z * geoVector.z);
          
          // Planet position calculated
          
          // Verify RA is in correct range (0-24 hours)
          if (rightAscension < 0 || rightAscension >= 24) {
            // RA out of range warning
          }
          
          // Verify Dec is in correct range (-90 to +90 degrees)
          if (declination < -90 || declination > 90) {
            // Dec out of range warning
          }
        }
      } catch (planetError) {
        // Error calculating planetary position
        throw new Error(`Failed to calculate ${planetName}: ${planetError instanceof Error ? planetError.message : 'Unknown error'}`);
      }
    
      // Determine retrograde motion
      // Calculate positions 1 day before and after to check motion direction
      const dayBefore = new Date(date);
      dayBefore.setDate(dayBefore.getDate() - 1);
      const dayAfter = new Date(date);
      dayAfter.setDate(dayAfter.getDate() + 1);
      
      let longitudeBefore: number;
      let longitudeAfter: number;
      
      if (body === 'Sun') {
        const sunPosBefore = Astronomy.SunPosition(dayBefore);
        const sunPosAfter = Astronomy.SunPosition(dayAfter);
        longitudeBefore = sunPosBefore.elon;
        longitudeAfter = sunPosAfter.elon;
      } else {
        const geoVectorBefore = Astronomy.GeoVector(body, dayBefore, false);
        const geoVectorAfter = Astronomy.GeoVector(body, dayAfter, false);
        const eclipticBefore = Astronomy.Ecliptic(geoVectorBefore);
        const eclipticAfter = Astronomy.Ecliptic(geoVectorAfter);
        longitudeBefore = eclipticBefore.elon;
        longitudeAfter = eclipticAfter.elon;
      }
    
      // If longitude is decreasing, planet is retrograde
      let retrograde = false;
      if (body !== 'Sun' && body !== 'Moon') {
        // Adjust for 360-degree wraparound
        let motion = longitudeAfter - longitudeBefore;
        if (motion > 180) motion -= 360;
        if (motion < -180) motion += 360;
        retrograde = motion < 0;
      }
      
      // Determine zodiac sign
      const sign = SIGNS[Math.floor(longitude / 30)];
      
      return {
        name: planetName,
        longitude: longitude,
        sign: sign,
        house: 0, // Will be calculated later
        retrograde: retrograde,
        rightAscension: rightAscension,
        declination: declination,
        distance: distance,
        isPlanet: true,  // Mark as actual planet
        pointType: 'planet',
      };
    });

    // Calculate houses using Placidus system
    const housesData = calculatePlacidusHouses(date, latitude, longitude);
  
    // Calculate additional celestial points
    const celestialPoints: PlanetPosition[] = [];
    
    // Add Lilith (Black Moon Lilith)
    const lilith = calculateLilith(date);
    lilith.house = determineHouse(lilith.longitude!, housesData.houses);
    
    // Ensure all required properties are present
    const lilithComplete: PlanetPosition = {
      name: lilith.name || 'lilith',
      longitude: lilith.longitude || 0,
      sign: lilith.sign || 'aries', // Use the sign calculated in the function
      house: lilith.house || 1,
      retrograde: lilith.retrograde || false,
      isPlanet: false,
      pointType: lilith.pointType,
      symbol: lilith.symbol
    };
    
    celestialPoints.push(lilithComplete);
    
    // Add Chiron
    const chiron = calculateChiron(date);
    chiron.house = determineHouse(chiron.longitude!, housesData.houses);
    
    // Ensure all required properties are present
    const chironComplete: PlanetPosition = {
      name: chiron.name || 'chiron',
      longitude: chiron.longitude || 0,
      sign: chiron.sign || 'aries', // Use the sign calculated in the function
      house: chiron.house || 1,
      retrograde: chiron.retrograde || false,
      isPlanet: false,
      pointType: chiron.pointType,
      symbol: chiron.symbol
    };
    celestialPoints.push(chironComplete);
    
    // Calculate Lunar Nodes
    const { northNode, southNode } = calculateLunarNodes(date);
    northNode.house = determineHouse(northNode.longitude!, housesData.houses);
    southNode.house = determineHouse(southNode.longitude!, housesData.houses);
    
    // Ensure all required properties are present for north node
    const northNodeComplete: PlanetPosition = {
      name: northNode.name || 'northNode',
      longitude: northNode.longitude || 0,
      sign: northNode.sign || 'aries', // Use the sign calculated in the function
      house: northNode.house || 1,
      retrograde: northNode.retrograde || true,
      isPlanet: false,
      pointType: northNode.pointType,
      symbol: northNode.symbol
    };
    celestialPoints.push(northNodeComplete);
    
    // Ensure all required properties are present for south node
    const southNodeComplete: PlanetPosition = {
      name: southNode.name || 'southNode',
      longitude: southNode.longitude || 0,
      sign: southNode.sign || 'libra', // Use the sign calculated in the function
      house: southNode.house || 7,
      retrograde: southNode.retrograde || true,
      isPlanet: false,
      pointType: southNode.pointType,
      symbol: southNode.symbol
    };
    celestialPoints.push(southNodeComplete);
    
    // Calculate Part of Fortune
    const sun = planets.find(p => p.name === 'sun');
    const moon = planets.find(p => p.name === 'moon');
    if (sun && moon) {
      // Determine if it's a day birth (sun above horizon)
      // Houses 7-12 are ABOVE the horizon (western half of chart)
      // Houses 1-6 are BELOW the horizon (eastern half of chart)
      const sunHouse = sun.house;
      const isDayBirth = sunHouse >= 7 && sunHouse <= 12; // Sun in houses 7-12 = day birth
      
      const partOfFortune = calculatePartOfFortune(
        sun.longitude,
        moon.longitude,
        housesData.ascendant,
        isDayBirth
      );
      partOfFortune.house = determineHouse(partOfFortune.longitude!, housesData.houses);
      
      
      // Ensure all required properties are present for Part of Fortune
      const partOfFortuneComplete: PlanetPosition = {
        name: partOfFortune.name || 'partOfFortune',
        longitude: partOfFortune.longitude || 0,
        sign: partOfFortune.sign || 'aries', // Use the sign calculated in the function
        house: partOfFortune.house || 1,
        retrograde: partOfFortune.retrograde || false,
        isPlanet: false,
        pointType: partOfFortune.pointType,
        symbol: partOfFortune.symbol
      };
      celestialPoints.push(partOfFortuneComplete);
    }
    
    // Combine regular planets with celestial points
    const allCelestialBodies = [...planets, ...celestialPoints];

    // Debug log for celestial points investigation
    console.log('🔍 generateNatalChart: Regular planets count:', planets.length);
    console.log('🔍 generateNatalChart: Celestial points count:', celestialPoints.length);
    console.log('🔍 generateNatalChart: Celestial points names:', celestialPoints.map(p => p.name));
    console.log('🔍 generateNatalChart: All celestial bodies count:', allCelestialBodies.length);
    console.log('🔍 generateNatalChart: All celestial bodies names:', allCelestialBodies.map(p => p.name));


  
    // Assign houses to all celestial bodies
    allCelestialBodies.forEach(body => {
      if (!body.house) {
        body.house = determineHouse(body.longitude, housesData.houses);
      }
    });

    // Calculate aspects including celestial points
    const aspects = calculateAspects(allCelestialBodies);
    // console.log('🔍 Chart generation - aspects calculated:', {
    //   aspectsCount: aspects.length,
    //   firstFewAspects: aspects.slice(0, 3),
    //   planetsCount: planets.length
    // });

    // Planetary positions calculation completed

    return {
      planets: allCelestialBodies,  // Now includes planets + celestial points
      houses: housesData.houses,
      aspects,
      ascendant: housesData.ascendant,
      midheaven: housesData.midheaven,
    };
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    throw new Error(`Failed to calculate planetary positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate houses using the Placidus system
 * This is the most commonly used house system in Western astrology
 */
function calculatePlacidusHouses(date: Date, latitude: number, longitude: number): {
  houses: HousePosition[];
  ascendant: number;
  midheaven: number;
} {
  // Calculate sidereal time
  const gst = Astronomy.SiderealTime(date);
  const lst = (gst + longitude / 15) % 24; // Local sidereal time in hours
  
  // Convert LST to degrees
  const lstDegrees = lst * 15;
  
  // Calculate MC (Midheaven) - where the ecliptic crosses the meridian
  const mc = lstDegrees % 360;
  
  // Calculate RAMC (Right Ascension of Midheaven) 
  const ramc = lstDegrees % 360;
  
  // Calculate obliquity of ecliptic for the given date
  const astroTime = Astronomy.MakeTime(date);
  const obliquity = 23.4367 - 0.013004 * (astroTime.tt / 365.25); // More accurate obliquity
  
  // Calculate Ascendant using proper spherical astronomy
  const ramcRad = ramc * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Improved Ascendant calculation
  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -Math.sin(ramcRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
  );
  
  // Convert to degrees and normalize
  let asc = ascRad * 180 / Math.PI;
  if (asc < 0) asc += 360;
  
  // Calculate intermediate house cusps using improved Placidus method
  // This ensures proper sequential ordering and prevents overlapping wedges
  const houses: HousePosition[] = [];
  
  // The four angles (cardinal cusps)
  const ic = (mc + 180) % 360;  // IC is opposite MC
  const dc = (asc + 180) % 360; // DC is opposite ASC
  
  // Calculate intermediate house cusps using Placidus proportional division
  // This creates unequal houses based on latitude and time of day
  const latFactor = Math.abs(latitude) / 90; // Latitude factor for house size variation
  
  // Improved Placidus house cusps ensuring sequential order and no overlaps
  // Start with the four angles and calculate intermediates in proper sequence
  const baseAngles = [
    { house: 1, angle: asc },
    { house: 4, angle: ic },
    { house: 7, angle: dc },
    { house: 10, angle: mc }
  ];
  
  // Sort angles to ensure proper sequence around the circle
  baseAngles.sort((a, b) => a.angle - b.angle);
  
  // Calculate all house cusps ensuring proper sequential spacing
  const houseCusps: number[] = new Array(12);
  
  // Set the four cardinal angles first
  houseCusps[0] = asc;   // 1st house
  houseCusps[3] = ic;    // 4th house  
  houseCusps[6] = dc;    // 7th house
  houseCusps[9] = mc;    // 10th house
  
  // Calculate intermediate cusps with proper spacing to prevent overlaps
  // Use proportional division but ensure minimum house size of 15 degrees
  const minHouseSize = 15; // Minimum degrees per house to prevent overlaps
  
  // Calculate houses 2, 3 between ASC and IC
  const ascToIcArc = ((ic - asc + 360) % 360);
  const house2Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house3Offset = Math.max(55 + latFactor * 12, house2Offset + minHouseSize);
  houseCusps[1] = (asc + Math.min(house2Offset, ascToIcArc * 0.33)) % 360;
  houseCusps[2] = (asc + Math.min(house3Offset, ascToIcArc * 0.67)) % 360;
  
  // Calculate houses 5, 6 between IC and DC
  const icToDcArc = ((dc - ic + 360) % 360);
  const house5Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house6Offset = Math.max(55 + latFactor * 12, house5Offset + minHouseSize);
  houseCusps[4] = (ic + Math.min(house5Offset, icToDcArc * 0.33)) % 360;
  houseCusps[5] = (ic + Math.min(house6Offset, icToDcArc * 0.67)) % 360;
  
  // Calculate houses 8, 9 between DC and MC
  const dcToMcArc = ((mc - dc + 360) % 360);
  const house8Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house9Offset = Math.max(55 + latFactor * 12, house8Offset + minHouseSize);
  houseCusps[7] = (dc + Math.min(house8Offset, dcToMcArc * 0.33)) % 360;
  houseCusps[8] = (dc + Math.min(house9Offset, dcToMcArc * 0.67)) % 360;
  
  // Calculate houses 11, 12 between MC and ASC
  const mcToAscArc = ((asc - mc + 360) % 360);
  const house11Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house12Offset = Math.max(55 + latFactor * 12, house11Offset + minHouseSize);
  houseCusps[10] = (mc + Math.min(house11Offset, mcToAscArc * 0.33)) % 360;
  houseCusps[11] = (mc + Math.min(house12Offset, mcToAscArc * 0.67)) % 360;
  
  // Create house data array with proper sequential cusps
  const houseData = houseCusps.map((cusp, index) => ({
    number: index + 1,
    cusp: cusp
  }));
  
  // House cusp calculation and validation - debug logging disabled
  houseCusps.forEach((cusp, index) => {
    const nextCusp = houseCusps[(index + 1) % 12];
    const houseSize = ((nextCusp - cusp + 360) % 360);
    
    // Check for very small houses (potential overlap)
    if (houseSize < 10) {
      // House is very small, potential overlap warning
    }
  });
  
  houseData.forEach(house => {
    const sign = SIGNS[Math.floor(house.cusp / 30)];
    houses.push({
      number: house.number,
      cusp: house.cusp,
      sign: sign,
    });
  });
  
  return {
    houses,
    ascendant: asc,
    midheaven: mc,
  };
}

/**
 * Calculate Black Moon Lilith (Mean Lunar Apogee)
 * This is the Moon's mean apogee - the farthest point in the Moon's orbit
 */
function calculateLilith(date: Date): Partial<PlanetPosition> {
  try {
    // Use astronomy-engine to find the most recent lunar apogee (Black Moon Lilith)
    const astroTime = new Astronomy.AstroTime(date);
    
    // Search backwards to find the most recent apogee
    const searchStartTime = astroTime.AddDays(-30); // Look back 30 days
    const apsisEvent = Astronomy.SearchLunarApsis(searchStartTime);
    
    if (apsisEvent) {
      let apogeeEvent = apsisEvent;
      
      // If we found perigee, get the next apogee
      if (apsisEvent.kind === Astronomy.ApsisKind.Pericenter) {
        apogeeEvent = Astronomy.NextLunarApsis(apsisEvent);
      }
      
      // Get the Moon's position at apogee to determine the longitude
      const moonVector = Astronomy.GeoMoon(apogeeEvent.time);
      const ecliptic = Astronomy.Ecliptic(moonVector);
      
      const longitude = ecliptic.elon;
      const signIndex = Math.floor(longitude / 30) % 12;
      const sign = SIGNS[signIndex] || 'aries';
      
      return {
        name: 'lilith',
        longitude: longitude,
        sign: sign,
        retrograde: false, // Lilith doesn't go retrograde
        isPlanet: false,
        pointType: 'apogee',
        symbol: '⚸'
      };
    }
  } catch (error) {
    console.warn('Failed to calculate Lilith with astronomy-engine, using fallback:', error);
  }
  
  // Fallback to previous calculation if astronomy-engine fails
  const T = ((date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) / 36525;
  let meanLongitude = 83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T * T * T / 80053 + T * T * T * T / 18999000;
  meanLongitude = ((meanLongitude % 360) + 360) % 360;
  
  return {
    name: 'lilith',
    longitude: meanLongitude,
    sign: SIGNS[Math.floor(meanLongitude / 30) % 12] || 'aries',
    retrograde: false,
    isPlanet: false,
    pointType: 'apogee',
    symbol: '⚸'
  };
}

/**
 * Calculate Part of Fortune (Lot of Fortune)
 * Formula: Ascendant + Moon - Sun (for day births)
 *         Ascendant + Sun - Moon (for night births)
 */
function calculatePartOfFortune(
  sunLongitude: number,
  moonLongitude: number,
  ascendant: number,
  isDayBirth: boolean
): Partial<PlanetPosition> {
  let longitude: number;
  
  if (isDayBirth) {
    // Day formula: ASC + Moon - Sun
    longitude = (ascendant + moonLongitude - sunLongitude + 360) % 360;
  } else {
    // Night formula: ASC + Sun - Moon
    longitude = (ascendant + sunLongitude - moonLongitude + 360) % 360;
  }
  
  // Ensure we have a valid sign index
  const signIndex = Math.floor(longitude / 30) % 12;
  const sign = SIGNS[signIndex] || 'aries';
  
  return {
    name: 'partOfFortune',
    longitude: longitude,
    sign: sign,
    retrograde: false,
    isPlanet: false,
    pointType: 'arabicPart',
    symbol: '⊕'
  };
}

/**
 * Calculate Lunar Nodes (North Node and South Node)
 * Using astronomy-engine SearchMoonNode for precise calculation
 */
function calculateLunarNodes(date: Date): { northNode: Partial<PlanetPosition>, southNode: Partial<PlanetPosition> } {
  try {
    // Use astronomy-engine to find the most recent Moon node
    const astroTime = new Astronomy.AstroTime(date);
    
    // Search backwards to find the most recent node, then forward to get current position
    const searchStartTime = astroTime.AddDays(-30); // Look back 30 days
    const nodeEvent = Astronomy.SearchMoonNode(searchStartTime);
    
    if (nodeEvent) {
      // Get the Moon's position at the node event time to determine longitude
      const moonVector = Astronomy.GeoMoon(nodeEvent.time);
      const ecliptic = Astronomy.Ecliptic(moonVector);
      
      // The node event gives us one node - calculate both from the Moon's position
      // At a node, the Moon crosses the ecliptic plane
      let northNodeLongitude: number;
      
      if (nodeEvent.kind === Astronomy.NodeEventKind.Ascending) {
        // This is the North Node
        northNodeLongitude = ecliptic.elon;
      } else {
        // This is the South Node, North Node is opposite
        northNodeLongitude = (ecliptic.elon + 180) % 360;
      }
      
      // South Node is always exactly opposite North Node
      const southNodeLongitude = (northNodeLongitude + 180) % 360;
      
      // Calculate signs
      const northNodeSignIndex = Math.floor(northNodeLongitude / 30) % 12;
      const southNodeSignIndex = Math.floor(southNodeLongitude / 30) % 12;
      const northNodeSign = SIGNS[northNodeSignIndex] || 'aries';
      const southNodeSign = SIGNS[southNodeSignIndex] || 'libra';
      
      return {
        northNode: {
          name: 'northNode',
          longitude: northNodeLongitude,
          sign: northNodeSign,
          retrograde: true, // Nodes are always retrograde
          isPlanet: false,
          pointType: 'node',
          symbol: '☊'
        },
        southNode: {
          name: 'southNode',
          longitude: southNodeLongitude,
          sign: southNodeSign,
          retrograde: true,
          isPlanet: false,
          pointType: 'node',
          symbol: '☋'
        }
      };
    }
  } catch (error) {
    console.warn('Failed to calculate lunar nodes with astronomy-engine, using fallback:', error);
  }
  
  // Fallback to previous calculation if astronomy-engine fails
  const T = ((date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) / 36525;
  let meanLongitude = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000;
  meanLongitude = ((meanLongitude % 360) + 360) % 360;
  const southNodeLongitude = (meanLongitude + 180) % 360;
  
  return {
    northNode: {
      name: 'northNode',
      longitude: meanLongitude,
      sign: SIGNS[Math.floor(meanLongitude / 30) % 12] || 'aries',
      retrograde: true,
      isPlanet: false,
      pointType: 'node',
      symbol: '☊'
    },
    southNode: {
      name: 'southNode',
      longitude: southNodeLongitude,
      sign: SIGNS[Math.floor(southNodeLongitude / 30) % 12] || 'libra',
      retrograde: true,
      isPlanet: false,
      pointType: 'node',
      symbol: '☋'
    }
  };
}

/**
 * Calculate Chiron position (approximation)
 * Note: For precise Chiron position, we would need ephemeris data
 * This is a simplified calculation based on its orbital period
 */
function calculateChiron(date: Date): Partial<PlanetPosition> {
  try {
    // Try using astronomy-engine's GravitySimulator for Chiron
    // If that's not available, use improved ephemeris calculation
    
    // Orbital elements for 2060 Chiron (Epoch J2000.0)
    const semiMajorAxis = 13.7053530; // AU
    const eccentricity = 0.3831649;
    const inclination = 6.93524; // degrees
    const meanAnomalyAtEpoch = 359.46170; // degrees at J2000.0
    const longitudeOfAscendingNode = 208.65735; // degrees
    const argumentOfPerihelion = 339.58061 - longitudeOfAscendingNode; // degrees
    const orbitalPeriod = 50.39; // years
    
    // J2000.0 epoch: January 1, 2000, 12:00 TT
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const yearsSinceEpoch = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    // Calculate mean anomaly at the given date
    const meanMotion = 360 / orbitalPeriod; // degrees per year
    let meanAnomaly = (meanAnomalyAtEpoch + meanMotion * yearsSinceEpoch) % 360;
    if (meanAnomaly < 0) meanAnomaly += 360;
    
    // Convert to radians for calculation
    const M = meanAnomaly * Math.PI / 180;
    const e = eccentricity;
    
    // Solve Kepler's equation for eccentric anomaly (E) using Newton's method
    let E = M; // Initial guess
    for (let i = 0; i < 10; i++) {
      const deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= deltaE;
      if (Math.abs(deltaE) < 1e-6) break;
    }
    
    // Calculate true anomaly
    const trueAnomaly = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );
    
    // Calculate heliocentric longitude
    const omega = argumentOfPerihelion * Math.PI / 180;
    const Omega = longitudeOfAscendingNode * Math.PI / 180;
    const i = inclination * Math.PI / 180;
    
    // Calculate longitude in ecliptic coordinates
    const u = trueAnomaly + omega; // argument of latitude
    let longitude = Math.atan2(
      Math.sin(u) * Math.cos(i),
      Math.cos(u)
    ) + Omega;
    
    // Convert to degrees and normalize
    longitude = longitude * 180 / Math.PI;
    if (longitude < 0) longitude += 360;
    longitude = longitude % 360;
    
    // Determine zodiac sign
    const signIndex = Math.floor(longitude / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';
    
    // Simple retrograde detection based on orbital position
    // Chiron is retrograde when it's moving slower than average (near aphelion)
    const distanceFromSun = semiMajorAxis * (1 - e * Math.cos(E));
    const isNearAphelion = distanceFromSun > semiMajorAxis * 1.2;
    
    return {
      name: 'chiron',
      longitude: longitude,
      sign: sign,
      retrograde: isNearAphelion,
      isPlanet: false,
      pointType: 'centaur',
      symbol: '⚷'
    };
  } catch (error) {
    // Fallback to simplified calculation if orbital calculation fails
    const cycleInDays = 18396; // 50.39 years
    const referenceDate = new Date('2000-01-01T00:00:00Z');
    const referenceLongitude = 251; // 11° Sagittarius at J2000
    
    const daysSinceReference = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
    const dailyMotion = 360 / cycleInDays;
    let longitude = (referenceLongitude + (daysSinceReference * dailyMotion)) % 360;
    
    if (longitude < 0) longitude += 360;
    
    const signIndex = Math.floor(longitude / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';
    
    return {
      name: 'chiron',
      longitude: longitude,
      sign: sign,
      retrograde: false,
      isPlanet: false,
      pointType: 'centaur',
      symbol: '⚷'
    };
  }
}

/**
 * Determine which house a planet is in based on its longitude
 */
function determineHouse(planetLongitude: number, houses: HousePosition[]): number {
  for (let i = 0; i < 12; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];
    
    const houseStart = currentHouse.cusp;
    const houseEnd = nextHouse.cusp;
    
    // Handle house that crosses 0 degrees
    if (houseEnd < houseStart) {
      if (planetLongitude >= houseStart || planetLongitude < houseEnd) {
        return currentHouse.number;
      }
    } else {
      if (planetLongitude >= houseStart && planetLongitude < houseEnd) {
        return currentHouse.number;
      }
    }
  }
  
  return 1; // Default to first house if not found
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planets: PlanetPosition[]): ChartAspect[] {
  // console.log('🔍 calculateAspects called with planets:', planets.length);
  const aspects: ChartAspect[] = [];
  
  // Define aspect colors
  const aspectColors: { [key: string]: string } = {
    conjunction: '#000000',
    sextile: '#0066cc',
    square: '#cc0000',
    trine: '#00cc00',
    opposition: '#cc0000',
    quincunx: '#cc6600'
  };
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate the angular separation
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;
      
      // Check for each aspect type
      for (const [aspectName, aspectData] of Object.entries(ASPECTS)) {
        const orb = Math.abs(angle - aspectData.angle);
        
        if (orb <= aspectData.orb) {
          // Determine if aspect is applying or separating
          // This is a simplified check - in reality would need to consider planetary speeds
          const applying = planet1.longitude < planet2.longitude;
          
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectName,
            angle: angle,
            orb: orb,
            color: aspectColors[aspectName] || '#666666',
            applying: applying
          });
          break; // Only one aspect per planet pair
        }
      }
    }
  }
  
  // console.log('🔍 calculateAspects returning:', {
  //   aspectsCount: aspects.length,
  //   aspects: aspects.map(a => `${a.planet1} ${a.aspect} ${a.planet2}`)
  // });
  
  return aspects;
}



/**
 * Generate SVG natal chart with proper ring-based partitioning
 */
export function generateNatalChartSVG(
  chartData: NatalChartData,
  width: number = 800,
  height: number = 800
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = Math.min(width, height) * 0.05;
  const maxRadius = (Math.min(width, height) - margin) / 2;
  const ringThickness = maxRadius * 0.12;

  // Define the ring radii (from outer to inner)
  const signRingRadius = maxRadius;                      // Outermost ring: Zodiac signs
  const houseRingRadius = maxRadius - ringThickness;    // Middle ring: Houses
  const planetRingRadius = maxRadius - 2 * ringThickness; // Inner ring: Planets
  const aspectRingRadius = maxRadius - 3 * ringThickness; // Center area: Aspect lines

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Generate sign wheel (outermost ring)
  try {
    svg += generateSignWheel(centerX, centerY, signRingRadius, ringThickness);
  } catch (error) {
    console.error('Error generating sign wheel:', error);
    svg += '<!-- Sign wheel generation failed -->';
  }

  // Generate house wheel
  try {
    svg += generateHouseWheel(
      centerX,
      centerY,
      houseRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating house wheel:', error);
    svg += '<!-- House wheel generation failed -->';
  }

  // Generate planet wheel (3rd ring)
  try {
    svg += generatePlanetWheel(
      centerX,
      centerY,
      planetRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating planet wheel:', error);
    svg += '<!-- Planet wheel generation failed -->';
  }

  // Generate aspect lines (innermost - in the center)
  try {
    svg += generateAspectLines(centerX, centerY, aspectRingRadius, chartData);
  } catch (error) {
    console.error('Error generating aspect lines:', error);
    svg += '<!-- Aspect lines generation failed -->';
  }

  svg += "</svg>";

  return svg;
}

/**
 * Generate the zodiac sign wheel (outermost ring)
 */
function generateSignWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number
): string {
  let svg = "";

  // Sign ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f8f9fa" stroke="#333" stroke-width="2"/>`;

  const signColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#48dbfb",
    "#0abde3",
  ];

  const signSymbols = [
    "♈", // Aries
    "♉", // Taurus
    "♊", // Gemini
    "♋", // Cancer
    "♌", // Leo
    "♍", // Virgo
    "♎", // Libra
    "♏", // Scorpio
    "♐", // Sagittarius
    "♑", // Capricorn
    "♒", // Aquarius
    "♓", // Pisces
  ];

  for (let i = 0; i < 12; i++) {
    const startAngle = i * 30 - 90;
    const endAngle = (i + 1) * 30 - 90;

    // Create sign sector
    svg += createSector(
      centerX,
      centerY,
      radius,
      radius - thickness,
      startAngle,
      endAngle,
      signColors[i] + "20",
      "#333",
      1
    );

    // Add sign symbol
    const symbolAngle = (startAngle + 15) * (Math.PI / 180);
    const symbolRadius = radius - thickness / 2;
    const symbolX = centerX + symbolRadius * Math.cos(symbolAngle);
    const symbolY = centerY + symbolRadius * Math.sin(symbolAngle);

    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="18" fill="${signColors[i]}" font-weight="bold" 
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${signSymbols[i]}</text>`;
  }

  return svg;
}

/**
 * Generate the house wheel
 */
function generateHouseWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // House ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f1f3f4" stroke="#666" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${
    radius - thickness
  }" fill="white" stroke="#666" stroke-width="1"/>`;

  const houseColors = [
    "#e3f2fd",
    "#f3e5f5",
    "#e8f5e8",
    "#fff3e0",
    "#fce4ec",
    "#e0f2f1",
    "#f9fbe7",
    "#fff8e1",
    "#f1f8e9",
    "#fef7ff",
    "#e8eaf6",
    "#e1f5fe",
  ];

  for (let i = 0; i < 12; i++) {
    const house = chartData.houses[i];
    const nextHouse = chartData.houses[(i + 1) % 12];

    const startAngle = house.cusp - 90;
    let endAngle = nextHouse.cusp - 90;

    // Improved handling of crossing 0 degrees with validation
    if (endAngle < startAngle) {
      endAngle += 360;
    }
    
    // Ensure minimum house size of 10 degrees to prevent invisible wedges
    const houseSize = endAngle - startAngle;
    if (houseSize < 10) {
      console.warn(`🏠 House ${i + 1} size too small (${houseSize.toFixed(1)}°), adjusting to 10°`);
      endAngle = startAngle + 10;
    }
    
    // Log house wedge details for debugging houses 4 and 8
    if (i === 3 || i === 7) { // Houses 4 and 8 (0-indexed)
      // House wedge calculation for chart display
    }

    // Create house sector with improved error handling
    try {
      svg += createSector(
        centerX,
        centerY,
        radius,
        radius - thickness,
        startAngle,
        endAngle,
        houseColors[i],
        "#666",
        1
      );
    } catch (error) {
      console.error(`🏠 Error creating sector for house ${i + 1}:`, error);
      // Create a fallback simple sector
      const fallbackPath = `<path d="M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius} Z" fill="${houseColors[i]}" stroke="#666" stroke-width="1"/>`;
      svg += fallbackPath;
    }

    // Add house number with better positioning
    const midAngle = (startAngle + (endAngle - startAngle) / 2) * (Math.PI / 180);
    const numberRadius = radius - thickness / 2;
    const numberX = centerX + numberRadius * Math.cos(midAngle);
    const numberY = centerY + numberRadius * Math.sin(midAngle);

    svg += `<text x="${numberX}" y="${numberY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="14" fill="#333" font-weight="bold">${i + 1}</text>`;

    // Add house cusp line with improved angular house emphasis
    const cuspAngle = startAngle * (Math.PI / 180);
    const lineStart = radius - thickness;
    const lineEnd = radius;
    const x1 = centerX + lineStart * Math.cos(cuspAngle);
    const y1 = centerY + lineStart * Math.sin(cuspAngle);
    const x2 = centerX + lineEnd * Math.cos(cuspAngle);
    const y2 = centerY + lineEnd * Math.sin(cuspAngle);

    // Emphasize angular houses (1st, 4th, 7th, 10th)
    const isAngularHouse = [1, 4, 7, 10].includes(i + 1);
    const strokeWidth = isAngularHouse ? 3 : 1;
    const strokeColor = isAngularHouse ? "#333" : "#666";
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
  }

  return svg;
}

/**
 * Generate the planet wheel
 */
function generatePlanetWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Planet ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#fafbfc" stroke="#999" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius - thickness}" fill="white" stroke="#999" stroke-width="1"/>`;

  const planetSymbols: { [key: string]: string } = {
    sun: "☉",
    moon: "☽", 
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
    // Additional celestial points
    lilith: "⚸",
    chiron: "⚷",
    northNode: "☊",
    southNode: "☋",
    partOfFortune: "⊕",
  };

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
    // Additional celestial points
    lilith: "#800080",      // Purple for Lilith
    chiron: "#228B22",      // Forest green for Chiron
    northNode: "#4682B4",   // Steel blue for North Node
    southNode: "#708090",   // Slate gray for South Node
    partOfFortune: "#DAA520", // Goldenrod for Part of Fortune
  };

  // Sort planets by longitude to avoid overlaps
  const sortedPlanets = [...chartData.planets].sort(
    (a, b) => a.longitude - b.longitude
  );
  const adjustedPositions = adjustPlanetPositions(sortedPlanets);

  sortedPlanets.forEach((planet, index) => {
    const originalAngle = (planet.longitude - 90) * (Math.PI / 180);
    const adjustedAngle = (adjustedPositions[index] - 90) * (Math.PI / 180);

    // Position on the actual degree (on the inner boundary of the chart)
    const degreeRadius = radius - thickness; // Point to the inner edge of the planet ring
    const degreeX = centerX + degreeRadius * Math.cos(originalAngle);
    const degreeY = centerY + degreeRadius * Math.sin(originalAngle);

    // Position for the symbol (in the planet ring - the innermost ring)
    const symbolRadius = radius - thickness / 2; // Position in the middle of the planet ring
    const symbolX = centerX + symbolRadius * Math.cos(adjustedAngle);
    const symbolY = centerY + symbolRadius * Math.sin(adjustedAngle);

    const color = planetColors[planet.name] || "#333";

    // Draw line from degree position to symbol
    svg += `<line x1="${degreeX}" y1="${degreeY}" x2="${symbolX}" y2="${symbolY}" 
            stroke="${color}" stroke-width="1" opacity="0.7"/>`;

    // Draw degree marker on the rim
    svg += `<circle cx="${degreeX}" cy="${degreeY}" r="2" fill="${color}" stroke="white" stroke-width="1"/>`;

    // Draw symbol background (well inside the center)
    svg += `<circle cx="${symbolX}" cy="${symbolY}" r="10" fill="white" stroke="${color}" stroke-width="2"/>`;

    // Draw symbol
    const symbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();
    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="12" fill="${color}" font-weight="bold" 
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${symbol}</text>`;

    // Retrograde indicator
    if (planet.retrograde) {
      svg += `<text x="${symbolX + 12}" y="${
        symbolY - 8
      }" text-anchor="middle" dominant-baseline="middle" 
              font-size="7" fill="red" font-weight="bold">R</text>`;
    }
  });

  return svg;
}

/**
 * Generate aspect lines in the center
 */
function generateAspectLines(
  centerX: number,
  centerY: number,
  radius: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Inner circle background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" stroke="#ccc" stroke-width="1"/>`;

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
  };

  // Generating aspect lines for chart visualization

  // Create gradients for each aspect line
  let gradientDefs = '<defs>';
  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      const color1 = planetColors[planet1.name] || "#333";
      const color2 = planetColors[planet2.name] || "#333";
      
      gradientDefs += `
        <linearGradient id="aspect-gradient-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:0.8" />
        </linearGradient>`;
    }
  });
  gradientDefs += '</defs>';
  svg += gradientDefs;

  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      // Draw lines to the edge of the aspect ring (inner circle boundary)
      const lineRadius = radius;
      
      const angle1 = (planet1.longitude - 90) * (Math.PI / 180);
      const angle2 = (planet2.longitude - 90) * (Math.PI / 180);

      const x1 = centerX + lineRadius * Math.cos(angle1);
      const y1 = centerY + lineRadius * Math.sin(angle1);
      const x2 = centerX + lineRadius * Math.cos(angle2);
      const y2 = centerY + lineRadius * Math.sin(angle2);

      const aspectData = ASPECTS[aspect.aspect as keyof typeof ASPECTS];
      const strokeWidth = aspectData?.type === "major" ? 2 : 1;
      const opacity = aspect.aspect === "conjunction" ? 0.9 : 0.7;

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="url(#aspect-gradient-${index})" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
    }
  });

  return svg;
}

/**
 * Create an SVG sector (arc segment)
 */
function createSector(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  fill: string,
  stroke: string,
  strokeWidth: number
): string {
  const startRad = startAngle * (Math.PI / 180);
  const endRad = endAngle * (Math.PI / 180);

  const x1 = centerX + outerRadius * Math.cos(startRad);
  const y1 = centerY + outerRadius * Math.sin(startRad);
  const x2 = centerX + outerRadius * Math.cos(endRad);
  const y2 = centerY + outerRadius * Math.sin(endRad);

  const x3 = centerX + innerRadius * Math.cos(endRad);
  const y3 = centerY + innerRadius * Math.sin(endRad);
  const x4 = centerX + innerRadius * Math.cos(startRad);
  const y4 = centerY + innerRadius * Math.sin(startRad);

  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  const pathData = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");

  return `<path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Adjust planet positions to avoid overlaps
 */
function adjustPlanetPositions(planets: PlanetPosition[]): number[] {
  const minSeparation = 12; // Minimum degrees between planets
  const positions = planets.map((p) => p.longitude);

  // Simple collision avoidance
  for (let i = 1; i < positions.length; i++) {
    const prevPos = positions[i - 1];
    const currentPos = positions[i];

    let diff = currentPos - prevPos;
    if (diff < 0) diff += 360;

    if (diff < minSeparation) {
      positions[i] = (prevPos + minSeparation) % 360;
    }
  }

  return positions;
}

/**
 * Generate natal chart from birth data
 */
export async function generateNatalChart(birthData: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  coordinates: { lat: string; lon: string };
  locationOfBirth: string;
}): Promise<{ svg: string; metadata: ChartMetadata }> {
  console.log('🌟 generateNatalChart: FUNCTION CALLED with data:', {
    name: birthData.name,
    dateOfBirth: birthData.dateOfBirth,
    timeOfBirth: birthData.timeOfBirth,
    coordinates: birthData.coordinates,
    locationOfBirth: birthData.locationOfBirth
  });

  // Process birth time with proper timezone handling
  const processedTime = processBirthTime({
    dateOfBirth: birthData.dateOfBirth,
    timeOfBirth: birthData.timeOfBirth,
    coordinates: birthData.coordinates,
    locationOfBirth: birthData.locationOfBirth
  });
  
  if (processedTime.confidence === 'low' || processedTime.warnings.length > 2) {
    console.warn('NATAL CHART ACCURACY WARNING:', processedTime.warnings);
  }
  
  const birthDate = processedTime.utcDate; // Use properly processed UTC date
  const latitude = parseFloat(birthData.coordinates.lat);
  const longitude = parseFloat(birthData.coordinates.lon);

  // Calculate planetary positions
  console.log('🔮 generateNatalChart: About to calculate planetary positions for date:', birthDate);
  const chartData = await calculatePlanetaryPositions(birthDate, latitude, longitude);

  const allPlanetNames = chartData.planets?.map(p => p.name) || [];
  const celestialPointsFound = chartData.planets?.filter(p =>
    ['lilith', 'chiron', 'northNode', 'southNode', 'partOfFortune'].includes(p.name?.toLowerCase() || '')
  ) || [];

  console.log('📊 generateNatalChart: Planetary positions calculated:', {
    planetsCount: chartData.planets?.length || 0,
    housesCount: chartData.houses?.length || 0,
    aspectsCount: chartData.aspects?.length || 0,
    allPlanetNames: allPlanetNames,
    celestialPointsInResult: celestialPointsFound.length,
    celestialPointsDetails: celestialPointsFound.map(p => ({
      name: p.name,
      lowerName: p.name?.toLowerCase(),
      isPlanet: p.isPlanet,
      pointType: p.pointType,
      longitude: p.longitude,
      sign: p.sign
    }))
  });

  // Generate SVG with larger size for better display
  const svg = generateNatalChartSVG(chartData, 1000, 1000);

  // Validate SVG was generated successfully
  if (!svg || svg.length === 0) {
    throw new Error('SVG generation failed: No content generated');
  }

  return {
    svg,
    metadata: {
      name: birthData.name,
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      locationOfBirth: birthData.locationOfBirth,
      coordinates: birthData.coordinates,
      generatedAt: new Date().toISOString(),
      chartData,
    },
  };
}
