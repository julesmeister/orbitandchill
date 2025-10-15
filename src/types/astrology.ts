/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Type definitions for astrological chart calculations
 */

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
  pointType?: 'planet' | 'asteroid' | 'centaur' | 'node' | 'arabicPart' | 'apogee' | 'angle'; // Type of celestial point
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
  timeZone?: string;  // IANA timezone used for calculation (e.g., "Asia/Manila")
  utcOffset?: number; // UTC offset in hours at time of birth
}
