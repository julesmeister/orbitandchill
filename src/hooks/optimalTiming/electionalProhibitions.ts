import { ElectionalProhibition } from './types';
import { ChartAspect, PlanetPosition } from '../../utils/natalChart';
import { isRetrograde, getMoonPhase, isCombust } from './astrologicalUtils';

// Enhanced electional prohibition checks
export const electionalProhibitions: Record<string, ElectionalProhibition> = {
  mercury_retrograde: {
    id: 'mercury_retrograde',
    name: 'Mercury Retrograde',
    description: 'Mercury in retrograde motion - critical prohibition for communication, technology, and business ventures',
    type: 'mercury_retrograde',
    severity: 'critical',
    penaltyMultiplier: 0.3, // Reduce score to 30%
    checkFunction: (chartData: any, date: Date) => {
      const mercury = chartData.planets.find((p: PlanetPosition) => p.name === 'mercury');
      return mercury ? isRetrograde(mercury) : false;
    }
  },
  mars_saturn_opposition: {
    id: 'mars_saturn_opposition',
    name: 'Mars-Saturn Opposition',
    description: 'Opposition between the two malefic planets - creates fundamental structural conflict',
    type: 'malefic_opposition',
    severity: 'critical',
    penaltyMultiplier: 0.4, // Reduce score to 40%
    checkFunction: (chartData: any, date: Date) => {
      const opposition = chartData.aspects.find((a: ChartAspect) => 
        (a.planet1 === 'mars' && a.planet2 === 'saturn' && a.aspect === 'opposition') ||
        (a.planet1 === 'saturn' && a.planet2 === 'mars' && a.aspect === 'opposition')
      );
      return Boolean(opposition);
    }
  },
  full_moon_new_venture: {
    id: 'full_moon_new_venture',
    name: 'Full Moon Launch',
    description: 'Full Moon represents culmination and crisis - antithetical to new beginnings',
    type: 'full_moon_launch',
    severity: 'major',
    penaltyMultiplier: 0.6, // Reduce score to 60%
    checkFunction: (chartData: any, date: Date) => {
      const moonPhase = getMoonPhase(date);
      return moonPhase === 'full';
    }
  },
  mars_debilitated: {
    id: 'mars_debilitated',
    name: 'Mars in Fall/Detriment',
    description: 'Mars in Cancer (fall) or Libra (detriment) - weakened action and initiative',
    type: 'planetary_debility',
    severity: 'major',
    penaltyMultiplier: 0.7, // Reduce score to 70%
    checkFunction: (chartData: any, date: Date) => {
      const mars = chartData.planets.find((p: PlanetPosition) => p.name === 'mars');
      return mars ? (mars.sign === 'cancer' || mars.sign === 'libra') : false;
    }
  },
  saturn_debilitated: {
    id: 'saturn_debilitated',
    name: 'Saturn in Fall/Detriment',
    description: 'Saturn in Aries (fall) or Cancer/Leo (detriment) - unstable foundation',
    type: 'planetary_debility',
    severity: 'major',
    penaltyMultiplier: 0.7, // Reduce score to 70%
    checkFunction: (chartData: any, date: Date) => {
      const saturn = chartData.planets.find((p: PlanetPosition) => p.name === 'saturn');
      return saturn ? (saturn.sign === 'aries' || saturn.sign === 'cancer' || saturn.sign === 'leo') : false;
    }
  },
  mercury_combust: {
    id: 'mercury_combust',
    name: 'Mercury Combustion',
    description: 'Mercury too close to the Sun - communication and mental faculties obscured',
    type: 'combustion',
    severity: 'moderate',
    penaltyMultiplier: 0.8, // Reduce score to 80%
    checkFunction: (chartData: any, date: Date) => {
      const mercury = chartData.planets.find((p: PlanetPosition) => p.name === 'mercury');
      const sun = chartData.planets.find((p: PlanetPosition) => p.name === 'sun');
      return mercury && sun ? isCombust(mercury, sun) : false;
    }
  }
};