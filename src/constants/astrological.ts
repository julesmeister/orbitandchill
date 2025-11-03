/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astrological constants and configuration
 */

import * as Astronomy from 'astronomy-engine';

// Zodiac signs
export const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

// Main planets
export const PLANETS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

// Additional celestial points (not planets but important in astrology)
export const CELESTIAL_POINTS = [
  "lilith",      // Black Moon Lilith (Moon's apogee)
  "partOfFortune", // Arabic Part (Lot of Fortune)
  "northNode",   // North Node (Rahu)
  "southNode",   // South Node (Ketu)
];

// House numbers
export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

// Aspect definitions with orbs
export const ASPECTS = {
  conjunction: { angle: 0, orb: 8, type: "major" },
  sextile: { angle: 60, orb: 6, type: "major" },
  square: { angle: 90, orb: 8, type: "major" },
  trine: { angle: 120, orb: 8, type: "major" },
  opposition: { angle: 180, orb: 8, type: "major" },
  quincunx: { angle: 150, orb: 3, type: "minor" },
};

// Astronomy-engine body mapping
export const ASTRONOMY_BODIES: { [key: string]: any } = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};
