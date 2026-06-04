/* eslint-disable @typescript-eslint/no-unused-vars */
import { NatalChartData, PlanetPosition, HousePosition } from '@/types/astrology';
import { calculateAyanamsaForYear, tropicalToSidereal } from './ayanamsaCalculator';
import { SIGNS } from '@/constants/astrological';
import { determineHouse } from './houseSystemService';

export type ChartSystem = 'placidus' | 'draconian' | 'vedic';

export function convertChartSystem(
  tropicalData: NatalChartData,
  system: ChartSystem,
  birthYear?: number
): NatalChartData {
  if (system === 'placidus') {
    return tropicalData;
  }

  if (system === 'draconian') {
    return convertToDraconian(tropicalData);
  }

  if (system === 'vedic') {
    const year = birthYear || new Date().getFullYear();
    return convertToVedic(tropicalData, year);
  }

  return tropicalData;
}

function convertToDraconian(tropicalData: NatalChartData): NatalChartData {
  const northNode = tropicalData.planets.find(p => p.name === 'northNode');
  if (!northNode) {
    return tropicalData;
  }

  const northNodeLongitude = northNode.longitude;

  const convertedPlanets: PlanetPosition[] = tropicalData.planets.map(planet => {
    const draconianLongitude = ((planet.longitude - northNodeLongitude) % 360 + 360) % 360;
    const signIndex = Math.floor(draconianLongitude / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';
    const house = determineHouse(draconianLongitude, tropicalData.houses);

    return {
      ...planet,
      longitude: draconianLongitude,
      sign,
      house,
    };
  });

  const convertedHouses: HousePosition[] = tropicalData.houses.map(house => {
    const draconianCusp = ((house.cusp - northNodeLongitude) % 360 + 360) % 360;
    const signIndex = Math.floor(draconianCusp / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';

    return {
      ...house,
      cusp: draconianCusp,
      sign,
    };
  });

  const draconianAscendant = ((tropicalData.ascendant - northNodeLongitude) % 360 + 360) % 360;
  const draconianMidheaven = ((tropicalData.midheaven - northNodeLongitude) % 360 + 360) % 360;

  return {
    ...tropicalData,
    planets: convertedPlanets,
    houses: convertedHouses,
    ascendant: draconianAscendant,
    midheaven: draconianMidheaven,
  };
}

function convertToVedic(tropicalData: NatalChartData, year: number): NatalChartData {
  const ayanamsa = calculateAyanamsaForYear(year, 'lahiri');

  const convertedPlanets: PlanetPosition[] = tropicalData.planets.map(planet => {
    const vedicLongitude = tropicalToSidereal(planet.longitude, ayanamsa);
    const signIndex = Math.floor(vedicLongitude / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';
    const house = determineHouse(vedicLongitude, tropicalData.houses);

    return {
      ...planet,
      longitude: vedicLongitude,
      sign,
      house,
    };
  });

  const convertedHouses: HousePosition[] = tropicalData.houses.map(house => {
    const vedicCusp = tropicalToSidereal(house.cusp, ayanamsa);
    const signIndex = Math.floor(vedicCusp / 30) % 12;
    const sign = SIGNS[signIndex] || 'aries';

    return {
      ...house,
      cusp: vedicCusp,
      sign,
    };
  });

  const vedicAscendant = tropicalToSidereal(tropicalData.ascendant, ayanamsa);
  const vedicMidheaven = tropicalToSidereal(tropicalData.midheaven, ayanamsa);

  return {
    ...tropicalData,
    planets: convertedPlanets,
    houses: convertedHouses,
    ascendant: vedicAscendant,
    midheaven: vedicMidheaven,
  };
}

export function getChartSystemDescription(system: ChartSystem): string {
  switch (system) {
    case 'placidus':
      return 'Tropical zodiac with Placidus house system';
    case 'draconian':
      return 'Draconian zodiac (North Node at 0° Aries)';
    case 'vedic':
      return 'Sidereal zodiac with Lahiri ayanamsa';
    default:
      return '';
  }
}
