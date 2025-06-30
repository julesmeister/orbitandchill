// Import all functions from split modules
import {
  AspectInfo,
  getAspectType,
  getAspectIcon,
  getAspectColor,
} from "./astrological/aspectUtilities";
import { getRisingSignInterpretation } from "./astrological/risingSignInterpretations";
import { getSignInterpretation } from "./astrological/signInterpretations";
import {
  getAspectInterpretation,
  getFullAspectInfo,
} from "./astrological/aspectInterpretations";
import {
  getPlanetInHouseInterpretation,
  getHouseCuspSignInterpretation,
} from "./astrological/houseInterpretations";
import {
  planetaryDignities,
  getPlanetaryDignity,
  getDignityInterpretation,
} from "./astrological/dignityInterpretations";
import {
  houseThemes,
  detailedHouseMeanings,
  getHouseTheme,
  getHouseInfo,
} from "./astrological/houseThemes";

// Re-export all functions and types for backward compatibility
export type { AspectInfo };
export {
  getAspectType,
  getAspectIcon,
  getAspectColor,
  getRisingSignInterpretation,
  getSignInterpretation,
  getAspectInterpretation,
  getFullAspectInfo,
  getPlanetInHouseInterpretation,
  getHouseCuspSignInterpretation,
  planetaryDignities,
  getPlanetaryDignity,
  getDignityInterpretation,
  houseThemes,
  detailedHouseMeanings,
  getHouseTheme,
  getHouseInfo,
};

// Comprehensive planetary interpretation combining sign, house, and dignity
export const getComprehensivePlanetaryInterpretation = (
  planet: string,
  sign: string,
  house: number,
  dignity: string
): string => {
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);

  // Get all the individual interpretations
  const signInterpretation = getSignInterpretation(sign, planet);
  const houseInterpretation = getPlanetInHouseInterpretation(planet, house);
  const dignityInterpretation =
    dignity !== "neutral"
      ? getDignityInterpretation(planet, sign, dignity)
      : "";

  // Get house theme from imported module
  const houseTheme = getHouseTheme(house);

  // Combine all interpretations into a comprehensive overview with proper structure
  let fullInterpretation = "";

  // Start with dignity if present
  if (dignityInterpretation) {
    fullInterpretation += `PLANETARY STRENGTH\n\n${dignityInterpretation}\n\n`;
  }

  // Add house context
  fullInterpretation += `LIFE AREA EXPRESSION (${house}th House)\n\n${houseTheme} ${houseInterpretation}\n\n`;

  // Add sign interpretation
  fullInterpretation += `SIGN EXPRESSION (${signName})\n\n${signInterpretation}`;

  return fullInterpretation;
};

// Transit System Constants and Data
// Professional orb ranges based on astrological standards
export const ORB_RANGES: Record<string, { major: number; minor: number }> = {
  // Luminaries get wider orbs
  'Sun': { major: 8, minor: 3 },
  'Moon': { major: 8, minor: 3 },
  // Personal planets
  'Mercury': { major: 6, minor: 2 },
  'Venus': { major: 6, minor: 2 },
  'Mars': { major: 6, minor: 2 },
  // Social planets
  'Jupiter': { major: 6, minor: 2 },
  'Saturn': { major: 6, minor: 2 },
  // Outer planets
  'Uranus': { major: 5, minor: 2 },
  'Neptune': { major: 5, minor: 2 },
  'Pluto': { major: 5, minor: 2 }
};

// Planet weights for strength calculation
export const PLANET_WEIGHTS: Record<string, number> = {
  'Pluto': 1.0, 'Neptune': 0.9, 'Uranus': 0.9,
  'Saturn': 0.85, 'Jupiter': 0.8,
  'Mars': 0.7, 'Venus': 0.7, 'Mercury': 0.6,
  'Sun': 0.9, 'Moon': 0.8
};

// Aspect weights for strength calculation
export const ASPECT_WEIGHTS: Record<string, number> = {
  'Conjunction': 1.0, 'Opposition': 1.0,
  'Square': 0.9, 'Trine': 0.8,
  'Sextile': 0.7, 'Quincunx': 0.6
};

// Planet daily motion speeds (degrees per day)
export const PLANET_SPEEDS: Record<string, number> = {
  'Sun': 1, 'Moon': 13, 'Mercury': 1.5, 'Venus': 1.2, 'Mars': 0.5,
  'Jupiter': 0.08, 'Saturn': 0.03, 'Uranus': 0.01, 'Neptune': 0.006, 'Pluto': 0.004
};

// Transit advice templates
interface TransitAdviceTemplate {
  immediate: string[];
  preparation: string[];
  timing: {
    favorable: string[];
    avoid: string[];
  };
}

export const TRANSIT_ADVICE_TEMPLATES: Record<string, TransitAdviceTemplate> = {
  'Saturn-Square': {
    immediate: ["Face challenges with patience and discipline", "Focus on building stronger foundations", "Avoid shortcuts and quick fixes"],
    preparation: ["Review and strengthen your foundations", "Clear out what's no longer working", "Set realistic goals and timelines"],
    timing: {
      favorable: ["Planning", "Building", "Commitment", "Taking responsibility"],
      avoid: ["Risk-taking", "Shortcuts", "Impulsive decisions", "Major changes"]
    }
  },
  'Saturn-Conjunction': {
    immediate: ["Take on new responsibilities", "Build lasting structures", "Focus on long-term goals"],
    preparation: ["Prepare for increased responsibility", "Strengthen your discipline", "Plan for the long term"],
    timing: {
      favorable: ["Starting new ventures", "Making commitments", "Building foundations"],
      avoid: ["Avoiding responsibility", "Seeking easy paths", "Ignoring reality"]
    }
  },
  'Jupiter-Trine': {
    immediate: ["Expand your horizons through education", "Take calculated risks", "Network and build connections"],
    preparation: ["Prepare for opportunities", "Update skills and knowledge", "Build confidence"],
    timing: {
      favorable: ["Launching projects", "Travel", "Education", "Publishing", "Growth initiatives"],
      avoid: ["Overexpansion", "Overconfidence", "Neglecting details"]
    }
  },
  'Jupiter-Conjunction': {
    immediate: ["Embrace new opportunities", "Think big and expand", "Share your wisdom"],
    preparation: ["Prepare for growth opportunities", "Expand your knowledge", "Build optimism"],
    timing: {
      favorable: ["Starting new ventures", "Education", "Travel", "Publishing"],
      avoid: ["Overextending", "Promising too much", "Ignoring limitations"]
    }
  },
  'Mars-Conjunction': {
    immediate: ["Channel energy into productive action", "Start new initiatives", "Assert yourself confidently"],
    preparation: ["Plan your next moves", "Build physical and mental energy", "Clarify your goals"],
    timing: {
      favorable: ["Initiating projects", "Physical activity", "Leadership", "Competition"],
      avoid: ["Rash decisions", "Aggression", "Burnout", "Conflicts"]
    }
  },
  'Mars-Square': {
    immediate: ["Channel frustration into constructive action", "Face conflicts directly", "Use energy wisely"],
    preparation: ["Prepare for challenges", "Build patience", "Strengthen your resolve"],
    timing: {
      favorable: ["Overcoming obstacles", "Building strength", "Assertive action"],
      avoid: ["Anger", "Impulsiveness", "Unnecessary conflicts", "Aggression"]
    }
  },
  'Venus-Trine': {
    immediate: ["Embrace beauty and harmony", "Strengthen relationships", "Enjoy artistic pursuits"],
    preparation: ["Prepare for social opportunities", "Enhance your environment", "Focus on relationships"],
    timing: {
      favorable: ["Romance", "Artistic creation", "Social events", "Beautification"],
      avoid: ["Overindulgence", "Laziness", "Superficiality"]
    }
  },
  'Venus-Square': {
    immediate: ["Work on relationship balance", "Address values conflicts", "Find harmony through effort"],
    preparation: ["Review your relationships", "Clarify your values", "Prepare for social challenges"],
    timing: {
      favorable: ["Relationship work", "Values clarification", "Artistic challenges"],
      avoid: ["Relationship drama", "Overindulgence", "Avoiding issues"]
    }
  },
  'Mercury-Conjunction': {
    immediate: ["Focus on clear communication", "Start new learning projects", "Share your ideas"],
    preparation: ["Organize your thoughts", "Prepare important communications", "Plan learning goals"],
    timing: {
      favorable: ["Writing", "Teaching", "Learning", "Communication", "Planning"],
      avoid: ["Miscommunication", "Information overload", "Scattered thinking"]
    }
  },
  'Uranus-Square': {
    immediate: ["Embrace necessary changes", "Break free from limitations", "Think innovatively"],
    preparation: ["Prepare for unexpected changes", "Build flexibility", "Question old patterns"],
    timing: {
      favorable: ["Innovation", "Liberation", "Breakthrough thinking", "Independence"],
      avoid: ["Rebellion without purpose", "Chaos", "Rejecting all structure"]
    }
  },
  'Neptune-Trine': {
    immediate: ["Trust your intuition", "Engage in spiritual practices", "Express creativity"],
    preparation: ["Develop spiritual practices", "Enhance creativity", "Practice meditation"],
    timing: {
      favorable: ["Spiritual growth", "Artistic creation", "Compassionate service", "Healing"],
      avoid: ["Escapism", "Deception", "Unclear boundaries"]
    }
  },
  'Pluto-Square': {
    immediate: ["Embrace deep transformation", "Face your shadows", "Release what no longer serves"],
    preparation: ["Prepare for profound change", "Build inner strength", "Practice letting go"],
    timing: {
      favorable: ["Deep healing", "Transformation", "Releasing old patterns", "Empowerment"],
      avoid: ["Power struggles", "Obsession", "Resistance to change", "Destructive behavior"]
    }
  }
};

// Planet keywords for transit descriptions
export const PLANET_KEYWORDS: Record<string, string> = {
  'Sun': 'identity, ego, vitality, self-expression, life purpose',
  'Moon': 'emotions, instincts, habits, subconscious, nurturing',
  'Mercury': 'communication, thinking, learning, perception, adaptability',
  'Venus': 'love, values, beauty, relationships, harmony',
  'Mars': 'action, desire, energy, assertiveness, courage',
  'Jupiter': 'expansion, wisdom, luck, growth, optimism',
  'Saturn': 'discipline, structure, responsibility, limitations, maturity',
  'Uranus': 'innovation, rebellion, sudden change, freedom, awakening',
  'Neptune': 'spirituality, dreams, illusion, compassion, transcendence',
  'Pluto': 'transformation, power, deep change, regeneration, intensity'
};
