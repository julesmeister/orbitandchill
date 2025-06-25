/**
 * Astrological elements and modalities
 */

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

/**
 * Elements in order (Fire, Earth, Air, Water cycle)
 */
export const ELEMENTS: Element[] = ['Fire', 'Earth', 'Air', 'Water'];

/**
 * Modalities in order (Cardinal, Fixed, Mutable cycle)
 */
export const MODALITIES: Modality[] = ['Cardinal', 'Fixed', 'Mutable'];

/**
 * Get element for a zodiac sign by index (0-11)
 */
export const getElementByIndex = (signIndex: number): Element => {
  return ELEMENTS[signIndex % 4];
};

/**
 * Get modality for a zodiac sign by index (0-11)
 */
export const getModalityByIndex = (signIndex: number): Modality => {
  return MODALITIES[signIndex % 3];
};

/**
 * Get element from longitude (0-360 degrees)
 */
export const getElementFromLongitude = (longitude: number): Element => {
  const signIndex = Math.floor(longitude / 30);
  return getElementByIndex(signIndex);
};

/**
 * Get modality from longitude (0-360 degrees)
 */
export const getModalityFromLongitude = (longitude: number): Modality => {
  const signIndex = Math.floor(longitude / 30);
  return getModalityByIndex(signIndex);
};

/**
 * Element characteristics
 */
export const ELEMENT_CHARACTERISTICS = {
  Fire: {
    keywords: ['Energy', 'Action', 'Enthusiasm', 'Leadership'],
    signs: ['Aries', 'Leo', 'Sagittarius']
  },
  Earth: {
    keywords: ['Practical', 'Stable', 'Material', 'Grounded'],
    signs: ['Taurus', 'Virgo', 'Capricorn']
  },
  Air: {
    keywords: ['Mental', 'Social', 'Communication', 'Ideas'],
    signs: ['Gemini', 'Libra', 'Aquarius']
  },
  Water: {
    keywords: ['Emotional', 'Intuitive', 'Sensitive', 'Psychic'],
    signs: ['Cancer', 'Scorpio', 'Pisces']
  }
} as const;