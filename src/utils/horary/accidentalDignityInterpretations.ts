/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Accidental Dignity Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive accidental dignity calculations and interpretations
 * for horary astrology, focusing on planetary power to act in practice.
 */

export interface AccidentalDignity {
  planet: string;
  house: number;
  housePlacement: 'angular' | 'succedent' | 'cadent';
  houseStrength: 'strong' | 'neutral' | 'weak';
  distanceFromCusp: number;
  sameSignAsCusp: boolean;
  
  joy: boolean;
  retrograde: boolean;
  station: 'first' | 'second' | null;
  speed: 'fast' | 'average' | 'slow';
  speedValue: number;
  
  combustion: {
    combust: boolean;
    cazimi: boolean;
    underSunbeams: boolean;
    distance: number;
    applying: boolean;
  };
  
  besiegement: {
    besieged: boolean;
    besiegedByRays: boolean;
    besiegers: string[];
    type: 'malefic' | 'benefic' | 'mixed' | null;
  };
  
  fixedStars: {
    regulus: boolean;
    spica: boolean;
    algol: boolean;
  };
  
  aspects: AspectFromPlanet[];
  strengthScore: number;
  overallAssessment: 'very strong' | 'strong' | 'moderate' | 'weak' | 'very weak';
  contextualFactors: string[];
  contextualMeaning: string;
}

export interface AspectFromPlanet {
  planet: string;
  aspect: string;
  orb: number;
  applying: boolean;
  strength: 'strong' | 'moderate' | 'weak';
  beneficial: boolean;
}

export interface LunarConditions {
  light: number; // 0-100 percentage
  increasing: boolean;
  phase: string;
  voidOfCourse: boolean;
  viaCombusta: boolean;
  nextAspect: string | null;
  distanceToNextAspect: number;
  phaseDescription: string;
  strengthAssessment: string;
}

export interface PlanetarySpeed {
  planet: string;
  averageDailyMotion: number;
  fastThreshold: number;
  slowThreshold: number;
}

// Planetary speed data from Frawley
export const PLANETARY_SPEEDS: PlanetarySpeed[] = [
  {
    planet: 'Moon',
    averageDailyMotion: 13.183333, // 13°11'
    fastThreshold: 14.5,
    slowThreshold: 12.5
  },
  {
    planet: 'Mercury', 
    averageDailyMotion: 0.983333, // 0°59'
    fastThreshold: 1.5,
    slowThreshold: 1.0
  },
  {
    planet: 'Venus',
    averageDailyMotion: 0.983333, // 0°59'
    fastThreshold: 1.0,
    slowThreshold: 0.833333 // 0°50'
  },
  {
    planet: 'Sun',
    averageDailyMotion: 0.983333, // 0°59' (never significantly fast/slow)
    fastThreshold: 1.0,
    slowThreshold: 0.966667
  },
  {
    planet: 'Mars',
    averageDailyMotion: 0.516667, // 0°31'
    fastThreshold: 0.666667, // 0°40'
    slowThreshold: 0.5 // 0°30'
  },
  {
    planet: 'Jupiter',
    averageDailyMotion: 0.083333, // 0°05'
    fastThreshold: 0.166667, // 0°10'
    slowThreshold: 0.083333 // 0°05'
  },
  {
    planet: 'Saturn',
    averageDailyMotion: 0.033333, // 0°02'
    fastThreshold: 0.083333, // 0°05'
    slowThreshold: 0.033333 // 0°02'
  }
];

// Planetary joys in houses
export const PLANETARY_JOYS: Record<string, number> = {
  'Mercury': 1,
  'Moon': 3,
  'Venus': 5,
  'Mars': 6,
  'Sun': 9,
  'Jupiter': 11,
  'Saturn': 12
};

// Fixed star positions (approximate for 2024)
export const FIXED_STARS = {
  regulus: { longitude: 29.833333, sign: 'Leo' }, // 29°50' Leo
  spica: { longitude: 23.833333, sign: 'Libra' }, // 23°50' Libra
  algol: { longitude: 26.2, sign: 'Taurus' } // 26°12' Taurus
};

// House classifications for accidental dignity
export function getHousePlacement(house: number): 'angular' | 'succedent' | 'cadent' {
  const angular = [1, 4, 7, 10];
  const succedent = [2, 5, 8, 11];
  const cadent = [3, 6, 9, 12];
  
  if (angular.includes(house)) return 'angular';
  if (succedent.includes(house)) return 'succedent';
  return 'cadent';
}

export function getHouseStrength(house: number): 'strong' | 'neutral' | 'weak' {
  // Angular houses strong; 6th, 8th, 12th weak; others neutral
  const angular = [1, 4, 7, 10];
  const weak = [6, 8, 12];
  
  if (angular.includes(house)) return 'strong';
  if (weak.includes(house)) return 'weak';
  return 'neutral';
}

export function getPlanetarySpeed(planet: string): PlanetarySpeed | undefined {
  return PLANETARY_SPEEDS.find(p => p.planet === planet);
}

export function analyzeSpeed(planet: string, dailyMotion: number): 'fast' | 'average' | 'slow' {
  const speedData = getPlanetarySpeed(planet);
  if (!speedData) return 'average';
  
  if (Math.abs(dailyMotion) >= speedData.fastThreshold) return 'fast';
  if (Math.abs(dailyMotion) <= speedData.slowThreshold) return 'slow';
  return 'average';
}

export function analyzeCombustion(planetLon: number, sunLon: number, planetSign: string, sunSign: string): {
  combust: boolean;
  cazimi: boolean;
  underSunbeams: boolean;
  distance: number;
  applying: boolean;
} {
  // Must be in same sign for combustion
  if (planetSign !== sunSign) {
    return {
      combust: false,
      cazimi: false,
      underSunbeams: false,
      distance: Math.abs(planetLon - sunLon),
      applying: planetLon < sunLon
    };
  }
  
  const distance = Math.abs(planetLon - sunLon);
  const applying = planetLon < sunLon; // Simplified - would need motion calculation
  
  return {
    combust: distance <= 8.5,
    cazimi: distance <= 0.283333, // 17 minutes
    underSunbeams: distance > 8.5 && distance <= 15,
    distance,
    applying
  };
}

export function analyzeFixedStars(planetLon: number, planetSign: string): {
  regulus: boolean;
  spica: boolean;
  algol: boolean;
} {
  const orb = 2; // 2 degree orb for fixed stars
  
  return {
    regulus: planetSign === 'Leo' && Math.abs(planetLon - FIXED_STARS.regulus.longitude) <= orb,
    spica: planetSign === 'Libra' && Math.abs(planetLon - FIXED_STARS.spica.longitude) <= orb,
    algol: planetSign === 'Taurus' && Math.abs(planetLon - FIXED_STARS.algol.longitude) <= orb
  };
}

export function analyzeBesiegement(planetName: string, planetLon: number, allPlanets: Array<{planet: string, longitude: number, sign: string}>): {
  besieged: boolean;
  besiegedByRays: boolean;
  besiegers: string[];
  type: 'malefic' | 'benefic' | 'mixed' | null;
} {
  const malefics = ['Mars', 'Saturn'];
  const benefics = ['Jupiter', 'Venus'];
  
  // Find planets on either side
  const sorted = allPlanets
    .filter(p => p.planet !== planetName)
    .sort((a, b) => a.longitude - b.longitude);
    
  // Simplified besiegement check - would need more sophisticated logic
  // for proper implementation including ray besiegement
  
  return {
    besieged: false,
    besiegedByRays: false,
    besiegers: [],
    type: null
  };
}

export function calculateAccidentalDignity(
  planet: string,
  house: number,
  longitude: number,
  sign: string,
  dailyMotion: number,
  isRetrograde: boolean,
  sunLongitude: number,
  sunSign: string,
  houseCuspLongitude: number,
  houseCuspSign: string,
  questionContext: string = ''
): AccidentalDignity {
  
  const housePlacement = getHousePlacement(house);
  const houseStrength = getHouseStrength(house);
  const distanceFromCusp = Math.abs(longitude - houseCuspLongitude);
  const sameSignAsCusp = sign === houseCuspSign;
  
  // Joy calculation
  const joy = PLANETARY_JOYS[planet] === house;
  
  // Speed analysis
  const speed = analyzeSpeed(planet, dailyMotion);
  
  // Combustion analysis
  const combustion = analyzeCombustion(longitude, sunLongitude, sign, sunSign);
  
  // Fixed stars
  const fixedStars = analyzeFixedStars(longitude, sign);
  
  // Station analysis (simplified - would need actual station data)
  const station = null; // Would calculate from ephemeris data
  
  // Besiegement (simplified)
  const besiegement = {
    besieged: false,
    besiegedByRays: false,
    besiegers: [],
    type: null as 'malefic' | 'benefic' | 'mixed' | null
  };
  
  // Aspects (simplified - would calculate from full chart)
  const aspects: AspectFromPlanet[] = [];
  
  // Calculate strength score
  let strengthScore = 0;
  
  // House strength
  if (houseStrength === 'strong') strengthScore += 5;
  else if (houseStrength === 'neutral') strengthScore += 2;
  // weak houses add 0
  
  // Additional factors
  if (joy) strengthScore += 2;
  if (speed === 'fast' && planet !== 'Saturn') strengthScore += 3;
  if (speed === 'slow') strengthScore -= 2;
  if (combustion.combust && !combustion.cazimi) strengthScore -= 5;
  if (combustion.cazimi) strengthScore += 5;
  if (combustion.underSunbeams) strengthScore -= 2;
  if (fixedStars.regulus || fixedStars.spica) strengthScore += 4;
  if (fixedStars.algol) strengthScore -= 4;
  if (isRetrograde) {
    // Context dependent - simplified here
    if (questionContext.includes('back') || questionContext.includes('return')) {
      strengthScore += 2; // Favorable
    } else {
      strengthScore -= 3; // Unfavorable
    }
  }
  
  // Overall assessment
  let overallAssessment: AccidentalDignity['overallAssessment'];
  if (strengthScore >= 8) overallAssessment = 'very strong';
  else if (strengthScore >= 5) overallAssessment = 'strong';
  else if (strengthScore >= 2) overallAssessment = 'moderate';
  else if (strengthScore >= -2) overallAssessment = 'weak';
  else overallAssessment = 'very weak';
  
  // Contextual factors
  const contextualFactors: string[] = [];
  if (joy) contextualFactors.push('In planetary joy');
  if (combustion.combust) contextualFactors.push('Combust - severely debilitated');
  if (combustion.cazimi) contextualFactors.push('Cazimi - crowned with royal power');
  if (fixedStars.regulus) contextualFactors.push('Conjunct Regulus - material success');
  if (fixedStars.spica) contextualFactors.push('Conjunct Spica - general fortune');
  if (fixedStars.algol) contextualFactors.push('Conjunct Algol - losing one\'s head');
  if (isRetrograde) contextualFactors.push('Retrograde motion');
  
  // Generate contextual meaning
  let contextualMeaning = '';
  if (houseStrength === 'strong') {
    contextualMeaning = 'In position of power - able to take decisive action';
  } else if (houseStrength === 'weak') {
    contextualMeaning = 'Weakened position - limited ability to influence outcomes';
  } else {
    contextualMeaning = 'Moderate position - some power to act but not dominant';
  }
  
  if (combustion.cazimi) {
    contextualMeaning = 'Cazimi - invincible and crowned with royal power';
  } else if (combustion.combust) {
    contextualMeaning = 'Combust - severely afflicted and unable to act effectively';
  }
  
  return {
    planet,
    house,
    housePlacement,
    houseStrength,
    distanceFromCusp,
    sameSignAsCusp,
    joy,
    retrograde: isRetrograde,
    station,
    speed,
    speedValue: dailyMotion,
    combustion,
    besiegement,
    fixedStars,
    aspects,
    strengthScore,
    overallAssessment,
    contextualFactors,
    contextualMeaning
  };
}

export function analyzeLunarConditions(
  moonLongitude: number,
  sunLongitude: number,
  moonSign: string,
  nextAspectDistance: number = 0,
  nextAspectPlanet: string | null = null
): LunarConditions {
  
  // Calculate lunar phase
  let phaseDifference = moonLongitude - sunLongitude;
  if (phaseDifference < 0) phaseDifference += 360;
  
  const light = Math.round(((1 - Math.cos((phaseDifference * Math.PI) / 180)) / 2) * 100);
  const increasing = phaseDifference < 180;
  
  let phase = '';
  let phaseDescription = '';
  
  if (phaseDifference < 45) {
    phase = 'New Moon';
    phaseDescription = 'New beginnings, low energy, hidden potential';
  } else if (phaseDifference < 90) {
    phase = 'Waxing Crescent';
    phaseDescription = 'Growing energy, building momentum';
  } else if (phaseDifference < 135) {
    phase = 'First Quarter';
    phaseDescription = 'Strong energy, overcoming obstacles';
  } else if (phaseDifference < 180) {
    phase = 'Waxing Gibbous';
    phaseDescription = 'Peak building energy, near full power';
  } else if (phaseDifference < 225) {
    phase = 'Full Moon';
    phaseDescription = 'Maximum light but opposing Sun (some weakness)';
  } else if (phaseDifference < 270) {
    phase = 'Waning Gibbous';
    phaseDescription = 'Decreasing light, releasing energy';
  } else if (phaseDifference < 315) {
    phase = 'Last Quarter';
    phaseDescription = 'Moderate light but decreasing';
  } else {
    phase = 'Waning Crescent';
    phaseDescription = 'Low light, ending cycles';
  }
  
  // Via combusta check (15° Libra to 15° Scorpio)
  const viaCombusta = (moonSign === 'Libra' && moonLongitude >= 15) || 
                      (moonSign === 'Scorpio' && moonLongitude <= 15);
  
  // Void of course check (simplified)
  const voidOfCourse = nextAspectDistance > 15 || nextAspectPlanet === null;
  
  // Strength assessment
  let strengthAssessment = '';
  if (light > 80 && increasing) {
    strengthAssessment = 'Very strong - high light and increasing';
  } else if (light > 60) {
    strengthAssessment = 'Strong - good light';
  } else if (light > 30 && increasing) {
    strengthAssessment = 'Moderate - increasing light';
  } else if (light > 30) {
    strengthAssessment = 'Weak - decreasing light';
  } else {
    strengthAssessment = 'Very weak - little light';
  }
  
  if (voidOfCourse) {
    strengthAssessment += ' (Void of course - nothing will happen)';
  }
  
  if (viaCombusta) {
    strengthAssessment += ' (Via combusta - emotional turbulence)';
  }
  
  return {
    light,
    increasing,
    phase,
    voidOfCourse,
    viaCombusta,
    nextAspect: nextAspectPlanet,
    distanceToNextAspect: nextAspectDistance,
    phaseDescription,
    strengthAssessment
  };
}

export function getAccidentalDignityDescription(assessment: AccidentalDignity['overallAssessment']): {
  label: string;
  color: string;
  description: string;
} {
  const descriptions = {
    'very strong': {
      label: 'Very Strong',
      color: 'green',
      description: 'Excellent power to act, in commanding position'
    },
    'strong': {
      label: 'Strong',
      color: 'lightgreen', 
      description: 'Good power to act, able to influence outcomes'
    },
    'moderate': {
      label: 'Moderate',
      color: 'yellow',
      description: 'Some power to act, moderate influence'
    },
    'weak': {
      label: 'Weak',
      color: 'orange',
      description: 'Limited power to act, constrained circumstances'
    },
    'very weak': {
      label: 'Very Weak',
      color: 'red',
      description: 'Severely limited, little ability to influence events'
    }
  };
  
  return descriptions[assessment];
}

export function compareAccidentalStrengths(dignities: AccidentalDignity[]): AccidentalDignity[] {
  return dignities.sort((a, b) => {
    // Sort by strength score primarily
    if (a.strengthScore !== b.strengthScore) {
      return b.strengthScore - a.strengthScore;
    }
    
    // Cazimi trumps all
    if (a.combustion.cazimi && !b.combustion.cazimi) return -1;
    if (b.combustion.cazimi && !a.combustion.cazimi) return 1;
    
    // Angular houses trump others
    if (a.houseStrength === 'strong' && b.houseStrength !== 'strong') return -1;
    if (b.houseStrength === 'strong' && a.houseStrength !== 'strong') return 1;
    
    return 0;
  });
}

export function contextualAccidentalInterpretation(
  dignity: AccidentalDignity,
  questionType: string,
  context: string = ''
): {
  interpretation: string;
  confidence: 'high' | 'medium' | 'low';
  relevantFactors: string[];
} {
  const relevantFactors: string[] = [];
  let interpretation = dignity.contextualMeaning;
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  // Retrograde context
  if (dignity.retrograde) {
    if (questionType.includes('back') || questionType.includes('return') || 
        questionType.includes('old') || questionType.includes('former')) {
      relevantFactors.push('Retrograde motion favors return/going back');
      interpretation += '. Retrograde motion is beneficial here - indicates return or recovery';
      confidence = 'high';
    } else {
      relevantFactors.push('Retrograde motion works against forward progress');
      interpretation += '. Retrograde motion is problematic - going against natural flow';
    }
  }
  
  // Speed context
  if (questionType.includes('quick') || questionType.includes('fast') || questionType.includes('urgent')) {
    if (dignity.speed === 'fast') {
      relevantFactors.push('Fast motion supports urgent timing');
      confidence = 'high';
    } else if (dignity.speed === 'slow') {
      relevantFactors.push('Slow motion works against urgent needs');
    }
  }
  
  if (questionType.includes('delay') || questionType.includes('patience') || questionType.includes('drag out')) {
    if (dignity.speed === 'slow') {
      relevantFactors.push('Slow motion supports delayed timing');
      confidence = 'high';
    }
  }
  
  // House context
  if (dignity.houseStrength === 'strong') {
    relevantFactors.push('Angular house gives power and visibility');
  } else if (dignity.houseStrength === 'weak') {
    relevantFactors.push('Weak house placement limits effectiveness');
  }
  
  // Combustion context
  if (dignity.combustion.combust && !dignity.combustion.cazimi) {
    if (questionType.includes('hidden') || questionType.includes('secret') || 
        questionType.includes('permit') || questionType.includes('permission')) {
      relevantFactors.push('Combustion provides invisibility - can act unseen');
      interpretation = 'Combust condition provides invisibility and secrecy';
      confidence = 'high';
    } else {
      relevantFactors.push('Combustion severely limits ability to act');
    }
  }
  
  if (dignity.combustion.cazimi) {
    relevantFactors.push('Cazimi grants invincible royal power');
    interpretation = 'Cazimi - invincible and able to achieve anything desired';
    confidence = 'high';
  }
  
  // Fixed star context
  if (dignity.fixedStars.regulus) {
    relevantFactors.push('Regulus brings material success but not happiness');
    if (questionType.includes('money') || questionType.includes('business') || 
        questionType.includes('career') || questionType.includes('success')) {
      confidence = 'high';
    }
  }
  
  if (dignity.fixedStars.spica) {
    relevantFactors.push('Spica provides protection and general fortune');
    confidence = 'high';
  }
  
  if (dignity.fixedStars.algol) {
    relevantFactors.push('Algol warns of losing one\'s head - act with caution');
    if (questionType.includes('decision') || questionType.includes('choice')) {
      confidence = 'high';
    }
  }
  
  return {
    interpretation,
    confidence,
    relevantFactors
  };
}