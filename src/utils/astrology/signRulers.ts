/**
 * Traditional planetary rulers and astrology constants
 */

export type PlanetName = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
export type SignName = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 
                       'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/**
 * Traditional planetary rulerships (pre-modern astrology)
 */
export const TRADITIONAL_SIGN_RULERS: Record<SignName, PlanetName> = {
  aries: 'mars',
  taurus: 'venus', 
  gemini: 'mercury',
  cancer: 'moon',
  leo: 'sun',
  virgo: 'mercury',
  libra: 'venus',
  scorpio: 'mars',
  sagittarius: 'jupiter',
  capricorn: 'saturn',
  aquarius: 'saturn',
  pisces: 'jupiter'
};

/**
 * Sign names in order (starting with Aries)
 */
export const SIGN_NAMES: SignName[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

/**
 * Get traditional ruler for a zodiac sign
 */
export const getSignRuler = (signName: SignName): PlanetName => {
  return TRADITIONAL_SIGN_RULERS[signName];
};

/**
 * Get traditional ruler for a zodiac sign by index (0-11)
 */
export const getSignRulerByIndex = (signIndex: number): PlanetName => {
  const signName = SIGN_NAMES[signIndex % 12];
  return TRADITIONAL_SIGN_RULERS[signName];
};

/**
 * Get sign name by index (0-11)
 */
export const getSignNameByIndex = (signIndex: number): SignName => {
  return SIGN_NAMES[signIndex % 12];
};

/**
 * Get sign name from longitude (0-360 degrees)
 */
export const getSignNameFromLongitude = (longitude: number): SignName => {
  const signIndex = Math.floor(longitude / 30);
  return getSignNameByIndex(signIndex);
};

/**
 * Get traditional ruler from longitude (0-360 degrees)
 */
export const getRulerFromLongitude = (longitude: number): PlanetName => {
  const signName = getSignNameFromLongitude(longitude);
  return getSignRuler(signName);
};