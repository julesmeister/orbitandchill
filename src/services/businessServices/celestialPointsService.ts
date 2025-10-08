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
 * Using astronomy-engine SearchMoonNode for precise calculation
 */
export function calculateLunarNodes(date: Date): { northNode: Partial<PlanetPosition>, southNode: Partial<PlanetPosition> } {
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
export function calculateChiron(date: Date): Partial<PlanetPosition> {
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
