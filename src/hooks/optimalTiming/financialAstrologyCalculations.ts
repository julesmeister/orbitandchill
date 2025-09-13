/* eslint-disable @typescript-eslint/no-explicit-any */
// Real astrological calculations for financial astrology (replacing all simulations)

import { ChartAspect, PlanetPosition } from '../../utils/natalChart';

// Jupiter sector mappings based on Grace Morris methodology
const JUPITER_SECTOR_MAPPINGS = {
  'aries': ['Defense', 'Military', 'Sports', 'Energy', 'Mining', 'Steel'],
  'taurus': ['Banking', 'Real Estate', 'Agriculture', 'Food', 'Luxury Goods', 'Art'],
  'gemini': ['Communication', 'Transportation', 'Social Media', 'Internet', 'Publishing', 'Education'],
  'cancer': ['Housing', 'Real Estate', 'Food Services', 'Healthcare', 'Family Services'],
  'leo': ['Entertainment', 'Gaming', 'Luxury', 'Gold', 'Children Products', 'Performance'],
  'virgo': ['Healthcare', 'Pharmaceuticals', 'Analytics', 'Service Industry', 'Agriculture'],
  'libra': ['Legal Services', 'Beauty', 'Art', 'Partnerships', 'Diplomacy', 'Fashion'],
  'scorpio': ['Insurance', 'Investigation', 'Transformation', 'Mining', 'Waste Management'],
  'sagittarius': ['International Trade', 'Higher Education', 'Publishing', 'Travel', 'Philosophy'],
  'capricorn': ['Government', 'Corporate', 'Infrastructure', 'Time-based Services'],
  'aquarius': ['Technology', 'Innovation', 'Networking', 'Humanitarian', 'Revolutionary Tech'],
  'pisces': ['Spirituality', 'Film', 'Music', 'Charity', 'Oil', 'Chemicals', 'Beverages']
};

// Saturn restriction mappings (sectors to avoid)
const SATURN_RESTRICTION_MAPPINGS = {
  'aries': ['capricorn'], // Saturn opposes/restricts Capricorn sectors when in Aries
  'taurus': ['aquarius'],
  'gemini': ['pisces'],
  'cancer': ['aries'],
  'leo': ['taurus'],
  'virgo': ['gemini'],
  'libra': ['cancer'],
  'scorpio': ['leo'],
  'sagittarius': ['virgo'],
  'capricorn': ['libra'],
  'aquarius': ['scorpio'],
  'pisces': ['sagittarius']
};

/**
 * Get Jupiter's current favored sectors based on its zodiac sign
 */
export const getJupiterFavoredSectors = (jupiterSign: string): string[] => {
  const sign = jupiterSign.toLowerCase();
  return JUPITER_SECTOR_MAPPINGS[sign as keyof typeof JUPITER_SECTOR_MAPPINGS] || [];
};

/**
 * Get sectors to avoid based on Saturn's current position
 */
export const getSaturnRestrictedSectors = (saturnSign: string): string[] => {
  const sign = saturnSign.toLowerCase();
  const restrictedSigns = SATURN_RESTRICTION_MAPPINGS[sign as keyof typeof SATURN_RESTRICTION_MAPPINGS] || [];
  
  // Get all sectors for the restricted signs
  return restrictedSigns.flatMap(restrictedSign => 
    JUPITER_SECTOR_MAPPINGS[restrictedSign as keyof typeof JUPITER_SECTOR_MAPPINGS] || []
  );
};

/**
 * Check if current timing involves Jupiter-favored sectors
 */
export const isJupiterFavoredTiming = (chartData: any, title: string, description: string): boolean => {
  const jupiter = chartData.planets.find((p: any) => p.name === 'jupiter');
  if (!jupiter?.sign) return false;
  
  const favoredSectors = getJupiterFavoredSectors(jupiter.sign);
  const content = `${title} ${description}`.toLowerCase();
  
  return favoredSectors.some(sector => 
    content.includes(sector.toLowerCase()) ||
    // Check for house correlations
    (sector === 'Communication' && (content.includes('3rd') || content.includes('mercury'))) ||
    (sector === 'Real Estate' && (content.includes('4th') || content.includes('2nd'))) ||
    (sector === 'Entertainment' && (content.includes('5th') || content.includes('venus'))) ||
    (sector === 'Healthcare' && (content.includes('6th') || content.includes('virgo')))
  );
};

/**
 * Calculate if we're in a planetary ingress window (3 weeks before/after sign change)
 */
export const calculateIngressWindows = (eventDate: Date, chartData: any): { planet: string; daysFromIngress: number } | null => {
  // Calculate approximate ingress timing based on planetary positions
  // This is a simplified calculation - in production, use precise ephemeris data
  
  const planets = ['jupiter', 'saturn', 'mars', 'venus'];
  
  for (const planetName of planets) {
    const planet = chartData.planets.find((p: any) => p.name === planetName);
    if (!planet?.longitude) continue;
    
    // Check if planet is near sign boundary (0° or 30° marks)
    const degreeInSign = planet.longitude % 30;
    const isNearStart = degreeInSign <= 3; // Within 3 degrees of sign start
    const isNearEnd = degreeInSign >= 27; // Within 3 degrees of sign end
    
    if (isNearStart || isNearEnd) {
      // Calculate days from ingress (approximation)
      const daysFromIngress = isNearStart ? 
        Math.round(degreeInSign * 2) : // About 2 days per degree
        Math.round((30 - degreeInSign) * 2);
      
      // Only flag if within 21 days (3 weeks)
      if (daysFromIngress <= 21) {
        return {
          planet: planetName.charAt(0).toUpperCase() + planetName.slice(1),
          daysFromIngress
        };
      }
    }
  }
  
  return null;
};

/**
 * Calculate real Void of Course Moon periods using lunar aspects
 */
export const calculateVoidOfCourseMoon = (eventDate: Date, chartData: any): { isVoidMoon: boolean; hasDeclinationSupport: boolean } => {
  const moon = chartData.planets.find((p: any) => p.name === 'moon');
  if (!moon?.longitude) return { isVoidMoon: false, hasDeclinationSupport: false };
  
  // Check if Moon makes any major aspects before changing signs
  const moonDegreeInSign = moon.longitude % 30;
  const distanceToNextSign = 30 - moonDegreeInSign;
  
  // Moon is void if it's in the last few degrees of a sign with no upcoming aspects
  // This is a simplified check - real implementation would need precise aspect orbs
  const isLikelyVoidPeriod = distanceToNextSign <= 2; // Last 2 degrees of sign
  
  if (!isLikelyVoidPeriod) {
    return { isVoidMoon: false, hasDeclinationSupport: false };
  }
  
  // Check for upcoming aspects within next 2 degrees of Moon's movement
  const hasUpcomingAspects = chartData.aspects?.some((aspect: ChartAspect) => {
    if (aspect.planet1 !== 'moon' && aspect.planet2 !== 'moon') return false;
    // If orb is very tight (< 1 degree), Moon hasn't made the aspect yet
    return aspect.orb < 1.0;
  });
  
  const isVoidMoon = !hasUpcomingAspects;
  
  // Check for declination aspects (parallel/contraparallel)
  // In real implementation, calculate declinations and check for aspects
  // For now, use a heuristic based on Moon's position
  const hasDeclinationSupport = isVoidMoon && (moonDegreeInSign % 7 === 0); // Simplified check
  
  return { isVoidMoon, hasDeclinationSupport };
};

/**
 * Calculate economic cycle phase based on outer planet positions
 */
export const calculateEconomicCyclePhase = (chartData: any, score: number): string => {
  const jupiter = chartData.planets.find((p: any) => p.name === 'jupiter');
  const saturn = chartData.planets.find((p: any) => p.name === 'saturn');
  const pluto = chartData.planets.find((p: any) => p.name === 'pluto');
  
  // Check for major economic cycle indicators
  let expansionIndicators = 0;
  let contractionIndicators = 0;
  
  // Jupiter indicators (expansion)
  if (jupiter?.sign) {
    const expansiveJupiterSigns = ['aries', 'leo', 'sagittarius', 'gemini', 'libra', 'aquarius'];
    if (expansiveJupiterSigns.includes(jupiter.sign.toLowerCase())) {
      expansionIndicators += 1;
    }
  }
  
  // Saturn indicators (contraction/structure)
  if (saturn?.sign) {
    const restrictiveSaturnSigns = ['capricorn', 'aquarius', 'virgo'];
    if (restrictiveSaturnSigns.includes(saturn.sign.toLowerCase())) {
      contractionIndicators += 1;
    }
  }
  
  // Pluto indicators (transformation)
  if (pluto?.sign) {
    // Pluto in Capricorn (ending) vs Aquarius (beginning) - major economic shift
    if (pluto.sign.toLowerCase() === 'capricorn') {
      contractionIndicators += 1; // End of plutocrat era
    } else if (pluto.sign.toLowerCase() === 'aquarius') {
      expansionIndicators += 1; // Common man era beginning
    }
  }
  
  // Use score as tiebreaker
  const totalExpansion = expansionIndicators + (score >= 6 ? 1 : 0);
  const totalContraction = contractionIndicators + (score <= 4 ? 1 : 0);
  
  if (totalExpansion > totalContraction) {
    return 'expansion';
  } else if (totalContraction > totalExpansion) {
    return 'consolidation';
  } else {
    return score >= 5 ? 'expansion' : 'consolidation';
  }
};

/**
 * Detect Magic Formula (Sun-Jupiter-Pluto) aspects with proper orbs
 * Returns detailed information about formula availability and astronomical context
 */
export const detectMagicFormula = (chartData: any): { 
  hasFullFormula: boolean; 
  hasPartialFormula: boolean; 
  formulaType: string;
  astronomicalContext: {
    jupiterPlutoSeparation: number;
    isJupiterPlutoInOrb: boolean;
    nextJupiterPlutoConjunction: string;
    individualBonuses: {
      jupiterAspects: number;
      plutoAspects: number;
    };
  };
} => {
  const sun = chartData.planets.find((p: any) => p.name === 'sun');
  const jupiter = chartData.planets.find((p: any) => p.name === 'jupiter');
  const pluto = chartData.planets.find((p: any) => p.name === 'pluto');
  
  if (!sun?.longitude || !jupiter?.longitude || !pluto?.longitude) {
    return { 
      hasFullFormula: false, 
      hasPartialFormula: false, 
      formulaType: 'none',
      astronomicalContext: {
        jupiterPlutoSeparation: 0,
        isJupiterPlutoInOrb: false,
        nextJupiterPlutoConjunction: 'Unknown - planetary data incomplete',
        individualBonuses: { jupiterAspects: 0, plutoAspects: 0 }
      }
    };
  }
  
  // Calculate Jupiter-Pluto separation for astronomical context
  let jupiterPlutoSeparation = Math.abs(jupiter.longitude - pluto.longitude);
  if (jupiterPlutoSeparation > 180) {
    jupiterPlutoSeparation = 360 - jupiterPlutoSeparation;
  }
  
  // Determine next Jupiter-Pluto conjunction timing (approximate)
  let nextConjunctionInfo = '';
  if (jupiterPlutoSeparation < 30) {
    nextConjunctionInfo = 'Within conjunction orb (~2020-2023 era)';
  } else if (jupiterPlutoSeparation < 90) {
    nextConjunctionInfo = 'Building toward next conjunction (~2033)';
  } else if (jupiterPlutoSeparation < 180) {
    nextConjunctionInfo = 'Opposition phase - next conjunction ~2033-2035';
  } else {
    nextConjunctionInfo = 'Next conjunction cycle ~2033-2035';
  }
  
  // Count individual aspect bonuses
  const jupiterAspects = chartData.aspects?.filter((a: any) => 
    (a.planet1 === 'jupiter' || a.planet2 === 'jupiter') && a.orb <= 8
  ).length || 0;
  
  const plutoAspects = chartData.aspects?.filter((a: any) => 
    (a.planet1 === 'pluto' || a.planet2 === 'pluto') && a.orb <= 8
  ).length || 0;
  
  // Check for aspects using proper orb calculations
  const hasSunJupiterAspect = chartData.aspects?.some((a: any) => 
    ((a.planet1 === 'sun' && a.planet2 === 'jupiter') || (a.planet1 === 'jupiter' && a.planet2 === 'sun')) &&
    a.orb <= 8 // Reasonable orb for major aspects
  );
  
  const hasJupiterPlutoAspect = chartData.aspects?.some((a: any) => 
    ((a.planet1 === 'jupiter' && a.planet2 === 'pluto') || (a.planet1 === 'pluto' && a.planet2 === 'jupiter')) &&
    a.orb <= 8
  );
  
  const hasSunPlutoAspect = chartData.aspects?.some((a: any) => 
    ((a.planet1 === 'sun' && a.planet2 === 'pluto') || (a.planet1 === 'pluto' && a.planet2 === 'sun')) &&
    a.orb <= 8
  );
  
  const hasFullFormula = hasSunJupiterAspect && hasJupiterPlutoAspect && hasSunPlutoAspect;
  const hasPartialFormula = hasJupiterPlutoAspect && (hasSunJupiterAspect || hasSunPlutoAspect);
  
  let formulaType = 'none';
  if (hasFullFormula) {
    formulaType = 'full';
  } else if (hasPartialFormula) {
    formulaType = 'partial';
  }
  
  return { 
    hasFullFormula, 
    hasPartialFormula, 
    formulaType,
    astronomicalContext: {
      jupiterPlutoSeparation: Math.round(jupiterPlutoSeparation * 10) / 10, // Round to 1 decimal
      isJupiterPlutoInOrb: hasJupiterPlutoAspect,
      nextJupiterPlutoConjunction: nextConjunctionInfo,
      individualBonuses: {
        jupiterAspects,
        plutoAspects
      }
    }
  };
};

/**
 * Check if timing favors sectors restricted by Saturn
 */
export const isSaturnRestrictedTiming = (chartData: any, title: string, description: string): boolean => {
  const saturn = chartData.planets.find((p: any) => p.name === 'saturn');
  if (!saturn?.sign) return false;
  
  const restrictedSectors = getSaturnRestrictedSectors(saturn.sign);
  const content = `${title} ${description}`.toLowerCase();
  
  return restrictedSectors.some(sector => content.includes(sector.toLowerCase()));
};