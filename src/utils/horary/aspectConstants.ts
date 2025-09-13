/**
 * Traditional aspect definitions for horary astrology
 */

export const ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 7,
  sextile: 6,
  quincunx: 3
} as const;

export const ASPECT_ANGLES = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180
} as const;

export const ASPECT_COLORS = {
  conjunction: "#e11d48", // red-600
  sextile: "#059669", // emerald-600
  square: "#dc2626", // red-600
  trine: "#2563eb", // blue-600
  quincunx: "#7c3aed", // violet-600
  opposition: "#7c2d12" // orange-800
} as const;

export interface Aspect {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  applying: boolean;
  color: string;
}

export type AspectType = keyof typeof ASPECT_ORBS;