/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Matrix of Destiny calculation utilities
 * Based on the Russian Matrix of Destiny system by Natalia Ladini (2006)
 */

export interface MatrixCalculation {
  positions: Record<string, number>;
  diagonalSquare: {
    A: number; // Left (Day)
    B: number; // Top (Month) 
    C: number; // Right (Year)
    D: number; // Bottom (Karma)
  };
  straightSquare: {
    F: number; // Top-left
    G: number; // Top-right
    H: number; // Bottom-right
    I: number; // Bottom-left
  };
  centers: {
    E: number; // Comfort zone
    J: number; // Past life mistakes
  };
  karmicTail: {
    d1: number; // Left - Paternal karma
    d2: number; // Center - Combined karma
    d: number;  // Right - Reputation
  };
  innerElements: {
    // Primary Inner Elements (Layer 1)
    heart: number; // Heart/Wishes position
    talent: number; // Natural talents and abilities
    guard: number; // Blockages and challenges
    earthPurpose: number; // Material world purpose
    
    // Secondary Inner Elements (Layer 2)
    shadowAspects: number; // Hidden challenges
    spiritualGifts: number; // Spiritual abilities
    karmicLessons: number; // Deep karmic patterns
    
    // Love Line Elements
    pastKarma: number; // As a parent influences
    heartDesire: number; // Core soul desires
    partnershipPotential: number; // Relationship compatibility
    
    // Money Line Elements
    materialKarma: number; // Financial lessons
    financialTalents: number; // Money-making abilities
    prosperityFlow: number; // Wealth consciousness
    spiritualWealth: number; // Higher abundance relationship
    
    // Chakra System Elements
    rootChakra: number; // Present Life Task/survival
    sacralChakra: number; // Creativity/sexuality
    solarPlexusChakra: number; // Personal power
    heartChakra: number; // Love/compassion
    throatChakra: number; // Communication/truth
    thirdEyeChakra: number; // Intuition/wisdom
    crownChakra: number; // Spiritual connection
    
    // Ancestral and Lineage Elements
    paternalLine: number; // Male lineage influence
    maternalLine: number; // Female lineage influence
    balancePoint: number; // Integration point
    ancestralWisdom: number; // Generational gifts
    ancestralHealing: number; // Lineage patterns to heal
  };
  purposes: {
    skypoint: number; // Sky energy
    earthpoint: number; // Earth energy
    perspurpose: number; // Personal purpose
    femalepoint: number; // Female energy
    malepoint: number; // Male energy
    socialpurpose: number; // Social purpose
    generalpurpose: number; // General purpose
    planetarypurpose: number; // Planetary purpose
  };
  yearlyCalculations?: Record<string, number>; // Age-based calculations
}

/**
 * Core reduction algorithm - reduces numbers > 22 by summing digits ONCE
 * Based on the original Russian Matrix of Destiny implementation
 */
export const reduceNumber = (number: number): number => {
  let num = number;
  if (number > 22) {
    num = (number % 10) + Math.floor(number / 10);
  }
  return num;
};

/**
 * Calculate year sum - sums all digits in a year
 */
export const calculateYear = (year: number): number => {
  let sum = 0;
  let yearNum = year;
  while (yearNum > 0) {
    sum += yearNum % 10;
    yearNum = Math.floor(yearNum / 10);
  }
  return reduceNumber(sum);
};

/**
 * Calculate all Matrix of Destiny points and positions
 */
export const calculateMatrixOfDestiny = (birthDate: string): MatrixCalculation => {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Extract and reduce base numbers (following exact reference implementation)
  const aPoint = reduceNumber(day);      // Reputation - reduced
  const bPoint = month;                   // Inspiration - NOT reduced, used directly
  const cPoint = calculateYear(year);     // Money block - sum all digits then reduce
  
  // Calculate all positions using the reference implementation logic
  const dpoint = reduceNumber(aPoint + bPoint + cPoint);
  const epoint = reduceNumber(aPoint + bPoint + cPoint + dpoint);
  const fpoint = reduceNumber(aPoint + bPoint);
  const gpoint = reduceNumber(bPoint + cPoint);
  const hpoint = reduceNumber(dpoint + aPoint);  // Correct: D + A
  const ipoint = reduceNumber(cPoint + dpoint);
  const jpoint = reduceNumber(dpoint + epoint);

  // Additional inner positions (following exact reference order)
  const npoint = reduceNumber(cPoint + epoint);
  const lpoint = reduceNumber(jpoint + npoint);
  const mpoint = reduceNumber(lpoint + npoint);
  const kpoint = reduceNumber(jpoint + lpoint);

  const qpoint = reduceNumber(npoint + cPoint);
  const rpoint = reduceNumber(jpoint + dpoint);
  const spoint = reduceNumber(aPoint + epoint);
  const tpoint = reduceNumber(bPoint + epoint);

  const opoint = reduceNumber(aPoint + spoint);
  const ppoint = reduceNumber(bPoint + tpoint);

  const upoint = reduceNumber(fpoint + gpoint + hpoint + ipoint);
  const vpoint = reduceNumber(epoint + upoint);
  const wpoint = reduceNumber(spoint + epoint);
  const xpoint = reduceNumber(tpoint + epoint);

  const f2point = reduceNumber(fpoint + upoint);
  const f1point = reduceNumber(fpoint + f2point);
  const g2point = reduceNumber(gpoint + upoint);
  const g1point = reduceNumber(gpoint + g2point);
  const i2point = reduceNumber(ipoint + upoint);
  const i1point = reduceNumber(ipoint + i2point);
  const h2point = reduceNumber(hpoint + upoint);
  const h1point = reduceNumber(hpoint + h2point);

  // Purpose calculations
  const skypoint = reduceNumber(bPoint + dpoint);
  const earthpoint = reduceNumber(aPoint + cPoint);
  const perspurpose = reduceNumber(skypoint + earthpoint);
  const femalepoint = reduceNumber(gpoint + hpoint);
  const malepoint = reduceNumber(fpoint + ipoint);
  const socialpurpose = reduceNumber(femalepoint + malepoint);
  const generalpurpose = reduceNumber(perspurpose + socialpurpose);
  const planetarypurpose = reduceNumber(socialpurpose + generalpurpose);

  // Diagonal square (rhombus) - personal energies
  const diagonalSquare = {
    A: aPoint,        // Left - Reputation
    B: bPoint,        // Top - Inspiration  
    C: cPoint,        // Right - Money block
    D: dpoint         // Bottom - Biggest obstacle in life
  };

  // Straight square - ancestral energies
  const straightSquare = {
    F: fpoint,        // Top-left
    G: gpoint,        // Top-right
    H: hpoint,        // Bottom-right (D + A)
    I: ipoint         // Bottom-left
  };

  // Centers
  const centers = {
    E: epoint,        // Comfort zone
    J: jpoint         // Past life mistakes
  };

  // Karmic tail
  const karmicTail = {
    d1: fpoint,       // Left - Paternal karma
    d2: f1point,      // Center - Combined karma
    d: aPoint         // Right - Reputation
  };

  // Calculate inner elements
  const heart = reduceNumber(epoint + gpoint); // E + G (Heart/Wishes)
  const talent = gpoint; // G position (Heart's desire)
  const guard = reduceNumber(aPoint + epoint); // A + E (Blockages)
  const earthPurpose = reduceNumber(aPoint + cPoint); // A + C (Material purpose)
  
  // Secondary Inner Elements
  const shadowAspects = reduceNumber(dpoint + epoint); // D + E (Hidden challenges)
  const spiritualGifts = reduceNumber(bPoint + epoint); // B + E (Spiritual abilities)
  const karmicLessons = reduceNumber(cPoint + dpoint); // C + D (Deep patterns)
  
  // Love Line Elements
  const pastKarma = reduceNumber(fpoint + aPoint); // As a parent influences
  const heartDesire = reduceNumber(epoint + bPoint); // Core soul desires
  const partnershipPotential = reduceNumber(fpoint + gpoint); // Relationship compatibility
  
  // Money Line Elements
  const materialKarma = reduceNumber(hpoint + dpoint); // Financial lessons
  const financialTalents = reduceNumber(cPoint + talent); // Money-making abilities
  const prosperityFlow = reduceNumber(gpoint + hpoint); // Wealth consciousness
  const spiritualWealth = reduceNumber(bPoint + fpoint); // Higher abundance relationship
  
  // Chakra System Elements
  const rootChakra = reduceNumber(dpoint + ipoint); // Present Life Task/survival
  const sacralChakra = reduceNumber(hpoint + cPoint); // Creativity/sexuality
  const solarPlexusChakra = reduceNumber(cPoint + epoint); // Personal power
  const heartChakra = reduceNumber(epoint + heart); // Love/compassion
  const throatChakra = reduceNumber(aPoint + fpoint); // Communication/truth
  const thirdEyeChakra = reduceNumber(fpoint + bPoint); // Intuition/wisdom
  const crownChakra = reduceNumber(bPoint + dpoint); // Spiritual connection
  
  // Ancestral and Lineage Elements
  const paternalLine = reduceNumber(fpoint + hpoint); // Male lineage influence
  const maternalLine = reduceNumber(gpoint + ipoint); // Female lineage influence
  const balancePoint = reduceNumber(paternalLine + maternalLine); // Integration point
  const ancestralWisdom = reduceNumber(fpoint + gpoint); // Generational gifts
  const ancestralHealing = reduceNumber(ipoint + hpoint); // Lineage patterns to heal

  return {
    positions: {
      // Main octagram positions
      A: aPoint,
      B: bPoint,
      C: cPoint,
      D: dpoint,
      E: epoint,
      F: fpoint,
      G: gpoint,
      H: hpoint,
      I: ipoint,
      J: jpoint,
      K: kpoint,
      L: lpoint,
      M: mpoint,
      N: npoint,
      O: opoint,
      P: ppoint,
      Q: qpoint,
      R: rpoint,
      S: spoint,
      T: tpoint,
      U: upoint,
      V: vpoint,
      W: wpoint,
      X: xpoint,
      // Extended family line positions
      F1: f1point,
      F2: f2point,
      G1: g1point,
      G2: g2point,
      H1: h1point,
      H2: h2point,
      I1: i1point,
      I2: i2point,
    },
    diagonalSquare,
    straightSquare,
    centers,
    karmicTail,
    innerElements: {
      // Primary Inner Elements
      heart,
      talent,
      guard,
      earthPurpose,
      
      // Secondary Inner Elements
      shadowAspects,
      spiritualGifts,
      karmicLessons,
      
      // Love Line Elements
      pastKarma,
      heartDesire,
      partnershipPotential,
      
      // Money Line Elements
      materialKarma,
      financialTalents,
      prosperityFlow,
      spiritualWealth,
      
      // Chakra System Elements
      rootChakra,
      sacralChakra,
      solarPlexusChakra,
      heartChakra,
      throatChakra,
      thirdEyeChakra,
      crownChakra,
      
      // Ancestral and Lineage Elements
      paternalLine,
      maternalLine,
      balancePoint,
      ancestralWisdom,
      ancestralHealing
    },
    purposes: {
      skypoint,
      earthpoint,
      perspurpose,
      femalepoint,
      malepoint,
      socialpurpose,
      generalpurpose,
      planetarypurpose
    }
  };
};

/**
 * Calculate age-based yearly progressions (for advanced analysis)
 */
export const calculateYearlyProgressions = (
  birthDate: string,
  currentAge?: number
): Record<string, number> => {
  const matrixData = calculateMatrixOfDestiny(birthDate);
  const yearlyCalcs: Record<string, number> = {};
  
  // This would include age-based calculations similar to the reference implementation
  // For now, we'll include the basic structure
  
  return yearlyCalcs;
};

/**
 * Validate birth date input
 */
export const validateBirthDate = (birthDate: string): boolean => {
  const date = new Date(birthDate);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Check if date is not in the future
  if (date > today) {
    return false;
  }
  
  // Check if date is not more than 120 years ago
  const maxAge = 120;
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  if (date < minDate) {
    return false;
  }
  
  return true;
};