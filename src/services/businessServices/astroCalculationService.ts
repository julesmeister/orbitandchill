/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astronomical Calculation Service
 * Core planetary position calculations and aspect detection
 */

import * as Astronomy from 'astronomy-engine';
import { PlanetPosition, NatalChartData, ChartAspect } from '@/types/astrology';
import { PLANETS, SIGNS, ASTRONOMY_BODIES, ASPECTS } from '@/constants/astrological';
import { calculatePlacidusHouses, determineHouse } from './houseSystemService';
import { calculateLilith, calculateChiron, calculateLunarNodes, calculatePartOfFortune } from './celestialPointsService';

/**
 * Calculate planetary positions using astronomy-engine
 * This provides professional-grade accuracy (±1 arcminute) with MIT license
 */
export async function calculatePlanetaryPositions(
  date: Date,
  latitude: number,
  longitude: number
): Promise<NatalChartData> {
  // Validate inputs first
  if (!date || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to calculatePlanetaryPositions');
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(`Invalid coordinates provided: lat=${latitude}, lng=${longitude}`);
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error(`Latitude out of range: ${latitude}. Must be between -90 and 90.`);
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error(`Longitude out of range: ${longitude}. Must be between -180 and 180.`);
  }

  try {
    // Create Observer for astronomy-engine
    let observer;
    try {
      // Method 1: Try as a constructor (most common)
      observer = new Astronomy.Observer(latitude, longitude, 0);
    } catch (e1) {
      try {
        // Method 2: Try with object literal (fallback)
        observer = { latitude, longitude, height: 0 };
      } catch (e2) {
        console.error('🔄 NATAL: All Observer creation methods failed:', { e1, e2 });
        throw new Error('Cannot create Observer object with provided coordinates');
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
        if (planetName === 'sun') {
          // For the Sun, use SunPosition which gives geocentric longitude
          const sunPos = Astronomy.SunPosition(date);
          if (!sunPos || typeof sunPos.elon !== 'number' || isNaN(sunPos.elon)) {
            throw new Error('SunPosition returned invalid longitude');
          }
          longitude = sunPos.elon;

          // For the Sun, use the Body directly with Astronomy.Equator
          const astroTime = Astronomy.MakeTime(date);
          if (!astroTime) {
            throw new Error('Failed to convert Date to AstroTime');
          }

          const equatorial = Astronomy.Equator(
            Astronomy.Body.Sun,             // Sun body
            astroTime,                      // convert Date to AstroTime
            observer,                       // observer
            true,                          // ofdate (use true for date-of-observation coordinates)
            true                           // aberration (include stellar aberration)
          );

          if (!equatorial || typeof equatorial.ra !== 'number' || typeof equatorial.dec !== 'number') {
            throw new Error('Equatorial coordinates calculation failed for Sun');
          }

          rightAscension = equatorial.ra;
          declination = equatorial.dec;
          distance = 1.0; // 1 AU for Sun
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

      if (planetName === 'sun') {
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
      if (planetName !== 'sun' && planetName !== 'moon') {
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



    // Assign houses to all celestial bodies
    allCelestialBodies.forEach(body => {
      if (!body.house) {
        body.house = determineHouse(body.longitude, housesData.houses);
      }
    });

    // Calculate aspects including celestial points
    const aspects = calculateAspects(allCelestialBodies);

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
 * Calculate aspects between planets
 */
export function calculateAspects(planets: PlanetPosition[]): ChartAspect[] {
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

  return aspects;
}
