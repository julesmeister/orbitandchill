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
