/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmbeddedChart, ChartMetadata, PlanetSummary, HouseSummary } from '../types/threads';

export interface ChartShareData {
  chartType: 'natal' | 'horary' | 'event';
  svgContent: string;
  metadata: any;
  name: string;
}

/**
 * Extract planet summary from chart metadata
 */
export function extractPlanetSummary(chartData: any): PlanetSummary[] {
  if (!chartData?.planets) return [];
  
  return chartData.planets.map((planet: any) => ({
    planet: planet.name || planet.planet,
    sign: planet.sign,
    house: planet.house?.toString() || 'Unknown',
    degree: Math.round(planet.degree * 100) / 100,
    isRetrograde: planet.isRetrograde || false,
    dignity: planet.dignity || undefined
  }));
}

/**
 * Extract house summary from chart metadata
 */
export function extractHouseSummary(chartData: any): HouseSummary[] {
  if (!chartData?.houses || !chartData?.planets) return [];
  
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const planetsInHouse = chartData.planets
      .filter((planet: any) => planet.house === houseNumber)
      .map((planet: any) => planet.name || planet.planet);
    
    const houseSign = chartData.houses.find((h: any) => h.number === houseNumber)?.sign || 'Unknown';
    
    return {
      house: `${houseNumber}${getHouseOrdinal(houseNumber)} House`,
      sign: houseSign,
      planets: planetsInHouse,
      isEmpty: planetsInHouse.length === 0
    };
  });
  
  return houses;
}

/**
 * Get ordinal suffix for house numbers
 */
function getHouseOrdinal(num: number): string {
  if (num >= 11 && num <= 13) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Extract major aspects from chart data
 */
export function extractMajorAspects(chartData: any): string[] {
  if (!chartData?.aspects) return [];
  
  return chartData.aspects
    .filter((aspect: any) => ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(aspect.type?.toLowerCase()))
    .map((aspect: any) => `${aspect.planet1} ${aspect.type} ${aspect.planet2}`)
    .slice(0, 8); // Limit to most important aspects
}

/**
 * Create embedded chart data for sharing
 */
export function createEmbeddedChart(shareData: ChartShareData): EmbeddedChart {
  const planetSummary = extractPlanetSummary(shareData.metadata?.chartData);
  const houseSummary = extractHouseSummary(shareData.metadata?.chartData);
  const majorAspects = extractMajorAspects(shareData.metadata?.chartData);
  
  const metadata: ChartMetadata = {
    name: shareData.name,
    chartTitle: generateChartTitle(shareData),
    planetSummary,
    houseSummary,
    majorAspects,
    chartScore: shareData.metadata?.score
  };
  
  // Add specific data based on chart type
  if (shareData.chartType === 'natal' && shareData.metadata?.birthData) {
    metadata.birthData = shareData.metadata.birthData;
  } else if (shareData.chartType === 'event' && shareData.metadata?.eventData) {
    metadata.eventData = shareData.metadata.eventData;
  } else if (shareData.chartType === 'horary' && shareData.metadata?.horaryData) {
    metadata.horaryData = shareData.metadata.horaryData;
  }
  
  return {
    id: generateChartId(),
    chartType: shareData.chartType,
    chartData: shareData.svgContent,
    metadata,
    createdAt: new Date()
  };
}

/**
 * Generate chart title based on type and data
 */
function generateChartTitle(shareData: ChartShareData): string {
  switch (shareData.chartType) {
    case 'natal':
      return `${shareData.name}'s Natal Chart`;
    case 'horary':
      const question = shareData.metadata?.horaryData?.question;
      return question ? `Horary: ${question.substring(0, 50)}...` : `${shareData.name}'s Horary Chart`;
    case 'event':
      const eventTitle = shareData.metadata?.eventData?.eventTitle;
      return eventTitle ? `Event Chart: ${eventTitle}` : `${shareData.name}'s Event Chart`;
    default:
      return `${shareData.name}'s Chart`;
  }
}

/**
 * Generate unique chart ID
 */
function generateChartId(): string {
  return `chart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get current chart data from various chart pages
 */
export function getCurrentChartData(): ChartShareData | null {
  // This will be implemented to extract data from the current page
  // For now, return null as we'll need to integrate with existing chart hooks
  return null;
}

/**
 * Format planet display text
 */
export function formatPlanetDisplay(planet: PlanetSummary): string {
  const retrograde = planet.isRetrograde ? '℞' : '';
  const dignity = planet.dignity ? ` (${planet.dignity})` : '';
  return `${planet.planet} in ${planet.sign} ${planet.house}${retrograde}${dignity}`;
}

/**
 * Format house display text
 */
export function formatHouseDisplay(house: HouseSummary): string {
  if (house.isEmpty) {
    return `${house.house} in ${house.sign} (Empty)`;
  }
  return `${house.house} in ${house.sign}: ${house.planets.join(', ')}`;
}

/**
 * Get chart summary for preview
 */
export function getChartSummary(chart: EmbeddedChart): string {
  const { planetSummary, houseSummary } = chart.metadata;
  const occupiedHouses = houseSummary.filter(h => !h.isEmpty).length;
  const retrogradeCount = planetSummary.filter(p => p.isRetrograde).length;
  
  return `${planetSummary.length} planets, ${occupiedHouses} occupied houses, ${retrogradeCount} retrograde`;
}