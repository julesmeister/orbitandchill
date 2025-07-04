/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astrological Event Data
 * 
 * This module contains all constants, mappings, and helper functions
 * related to astrological event detection including colors, rarity
 * classifications, sign themes, and conjunction analysis.
 */

// Event type colors for UI display
export const EVENT_TYPE_COLORS = {
  eclipse: '#ff6b6b',
  stellium: '#6b4ce6',
  grandTrine: '#4ce66b',
  alignment: '#e6d94c',
  retrograde: '#ff9f40',
  conjunction: '#40c4ff',
  moonPhase: '#c084fc',
  voidMoon: '#64748b'
};

// Rarity classification with frequency indicators
export const RARITY_BADGES = {
  common: { text: 'Common', color: '#6b7280' },         // Every few weeks/months
  uncommon: { text: 'Uncommon', color: '#3b82f6' },   // Every 1-2 years  
  rare: { text: 'Rare', color: '#8b5cf6' },           // Every 12-45 years
  veryRare: { text: 'Very Rare', color: '#ec4899' }   // Every 100+ years
};

// Astrological sign themes and keywords
export const SIGN_THEMES: Record<string, string> = {
  aries: 'leadership, courage, new beginnings',
  taurus: 'stability, material security, sensuality',
  gemini: 'communication, learning, adaptability',
  cancer: 'home, family, emotional security',
  leo: 'creativity, self-expression, confidence',
  virgo: 'organization, health, practical service',
  libra: 'relationships, balance, beauty',
  scorpio: 'transformation, depth, hidden truths',
  sagittarius: 'adventure, philosophy, expansion',
  capricorn: 'achievement, structure, responsibility',
  aquarius: 'innovation, community, humanitarian ideals',
  pisces: 'spirituality, compassion, imagination'
};

// Elemental themes for astrological analysis
export const ELEMENT_THEMES: Record<string, string> = {
  Fire: 'passion, inspiration, and action',
  Earth: 'practicality, stability, and manifestation',
  Air: 'communication, ideas, and social connection',
  Water: 'intuition, emotion, and healing'
};

// Sign to element mapping
export const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'Fire', leo: 'Fire', sagittarius: 'Fire',
  taurus: 'Earth', virgo: 'Earth', capricorn: 'Earth',
  gemini: 'Air', libra: 'Air', aquarius: 'Air',
  cancer: 'Water', scorpio: 'Water', pisces: 'Water'
};

// Detailed conjunction impact interpretations
export const CONJUNCTION_IMPACTS: Record<string, string> = {
  // Great Conjunction (every ~20 years)
  'jupiter-saturn': 'Major societal shifts and new structures, generational change',
  
  // Spiritual/Creative combinations
  'jupiter-neptune': 'Spiritual awakening and creative breakthroughs',
  'venus-neptune': 'Heightened romance, artistic inspiration, spiritual love',
  
  // Transformation combinations
  'saturn-pluto': 'Transformation of structures and power, breakdown and rebuild',
  'jupiter-pluto': 'Expansion through transformation, powerful growth',
  'mars-pluto': 'Intense willpower, transformation through action',
  
  // Innovation combinations
  'saturn-uranus': 'Revolutionary changes in structures, old vs new',
  'jupiter-uranus': 'Sudden expansion, breakthrough opportunities',
  'mars-uranus': 'Sudden action, revolutionary energy, liberation',
  
  // Deep transformation (very rare)
  'saturn-neptune': 'Dissolving old structures, spiritual materialism, reality shifts',
  'uranus-neptune': 'Spiritual revolution, technological mysticism (generational)',
  'uranus-pluto': 'Revolutionary transformation, radical change (generational)',
  'neptune-pluto': 'Collective spiritual transformation (generational)',
  
  // Personal planet combinations
  'venus-mars': 'Harmony between love and passion, magnetic attraction',
  'mercury-venus': 'Beautiful communication and artistic expression',
  'sun-mercury': 'Enhanced communication and mental clarity',
  'sun-venus': 'Increased charm, creativity, and social appeal',
  'mercury-mars': 'Sharp thinking, decisive communication, mental energy'
};

// Complete zodiac sign list in order
export const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// Helper functions for astrological event analysis

/**
 * Get thematic keywords for a zodiac sign
 */
export const getSignThemes = (sign: string): string => {
  return SIGN_THEMES[sign.toLowerCase()] || 'personal growth';
};

/**
 * Get the elemental classification of a zodiac sign
 */
export const getElementFromSign = (sign: string): string => {
  return SIGN_ELEMENTS[sign.toLowerCase()] || 'Mixed';
};

/**
 * Get thematic keywords for an element
 */
export const getElementThemes = (element: string): string => {
  return ELEMENT_THEMES[element] || 'personal development';
};

/**
 * Determine the rarity of a planetary conjunction based on astronomical cycles
 */
export const getConjunctionRarity = (planet1: string, planet2: string): 'common' | 'uncommon' | 'rare' | 'veryRare' => {
  const p1Lower = planet1.toLowerCase();
  const p2Lower = planet2.toLowerCase();
  
  // Define planet categories by speed and significance
  const innerPlanets = ['mercury', 'venus', 'mars'];
  const socialPlanets = ['jupiter', 'saturn'];
  const outerPlanets = ['uranus', 'neptune', 'pluto'];
  
  // Specific rare combinations based on astronomical cycles
  const veryRarePairs = [
    ['uranus', 'neptune'],    // ~171 years
    ['uranus', 'pluto'],      // ~142 years 
    ['neptune', 'pluto']      // ~492 years
  ];
  
  const rarePairs = [
    ['jupiter', 'saturn'],    // ~20 years (Great Conjunction)
    ['saturn', 'uranus'],     // ~45 years
    ['saturn', 'neptune'],    // ~36 years
    ['saturn', 'pluto'],      // ~33 years
    ['jupiter', 'uranus'],    // ~14 years
    ['jupiter', 'neptune'],   // ~13 years
    ['jupiter', 'pluto']      // ~12 years
  ];
  
  // Check if this specific pair is very rare
  const isVeryRare = veryRarePairs.some(([a, b]) => 
    (p1Lower === a && p2Lower === b) || (p1Lower === b && p2Lower === a)
  );
  
  if (isVeryRare) return 'veryRare';
  
  // Check if this specific pair is rare
  const isRare = rarePairs.some(([a, b]) => 
    (p1Lower === a && p2Lower === b) || (p1Lower === b && p2Lower === a)
  );
  
  if (isRare) return 'rare';
  
  // Social + outer planet combinations
  if ((socialPlanets.includes(p1Lower) && outerPlanets.includes(p2Lower)) ||
      (outerPlanets.includes(p1Lower) && socialPlanets.includes(p2Lower))) {
    return 'uncommon';
  }
  
  // Inner planet combinations
  if (innerPlanets.includes(p1Lower) && innerPlanets.includes(p2Lower)) {
    return 'common';
  }
  
  // Default for other combinations
  return 'uncommon';
};

/**
 * Get the astrological impact description for a planetary conjunction
 */
export const getConjunctionImpact = (planet1: string, planet2: string): string => {
  const key1 = `${planet1.toLowerCase()}-${planet2.toLowerCase()}`;
  const key2 = `${planet2.toLowerCase()}-${planet1.toLowerCase()}`;
  
  return CONJUNCTION_IMPACTS[key1] || CONJUNCTION_IMPACTS[key2] || 
    `${planet1.charAt(0).toUpperCase() + planet1.slice(1)} and ${planet2.charAt(0).toUpperCase() + planet2.slice(1)} energies blend, creating new opportunities for growth`;
};

/**
 * Get the next zodiac sign in the sequence
 */
export const getNextSign = (currentSign: string): string => {
  const currentIndex = ZODIAC_SIGNS.indexOf(currentSign.toLowerCase());
  return ZODIAC_SIGNS[(currentIndex + 1) % 12];
};