/**
 * Statistical analysis and reporting for natal charts
 * Translated from Python natal library stats.py
 */

import { Data } from './data';
import { Aspect } from './types';
import { ELEMENTS, MODALITIES, POLARITIES, SIGNS } from './constants';

export interface ElementDistribution {
  Fire: number;
  Earth: number;
  Air: number;
  Water: number;
}

export interface ModalityDistribution {
  Cardinal: number;
  Fixed: number;
  Mutable: number;
}

export interface PolarityDistribution {
  Positive: number;
  Negative: number;
}

export interface HouseDistribution {
  angular: number;    // Houses 1, 4, 7, 10
  succedent: number;  // Houses 2, 5, 8, 11
  cadent: number;     // Houses 3, 6, 9, 12
}

export interface QuadrantDistribution {
  first: number;      // Houses 1, 2, 3
  second: number;     // Houses 4, 5, 6
  third: number;      // Houses 7, 8, 9
  fourth: number;     // Houses 10, 11, 12
}

export interface HemisphereDistribution {
  eastern: number;    // Houses 10, 11, 12, 1, 2, 3
  western: number;    // Houses 4, 5, 6, 7, 8, 9
  northern: number;   // Houses 7, 8, 9, 10, 11, 12
  southern: number;   // Houses 1, 2, 3, 4, 5, 6
}

export interface AspectGrid {
  [planet1: string]: {
    [planet2: string]: Aspect | null;
  };
}

export interface ChartStatistics {
  elementDistribution: ElementDistribution;
  modalityDistribution: ModalityDistribution;
  polarityDistribution: PolarityDistribution;
  houseDistribution: HouseDistribution;
  quadrantDistribution: QuadrantDistribution;
  hemisphereDistribution: HemisphereDistribution;
  aspectGrid: AspectGrid;
  stelliums: Array<{ sign: string; planets: string[] }>;
  dominantElement: string;
  dominantModality: string;
  dominantPolarity: string;
  planetCounts: {
    bySign: Record<string, number>;
    byHouse: Record<number, number>;
    byElement: ElementDistribution;
    byModality: ModalityDistribution;
  };
  aspectCounts: {
    major: number;
    minor: number;
    byType: Record<string, number>;
  };
  specialPatterns: {
    grandTrines: number;
    tSquares: number;
    grandCrosses: number;
    yods: number;
  };
}

export class ChartStats {
  private data: Data;
  
  constructor(data: Data) {
    this.data = data;
  }

  // Generate comprehensive statistics
  getStatistics(): ChartStatistics {
    return {
      elementDistribution: this.getElementDistribution(),
      modalityDistribution: this.getModalityDistribution(),
      polarityDistribution: this.getPolarityDistribution(),
      houseDistribution: this.getHouseDistribution(),
      quadrantDistribution: this.getQuadrantDistribution(),
      hemisphereDistribution: this.getHemisphereDistribution(),
      aspectGrid: this.getAspectGrid(),
      stelliums: this.getStelliums(),
      dominantElement: this.getDominantElement(),
      dominantModality: this.getDominantModality(),
      dominantPolarity: this.getDominantPolarity(),
      planetCounts: this.getPlanetCounts(),
      aspectCounts: this.getAspectCounts(),
      specialPatterns: this.getSpecialPatterns()
    };
  }

  // Calculate element distribution
  private getElementDistribution(): ElementDistribution {
    const distribution: ElementDistribution = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    
    for (const planet of this.data.chart.planets) {
      const sign = planet.sign;
      for (const [element, signs] of Object.entries(ELEMENTS) as Array<[string, readonly string[]]>) {
        if ((signs as readonly string[]).includes(sign as string)) {
          distribution[element as keyof ElementDistribution]++;
          break;
        }
      }
    }
    
    return distribution;
  }

  // Calculate modality distribution
  private getModalityDistribution(): ModalityDistribution {
    const distribution: ModalityDistribution = { Cardinal: 0, Fixed: 0, Mutable: 0 };
    
    for (const planet of this.data.chart.planets) {
      const sign = planet.sign;
      for (const [modality, signs] of Object.entries(MODALITIES) as Array<[string, readonly string[]]>) {
        if ((signs as readonly string[]).includes(sign as string)) {
          distribution[modality as keyof ModalityDistribution]++;
          break;
        }
      }
    }
    
    return distribution;
  }

  // Calculate polarity distribution
  private getPolarityDistribution(): PolarityDistribution {
    const distribution: PolarityDistribution = { Positive: 0, Negative: 0 };
    
    for (const planet of this.data.chart.planets) {
      const sign = planet.sign;
      for (const [polarity, signs] of Object.entries(POLARITIES) as Array<[string, readonly string[]]>) {
        if ((signs as readonly string[]).includes(sign as string)) {
          distribution[polarity as keyof PolarityDistribution]++;
          break;
        }
      }
    }
    
    return distribution;
  }

  // Calculate house distribution
  private getHouseDistribution(): HouseDistribution {
    const distribution: HouseDistribution = { angular: 0, succedent: 0, cadent: 0 };
    
    for (const house of this.data.chart.houses) {
      const planetCount = house.planets.length;
      
      if (house.isAngular) {
        distribution.angular += planetCount;
      } else if (house.isSuccedent) {
        distribution.succedent += planetCount;
      } else if (house.isCadent) {
        distribution.cadent += planetCount;
      }
    }
    
    return distribution;
  }

  // Calculate quadrant distribution
  private getQuadrantDistribution(): QuadrantDistribution {
    const distribution: QuadrantDistribution = { first: 0, second: 0, third: 0, fourth: 0 };
    
    for (const house of this.data.chart.houses) {
      const planetCount = house.planets.length;
      const houseNum = house.houseNumber;
      
      if (houseNum >= 1 && houseNum <= 3) {
        distribution.first += planetCount;
      } else if (houseNum >= 4 && houseNum <= 6) {
        distribution.second += planetCount;
      } else if (houseNum >= 7 && houseNum <= 9) {
        distribution.third += planetCount;
      } else if (houseNum >= 10 && houseNum <= 12) {
        distribution.fourth += planetCount;
      }
    }
    
    return distribution;
  }

  // Calculate hemisphere distribution
  private getHemisphereDistribution(): HemisphereDistribution {
    const distribution: HemisphereDistribution = { eastern: 0, western: 0, northern: 0, southern: 0 };
    
    for (const house of this.data.chart.houses) {
      const planetCount = house.planets.length;
      const houseNum = house.houseNumber;
      
      // Eastern hemisphere: Houses 10, 11, 12, 1, 2, 3
      if ([10, 11, 12, 1, 2, 3].includes(houseNum)) {
        distribution.eastern += planetCount;
      }
      
      // Western hemisphere: Houses 4, 5, 6, 7, 8, 9
      if ([4, 5, 6, 7, 8, 9].includes(houseNum)) {
        distribution.western += planetCount;
      }
      
      // Northern hemisphere: Houses 7, 8, 9, 10, 11, 12
      if ([7, 8, 9, 10, 11, 12].includes(houseNum)) {
        distribution.northern += planetCount;
      }
      
      // Southern hemisphere: Houses 1, 2, 3, 4, 5, 6
      if ([1, 2, 3, 4, 5, 6].includes(houseNum)) {
        distribution.southern += planetCount;
      }
    }
    
    return distribution;
  }

  // Create aspect grid
  private getAspectGrid(): AspectGrid {
    const grid: AspectGrid = {};
    const planets = this.data.chart.planets;
    
    // Initialize grid
    for (const planet1 of planets) {
      grid[planet1.name] = {};
      for (const planet2 of planets) {
        grid[planet1.name][planet2.name] = null;
      }
    }
    
    // Fill in aspects
    for (const aspect of this.data.chart.aspects) {
      grid[aspect.planet1.name][aspect.planet2.name] = aspect;
      grid[aspect.planet2.name][aspect.planet1.name] = aspect;
    }
    
    return grid;
  }

  // Get stelliums (3+ planets in same sign)
  private getStelliums(): Array<{ sign: string; planets: string[] }> {
    const signGroups: Record<string, string[]> = {};
    
    for (const planet of this.data.chart.planets) {
      const sign = planet.sign;
      if (!signGroups[sign]) {
        signGroups[sign] = [];
      }
      signGroups[sign].push(planet.name);
    }
    
    return Object.entries(signGroups)
      .filter(([, planets]) => planets.length >= 3)
      .map(([sign, planets]) => ({ sign, planets }));
  }

  // Get dominant element
  private getDominantElement(): string {
    const distribution = this.getElementDistribution();
    return Object.keys(distribution).reduce((a, b) => 
      distribution[a as keyof ElementDistribution] > distribution[b as keyof ElementDistribution] ? a : b
    );
  }

  // Get dominant modality
  private getDominantModality(): string {
    const distribution = this.getModalityDistribution();
    return Object.keys(distribution).reduce((a, b) => 
      distribution[a as keyof ModalityDistribution] > distribution[b as keyof ModalityDistribution] ? a : b
    );
  }

  // Get dominant polarity
  private getDominantPolarity(): string {
    const distribution = this.getPolarityDistribution();
    return Object.keys(distribution).reduce((a, b) => 
      distribution[a as keyof PolarityDistribution] > distribution[b as keyof PolarityDistribution] ? a : b
    );
  }

  // Get detailed planet counts
  private getPlanetCounts() {
    const bySign: Record<string, number> = {};
    const byHouse: Record<number, number> = {};
    
    // Initialize counts
    Object.keys(SIGNS).forEach(sign => bySign[sign] = 0);
    for (let i = 1; i <= 12; i++) {
      byHouse[i] = 0;
    }
    
    // Count planets by sign and house
    for (const planet of this.data.chart.planets) {
      bySign[planet.sign]++;
      
      // Find which house this planet is in
      for (const house of this.data.chart.houses) {
        if (house.planets.includes(planet)) {
          byHouse[house.houseNumber]++;
          break;
        }
      }
    }
    
    return {
      bySign,
      byHouse,
      byElement: this.getElementDistribution(),
      byModality: this.getModalityDistribution()
    };
  }

  // Get aspect counts
  private getAspectCounts() {
    const byType: Record<string, number> = {};
    let major = 0;
    let minor = 0;
    
    for (const aspect of this.data.chart.aspects) {
      if (!byType[aspect.aspectType]) {
        byType[aspect.aspectType] = 0;
      }
      byType[aspect.aspectType]++;
      
      if (aspect.isMajor) {
        major++;
      } else {
        minor++;
      }
    }
    
    return { major, minor, byType };
  }

  // Identify special patterns
  private getSpecialPatterns() {
    return {
      grandTrines: this.data.getGrandTrines().length,
      tSquares: this.data.getTSquares().length,
      grandCrosses: this.getGrandCrosses(),
      yods: this.getYods()
    };
  }

  // Get Grand Cross count
  private getGrandCrosses(): number {
    // A Grand Cross is formed by four planets that form four squares and two oppositions
    const squares = this.data.chart.aspects.filter(aspect => aspect.aspectType === 'Square');
    const oppositions = this.data.chart.aspects.filter(aspect => aspect.aspectType === 'Opposition');
    
    // Simplified detection - in reality this requires more complex pattern matching
    if (squares.length >= 4 && oppositions.length >= 2) {
      return 1; // Basic detection, should be more sophisticated
    }
    
    return 0;
  }

  // Get Yod count
  private getYods(): number {
    // A Yod is formed by two planets in sextile, both quincunx to a third planet
    const sextiles = this.data.chart.aspects.filter(aspect => aspect.aspectType === 'Sextile');
    const quincunxes = this.data.chart.aspects.filter(aspect => aspect.aspectType === 'Quincunx');
    
    // Simplified detection
    if (sextiles.length >= 1 && quincunxes.length >= 2) {
      return 1; // Basic detection, should be more sophisticated
    }
    
    return 0;
  }

  // Generate text report
  generateReport(): string {
    const stats = this.getStatistics();
    const lines: string[] = [];
    
    lines.push('=== NATAL CHART STATISTICAL ANALYSIS ===\n');
    
    // Basic info
    lines.push(`Chart for: ${this.data.birthData.name}`);
    lines.push(`Birth Date: ${this.data.birthData.dateTime.toLocaleDateString()}`);
    lines.push(`Birth Time: ${this.data.birthData.dateTime.toLocaleTimeString()}`);
    lines.push(`Location: ${this.data.birthData.coordinates.lat}°, ${this.data.birthData.coordinates.lon}°\n`);
    
    // Element distribution
    lines.push('ELEMENT DISTRIBUTION:');
    Object.entries(stats.elementDistribution).forEach(([element, count]) => {
      const percentage = ((count / this.data.chart.planets.length) * 100).toFixed(1);
      lines.push(`  ${element}: ${count} planets (${percentage}%)`);
    });
    lines.push(`  Dominant: ${stats.dominantElement}\n`);
    
    // Modality distribution
    lines.push('MODALITY DISTRIBUTION:');
    Object.entries(stats.modalityDistribution).forEach(([modality, count]) => {
      const percentage = ((count / this.data.chart.planets.length) * 100).toFixed(1);
      lines.push(`  ${modality}: ${count} planets (${percentage}%)`);
    });
    lines.push(`  Dominant: ${stats.dominantModality}\n`);
    
    // House distribution
    lines.push('HOUSE DISTRIBUTION:');
    lines.push(`  Angular: ${stats.houseDistribution.angular} planets`);
    lines.push(`  Succedent: ${stats.houseDistribution.succedent} planets`);
    lines.push(`  Cadent: ${stats.houseDistribution.cadent} planets\n`);
    
    // Aspects
    lines.push('ASPECT SUMMARY:');
    lines.push(`  Major aspects: ${stats.aspectCounts.major}`);
    lines.push(`  Minor aspects: ${stats.aspectCounts.minor}`);
    Object.entries(stats.aspectCounts.byType).forEach(([type, count]) => {
      lines.push(`    ${type}: ${count}`);
    });
    
    // Special patterns
    if (stats.specialPatterns.grandTrines > 0) {
      lines.push(`  Grand Trines: ${stats.specialPatterns.grandTrines}`);
    }
    if (stats.specialPatterns.tSquares > 0) {
      lines.push(`  T-Squares: ${stats.specialPatterns.tSquares}`);
    }
    if (stats.specialPatterns.grandCrosses > 0) {
      lines.push(`  Grand Crosses: ${stats.specialPatterns.grandCrosses}`);
    }
    if (stats.specialPatterns.yods > 0) {
      lines.push(`  Yods: ${stats.specialPatterns.yods}`);
    }
    
    // Stelliums
    if (stats.stelliums.length > 0) {
      lines.push('\nSTELLIUMS:');
      stats.stelliums.forEach(stellium => {
        lines.push(`  ${stellium.sign}: ${stellium.planets.join(', ')}`);
      });
    }
    
    return lines.join('\n');
  }

  // Generate HTML table for aspects
  generateAspectTable(): string {
    const grid = this.getAspectGrid();
    const planets = this.data.chart.planets.map(p => p.name);
    
    let html = '<table border="1" cellpadding="3" cellspacing="0">\n';
    
    // Header row
    html += '<tr><th></th>';
    planets.forEach(planet => {
      html += `<th>${planet}</th>`;
    });
    html += '</tr>\n';
    
    // Data rows
    planets.forEach(planet1 => {
      html += `<tr><th>${planet1}</th>`;
      planets.forEach(planet2 => {
        const aspect = grid[planet1][planet2];
        if (planet1 === planet2) {
          html += '<td>-</td>';
        } else if (aspect) {
          html += `<td>${aspect.symbol}</td>`;
        } else {
          html += '<td></td>';
        }
      });
      html += '</tr>\n';
    });
    
    html += '</table>';
    return html;
  }
}