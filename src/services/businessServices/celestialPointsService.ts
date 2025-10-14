/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Celestial Points Calculation Service
 * Calculates special astrological points: Lilith, Chiron, Lunar Nodes, Part of Fortune
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
 * Calculate Chiron position using ephemeris-based approximation
 * Chiron's orbital period is 50.39 years with significant eccentricity
 * For production use, Swiss Ephemeris would provide exact positions
 */
export function calculateChiron(date: Date): Partial<PlanetPosition> {
  // Reference points from ephemeris data for geocentric ecliptic longitude
  // Chiron's motion is irregular due to its eccentric orbit
  const referencePoints = [
    { date: new Date('1990-01-01T00:00:00Z'), longitude: 109.5 }, // ~19° Cancer
    { date: new Date('1994-01-01T00:00:00Z'), longitude: 154.5 }, // ~4.5° Virgo
    { date: new Date('2000-01-01T00:00:00Z'), longitude: 250.0 }, // ~10° Sagittarius
    { date: new Date('2010-01-01T00:00:00Z'), longitude: 327.5 }, // ~27.5° Aquarius
    { date: new Date('2020-01-01T00:00:00Z'), longitude: 3.5 }    // ~3.5° Aries
  ];

  // Find the two reference points that bracket the target date
  let beforePoint = referencePoints[0];
  let afterPoint = referencePoints[referencePoints.length - 1];

  for (let i = 0; i < referencePoints.length - 1; i++) {
    if (date >= referencePoints[i].date && date <= referencePoints[i + 1].date) {
      beforePoint = referencePoints[i];
      afterPoint = referencePoints[i + 1];
      break;
    }
  }

  // Linear interpolation between reference points
  const totalDays = (afterPoint.date.getTime() - beforePoint.date.getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceStart = (date.getTime() - beforePoint.date.getTime()) / (1000 * 60 * 60 * 24);
  const fraction = daysSinceStart / totalDays;

  let longitudeDiff = afterPoint.longitude - beforePoint.longitude;

  // Handle wrap-around at 0°/360°
  if (longitudeDiff > 180) {
    longitudeDiff -= 360;
  } else if (longitudeDiff < -180) {
    longitudeDiff += 360;
  }

  let longitude = beforePoint.longitude + (longitudeDiff * fraction);

  // Normalize to 0-360
  longitude = ((longitude % 360) + 360) % 360;

  // Determine zodiac sign
  const signIndex = Math.floor(longitude / 30) % 12;
  const sign = SIGNS[signIndex] || 'aries';

  // Chiron retrograde detection (approximate)
  // Chiron is retrograde roughly 5 months per year
  // Simple estimation based on typical retrograde periods
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const isRetrograde = dayOfYear >= 170 && dayOfYear <= 320; // Roughly June-November

  return {
    name: 'chiron',
    longitude: longitude,
    sign: sign,
    retrograde: isRetrograde,
    isPlanet: false,
    pointType: 'centaur',
    symbol: '⚷'
  };
}
