/* eslint-disable @typescript-eslint/no-unused-vars */

// Celestial Point Aspect Interpretations
// =====================================
//
// This file combines aspect interpretations from:
// - planetaryCelestialPointAspects.ts: Planets aspecting celestial points
// - celestialPointInterAspects.ts: Celestial points aspecting each other
//
// Covers aspects between planets and celestial points:
// - Lilith (Black Moon Lilith): Shadow self, wild feminine power, authentic expression
// - North Node: Soul purpose, karmic destiny, spiritual evolution
// - South Node: Past-life gifts, comfortable patterns, spiritual balance
// - Part of Fortune: Joy, prosperity, material success through spiritual alignment

import { planetaryCelestialPointAspects } from './planetaryCelestialPointAspects';
import { celestialPointInterAspects } from './celestialPointInterAspects';

// Merge both sets of aspects into a single export
export const celestialPointAspectCombinations: Record<
  string,
  Record<string, Record<string, string>>
> = {
  ...planetaryCelestialPointAspects,
  ...celestialPointInterAspects
};
