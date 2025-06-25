/**
 * Astronomical calculation utilities
 * JavaScript replacement for pyswisseph functionality
 * 
 * Note: This is a simplified implementation for demonstration.
 * For production use, consider integrating with a proper ephemeris library
 * or astronomical calculation service.
 */

import { PLANETS } from '../constants';

// Julian Day Number calculation
export function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JavaScript months are 0-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  // Convert time to decimal hours
  const decimalHours = hour + minute / 60 + second / 3600;
  
  // Julian Day calculation (simplified Gregorian calendar)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  return jdn + (decimalHours - 12) / 24;
}

// Convert degrees to radians
export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Convert radians to degrees
export function radiansToDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

// Normalize angle to 0-360 degrees
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

// Calculate planetary positions (simplified)
// Note: This is a basic implementation using mean elements
// For accurate results, use a proper ephemeris
export function calculatePlanetPosition(planetId: number, julianDay: number): { longitude: number; speed: number } {
  // This is a very simplified calculation
  // In a real implementation, you would use VSOP87 or similar algorithms
  
  const T = (julianDay - 2451545.0) / 36525; // centuries since J2000.0
  
  // Simplified mean longitude calculations (very approximate)
  let longitude: number;
  let speed: number;
  
  switch (planetId) {
    case 0: // Sun
      longitude = normalizeAngle(280.460 + 36000.771 * T);
      speed = 0.985; // degrees per day (approximate)
      break;
    case 1: // Moon
      longitude = normalizeAngle(218.316 + 481267.881 * T);
      speed = 13.176; // degrees per day (approximate)
      break;
    case 2: // Mercury
      longitude = normalizeAngle(252.251 + 149472.675 * T);
      speed = 1.383; // degrees per day (approximate)
      break;
    case 3: // Venus
      longitude = normalizeAngle(181.980 + 58517.816 * T);
      speed = 1.202; // degrees per day (approximate)
      break;
    case 4: // Mars
      longitude = normalizeAngle(355.453 + 19140.297 * T);
      speed = 0.524; // degrees per day (approximate)
      break;
    case 5: // Jupiter
      longitude = normalizeAngle(34.352 + 3034.906 * T);
      speed = 0.083; // degrees per day (approximate)
      break;
    case 6: // Saturn
      longitude = normalizeAngle(50.078 + 1222.114 * T);
      speed = 0.033; // degrees per day (approximate)
      break;
    case 7: // Uranus
      longitude = normalizeAngle(314.055 + 428.379 * T);
      speed = 0.012; // degrees per day (approximate)
      break;
    case 8: // Neptune
      longitude = normalizeAngle(304.348 + 218.486 * T);
      speed = 0.006; // degrees per day (approximate)
      break;
    case 9: // Pluto
      longitude = normalizeAngle(238.957 + 145.181 * T);
      speed = 0.004; // degrees per day (approximate)
      break;
    case 10: // Mean Node
      longitude = normalizeAngle(125.045 - 1934.136 * T);
      speed = -0.053; // degrees per day (retrograde)
      break;
    default:
      longitude = 0;
      speed = 0;
  }
  
  return { longitude, speed };
}

// Calculate house cusps using Placidus system (simplified)
export function calculateHouseCusps(
  julianDay: number,
  latitude: number,
  longitude: number,
  houseSystem: string = 'Placidus'
): number[] {
  // This is a very simplified house calculation
  // Real implementations would use complex spherical trigonometry
  
  // Calculate sidereal time (simplified)
  const siderealTime = normalizeAngle(280.460618 + 360.98564736629 * (julianDay - 2451545.0));
  
  // Calculate Ascendant (simplified)
  const ascendant = normalizeAngle(siderealTime + longitude);
  
  // For simplified calculation, we'll use equal house division with Placidus adjustment
  const houses: number[] = [];
  
  if (houseSystem === 'Equal') {
    // Equal house system
    for (let i = 0; i < 12; i++) {
      houses.push(normalizeAngle(ascendant + i * 30));
    }
  } else {
    // Simplified Placidus-like calculation
    houses.push(ascendant); // 1st house (Ascendant)
    
    // For demonstration, we'll create unequal divisions
    // In reality, this requires complex calculations
    const baseIncrement = 30;
    const latitudeAdjustment = Math.sin(degreesToRadians(latitude)) * 5;
    
    for (let i = 1; i < 12; i++) {
      let increment = baseIncrement;
      
      // Adjust for latitude (simplified)
      if (i >= 1 && i <= 3) increment += latitudeAdjustment;
      if (i >= 7 && i <= 9) increment -= latitudeAdjustment;
      
      houses.push(normalizeAngle(houses[i - 1] + increment));
    }
  }
  
  return houses;
}

// Calculate Midheaven (MC)
export function calculateMidheaven(julianDay: number, longitude: number): number {
  const siderealTime = normalizeAngle(280.460618 + 360.98564736629 * (julianDay - 2451545.0));
  return normalizeAngle(siderealTime + longitude);
}

// Calculate aspects between two points
export function calculateAspect(degree1: number, degree2: number): { angle: number; exactness: number } {
  let angle = Math.abs(degree1 - degree2);
  if (angle > 180) angle = 360 - angle;
  
  // Calculate exactness as percentage of how close to exact angle
  const aspectAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
  let exactness = 0;
  
  for (const aspectAngle of aspectAngles) {
    const difference = Math.abs(angle - aspectAngle);
    if (difference <= 10) { // Within 10 degrees orb
      exactness = Math.max(exactness, 100 - (difference / 10) * 100);
    }
  }
  
  return { angle, exactness };
}

// Delta T calculation (difference between TT and UT)
export function getDeltaT(year: number): number {
  // Simplified calculation for modern years
  if (year >= 2000) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t;
  }
  // For other years, use approximate values
  return 69.2; // approximate value for recent years
}

// Convert geographic coordinates to ecliptic coordinates
export function geographicToEcliptic(latitude: number, longitude: number): {
  eclipticLatitude: number;
  eclipticLongitude: number;
} {
  // Simplified conversion
  // In reality, this involves complex coordinate transformations
  return {
    eclipticLatitude: latitude,
    eclipticLongitude: longitude
  };
}

// Calculate local sidereal time
export function getLocalSiderealTime(julianDay: number, longitude: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
               0.000387933 * T * T - T * T * T / 38710000;
  
  const lst = normalizeAngle(gmst + longitude);
  return lst;
}

// Validate calculation inputs
export function validateInputs(date: Date, latitude: number, longitude: number): boolean {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  
  if (longitude < -180 || longitude > 180) {
    return false;
  }
  
  return true;
}

// Get all planet positions for a given time and location
export function getAllPlanetPositions(date: Date, latitude: number, longitude: number): {
  planets: Array<{ id: number; name: string; longitude: number; speed: number }>;
  houses: number[];
  ascendant: number;
  midheaven: number;
} {
  if (!validateInputs(date, latitude, longitude)) {
    throw new Error('Invalid input parameters for astronomical calculations');
  }
  
  const julianDay = getJulianDay(date);
  
  // Calculate planetary positions
  const planets = Object.entries(PLANETS)
    .filter(([, planet]) => planet.id <= 10) // Main planets only
    .map(([name, planet]) => {
      const position = calculatePlanetPosition(planet.id, julianDay);
      return {
        id: planet.id,
        name,
        longitude: position.longitude,
        speed: position.speed
      };
    });
  
  // Calculate house cusps
  const houses = calculateHouseCusps(julianDay, latitude, longitude);
  
  // Calculate chart points
  const ascendant = houses[0]; // First house cusp is Ascendant
  const midheaven = calculateMidheaven(julianDay, longitude);
  
  return {
    planets,
    houses,
    ascendant,
    midheaven
  };
}