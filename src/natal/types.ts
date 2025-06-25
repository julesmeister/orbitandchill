/**
 * Type definitions for the natal chart library
 * Translated from Python natal library classes.py
 */

import { SIGNS, PLANETS, ASPECTS, CHART_POINTS, HOUSE_SYSTEMS } from './constants';

// Base coordinates interface
export interface Coordinates {
  lat: number;
  lon: number;
}

// Birth data interface
export interface BirthData {
  name: string;
  dateTime: Date;
  coordinates: Coordinates;
  timezone?: string;
}

// Base celestial body class
export abstract class CelestialBody {
  public degree: number;
  public speed: number;
  public name: string;
  public symbol: string;
  
  constructor(degree: number, speed: number, name: string, symbol: string) {
    this.degree = degree;
    this.speed = speed;
    this.name = name;
    this.symbol = symbol;
  }

  // Calculate which sign this body is in
  get sign(): keyof typeof SIGNS {
    const signIndex = Math.floor(this.degree / 30);
    const signNames = Object.keys(SIGNS) as Array<keyof typeof SIGNS>;
    return signNames[signIndex];
  }

  // Calculate degree within the sign (0-29.999...)
  get degreeInSign(): number {
    return this.degree % 30;
  }

  // Check if the body is retrograde
  get isRetrograde(): boolean {
    return this.speed < 0;
  }

  // Format degree as traditional astrological notation
  get formattedDegree(): string {
    const signSymbol = SIGNS[this.sign].symbol;
    const degrees = Math.floor(this.degreeInSign);
    const minutes = Math.floor((this.degreeInSign - degrees) * 60);
    const seconds = Math.floor(((this.degreeInSign - degrees) * 60 - minutes) * 60);
    
    return `${degrees}°${signSymbol}${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"`;
  }

  // Calculate normalized degree (0-360)
  get normalizedDegree(): number {
    let normalized = this.degree % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  }
}

// Planet class
export class Planet extends CelestialBody {
  public planetId: number;
  
  constructor(degree: number, speed: number, planetId: number) {
    const planetKeys = Object.keys(PLANETS) as Array<keyof typeof PLANETS>;
    const planetKey = planetKeys.find(key => PLANETS[key].id === planetId);
    const planetData = planetKey ? PLANETS[planetKey] : { name: 'Unknown', symbol: '?' };
    
    super(degree, speed, planetData.name, planetData.symbol);
    this.planetId = planetId;
  }

  // Get ruling sign(s) for this planet
  get rulerOf(): Array<keyof typeof SIGNS> {
    return Object.keys(SIGNS).filter(signKey => 
      SIGNS[signKey as keyof typeof SIGNS].ruler === this.name
    ) as Array<keyof typeof SIGNS>;
  }

  // Check if planet is in its ruling sign
  get isInRuling(): boolean {
    return this.rulerOf.includes(this.sign);
  }

  // Check if planet is in exaltation
  get isInExaltation(): boolean {
    return SIGNS[this.sign].exaltation === this.name;
  }

  // Check if planet is in detriment
  get isInDetriment(): boolean {
    return SIGNS[this.sign].detriment === this.name;
  }

  // Check if planet is in fall
  get isInFall(): boolean {
    return SIGNS[this.sign].fall === this.name;
  }
}

// Chart point class (Ascendant, MC, etc.)
export class ChartPoint extends CelestialBody {
  public pointType: keyof typeof CHART_POINTS;
  
  constructor(degree: number, pointType: keyof typeof CHART_POINTS) {
    const pointData = CHART_POINTS[pointType];
    super(degree, 0, pointData.name, pointData.symbol);
    this.pointType = pointType;
  }
}

// House class
export class House {
  public houseNumber: number;
  public cusp: number;
  public planets: Planet[];
  
  constructor(houseNumber: number, cusp: number) {
    this.houseNumber = houseNumber;
    this.cusp = cusp;
    this.planets = [];
  }

  // Get the sign on the house cusp
  get sign(): keyof typeof SIGNS {
    const signIndex = Math.floor(this.cusp / 30);
    const signNames = Object.keys(SIGNS) as Array<keyof typeof SIGNS>;
    return signNames[signIndex];
  }

  // Get the ruling planet of this house
  get ruler(): string {
    return SIGNS[this.sign].ruler;
  }

  // Add a planet to this house
  addPlanet(planet: Planet): void {
    this.planets.push(planet);
  }

  // Check if this house is angular (1st, 4th, 7th, 10th)
  get isAngular(): boolean {
    return [1, 4, 7, 10].includes(this.houseNumber);
  }

  // Check if this house is succedent (2nd, 5th, 8th, 11th)
  get isSuccedent(): boolean {
    return [2, 5, 8, 11].includes(this.houseNumber);
  }

  // Check if this house is cadent (3rd, 6th, 9th, 12th)
  get isCadent(): boolean {
    return [3, 6, 9, 12].includes(this.houseNumber);
  }
}

// Aspect class
export class Aspect {
  public planet1: Planet;
  public planet2: Planet;
  public aspectType: keyof typeof ASPECTS;
  public orb: number;
  public exactness: number; // How close to exact (0-100%)
  
  constructor(planet1: Planet, planet2: Planet, aspectType: keyof typeof ASPECTS, orb: number) {
    this.planet1 = planet1;
    this.planet2 = planet2;
    this.aspectType = aspectType;
    this.orb = orb;
    
    const aspectAngle = ASPECTS[aspectType].angle;
    const actualAngle = this.calculateAngle();
    this.exactness = Math.max(0, 100 - (Math.abs(actualAngle - aspectAngle) / orb) * 100);
  }

  // Calculate the angle between two planets
  private calculateAngle(): number {
    let angle = Math.abs(this.planet1.degree - this.planet2.degree);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  // Get aspect symbol
  get symbol(): string {
    return ASPECTS[this.aspectType].symbol;
  }

  // Check if this is a major aspect
  get isMajor(): boolean {
    return ASPECTS[this.aspectType].type === 'major';
  }

  // Check if this is a minor aspect
  get isMinor(): boolean {
    return ASPECTS[this.aspectType].type === 'minor';
  }

  // Check if aspect is applying or separating (simplified)
  get isApplying(): boolean {
    // Simplified calculation - in reality this needs more complex logic
    return Math.abs(this.planet1.speed) > Math.abs(this.planet2.speed);
  }
}

// Main natal chart data structure
export class NatalChart {
  public birthData: BirthData;
  public planets: Planet[];
  public houses: House[];
  public chartPoints: ChartPoint[];
  public aspects: Aspect[];
  
  constructor(birthData: BirthData) {
    this.birthData = birthData;
    this.planets = [];
    this.houses = [];
    this.chartPoints = [];
    this.aspects = [];
  }

  // Add a planet to the chart
  addPlanet(planet: Planet): void {
    this.planets.push(planet);
    this.assignPlanetToHouse(planet);
  }

  // Add a house to the chart
  addHouse(house: House): void {
    this.houses.push(house);
  }

  // Add a chart point
  addChartPoint(point: ChartPoint): void {
    this.chartPoints.push(point);
  }

  // Add an aspect
  addAspect(aspect: Aspect): void {
    this.aspects.push(aspect);
  }

  // Assign planet to appropriate house
  private assignPlanetToHouse(planet: Planet): void {
    for (const house of this.houses) {
      const nextHouseIndex = this.houses.indexOf(house) + 1;
      const nextHouseCusp = nextHouseIndex < this.houses.length 
        ? this.houses[nextHouseIndex].cusp 
        : this.houses[0].cusp + 360;
      
      if (planet.degree >= house.cusp && planet.degree < nextHouseCusp) {
        house.addPlanet(planet);
        break;
      }
    }
  }

  // Get planet by name
  getPlanet(name: string): Planet | undefined {
    return this.planets.find(planet => planet.name === name);
  }

  // Get house by number
  getHouse(number: number): House | undefined {
    return this.houses.find(house => house.houseNumber === number);
  }

  // Get chart point by type
  getChartPoint(type: keyof typeof CHART_POINTS): ChartPoint | undefined {
    return this.chartPoints.find(point => point.pointType === type);
  }

  // Get aspects for a specific planet
  getAspectsForPlanet(planetName: string): Aspect[] {
    return this.aspects.filter(aspect => 
      aspect.planet1.name === planetName || aspect.planet2.name === planetName
    );
  }

  // Get all major aspects
  get majorAspects(): Aspect[] {
    return this.aspects.filter(aspect => aspect.isMajor);
  }

  // Get all minor aspects
  get minorAspects(): Aspect[] {
    return this.aspects.filter(aspect => aspect.isMinor);
  }
}

// Configuration interface for chart generation
export interface ChartConfig {
  width: number;
  height: number;
  theme: 'light' | 'dark' | 'mono';
  showMinorAspects: boolean;
  showHouseNumbers: boolean;
  showDegrees: boolean;
  houseSystem: keyof typeof HOUSE_SYSTEMS;
  orbs: Record<keyof typeof ASPECTS, number>;
}

// Default chart configuration
export const DEFAULT_CHART_CONFIG: ChartConfig = {
  width: 600,
  height: 600,
  theme: 'light',
  showMinorAspects: false,
  showHouseNumbers: true,
  showDegrees: true,
  houseSystem: 'Placidus',
  orbs: {
    Conjunction: 10,
    Sextile: 6,
    Square: 10,
    Trine: 10,
    Opposition: 10,
    Semisextile: 3,
    Semisquare: 3,
    Sesquiquadrate: 3,
    Quincunx: 3
  }
};