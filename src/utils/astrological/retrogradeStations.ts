/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Retrograde Station Detection
 * 
 * Accurate detection of planetary retrograde stations using astronomy-engine
 * Finds exact dates when planets go stationary-retrograde and stationary-direct
 */

import * as Astronomy from 'astronomy-engine';
import { Body } from 'astronomy-engine';

export interface RetrogradeStation {
  planet: string;
  stationDate: Date;
  stationType: 'retrograde' | 'direct';
  longitude: number;
  sign: string;
}

export interface RetrogradePeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  startLongitude: number;
  endLongitude: number;
  sign: string;
}

// Constants for station detection
const STATION_THRESHOLD = 0.02; // degrees/day - motion below this indicates station
const SEARCH_PRECISION_HOURS = 6; // hours for precise station timing

/**
 * Get zodiac sign from longitude
 */
function getZodiacSign(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[Math.floor(longitude / 30)];
}

/**
 * Calculate planetary longitude for a given date
 */
function getPlanetaryLongitude(planet: string, date: Date): number {
  try {
    if (planet.toLowerCase() === 'mercury') {
      const geoVector = Astronomy.GeoVector(Body.Mercury, date, false);
      const ecliptic = Astronomy.Ecliptic(geoVector);
      return ecliptic.elon;
    }
    // Add other planets as needed
    return 0;
  } catch (error) {
    console.warn(`Error calculating longitude for ${planet}:`, error);
    return 0;
  }
}

/**
 * Calculate daily motion of a planet (degrees per day)
 */
function getDailyMotion(planet: string, date: Date): number {
  const currentLon = getPlanetaryLongitude(planet, date);
  const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const nextLon = getPlanetaryLongitude(planet, nextDate);
  
  let motion = nextLon - currentLon;
  // Handle 360-degree wraparound
  if (motion > 180) motion -= 360;
  if (motion < -180) motion += 360;
  
  return motion;
}

/**
 * Find retrograde stations for Mercury using precise algorithmic detection
 * Finds exact station moments by detecting when daily motion crosses zero
 */
export function findMercuryRetrogradeStations(searchDate: Date, searchDays: number = 120): RetrogradeStation[] {
  const stations: RetrogradeStation[] = [];
  const startDate = new Date(searchDate.getTime() - (searchDays / 2) * 24 * 60 * 60 * 1000);
  
  let previousMotion = getDailyMotion('Mercury', startDate);
  
  // Scan daily for significant motion changes
  for (let i = 1; i < searchDays; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const currentMotion = getDailyMotion('Mercury', currentDate);
    
    // Detect when motion crosses zero (station points)
    if ((previousMotion > STATION_THRESHOLD && currentMotion < -STATION_THRESHOLD) ||
        (previousMotion < -STATION_THRESHOLD && currentMotion > STATION_THRESHOLD)) {
      
      // Found a potential station - refine timing with higher precision
      const preciseStationDate = refineStationTiming(currentDate, previousMotion > 0);
      const stationType = previousMotion > 0 ? 'retrograde' : 'direct';
      
      stations.push({
        planet: 'Mercury',
        stationDate: preciseStationDate,
        stationType,
        longitude: getPlanetaryLongitude('Mercury', preciseStationDate),
        sign: getZodiacSign(getPlanetaryLongitude('Mercury', preciseStationDate))
      });
    }
    
    previousMotion = currentMotion;
  }
  
  return stations;
}

/**
 * Refine station timing to hour-level precision
 * Uses binary search to find exact moment when motion crosses zero
 */
function refineStationTiming(approximateDate: Date, goingRetrograde: boolean): Date {
  let startTime = new Date(approximateDate.getTime() - 12 * 60 * 60 * 1000); // 12 hours before
  let endTime = new Date(approximateDate.getTime() + 12 * 60 * 60 * 1000);   // 12 hours after
  
  // Binary search for precise station moment
  for (let i = 0; i < 10; i++) {
    const midTime = new Date((startTime.getTime() + endTime.getTime()) / 2);
    const motion = getDailyMotion('Mercury', midTime);
    
    if (Math.abs(motion) < 0.01) {
      return midTime; // Found precise station
    }
    
    if (goingRetrograde) {
      if (motion > 0) {
        startTime = midTime; // Station is later
      } else {
        endTime = midTime; // Station is earlier
      }
    } else {
      if (motion < 0) {
        startTime = midTime; // Station is later
      } else {
        endTime = midTime; // Station is earlier
      }
    }
  }
  
  return new Date((startTime.getTime() + endTime.getTime()) / 2);
}

/**
 * Get current Mercury retrograde period if active (pure algorithmic)
 */
export function getCurrentMercuryRetrogradePeriod(date: Date = new Date()): RetrogradePeriod | null {
  // Use algorithmic station detection for all years
  const stations = findMercuryRetrogradeStations(date);
  
  // Sort stations by date
  stations.sort((a, b) => a.stationDate.getTime() - b.stationDate.getTime());
  
  // Find the retrograde period that contains the given date
  for (let i = 0; i < stations.length - 1; i++) {
    const currentStation = stations[i];
    const nextStation = stations[i + 1];
    
    if (currentStation.stationType === 'retrograde' && 
        nextStation.stationType === 'direct' &&
        date >= currentStation.stationDate && 
        date <= nextStation.stationDate) {
      
      return {
        planet: 'Mercury',
        startDate: currentStation.stationDate,
        endDate: nextStation.stationDate,
        startLongitude: currentStation.longitude,
        endLongitude: nextStation.longitude,
        sign: currentStation.sign
      };
    }
  }
  
  return null;
}

/**
 * Check if Mercury is currently in retrograde
 */
export function isMercuryRetrograde(date: Date = new Date()): boolean {
  return getCurrentMercuryRetrogradePeriod(date) !== null;
}