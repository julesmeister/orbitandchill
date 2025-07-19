/**
 * Astrocartography Calculation Method Types
 * 
 * Defines the different calculation approaches for astrocartography lines
 * and provides transparency about which method is being used.
 */

export type CalculationMethod = 'zodiacal' | 'in_mundo';

export interface CalculationMethodInfo {
  method: CalculationMethod;
  name: string;
  description: string;
  technicalDetails: string;
  whenToUse: string;
  advantages: string[];
  considerations: string[];
}

export const CALCULATION_METHODS: Record<CalculationMethod, CalculationMethodInfo> = {
  zodiacal: {
    method: 'zodiacal',
    name: 'Zodiacal (Ecliptic-based)',
    description: 'Calculates lines based on ecliptic longitude positions relative to the zodiac',
    technicalDetails: 'Uses ecliptic coordinates and converts through the zodiac wheel. Based on planetary positions in tropical signs.',
    whenToUse: 'Traditional Western astrology approach. Most common in modern astrocartography.',
    advantages: [
      'Aligns with tropical zodiac system',
      'Consistent with natal chart house systems',
      'Widely used standard in astrology software',
      'Easier to correlate with natal chart interpretations'
    ],
    considerations: [
      'May not reflect exact sky positions due to precession',
      'Based on mathematical zodiac rather than actual star positions',
      'Can show slight differences from astronomical coordinates'
    ]
  },
  in_mundo: {
    method: 'in_mundo',
    name: 'In Mundo (Sky-based)',
    description: 'Calculates lines based on actual sky positions using right ascension and declination',
    technicalDetails: 'Uses equatorial coordinates (RA/Dec) directly from astronomical calculations without zodiacal conversion.',
    whenToUse: 'When astronomical precision is preferred over astrological tradition.',
    advantages: [
      'Reflects actual sky positions',
      'Astronomically accurate coordinates',
      'No precession-related discrepancies',
      'Matches what you would see with a telescope'
    ],
    considerations: [
      'May not align perfectly with zodiacal interpretations',
      'Less commonly used in traditional astrology',
      'Can show subtle differences from zodiacal methods',
      'Requires understanding of astronomical vs astrological coordinates'
    ]
  }
};

export interface CalculationSettings {
  method: CalculationMethod;
  houseSystem: 'placidus' | 'koch' | 'whole_sign' | 'equal';
  orbSettings: {
    acgLines: number;      // Orb of influence for AC/MC lines in miles (175-250 standard)
    parans: number;        // Orb of influence for parans in miles (70-75 standard)
  };
  precisionLevel: 'fast' | 'standard' | 'high';
  includeMinorPlanets: boolean;
}

export const DEFAULT_CALCULATION_SETTINGS: CalculationSettings = {
  method: 'zodiacal',  // Our current implementation
  houseSystem: 'placidus',
  orbSettings: {
    acgLines: 200,  // miles
    parans: 75      // miles
  },
  precisionLevel: 'standard',
  includeMinorPlanets: false
};

export interface MethodComparisonResult {
  zodiacalLines: unknown[];
  inMundoLines: unknown[];
  discrepancies: Array<{
    planet: string;
    lineType: string;
    maxDifference: number; // miles
    averageDifference: number; // miles
  }>;
  recommendation: string;
}

/**
 * Get user-friendly explanation of current calculation method
 */
export function getCalculationMethodExplanation(method: CalculationMethod): {
  summary: string;
  technical: string;
  userNote: string;
} {
  const methodInfo = CALCULATION_METHODS[method];
  
  // Handle invalid method gracefully
  if (!methodInfo) {
    return {
      summary: 'Using standard calculation method',
      technical: 'Standard astrological calculation approach',
      userNote: 'This is the standard method used by most professional astrology software.'
    };
  }
  
  return {
    summary: `Using ${methodInfo.name}: ${methodInfo.description}`,
    technical: methodInfo.technicalDetails,
    userNote: method === 'zodiacal' 
      ? 'This is the standard method used by most professional astrology software and aligns with your natal chart calculations.'
      : 'This method uses precise astronomical coordinates and may show slight differences from traditional astrological calculations.'
  };
}