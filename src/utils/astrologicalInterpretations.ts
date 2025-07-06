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
import {
  EventActionableAdvice,
  EventInterpretation,
  getEventInterpretation,
  hasEventInterpretation,
  RETROGRADE_INTERPRETATIONS,
  MOON_PHASE_INTERPRETATIONS,
  PLANETARY_SIGN_INTERPRETATIONS,
  CONJUNCTION_INTERPRETATIONS,
  STELLIUM_INTERPRETATIONS,
  GRAND_TRINE_INTERPRETATIONS,
  VOID_MOON_INTERPRETATIONS,
  ECLIPSE_INTERPRETATIONS,
} from "./astrological/eventInterpretations";

// Import transit and event data from new split modules
import {
  ORB_RANGES,
  PLANET_WEIGHTS,
  ASPECT_WEIGHTS,
  PLANET_SPEEDS,
  TransitAdviceTemplate,
  TRANSIT_ADVICE_TEMPLATES,
  PLANET_KEYWORDS,
} from "./astrological/transitData";
import {
  EVENT_TYPE_COLORS,
  RARITY_BADGES,
  SIGN_THEMES,
  ELEMENT_THEMES,
  SIGN_ELEMENTS,
  CONJUNCTION_IMPACTS,
  ZODIAC_SIGNS,
  getSignThemes,
  getElementFromSign,
  getElementThemes,
  getConjunctionRarity,
  getConjunctionImpact,
  getNextSign,
} from "./astrological/eventData";

// Re-export all functions and types for backward compatibility
export type { AspectInfo, TransitAdviceTemplate, EventActionableAdvice, EventInterpretation };
export {
  // Aspect utilities
  getAspectType,
  getAspectIcon,
  getAspectColor,
  
  // Interpretations
  getRisingSignInterpretation,
  getSignInterpretation,
  getAspectInterpretation,
  getFullAspectInfo,
  getPlanetInHouseInterpretation,
  getHouseCuspSignInterpretation,
  
  // Dignities
  planetaryDignities,
  getPlanetaryDignity,
  getDignityInterpretation,
  
  // Houses
  houseThemes,
  detailedHouseMeanings,
  getHouseTheme,
  getHouseInfo,
  
  // Transit data
  ORB_RANGES,
  PLANET_WEIGHTS,
  ASPECT_WEIGHTS,
  PLANET_SPEEDS,
  TRANSIT_ADVICE_TEMPLATES,
  PLANET_KEYWORDS,
  
  // Event data
  EVENT_TYPE_COLORS,
  RARITY_BADGES,
  SIGN_THEMES,
  ELEMENT_THEMES,
  SIGN_ELEMENTS,
  CONJUNCTION_IMPACTS,
  ZODIAC_SIGNS,
  getSignThemes,
  getElementFromSign,
  getElementThemes,
  getConjunctionRarity,
  getConjunctionImpact,
  getNextSign,
  
  // Event interpretations
  getEventInterpretation,
  hasEventInterpretation,
  RETROGRADE_INTERPRETATIONS,
  MOON_PHASE_INTERPRETATIONS,
  PLANETARY_SIGN_INTERPRETATIONS,
  CONJUNCTION_INTERPRETATIONS,
  STELLIUM_INTERPRETATIONS,
  GRAND_TRINE_INTERPRETATIONS,
  VOID_MOON_INTERPRETATIONS,
  ECLIPSE_INTERPRETATIONS,
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

// All transit and event data has been moved to separate modules
// and is imported above for re-export
