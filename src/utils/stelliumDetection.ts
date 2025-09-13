/* eslint-disable @typescript-eslint/no-unused-vars */
import { NatalChartData } from './natalChart';

export interface DetailedStellium {
  type: 'sign' | 'house';
  sign?: string;
  house?: number;
  planets: { name: string; sign: string; house: number }[];
}

export interface StelliumDetectionResult {
  signStelliums: string[];
  houseStelliums: string[];
  sunSign?: string;
  detailedStelliums: DetailedStellium[];
}

/**
 * Detect stelliums (3+ planets in same sign or house) and extract sun sign from chart data
 */
export function detectStelliums(chartData: NatalChartData): StelliumDetectionResult {
  const signGroups: Record<string, typeof chartData.planets> = {};
  const houseGroups: Record<string, typeof chartData.planets> = {};
  let sunSign: string | undefined;

  // Group planets by sign and house, and extract sun sign
  chartData.planets.forEach(planet => {
    if (!signGroups[planet.sign]) signGroups[planet.sign] = [];
    if (!houseGroups[planet.house]) houseGroups[planet.house] = [];
    
    signGroups[planet.sign].push(planet);
    houseGroups[planet.house].push(planet);
    
    // Extract sun sign
    if (planet.name.toLowerCase() === 'sun') {
      sunSign = planet.sign;
    }
  });

  // Find stelliums (3+ planets in same sign/house)
  const signStelliums = Object.entries(signGroups)
    .filter(([_, planets]) => planets.length >= 3)
    .map(([sign, _]) => sign);

  const houseStelliums = Object.entries(houseGroups)
    .filter(([_, planets]) => planets.length >= 3)
    .map(([house, _]) => house);

  // Create detailed stellium data for rich display
  const detailedStelliums: DetailedStellium[] = [
    // Sign stelliums
    ...Object.entries(signGroups)
      .filter(([_, planets]) => planets.length >= 3)
      .map(([sign, planets]) => ({
        type: 'sign' as const,
        sign,
        planets: planets.map(p => ({ name: p.name, sign: p.sign, house: p.house }))
      })),
    // House stelliums  
    ...Object.entries(houseGroups)
      .filter(([_, planets]) => planets.length >= 3)
      .map(([house, planets]) => ({
        type: 'house' as const,
        house: parseInt(house),
        planets: planets.map(p => ({ name: p.name, sign: p.sign, house: p.house }))
      }))
  ];

  return {
    signStelliums,
    houseStelliums,
    sunSign,
    detailedStelliums
  };
}