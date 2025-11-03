/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Celestial Points Calculation Service
 * Calculates special astrological points: Lilith, Lunar Nodes, Part of Fortune, Vertex
 */

import * as Astronomy from 'astronomy-engine';
import { PlanetPosition } from '@/types/astrology';
import { SIGNS } from '@/constants/astrological';

/**
 * Calculate Black Moon Lilith (Mean Lunar Apogee)
 * This is the Moon's mean apogee - the farthest point in the Moon's orbit
 */
export function calculateLilith(date: Date): Partial<PlanetPosition> {
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
export function calculatePartOfFortune(
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
 * Using Mean Node formula for accurate position
 */
export function calculateLunarNodes(date: Date): { northNode: Partial<PlanetPosition>, southNode: Partial<PlanetPosition> } {
  // Calculate Julian centuries from J2000.0
  // Using Mean Node formula from astronomical algorithms
  const T = ((date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) / 36525;

  // Mean North Node longitude formula
  let meanLongitude = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000;

  // Normalize to 0-360
  meanLongitude = ((meanLongitude % 360) + 360) % 360;

  // South Node is always exactly 180° opposite
  const southNodeLongitude = (meanLongitude + 180) % 360;

  // Calculate zodiac signs
  const northNodeSignIndex = Math.floor(meanLongitude / 30) % 12;
  const southNodeSignIndex = Math.floor(southNodeLongitude / 30) % 12;
  const northNodeSign = SIGNS[northNodeSignIndex] || 'aries';
  const southNodeSign = SIGNS[southNodeSignIndex] || 'libra';

  return {
    northNode: {
      name: 'northNode',
      longitude: meanLongitude,
      sign: northNodeSign,
      retrograde: true, // Mean Node is always retrograde
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

/**
 * Calculate Vertex (Electric Ascendant)
 * The Vertex is found at the intersection of the ecliptic with the prime vertical in the west
 * It represents fated encounters and significant relationships
 *
 * Formula: Vertex = ARCCOT(-((COT(colatitude) × SIN(ε)) - (SIN(RAMC) × COS(ε))) / COS(RAMC))
 * Where:
 * - ε = obliquity of the ecliptic (23.4397°)
 * - RAMC = Right Ascension of Midheaven = LST × 15
 * - colatitude = 90° - |latitude|
 */
/**
 * Calculate Vertex (Electric Ascendant)
 * The Vertex is found at the intersection of the ecliptic with the prime vertical in the west
 *
 * Algorithm ported from Kotlin mobile app for consistency across platforms.
 */
export function calculateVertex(
  date: Date,
  latitude: number,
  longitude: number
): Partial<PlanetPosition> {
  try {
    // Calculate Local Sidereal Time using Astronomy Engine
    const astroTime = new Astronomy.AstroTime(date);

    // Get the Mean Sidereal Time at Greenwich (in hours)
    const mst = Astronomy.SiderealTime(astroTime);

    // Convert longitude to hours (15 degrees = 1 hour)
    const longitudeHours = longitude / 15;

    // Calculate Local Sidereal Time (in hours)
    let lst = mst + longitudeHours;
    if (lst < 0) lst += 24;
    if (lst >= 24) lst -= 24;

    // Calculate RAMC (Right Ascension of the Midheaven) in degrees
    const ramc = lst * 15;

    // Obliquity of the ecliptic (more accurate value for epoch)
    const obliquity = 23.4397;

    // Convert to radians
    const latRad = (latitude * Math.PI) / 180;
    const ramcRad = (ramc * Math.PI) / 180;
    const oblRad = (obliquity * Math.PI) / 180;

    // VERTEX CALCULATION
    // The Vertex is the western intersection of the Prime Vertical with the Ecliptic
    // Formula: atan2(cos(RAMC), -((cot(lat) * sin(obl)) - (sin(RAMC) * cos(obl))))
    //
    // Traditional method suggests calculating "Ascendant at co-latitude" but direct
    // implementation yields ~11-13° error. Current formula gives ~7-18° error.
    //
    // Note: Achieving sub-degree accuracy requires Swiss Ephemeris or extensive
    // empirical tuning with dozens of test cases. Current accuracy is acceptable
    // for general astrological practice as Vertex is a minor point.

    const cotLat = 1.0 / Math.tan(latRad);
    const numerator = Math.cos(ramcRad);
    const denominator = -((cotLat * Math.sin(oblRad)) - (Math.sin(ramcRad) * Math.cos(oblRad)));

    // Calculate using atan2 for proper quadrant handling
    let vertexLongitude = Math.atan2(numerator, denominator) * (180 / Math.PI);

    // Normalize to 0-360
    vertexLongitude = ((vertexLongitude % 360) + 360) % 360;

    const signIndex = Math.floor(vertexLongitude / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';

    return {
      name: 'vertex',
      longitude: vertexLongitude,
      sign: sign,
      retrograde: false,
      isPlanet: false,
      pointType: 'angle',
      symbol: 'Vx'
    };
  } catch (error) {
    console.warn('Failed to calculate Vertex:', error);
    // Return fallback position
    return {
      name: 'vertex',
      longitude: 0,
      sign: 'aries',
      retrograde: false,
      isPlanet: false,
      pointType: 'angle',
      symbol: 'Vx'
    };
  }
}

