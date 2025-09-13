/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Essential Dignity Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive essential dignity calculations and interpretations
 * for horary astrology, following traditional principles.
 */

export interface EssentialDignity {
  planet: string;
  sign: string;
  degree: number;
  dignities: {
    ruler: boolean;
    exaltation: boolean;
    exaltationDegree: boolean;
    triplicity: boolean;
    term: boolean;
    face: boolean;
  };
  debilities: {
    detriment: boolean;
    fall: boolean;
    fallDegree: boolean;
    peregrine: boolean;
  };
  strengthScore: number;
  overallAssessment: 'very strong' | 'strong' | 'moderate' | 'weak' | 'very weak' | 'peregrine';
  contextualMeaning: string;
  descriptiveQualities: string[];
}

export interface DignityTable {
  sign: string;
  ruler: string;
  exaltation?: { planet: string; degree: number };
  triplicityDay: string;
  triplicityNight: string;
  terms: Array<{ planet: string; startDegree: number; endDegree: number }>;
  faces: Array<{ planet: string; startDegree: number; endDegree: number }>;
  detriment: string;
  fall?: { planet: string; degree: number };
}

// Traditional Essential Dignity Tables
export const ESSENTIAL_DIGNITY_TABLE: DignityTable[] = [
  {
    sign: 'Aries',
    ruler: 'Mars',
    exaltation: { planet: 'Sun', degree: 19 },
    triplicityDay: 'Sun',
    triplicityNight: 'Jupiter',
    terms: [
      { planet: 'Jupiter', startDegree: 0, endDegree: 6 },
      { planet: 'Venus', startDegree: 6, endDegree: 14 },
      { planet: 'Mercury', startDegree: 14, endDegree: 21 },
      { planet: 'Mars', startDegree: 21, endDegree: 26 },
      { planet: 'Saturn', startDegree: 26, endDegree: 30 }
    ],
    faces: [
      { planet: 'Mars', startDegree: 0, endDegree: 10 },
      { planet: 'Sun', startDegree: 10, endDegree: 20 },
      { planet: 'Venus', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Venus',
    fall: { planet: 'Saturn', degree: 21 }
  },
  {
    sign: 'Taurus',
    ruler: 'Venus',
    exaltation: { planet: 'Moon', degree: 3 },
    triplicityDay: 'Venus',
    triplicityNight: 'Moon',
    terms: [
      { planet: 'Venus', startDegree: 0, endDegree: 8 },
      { planet: 'Mercury', startDegree: 8, endDegree: 15 },
      { planet: 'Jupiter', startDegree: 15, endDegree: 22 },
      { planet: 'Saturn', startDegree: 22, endDegree: 26 },
      { planet: 'Mars', startDegree: 26, endDegree: 30 }
    ],
    faces: [
      { planet: 'Mercury', startDegree: 0, endDegree: 10 },
      { planet: 'Moon', startDegree: 10, endDegree: 20 },
      { planet: 'Saturn', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Mars',
    fall: { planet: 'Uranus', degree: 15 } // Note: Traditional doesn't include Uranus, using as placeholder
  },
  {
    sign: 'Gemini',
    ruler: 'Mercury',
    triplicityDay: 'Saturn',
    triplicityNight: 'Mercury',
    terms: [
      { planet: 'Mercury', startDegree: 0, endDegree: 7 },
      { planet: 'Jupiter', startDegree: 7, endDegree: 14 },
      { planet: 'Venus', startDegree: 14, endDegree: 21 },
      { planet: 'Mars', startDegree: 21, endDegree: 25 },
      { planet: 'Saturn', startDegree: 25, endDegree: 30 }
    ],
    faces: [
      { planet: 'Jupiter', startDegree: 0, endDegree: 10 },
      { planet: 'Mars', startDegree: 10, endDegree: 20 },
      { planet: 'Sun', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Jupiter'
  },
  {
    sign: 'Cancer',
    ruler: 'Moon',
    exaltation: { planet: 'Jupiter', degree: 15 },
    triplicityDay: 'Mars',
    triplicityNight: 'Mars',
    terms: [
      { planet: 'Mars', startDegree: 0, endDegree: 7 },
      { planet: 'Venus', startDegree: 7, endDegree: 13 },
      { planet: 'Mercury', startDegree: 13, endDegree: 19 },
      { planet: 'Jupiter', startDegree: 19, endDegree: 26 },
      { planet: 'Saturn', startDegree: 26, endDegree: 30 }
    ],
    faces: [
      { planet: 'Venus', startDegree: 0, endDegree: 10 },
      { planet: 'Mercury', startDegree: 10, endDegree: 20 },
      { planet: 'Moon', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Saturn',
    fall: { planet: 'Mars', degree: 28 }
  },
  {
    sign: 'Leo',
    ruler: 'Sun',
    triplicityDay: 'Sun',
    triplicityNight: 'Jupiter',
    terms: [
      { planet: 'Jupiter', startDegree: 0, endDegree: 6 },
      { planet: 'Venus', startDegree: 6, endDegree: 13 },
      { planet: 'Saturn', startDegree: 13, endDegree: 19 },
      { planet: 'Mercury', startDegree: 19, endDegree: 25 },
      { planet: 'Mars', startDegree: 25, endDegree: 30 }
    ],
    faces: [
      { planet: 'Saturn', startDegree: 0, endDegree: 10 },
      { planet: 'Jupiter', startDegree: 10, endDegree: 20 },
      { planet: 'Mars', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Saturn'
  },
  {
    sign: 'Virgo',
    ruler: 'Mercury',
    exaltation: { planet: 'Mercury', degree: 15 },
    triplicityDay: 'Venus',
    triplicityNight: 'Moon',
    terms: [
      { planet: 'Mercury', startDegree: 0, endDegree: 7 },
      { planet: 'Venus', startDegree: 7, endDegree: 13 },
      { planet: 'Jupiter', startDegree: 13, endDegree: 18 },
      { planet: 'Mars', startDegree: 18, endDegree: 24 },
      { planet: 'Saturn', startDegree: 24, endDegree: 30 }
    ],
    faces: [
      { planet: 'Sun', startDegree: 0, endDegree: 10 },
      { planet: 'Venus', startDegree: 10, endDegree: 20 },
      { planet: 'Mercury', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Jupiter',
    fall: { planet: 'Venus', degree: 27 }
  },
  {
    sign: 'Libra',
    ruler: 'Venus',
    exaltation: { planet: 'Saturn', degree: 21 },
    triplicityDay: 'Saturn',
    triplicityNight: 'Mercury',
    terms: [
      { planet: 'Saturn', startDegree: 0, endDegree: 6 },
      { planet: 'Venus', startDegree: 6, endDegree: 11 },
      { planet: 'Jupiter', startDegree: 11, endDegree: 19 },
      { planet: 'Mercury', startDegree: 19, endDegree: 24 },
      { planet: 'Mars', startDegree: 24, endDegree: 30 }
    ],
    faces: [
      { planet: 'Moon', startDegree: 0, endDegree: 10 },
      { planet: 'Saturn', startDegree: 10, endDegree: 20 },
      { planet: 'Jupiter', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Mars',
    fall: { planet: 'Sun', degree: 19 }
  },
  {
    sign: 'Scorpio',
    ruler: 'Mars',
    triplicityDay: 'Mars',
    triplicityNight: 'Mars',
    terms: [
      { planet: 'Mars', startDegree: 0, endDegree: 7 },
      { planet: 'Venus', startDegree: 7, endDegree: 11 },
      { planet: 'Mercury', startDegree: 11, endDegree: 19 },
      { planet: 'Jupiter', startDegree: 19, endDegree: 24 },
      { planet: 'Saturn', startDegree: 24, endDegree: 30 }
    ],
    faces: [
      { planet: 'Mars', startDegree: 0, endDegree: 10 },
      { planet: 'Sun', startDegree: 10, endDegree: 20 },
      { planet: 'Venus', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Venus',
    fall: { planet: 'Moon', degree: 3 }
  },
  {
    sign: 'Sagittarius',
    ruler: 'Jupiter',
    triplicityDay: 'Sun',
    triplicityNight: 'Jupiter',
    terms: [
      { planet: 'Jupiter', startDegree: 0, endDegree: 8 },
      { planet: 'Venus', startDegree: 8, endDegree: 14 },
      { planet: 'Mercury', startDegree: 14, endDegree: 19 },
      { planet: 'Saturn', startDegree: 19, endDegree: 25 },
      { planet: 'Mars', startDegree: 25, endDegree: 30 }
    ],
    faces: [
      { planet: 'Mercury', startDegree: 0, endDegree: 10 },
      { planet: 'Moon', startDegree: 10, endDegree: 20 },
      { planet: 'Saturn', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Mercury'
  },
  {
    sign: 'Capricorn',
    ruler: 'Saturn',
    exaltation: { planet: 'Mars', degree: 28 },
    triplicityDay: 'Venus',
    triplicityNight: 'Moon',
    terms: [
      { planet: 'Mercury', startDegree: 0, endDegree: 7 },
      { planet: 'Jupiter', startDegree: 7, endDegree: 14 },
      { planet: 'Venus', startDegree: 14, endDegree: 22 },
      { planet: 'Saturn', startDegree: 22, endDegree: 26 },
      { planet: 'Mars', startDegree: 26, endDegree: 30 }
    ],
    faces: [
      { planet: 'Jupiter', startDegree: 0, endDegree: 10 },
      { planet: 'Mars', startDegree: 10, endDegree: 20 },
      { planet: 'Sun', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Moon',
    fall: { planet: 'Jupiter', degree: 15 }
  },
  {
    sign: 'Aquarius',
    ruler: 'Saturn',
    triplicityDay: 'Saturn',
    triplicityNight: 'Mercury',
    terms: [
      { planet: 'Mercury', startDegree: 0, endDegree: 7 },
      { planet: 'Venus', startDegree: 7, endDegree: 13 },
      { planet: 'Jupiter', startDegree: 13, endDegree: 20 },
      { planet: 'Mars', startDegree: 20, endDegree: 25 },
      { planet: 'Saturn', startDegree: 25, endDegree: 30 }
    ],
    faces: [
      { planet: 'Venus', startDegree: 0, endDegree: 10 },
      { planet: 'Mercury', startDegree: 10, endDegree: 20 },
      { planet: 'Moon', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Sun'
  },
  {
    sign: 'Pisces',
    ruler: 'Jupiter',
    exaltation: { planet: 'Venus', degree: 27 },
    triplicityDay: 'Mars',
    triplicityNight: 'Mars',
    terms: [
      { planet: 'Venus', startDegree: 0, endDegree: 8 },
      { planet: 'Jupiter', startDegree: 8, endDegree: 14 },
      { planet: 'Mercury', startDegree: 14, endDegree: 20 },
      { planet: 'Mars', startDegree: 20, endDegree: 26 },
      { planet: 'Saturn', startDegree: 26, endDegree: 30 }
    ],
    faces: [
      { planet: 'Saturn', startDegree: 0, endDegree: 10 },
      { planet: 'Jupiter', startDegree: 10, endDegree: 20 },
      { planet: 'Mars', startDegree: 20, endDegree: 30 }
    ],
    detriment: 'Mercury',
    fall: { planet: 'Mercury', degree: 15 }
  }
];

// Helper functions for dignity calculation

export function getSignData(sign: string): DignityTable | undefined {
  return ESSENTIAL_DIGNITY_TABLE.find(s => s.sign === sign);
}

export function isDay(sunHouse: number): boolean {
  // Sun in houses 7-12 = day, houses 1-6 = night
  // Allow few degrees favor toward day at ASC/DESC (houses 1 and 7)
  return sunHouse >= 7 && sunHouse <= 12;
}

export function calculateEssentialDignity(
  planet: string,
  sign: string,
  degree: number,
  isDayChart: boolean
): EssentialDignity {
  const signData = getSignData(sign);
  if (!signData) {
    throw new Error(`Unknown sign: ${sign}`);
  }

  const dignities = {
    ruler: signData.ruler === planet,
    exaltation: signData.exaltation?.planet === planet,
    exaltationDegree: signData.exaltation?.planet === planet && 
                     Math.floor(degree) === (signData.exaltation.degree - 1), // Ordinal to cardinal
    triplicity: (isDayChart ? signData.triplicityDay : signData.triplicityNight) === planet,
    term: false,
    face: false
  };

  // Check term
  const term = signData.terms.find(t => degree >= t.startDegree && degree < t.endDegree);
  if (term) {
    dignities.term = term.planet === planet;
  }

  // Check face
  const face = signData.faces.find(f => degree >= f.startDegree && degree < f.endDegree);
  if (face) {
    dignities.face = face.planet === planet;
  }

  const debilities = {
    detriment: signData.detriment === planet,
    fall: signData.fall?.planet === planet,
    fallDegree: signData.fall?.planet === planet && 
                Math.floor(degree) === (signData.fall.degree - 1), // Ordinal to cardinal
    peregrine: false
  };

  // Calculate strength score (for almuten calculation)
  let strengthScore = 0;
  if (dignities.ruler) strengthScore += 5;
  if (dignities.exaltation) strengthScore += 4;
  if (dignities.triplicity) strengthScore += 3;
  if (dignities.term) strengthScore += 2;
  if (dignities.face) strengthScore += 1;

  // Check if peregrine (no dignities or debilities)
  const hasDignity = Object.values(dignities).some(d => d);
  const hasDebility = debilities.detriment || debilities.fall;
  debilities.peregrine = !hasDignity && !hasDebility;

  // Determine overall assessment
  let overallAssessment: EssentialDignity['overallAssessment'];
  if (dignities.ruler || (dignities.exaltation && dignities.triplicity)) {
    overallAssessment = 'very strong';
  } else if (dignities.exaltation || (dignities.triplicity && (dignities.term || dignities.face))) {
    overallAssessment = 'strong';
  } else if (dignities.triplicity) {
    overallAssessment = 'moderate';
  } else if (debilities.detriment || debilities.fall) {
    overallAssessment = debilities.fallDegree || debilities.detriment ? 'very weak' : 'weak';
  } else if (debilities.peregrine) {
    overallAssessment = 'peregrine';
  } else {
    overallAssessment = 'weak'; // Minor dignities only
  }

  // Generate contextual meaning
  let contextualMeaning = '';
  if (dignities.ruler) {
    contextualMeaning = 'In own home - complete control and contentment';
  } else if (dignities.exaltation) {
    contextualMeaning = 'Honored guest - appears better than reality but very strong';
  } else if (dignities.triplicity) {
    contextualMeaning = 'In element - comfortable, moderately strong';
  } else if (debilities.detriment) {
    contextualMeaning = 'Severely debilitated - manifests worst qualities';
  } else if (debilities.fall) {
    contextualMeaning = 'Fall - exaggerated badness, seems worse than it is';
  } else if (debilities.peregrine) {
    contextualMeaning = 'Homeless wanderer - lacks moral direction';
  } else {
    contextualMeaning = 'Minor dignity only - slightly better than nothing';
  }

  // Generate descriptive qualities
  const descriptiveQualities: string[] = [];
  if (dignities.ruler) descriptiveQualities.push('Masterful', 'Confident', 'At home');
  if (dignities.exaltation) descriptiveQualities.push('Exaggerated', 'Impressive', 'Puffed up');
  if (dignities.triplicity) descriptiveQualities.push('Comfortable', 'In element', 'Natural');
  if (debilities.detriment) descriptiveQualities.push('Alien environment', 'Stressed', 'Worst nature');
  if (debilities.fall) descriptiveQualities.push('Fallen', 'Worse than appears', 'Declined');
  if (debilities.peregrine) descriptiveQualities.push('Drifting', 'Directionless', 'Amoral');

  return {
    planet,
    sign,
    degree,
    dignities,
    debilities,
    strengthScore,
    overallAssessment,
    contextualMeaning,
    descriptiveQualities
  };
}

export function calculateAlmuten(sign: string, degree: number, isDayChart: boolean): {
  almuten: string;
  score: number;
  competitors: Array<{ planet: string; score: number }>;
} {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const scores: Array<{ planet: string; score: number }> = [];

  planets.forEach(planet => {
    const dignity = calculateEssentialDignity(planet, sign, degree, isDayChart);
    scores.push({ planet, score: dignity.strengthScore });
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  const highestScore = scores[0].score;
  const winners = scores.filter(s => s.score === highestScore);
  
  return {
    almuten: winners[0].planet, // In case of tie, return first (would need chart context to resolve)
    score: highestScore,
    competitors: scores
  };
}

export function getDispositor(sign: string): string {
  const signData = getSignData(sign);
  return signData?.ruler || 'Unknown';
}

export function analyzeContradictions(dignity: EssentialDignity): {
  hasContradictions: boolean;
  contradictions: string[];
  interpretation: string;
} {
  const contradictions: string[] = [];
  let hasContradictions = false;

  // Check for dignity + debility combinations
  if ((dignity.dignities.triplicity && dignity.debilities.fall) ||
      (dignity.dignities.triplicity && dignity.debilities.detriment)) {
    hasContradictions = true;
    
    if (dignity.debilities.fall && dignity.dignities.triplicity) {
      contradictions.push('Triplicity (comfortable) + Fall (harmed)');
    }
    if (dignity.debilities.detriment && dignity.dignities.triplicity) {
      contradictions.push('Triplicity (comfortable) + Detriment (alien)');
    }
  }

  let interpretation = '';
  if (hasContradictions) {
    if (dignity.debilities.fall && dignity.dignities.triplicity) {
      interpretation = 'Reflects real-life ambiguity: comfortable with the situation but being harmed by it. Fall (stronger) indicates harm outweighs comfort, but exaggerated badness suggests not as bad as feared.';
    } else if (dignity.debilities.detriment && dignity.dignities.triplicity) {
      interpretation = 'Mixed signals: some comfort in the element but overall alien environment. Detriment (stronger) dominates, showing severe debilitation.';
    }
  } else {
    interpretation = 'No contradictions - dignity/debility pattern is straightforward.';
  }

  return {
    hasContradictions,
    contradictions,
    interpretation
  };
}

export function contextualDignityInterpretation(
  dignity: EssentialDignity,
  questionType: string,
  context: string = ''
): {
  interpretation: string;
  confidence: 'high' | 'medium' | 'low';
  overrides: string[];
} {
  const overrides: string[] = [];
  let interpretation = dignity.contextualMeaning;
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  // Check for descriptive overrides
  if (questionType.includes('lost') || questionType.includes('find')) {
    // Lost object example: Saturn in Cancer = wet barrier (umbrella)
    if (dignity.planet === 'Saturn' && dignity.sign === 'Cancer') {
      overrides.push('Descriptive meaning: barrier against wet (umbrella, raincoat)');
      interpretation = 'Perfect descriptive match overrides dignity considerations';
      confidence = 'high';
    }
  }

  if (questionType.includes('job') || questionType.includes('work')) {
    if (dignity.debilities.detriment || dignity.debilities.fall) {
      interpretation += '. In job context: desperate situation, may be unqualified, applying out of necessity';
      confidence = 'high';
    } else if (dignity.dignities.ruler || dignity.dignities.exaltation) {
      interpretation += '. In job context: well-qualified, confident, good position';
      confidence = 'high';
    }
  }

  if (questionType.includes('weather')) {
    // Jupiter in Pisces for beach weather = rain (malefic in context)
    if (dignity.planet === 'Jupiter' && ['Cancer', 'Scorpio', 'Pisces'].includes(dignity.sign)) {
      overrides.push('Contextual malefic: rain god in water sign');
      interpretation = 'Though dignified, contextually malefic for good weather';
      confidence = 'high';
    }
  }

  if (questionType.includes('relationship') || questionType.includes('marriage')) {
    if (dignity.dignities.ruler && ['Venus', 'Moon'].includes(dignity.planet)) {
      interpretation += '. In relationship context: very attractive, knows their worth';
      confidence = 'high';
    }
  }

  return {
    interpretation,
    confidence,
    overrides
  };
}

export function getDignityStrengthDescription(assessment: EssentialDignity['overallAssessment']): {
  label: string;
  color: string;
  description: string;
} {
  const descriptions = {
    'very strong': {
      label: 'Very Strong',
      color: 'green',
      description: 'Able to manifest best qualities, highly effective'
    },
    'strong': {
      label: 'Strong', 
      color: 'lightgreen',
      description: 'Good strength, can act well and effectively'
    },
    'moderate': {
      label: 'Moderate',
      color: 'yellow',
      description: 'Comfortable, moderate strength, pretty good'
    },
    'weak': {
      label: 'Weak',
      color: 'orange', 
      description: 'Limited strength, minor dignity only'
    },
    'very weak': {
      label: 'Very Weak',
      color: 'red',
      description: 'Severely debilitated, manifests worst qualities'
    },
    'peregrine': {
      label: 'Peregrine',
      color: 'gray',
      description: 'Morally directionless, inclined toward evil'
    }
  };

  return descriptions[assessment];
}

export function comparePlanetaryStrengths(dignities: EssentialDignity[]): EssentialDignity[] {
  return dignities.sort((a, b) => {
    // Sort by strength score, but consider special cases
    if (a.strengthScore !== b.strengthScore) {
      return b.strengthScore - a.strengthScore;
    }
    
    // In contests, exaltation trumps rulership
    if (a.dignities.exaltation && b.dignities.ruler) return -1;
    if (b.dignities.exaltation && a.dignities.ruler) return 1;
    
    return 0;
  });
}