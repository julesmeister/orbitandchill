/**
 * SVG chart rendering engine
 * Translated from Python natal library chart.py
 * 
 * Creates detailed natal charts with proper sectors, wheels, and symbol integration
 */

import { Data } from '../data';
import { ChartConfig, THEMES } from '../config';
import { SIGNS, normalizeAngle, SIGN_NAMES } from '../constants';
import { createSymbolGroup } from './svg-loader';

export class ChartRenderer {
  private data: Data;
  private config: ChartConfig;
  private centerX: number;
  private centerY: number;
  private maxRadius: number;
  private ringThickness: number;
  private fontSize: number;
  private margin: number;
  private scaleAdjustment: number;
  private posAdjustment: number;
  
  constructor(data: Data, config: ChartConfig) {
    this.data = data;
    this.config = config;
    this.centerX = config.width / 2;
    this.centerY = config.height / 2;
    
    // Calculate dimensions like the Python implementation
    this.margin = Math.min(config.width, config.height) * 0.05; // 5% margin
    this.maxRadius = Math.min(config.width - this.margin, config.height - this.margin) / 2;
    this.ringThickness = this.maxRadius * 0.15; // 15% of radius for each ring
    this.fontSize = this.ringThickness * 0.6;
    this.scaleAdjustment = config.width / 800; // Scale factor for symbols
    this.posAdjustment = this.fontSize / 4;
  }

  // Main method to generate SVG chart
  generateSVG(): string {
    const svgElements: string[] = [];
    
    // Start SVG with header and styles
    svgElements.push(this.createSVGHeader());
    
    // Build chart from outside to inside (like Python implementation)
    // 1. Sign wheel (outermost ring with zodiac sectors)
    svgElements.push(...this.createSignWheel());
    
    // 2. Sign symbols overlay
    svgElements.push(...this.createSignSymbols());
    
    // 3. House wheel (middle ring with house sectors)
    svgElements.push(...this.createHouseWheel());
    
    // 4. Vertex lines (house cusps and major axes)
    svgElements.push(...this.createVertexLines());
    
    // 5. Aspect lines (behind planets)
    svgElements.push(...this.createAspectLines());
    
    // 6. Planet positions with symbols
    svgElements.push(...this.createPlanetPlacements());
    
    // 7. Chart points (Asc, MC, etc.)
    svgElements.push(...this.createChartPoints());
    
    // End SVG
    svgElements.push('</svg>');
    
    return svgElements.join('\n');
  }

  // Create SVG header with dimensions and styles
  private createSVGHeader(): string {
    const colors = THEMES[this.config.theme];
    
    return `<svg width="${this.config.width}" height="${this.config.height}" 
      viewBox="0 0 ${this.config.width} ${this.config.height}" 
      xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
      <defs>
        <style>
          .chart-bg { fill: ${colors.background}; }
          .chart-text { fill: ${colors.text}; font-family: Arial, sans-serif; }
          .chart-line { stroke: ${colors.foreground}; fill: none; }
          .sign-sector { stroke: ${colors.foreground}; stroke-width: 2; }
          .house-sector { stroke: ${colors.foreground}; stroke-width: 1; }
          .vertex-line { stroke: ${colors.foreground}; stroke-width: 1; }
          .vertex-major { stroke: ${colors.foreground}; stroke-width: 2; }
          .aspect-line { stroke-width: 1; fill: none; opacity: 0.6; }
          .planet-symbol { font-size: ${this.fontSize}px; text-anchor: middle; dominant-baseline: central; }
          .house-number { font-size: ${this.fontSize * 0.8}px; text-anchor: middle; dominant-baseline: central; }
        </style>
      </defs>`;
  }

  // Create sector path (like Python implementation)
  private createSector(
    radius: number,
    startDeg: number,
    endDeg: number,
    fill: string = 'white',
    strokeColor: string = 'black',
    strokeWidth: number = 1
  ): string {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    
    const startX = this.centerX - radius * Math.cos(startRad);
    const startY = this.centerY + radius * Math.sin(startRad);
    const endX = this.centerX - radius * Math.cos(endRad);
    const endY = this.centerY + radius * Math.sin(endRad);
    
    const pathData = [
      `M ${this.centerX} ${this.centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 0 0 ${endX} ${endY}`,
      'Z'
    ].join(' ');
    
    return `<path d="${pathData}" fill="${fill}" stroke="${strokeColor}" 
      stroke-width="${strokeWidth}" class="sign-sector"/>`;
  }

  // Create background circle
  private createBackground(radius: number, fill: string, strokeColor?: string, strokeWidth: number = 1): string {
    const stroke = strokeColor ? `stroke="${strokeColor}" stroke-width="${strokeWidth}"` : '';
    return `<circle cx="${this.centerX}" cy="${this.centerY}" r="${radius}" 
      fill="${fill}" ${stroke} class="chart-bg"/>`;
  }

  // Create sign wheel with colored sectors (outermost ring)
  private createSignWheel(): string[] {
    const elements: string[] = [];
    const radius = this.maxRadius;
    const colors = THEMES[this.config.theme];
    
    // Background circle
    elements.push(this.createBackground(radius, colors.background));
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    // Create 12 sign sectors
    for (let i = 0; i < 12; i++) {
      const startDeg = (i * 30) - ascendantDegree;
      const endDeg = ((i + 1) * 30) - ascendantDegree;
      
      // Get sign element for color
      const signName = SIGN_NAMES[i];
      const sign = SIGNS[signName as keyof typeof SIGNS];
      const elementColor = colors.signColors[sign.element as keyof typeof colors.signColors];
      
      // Create sector with subtle background color
      const sectorFill = this.adjustColorOpacity(elementColor, 0.1);
      
      elements.push(this.createSector(
        radius,
        startDeg,
        endDeg,
        sectorFill,
        colors.foreground,
        2
      ));
    }
    
    return elements;
  }

  // Create sign symbols overlay
  private createSignSymbols(): string[] {
    const elements: string[] = [];
    const symbolRadius = this.maxRadius - (this.ringThickness / 2);
    const colors = THEMES[this.config.theme];
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    if (this.config.display.showSignSymbols) {
      for (let i = 0; i < 12; i++) {
        const signAngle = (i * 30 + 15) - ascendantDegree; // Center of sector
        const { x, y } = this.polarToCartesian(symbolRadius, signAngle);
        
        const signName = SIGN_NAMES[i];
        const sign = SIGNS[signName as keyof typeof SIGNS];
        const elementColor = colors.signColors[sign.element as keyof typeof colors.signColors];
        
        // Create symbol group with background circle
        elements.push(`<g>
          <circle cx="${x}" cy="${y}" r="12" fill="${colors.background}" 
            stroke="${elementColor}" stroke-width="1.5" opacity="0.9"/>
          ${createSymbolGroup(signName.toLowerCase(), x, y, this.scaleAdjustment, elementColor, 1.5)}
        </g>`);
      }
    }
    
    return elements;
  }

  // Create house wheel with sectors (middle ring)
  private createHouseWheel(): string[] {
    const elements: string[] = [];
    const radius = this.maxRadius - this.ringThickness;
    const colors = THEMES[this.config.theme];
    
    // Background circle
    elements.push(this.createBackground(radius, colors.background));
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    // Get house cusps from chart data
    const houses = this.data.chart.houses;
    
    for (let i = 0; i < houses.length; i++) {
      const house = houses[i];
      const nextHouse = houses[(i + 1) % houses.length];
      
      const startDeg = house.cusp - ascendantDegree;
      let endDeg = nextHouse.cusp - ascendantDegree;
      
      // Handle wrap-around for the 12th house
      if (endDeg <= startDeg) {
        endDeg += 360;
      }
      
      // Get house type color
      let houseColor: string = colors.houseColors.cadent;
      if (house.isAngular) houseColor = colors.houseColors.angular;
      else if (house.isSuccedent) houseColor = colors.houseColors.succedent;
      
      // Create sector with subtle background
      const sectorFill = this.adjustColorOpacity(houseColor, 0.05);
      
      elements.push(this.createSector(
        radius,
        startDeg,
        endDeg,
        sectorFill,
        colors.foreground,
        1
      ));
      
      // Add house number
      if (this.config.display.showHouseNumbers) {
        const midAngle = startDeg + ((endDeg - startDeg) / 2);
        const numberRadius = radius - (this.ringThickness / 2);
        const { x, y } = this.polarToCartesian(numberRadius, midAngle);
        
        elements.push(`<text x="${x}" y="${y}" fill="${houseColor}" 
          class="house-number" font-weight="bold">${house.houseNumber}</text>`);
      }
    }
    
    return elements;
  }

  // Create vertex lines (house cusps and major axes)
  private createVertexLines(): string[] {
    const elements: string[] = [];
    const colors = THEMES[this.config.theme];
    const houseRadius = this.maxRadius - 2 * this.ringThickness;
    const bodyRadius = this.maxRadius - 3 * this.ringThickness;
    const vertexRadius = this.maxRadius + this.margin / 2;
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    // Inner background circles
    elements.push(this.createBackground(houseRadius, colors.background, colors.foreground, 1));
    elements.push(this.createBackground(bodyRadius, 'transparent', '#88888880', 1));
    
    // Draw house cusp lines
    for (const house of this.data.chart.houses) {
      const angle = house.cusp - ascendantDegree;
      let radius = houseRadius;
      let strokeWidth = 1;
      let strokeColor = '#88888880'; // dim color
      
      // Emphasize angular houses (1st, 4th, 7th, 10th)
      if ([1, 4, 7, 10].includes(house.houseNumber)) {
        radius = vertexRadius;
        strokeColor = colors.foreground;
        strokeWidth = 2;
      }
      
      const { x, y } = this.polarToCartesian(radius, angle);
      
      elements.push(`<line x1="${this.centerX}" y1="${this.centerY}" 
        x2="${x}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
        class="vertex-line"/>`);
    }
    
    return elements;
  }

  // Create aspect lines between planets
  private createAspectLines(): string[] {
    if (!this.data.chart.aspects.length) return [];
    
    const elements: string[] = [];
    const aspectRadius = this.maxRadius - 2.5 * this.ringThickness;
    const colors = THEMES[this.config.theme];
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    for (const aspect of this.data.chart.aspects) {
      const angle1 = aspect.planet1.degree - ascendantDegree;
      const angle2 = aspect.planet2.degree - ascendantDegree;
      
      const { x: x1, y: y1 } = this.polarToCartesian(aspectRadius, angle1);
      const { x: x2, y: y2 } = this.polarToCartesian(aspectRadius, angle2);
      
      const color = colors.aspectColors[aspect.aspectType];
      const opacity = Math.max(0.3, aspect.exactness / 100);
      
      elements.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
        stroke="${color}" stroke-width="1" opacity="${opacity}" class="aspect-line"/>`);
    }
    
    return elements;
  }

  // Create planet placements with symbols and collision avoidance
  private createPlanetPlacements(): string[] {
    const elements: string[] = [];
    const bodyRadius = this.maxRadius - 3 * this.ringThickness;
    const colors = THEMES[this.config.theme];
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    // Calculate planet positions with collision avoidance
    const planetPositions = this.calculatePlanetPositions();
    
    for (const planet of this.data.chart.planets) {
      const adjustedAngle = planet.degree - ascendantDegree;
      const position = planetPositions.get(planet.name) || { angle: adjustedAngle, radius: bodyRadius };
      
      const { x, y } = this.polarToCartesian(position.radius, adjustedAngle);
      const planetColor = colors.planetColors[planet.name as keyof typeof colors.planetColors] || colors.foreground;
      
      // Create planet symbol with background circle
      elements.push(`<g>
        <circle cx="${x}" cy="${y}" r="10" fill="${colors.background}" 
          stroke="${planetColor}" stroke-width="1" opacity="0.9"/>
        ${createSymbolGroup(planet.name.toLowerCase(), x, y, this.scaleAdjustment * 0.8, planetColor, 1.5)}
        ${planet.isRetrograde && this.config.display.showRetrogrades ? 
          createSymbolGroup('retrograde', x + 8, y - 8, this.scaleAdjustment * 0.5, planetColor, 1) : ''}
      </g>`);
      
      // Planet degree (optional)
      if (this.config.display.showDegreeMarkers) {
        elements.push(`<text x="${x}" y="${y + 18}" fill="${planetColor}" 
          class="chart-text" text-anchor="middle" font-size="${this.fontSize * 0.6}">
          ${Math.floor(planet.degreeInSign)}°</text>`);
      }
    }
    
    return elements;
  }

  // Create chart points (Ascendant, MC, etc.)
  private createChartPoints(): string[] {
    const elements: string[] = [];
    const pointRadius = this.maxRadius + this.margin / 4;
    const colors = THEMES[this.config.theme];
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    for (const point of this.data.chart.chartPoints) {
      const angle = point.degree - ascendantDegree;
      const { x, y } = this.polarToCartesian(pointRadius, angle);
      
      // Create chart point symbol
      elements.push(`<g>
        <circle cx="${x}" cy="${y}" r="8" fill="${colors.background}" 
          stroke="${colors.foreground}" stroke-width="2"/>
        ${createSymbolGroup(point.pointType.toLowerCase(), x, y, this.scaleAdjustment * 0.6, colors.foreground, 2)}
      </g>`);
    }
    
    return elements;
  }

  // Calculate planet positions with collision avoidance
  private calculatePlanetPositions(): Map<string, { angle: number; radius: number }> {
    const positions = new Map<string, { angle: number; radius: number }>();
    const baseRadius = this.maxRadius - 3 * this.ringThickness;
    const minSeparation = 12; // Minimum degrees between planets
    
    // Get Ascendant for proper rotation
    const ascendant = this.data.getChartPoint('Ascendant');
    const ascendantDegree = ascendant ? ascendant.degree : 0;
    
    // Sort planets by degree
    const sortedPlanets = [...this.data.chart.planets].sort((a, b) => a.degree - b.degree);
    
    for (let i = 0; i < sortedPlanets.length; i++) {
      const planet = sortedPlanets[i];
      const angle = planet.degree - ascendantDegree;
      
      // Check for collisions with previous planets
      let hasCollision = true;
      let adjustmentRadius = baseRadius;
      
      while (hasCollision && adjustmentRadius > baseRadius - this.ringThickness) {
        hasCollision = false;
        
        for (const [, position] of positions) {
          const angleDiff = Math.abs(normalizeAngle(angle - position.angle));
          const minAngleDiff = Math.min(angleDiff, 360 - angleDiff);
          
          if (minAngleDiff < minSeparation && Math.abs(adjustmentRadius - position.radius) < 15) {
            hasCollision = true;
            break;
          }
        }
        
        if (hasCollision) {
          adjustmentRadius -= 12; // Move inward
        }
      }
      
      positions.set(planet.name, { angle, radius: adjustmentRadius });
    }
    
    return positions;
  }

  // Convert polar coordinates to cartesian (adjusted for proper orientation)
  private polarToCartesian(radius: number, angleDegrees: number): { x: number; y: number } {
    // Convert to radians and adjust for chart orientation (0° at 9 o'clock, increasing counterclockwise)
    const angleRadians = (-angleDegrees + 90) * Math.PI / 180;
    
    return {
      x: this.centerX + radius * Math.cos(angleRadians),
      y: this.centerY - radius * Math.sin(angleRadians)
    };
  }

  // Adjust color opacity
  private adjustColorOpacity(color: string, opacity: number): string {
    // Simple hex color opacity adjustment
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return color + alpha;
    }
    return color;
  }
}