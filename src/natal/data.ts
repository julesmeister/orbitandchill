/**
 * Core natal chart data calculation engine
 * Translated from Python natal library data.py
 */

import { 
  Planet, 
  House, 
  ChartPoint, 
  Aspect, 
  NatalChart, 
  BirthData
} from './types';
import { ChartConfig, PRESET_CONFIGS } from './config';
import { ASPECTS, CHART_POINTS, getSignFromDegree } from './constants';
import { 
  getAllPlanetPositions, 
  calculateAspect, 
  normalizeAngle,
  validateInputs 
} from './calculations/ephemeris';

export class Data {
  public birthData: BirthData;
  public chart: NatalChart;
  public config: ChartConfig;
  
  constructor(birthData: BirthData, config: ChartConfig = PRESET_CONFIGS.default) {
    if (!validateInputs(birthData.dateTime, birthData.coordinates.lat, birthData.coordinates.lon)) {
      throw new Error('Invalid birth data provided');
    }
    
    this.birthData = birthData;
    this.config = config;
    this.chart = new NatalChart(birthData);
    
    this.calculateChart();
  }

  // Main chart calculation method
  private calculateChart(): void {
    try {
      // Get astronomical data
      const astronomicalData = getAllPlanetPositions(
        this.birthData.dateTime,
        this.birthData.coordinates.lat,
        this.birthData.coordinates.lon
      );

      // Create planets
      this.createPlanets(astronomicalData.planets);
      
      // Create houses
      this.createHouses(astronomicalData.houses);
      
      // Create chart points (Ascendant, MC, etc.)
      this.createChartPoints(astronomicalData.ascendant, astronomicalData.midheaven);
      
      // Calculate aspects
      this.calculateAspects();
      
    } catch (error) {
      throw new Error(`Failed to calculate natal chart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create planet objects from astronomical data
  private createPlanets(planetData: Array<{ id: number; name: string; longitude: number; speed: number }>): void {
    for (const data of planetData) {
      // Check if this planet should be displayed
      const planetName = data.name as keyof typeof this.config.display.showPlanets;
      if (this.config.display.showPlanets[planetName]) {
        const planet = new Planet(data.longitude, data.speed, data.id);
        this.chart.addPlanet(planet);
      }
    }
  }

  // Create house objects
  private createHouses(houseCusps: number[]): void {
    for (let i = 0; i < 12; i++) {
      const house = new House(i + 1, houseCusps[i]);
      this.chart.addHouse(house);
    }
  }

  // Create chart points (Ascendant, MC, etc.)
  private createChartPoints(ascendant: number, midheaven: number): void {
    // Ascendant
    const asc = new ChartPoint(ascendant, 'Ascendant');
    this.chart.addChartPoint(asc);
    
    // Midheaven
    const mc = new ChartPoint(midheaven, 'Midheaven');
    this.chart.addChartPoint(mc);
    
    // Descendant (opposite Ascendant)
    const desc = new ChartPoint(normalizeAngle(ascendant + 180), 'Descendant');
    this.chart.addChartPoint(desc);
    
    // Imum Coeli (opposite Midheaven)
    const ic = new ChartPoint(normalizeAngle(midheaven + 180), 'Imumcoeli');
    this.chart.addChartPoint(ic);
  }

  // Calculate aspects between planets
  private calculateAspects(): void {
    const planets = this.chart.planets;
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        const aspectData = calculateAspect(planet1.degree, planet2.degree);
        
        // Check each aspect type
        for (const [aspectName, aspectInfo] of Object.entries(ASPECTS)) {
          const aspectType = aspectName as keyof typeof ASPECTS;
          
          // Check if this aspect should be calculated
          if (!this.config.display.showAspects[aspectType]) {
            continue;
          }
          
          const targetAngle = aspectInfo.angle;
          const allowedOrb = this.config.orbs[aspectType];
          const angleDiff = Math.abs(aspectData.angle - targetAngle);
          
          // Check if the aspect is within orb
          if (angleDiff <= allowedOrb) {
            const aspect = new Aspect(planet1, planet2, aspectType, angleDiff);
            this.chart.addAspect(aspect);
          }
        }
      }
    }
  }

  // Get planet by name
  getPlanet(name: string): Planet | undefined {
    return this.chart.getPlanet(name);
  }

  // Get house by number
  getHouse(number: number): House | undefined {
    return this.chart.getHouse(number);
  }

  // Get chart point by type
  getChartPoint(type: keyof typeof CHART_POINTS): ChartPoint | undefined {
    return this.chart.getChartPoint(type);
  }

  // Get aspects for a specific planet
  getAspectsForPlanet(planetName: string): Aspect[] {
    return this.chart.getAspectsForPlanet(planetName);
  }

  // Get planets in a specific sign
  getPlanetsInSign(signName: string): Planet[] {
    return this.chart.planets.filter(planet => planet.sign === signName);
  }

  // Get planets in a specific house
  getPlanetsInHouse(houseNumber: number): Planet[] {
    const house = this.getHouse(houseNumber);
    return house ? house.planets : [];
  }

  // Get dominant element
  getDominantElement(): string {
    const elements: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    
    for (const planet of this.chart.planets) {
      const sign = getSignFromDegree(planet.degree);
      const element = this.getSignElement(sign);
      elements[element]++;
    }
    
    return Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);
  }

  // Get dominant modality
  getDominantModality(): string {
    const modalities: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
    
    for (const planet of this.chart.planets) {
      const sign = getSignFromDegree(planet.degree);
      const modality = this.getSignModality(sign);
      modalities[modality]++;
    }
    
    return Object.keys(modalities).reduce((a, b) => modalities[a] > modalities[b] ? a : b);
  }

  // Helper method to get sign element
  private getSignElement(sign: string): string {
    const fireSign = ['Aries', 'Leo', 'Sagittarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    
    if (fireSign.includes(sign)) return 'Fire';
    if (earthSigns.includes(sign)) return 'Earth';
    if (airSigns.includes(sign)) return 'Air';
    if (waterSigns.includes(sign)) return 'Water';
    
    return 'Unknown';
  }

  // Helper method to get sign modality
  private getSignModality(sign: string): string {
    const cardinalSigns = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
    const fixedSigns = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];
    const mutableSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
    
    if (cardinalSigns.includes(sign)) return 'Cardinal';
    if (fixedSigns.includes(sign)) return 'Fixed';
    if (mutableSigns.includes(sign)) return 'Mutable';
    
    return 'Unknown';
  }

  // Get stellium (3+ planets in same sign)
  getStelliums(): Array<{ sign: string; planets: Planet[] }> {
    const signGroups: Record<string, Planet[]> = {};
    
    for (const planet of this.chart.planets) {
      const sign = planet.sign;
      if (!signGroups[sign]) {
        signGroups[sign] = [];
      }
      signGroups[sign].push(planet);
    }
    
    return Object.entries(signGroups)
      .filter(([, planets]) => planets.length >= 3)
      .map(([sign, planets]) => ({ sign, planets }));
  }

  // Get T-Square aspects
  getTSquares(): Array<{ apex: Planet; base: [Planet, Planet] }> {
    const tSquares: Array<{ apex: Planet; base: [Planet, Planet] }> = [];
    const squares = this.chart.aspects.filter(aspect => aspect.aspectType === 'Square');
    const oppositions = this.chart.aspects.filter(aspect => aspect.aspectType === 'Opposition');
    
    for (const opposition of oppositions) {
      for (const square1 of squares) {
        for (const square2 of squares) {
          // Check if we have a T-Square pattern
          if (
            (square1.planet1 === opposition.planet1 && square2.planet1 === opposition.planet2 && square1.planet2 === square2.planet2) ||
            (square1.planet1 === opposition.planet2 && square2.planet1 === opposition.planet1 && square1.planet2 === square2.planet2)
          ) {
            tSquares.push({
              apex: square1.planet2,
              base: [opposition.planet1, opposition.planet2]
            });
          }
        }
      }
    }
    
    return tSquares;
  }

  // Get Grand Trine aspects
  getGrandTrines(): Array<Planet[]> {
    const grandTrines: Array<Planet[]> = [];
    const trines = this.chart.aspects.filter(aspect => aspect.aspectType === 'Trine');
    
    // Look for sets of three planets that all trine each other
    for (let i = 0; i < trines.length; i++) {
      for (let j = i + 1; j < trines.length; j++) {
        for (let k = j + 1; k < trines.length; k++) {
          const trine1 = trines[i];
          const trine2 = trines[j];
          const trine3 = trines[k];
          
          // Check if we have a grand trine pattern
          const planets = [trine1.planet1, trine1.planet2, trine2.planet1, trine2.planet2, trine3.planet1, trine3.planet2];
          const uniquePlanets = Array.from(new Set(planets));
          
          if (uniquePlanets.length === 3) {
            grandTrines.push(uniquePlanets);
          }
        }
      }
    }
    
    return grandTrines;
  }

  // Export chart data as JSON
  toJSON(): object {
    return {
      birthData: this.birthData,
      planets: this.chart.planets.map(planet => ({
        name: planet.name,
        degree: planet.degree,
        sign: planet.sign,
        degreeInSign: planet.degreeInSign,
        house: this.getPlanetHouse(planet),
        isRetrograde: planet.isRetrograde,
        speed: planet.speed
      })),
      houses: this.chart.houses.map(house => ({
        number: house.houseNumber,
        cusp: house.cusp,
        sign: house.sign,
        ruler: house.ruler,
        planets: house.planets.map(p => p.name)
      })),
      chartPoints: this.chart.chartPoints.map(point => ({
        type: point.pointType,
        degree: point.degree,
        sign: point.sign
      })),
      aspects: this.chart.aspects.map(aspect => ({
        planet1: aspect.planet1.name,
        planet2: aspect.planet2.name,
        type: aspect.aspectType,
        orb: aspect.orb,
        exactness: aspect.exactness,
        isMajor: aspect.isMajor
      })),
      summary: {
        dominantElement: this.getDominantElement(),
        dominantModality: this.getDominantModality(),
        stelliums: this.getStelliums(),
        tSquares: this.getTSquares().length,
        grandTrines: this.getGrandTrines().length
      }
    };
  }

  // Helper method to get which house a planet is in
  private getPlanetHouse(planet: Planet): number {
    for (const house of this.chart.houses) {
      if (house.planets.includes(planet)) {
        return house.houseNumber;
      }
    }
    return 0; // Should not happen if chart is calculated correctly
  }
}