/**
 * Traditional house meanings and astrological house system constants
 */

/**
 * Traditional meanings for the 12 astrological houses
 */
export const HOUSE_MEANINGS = [
  'Self, Identity, Appearance',           // 1st House
  'Money, Possessions, Values',           // 2nd House  
  'Communication, Siblings, Travel',      // 3rd House
  'Home, Family, Property',               // 4th House
  'Children, Romance, Creativity',        // 5th House
  'Health, Work, Service',                // 6th House
  'Partnerships, Marriage, Others',       // 7th House
  'Death, Transformation, Others Money',  // 8th House
  'Higher Learning, Philosophy, Travel',  // 9th House
  'Career, Reputation, Authority',        // 10th House
  'Friends, Groups, Hopes',               // 11th House
  'Secrets, Subconscious, Enemies'        // 12th House
];

/**
 * Get meaning for a house number (1-12)
 */
export const getHouseMeaning = (houseNumber: number): string => {
  if (houseNumber < 1 || houseNumber > 12) {
    return 'Unknown';
  }
  return HOUSE_MEANINGS[houseNumber - 1];
};

/**
 * House classification by angular strength
 */
export const ANGULAR_HOUSES = [1, 4, 7, 10];
export const SUCCEDENT_HOUSES = [2, 5, 8, 11];
export const CADENT_HOUSES = [3, 6, 9, 12];

/**
 * Get house classification
 */
export const getHouseClassification = (houseNumber: number): 'angular' | 'succedent' | 'cadent' | 'unknown' => {
  if (ANGULAR_HOUSES.includes(houseNumber)) return 'angular';
  if (SUCCEDENT_HOUSES.includes(houseNumber)) return 'succedent'; 
  if (CADENT_HOUSES.includes(houseNumber)) return 'cadent';
  return 'unknown';
};

/**
 * Traditional horary house associations for different question types
 */
export const HORARY_HOUSE_ASSOCIATIONS = {
  career: { querent: 1, quesited: 10 },
  relationships: { querent: 1, quesited: 7 },
  property: { querent: 1, quesited: 4 },
  money: { querent: 1, quesited: 2 },
  health: { querent: 1, quesited: 6 },
  travel: { querent: 1, quesited: 9 },
  children: { querent: 1, quesited: 5 },
  friends: { querent: 1, quesited: 11 },
  secrets: { querent: 1, quesited: 12 },
  communication: { querent: 1, quesited: 3 },
  death: { querent: 1, quesited: 8 },
  general: { querent: 1, quesited: 1 }
} as const;

export type HoraryQuestionType = keyof typeof HORARY_HOUSE_ASSOCIATIONS;