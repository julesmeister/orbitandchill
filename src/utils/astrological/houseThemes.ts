/* eslint-disable @typescript-eslint/no-unused-vars */

// House themes and meanings for astrological interpretation
export const houseThemes: Record<number, string> = {
  1: "This placement is central to your identity and how you present yourself to the world.",
  2: "This placement influences your relationship with money, possessions, and personal values.",
  3: "This placement affects your communication style, learning approach, and relationships with siblings and neighbors.",
  4: "This placement shapes your connection to home, family, and emotional foundations.",
  5: "This placement influences your creativity, romance, self-expression, and relationship with children.",
  6: "This placement affects your work life, health routines, and approach to service and improvement.",
  7: "This placement is key to understanding your partnerships, marriage, and one-on-one relationships.",
  8: "This placement influences transformation, shared resources, and your approach to life's deeper mysteries.",
  9: "This placement affects your philosophy, higher learning, travel, and search for meaning.",
  10: "This placement shapes your career, reputation, and public image.",
  11: "This placement influences your friendships, group activities, and hopes for the future.",
  12: "This placement affects your spiritual life, subconscious patterns, and service to others."
};

// Detailed house meanings for more comprehensive interpretations
export const detailedHouseMeanings: Record<number, {
  name: string;
  keywords: string[];
  description: string;
  rulingSign: string;
  rulingPlanet: string;
}> = {
  1: {
    name: "House of Self",
    keywords: ["identity", "appearance", "first impressions", "personality", "vitality", "beginnings"],
    description: "The 1st house represents your core identity, physical appearance, and how you present yourself to the world. It's your mask, your persona, and your immediate reaction to new situations.",
    rulingSign: "Aries",
    rulingPlanet: "Mars"
  },
  2: {
    name: "House of Values",
    keywords: ["money", "possessions", "values", "self-worth", "resources", "material security"],
    description: "The 2nd house governs your relationship with material possessions, money, personal values, and sense of self-worth. It shows what you value most and how you attract resources.",
    rulingSign: "Taurus",
    rulingPlanet: "Venus"
  },
  3: {
    name: "House of Communication",
    keywords: ["communication", "siblings", "learning", "short trips", "neighbors", "daily life"],
    description: "The 3rd house rules communication, learning, siblings, neighbors, and short-distance travel. It represents your mental processes and how you gather and share information.",
    rulingSign: "Gemini",
    rulingPlanet: "Mercury"
  },
  4: {
    name: "House of Home",
    keywords: ["home", "family", "roots", "mother", "emotional foundation", "heritage"],
    description: "The 4th house represents your home, family background, emotional foundations, and connection to your roots. It's your private world and inner emotional life.",
    rulingSign: "Cancer",
    rulingPlanet: "Moon"
  },
  5: {
    name: "House of Creativity",
    keywords: ["creativity", "romance", "children", "self-expression", "pleasure", "entertainment"],
    description: "The 5th house governs creativity, romance, children, self-expression, and pleasure. It represents your creative spark and what brings you joy and fulfillment.",
    rulingSign: "Leo",
    rulingPlanet: "Sun"
  },
  6: {
    name: "House of Service",
    keywords: ["work", "health", "daily routine", "service", "pets", "improvement"],
    description: "The 6th house rules work, health, daily routines, and service to others. It represents your approach to responsibility, health maintenance, and helping others.",
    rulingSign: "Virgo",
    rulingPlanet: "Mercury"
  },
  7: {
    name: "House of Partnership",
    keywords: ["marriage", "partnerships", "open enemies", "contracts", "cooperation"],
    description: "The 7th house governs partnerships, marriage, open enemies, and one-on-one relationships. It represents how you relate to others and what you seek in partnerships.",
    rulingSign: "Libra",
    rulingPlanet: "Venus"
  },
  8: {
    name: "House of Transformation",
    keywords: ["transformation", "shared resources", "intimacy", "death", "rebirth", "occult"],
    description: "The 8th house rules transformation, shared resources, intimacy, death and rebirth, and occult matters. It represents deep psychological processes and regeneration.",
    rulingSign: "Scorpio",
    rulingPlanet: "Pluto"
  },
  9: {
    name: "House of Philosophy",
    keywords: ["philosophy", "higher education", "travel", "religion", "publishing", "wisdom"],
    description: "The 9th house governs philosophy, higher education, long-distance travel, religion, and the search for meaning. It represents your quest for wisdom and understanding.",
    rulingSign: "Sagittarius",
    rulingPlanet: "Jupiter"
  },
  10: {
    name: "House of Career",
    keywords: ["career", "reputation", "authority", "father", "public image", "ambition"],
    description: "The 10th house rules career, reputation, public image, and authority. It represents your professional life and how you're known in the world.",
    rulingSign: "Capricorn",
    rulingPlanet: "Saturn"
  },
  11: {
    name: "House of Friendship",
    keywords: ["friends", "groups", "hopes", "wishes", "humanitarian causes", "future"],
    description: "The 11th house governs friendships, group activities, hopes and wishes, and humanitarian causes. It represents your social circles and future aspirations.",
    rulingSign: "Aquarius",
    rulingPlanet: "Uranus"
  },
  12: {
    name: "House of Spirituality",
    keywords: ["spirituality", "subconscious", "hidden enemies", "sacrifice", "institutions"],
    description: "The 12th house rules spirituality, the subconscious mind, hidden enemies, sacrifice, and institutions. It represents your spiritual life and unconscious patterns.",
    rulingSign: "Pisces",
    rulingPlanet: "Neptune"
  }
};

// Get house theme by number
export const getHouseTheme = (houseNumber: number): string => {
  return houseThemes[houseNumber] || `This placement affects the ${houseNumber}th house themes in your life.`;
};

// Get detailed house information
export const getHouseInfo = (houseNumber: number) => {
  return detailedHouseMeanings[houseNumber] || {
    name: `${houseNumber}th House`,
    keywords: [],
    description: `The ${houseNumber}th house represents important life themes.`,
    rulingSign: "Unknown",
    rulingPlanet: "Unknown"
  };
};