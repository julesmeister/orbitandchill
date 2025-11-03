/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChartAspect } from "../natalChart";
import { AspectInfo, getAspectType, getAspectIcon, getAspectColor } from "./aspectUtilities";
import { planetaryAspectCombinations } from "./planetaryAspects";
import { celestialPointAspectCombinations } from "./celestialPointAspects";

export const getAspectInterpretation = (aspect: ChartAspect): string => {
  const aspectInfo = getFullAspectInfo(aspect);
  return aspectInfo.interpretation;
};

export const getFullAspectInfo = (aspect: ChartAspect): AspectInfo => {
  const p1 = aspect.planet1.toLowerCase();
  const p2 = aspect.planet2.toLowerCase();

  // Traditional planets (for bidirectional lookup)
  const traditionalPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  
  // Celestial points (these are typically the second planet in aspects)
  const celestialPoints = ['lilith', 'northnode', 'southnode', 'partoffortune'];

  let interpretation: string | undefined;

  // First, try traditional planetary combinations (planet-to-planet)
  interpretation = 
    planetaryAspectCombinations[p1]?.[p2]?.[aspect.aspect] ||
    planetaryAspectCombinations[p2]?.[p1]?.[aspect.aspect];

  // If not found, try celestial point combinations (planet-to-celestial-point)
  if (!interpretation) {
    interpretation = 
      celestialPointAspectCombinations[p1]?.[p2]?.[aspect.aspect] ||
      celestialPointAspectCombinations[p2]?.[p1]?.[aspect.aspect];
  }

  const aspectType = getAspectType(aspect.aspect);
  const icon = getAspectIcon(aspectType);
  const color = getAspectColor(aspectType);

  if (interpretation) {
    return {
      interpretation,
      type: aspectType,
      icon,
      color
    };
  }

  // Fallback to generic interpretations
  const aspectMeanings: Record<string, string> = {
    conjunction: "These energies blend and intensify each other",
    sextile: "These energies work together harmoniously and supportively",
    square: "These energies create tension that drives growth and action",
    trine: "These energies flow together naturally and easily",
    opposition: "These energies create balance through conscious integration",
    quincunx: "These energies require adjustment and conscious effort to integrate",
  };

  const fallbackInterpretation = aspectMeanings[aspect.aspect] ||
    "This aspect creates a unique dynamic between these planetary energies.";

  return {
    interpretation: fallbackInterpretation,
    type: aspectType,
    icon,
    color
  };
};