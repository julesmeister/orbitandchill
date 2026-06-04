/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlanetPosition, ChartAspect, AspectPattern } from '@/types/astrology';

const MAJOR_PLANETS = new Set([
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
]);

const ELEMENT_BY_SIGN: Record<string, string> = {
  aries: 'Fire', leo: 'Fire', sagittarius: 'Fire',
  taurus: 'Earth', virgo: 'Earth', capricorn: 'Earth',
  gemini: 'Air', libra: 'Air', aquarius: 'Air',
  cancer: 'Water', scorpio: 'Water', pisces: 'Water'
};

const QUALITY_BY_SIGN: Record<string, string> = {
  aries: 'Cardinal', cancer: 'Cardinal', libra: 'Cardinal', capricorn: 'Cardinal',
  taurus: 'Fixed', leo: 'Fixed', scorpio: 'Fixed', aquarius: 'Fixed',
  gemini: 'Mutable', virgo: 'Mutable', sagittarius: 'Mutable', pisces: 'Mutable'
};

export function detectPatterns(
  planets: PlanetPosition[],
  aspects: ChartAspect[]
): AspectPattern[] {
  const majorPlanetAspects = aspects.filter(aspect =>
    MAJOR_PLANETS.has(aspect.planet1.toLowerCase()) &&
    MAJOR_PLANETS.has(aspect.planet2.toLowerCase())
  );

  const patterns: AspectPattern[] = [];
  patterns.push(...detectGrandTrines(planets, majorPlanetAspects));
  patterns.push(...detectTSquares(planets, majorPlanetAspects));

  return patterns.sort((a, b) => b.strength - a.strength);
}

function detectGrandTrines(
  planets: PlanetPosition[],
  aspects: ChartAspect[]
): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const foundPatternKeys = new Set<string>();
  const trines = aspects.filter(a => a.aspect.toLowerCase() === 'trine');

  const trinePairMap = new Map<string, ChartAspect>();
  for (const trine of trines) {
    const key = [trine.planet1, trine.planet2].sort().join('|');
    trinePairMap.set(key, trine);
  }

  for (let i = 0; i < trines.length; i++) {
    for (let j = i + 1; j < trines.length; j++) {
      const trine1 = trines[i];
      const trine2 = trines[j];

      let commonPlanet: string | null = null;
      if (trine1.planet1 === trine2.planet1 || trine1.planet1 === trine2.planet2) {
        commonPlanet = trine1.planet1;
      } else if (trine1.planet2 === trine2.planet1 || trine1.planet2 === trine2.planet2) {
        commonPlanet = trine1.planet2;
      }
      if (!commonPlanet) continue;

      const planet2 = trine1.planet1 === commonPlanet ? trine1.planet2 : trine1.planet1;
      const planet3 = trine2.planet1 === commonPlanet ? trine2.planet2 : trine2.planet1;

      const closingKey = [planet2, planet3].sort().join('|');
      const closingTrine = trinePairMap.get(closingKey);
      if (!closingTrine) continue;

      const sortedPlanets = [commonPlanet, planet2, planet3].sort();
      const patternKey = sortedPlanets.join('|');
      if (foundPatternKeys.has(patternKey)) continue;
      foundPatternKeys.add(patternKey);

      const planetPositions = planets.filter(p => sortedPlanets.includes(p.name));
      const elements = planetPositions
        .map(p => ELEMENT_BY_SIGN[p.sign.toLowerCase()])
        .filter(Boolean);
      const elementCounts: Record<string, number> = {};
      elements.forEach(e => { elementCounts[e] = (elementCounts[e] || 0) + 1; });
      const element = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

      const involvedAspects = [trine1, trine2, closingTrine];
      const avgOrb = involvedAspects.reduce((sum, a) => sum + Math.abs(a.orb), 0) / 3;
      const strength = Math.max(0, Math.min(1, 1.0 - (avgOrb / 8.0)));

      patterns.push({
        name: 'Grand Trine',
        patternType: 'grand_trine',
        element,
        planets: sortedPlanets,
        strength,
        aspects: involvedAspects
      });
    }
  }

  return patterns;
}

function detectTSquares(
  planets: PlanetPosition[],
  aspects: ChartAspect[]
): AspectPattern[] {
  const patterns: AspectPattern[] = [];
  const foundPatternKeys = new Set<string>();
  const oppositions = aspects.filter(a => a.aspect.toLowerCase() === 'opposition');
  const squares = aspects.filter(a => a.aspect.toLowerCase() === 'square');

  const squaresByPlanet = new Map<string, ChartAspect[]>();
  for (const sq of squares) {
    if (!squaresByPlanet.has(sq.planet1)) squaresByPlanet.set(sq.planet1, []);
    squaresByPlanet.get(sq.planet1)!.push(sq);
    if (!squaresByPlanet.has(sq.planet2)) squaresByPlanet.set(sq.planet2, []);
    squaresByPlanet.get(sq.planet2)!.push(sq);
  }

  const squarePairMap = new Map<string, ChartAspect>();
  for (const sq of squares) {
    const key = [sq.planet1, sq.planet2].sort().join('|');
    squarePairMap.set(key, sq);
  }

  for (const opposition of oppositions) {
    const planet1 = opposition.planet1;
    const planet2 = opposition.planet2;

    const planet1Squares = squaresByPlanet.get(planet1);
    if (!planet1Squares) continue;

    for (const sq1 of planet1Squares) {
      const apexCandidate = sq1.planet1 === planet1 ? sq1.planet2 : sq1.planet1;

      const pairKey = [apexCandidate, planet2].sort().join('|');
      const sq2 = squarePairMap.get(pairKey);
      if (!sq2) continue;

      const sortedPlanets = [planet1, planet2, apexCandidate].sort();
      const patternKey = sortedPlanets.join('|');
      if (foundPatternKeys.has(patternKey)) continue;
      foundPatternKeys.add(patternKey);

      const planetPositions = planets.filter(p => sortedPlanets.includes(p.name));
      const qualities = planetPositions
        .map(p => QUALITY_BY_SIGN[p.sign.toLowerCase()])
        .filter(Boolean);
      const qualityCounts: Record<string, number> = {};
      qualities.forEach(q => { qualityCounts[q] = (qualityCounts[q] || 0) + 1; });
      const quality = Object.entries(qualityCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

      const involvedAspects = [opposition, sq1, sq2];
      const avgOrb = involvedAspects.reduce((sum, a) => sum + Math.abs(a.orb), 0) / 3;
      const strength = Math.max(0, Math.min(1, 1.0 - (avgOrb / 8.0)));

      patterns.push({
        name: 'T-Square',
        patternType: 't_square',
        quality,
        planets: sortedPlanets,
        apexPlanet: apexCandidate,
        strength,
        aspects: involvedAspects
      });
    }
  }

  return patterns;
}
