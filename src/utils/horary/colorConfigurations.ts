/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Centralized color configurations for horary astrology components
 * Ensures consistent color usage across all tabs
 */

// Relevance levels for aspects and interpretations
export const RELEVANCE_COLORS = {
  high: { bg: '#51bd94', text: 'white' },
  medium: { bg: '#ffe602', text: 'black' },
  low: { bg: '#6b7280', text: 'white' }
} as const;

// Outcome types for interpretations
export const OUTCOME_COLORS = {
  favorable: { bg: '#51bd94', text: 'white' },
  challenging: { bg: '#e74c3c', text: 'white' },
  neutral: { bg: '#29c9ff', text: 'white' }
} as const;

// Overall tone colors
export const TONE_COLORS = {
  favorable: '#51bd94',
  challenging: '#e74c3c',
  neutral: '#0ac0fc'
} as const;

// Darker aspect colors for better readability
export const ASPECT_COLORS_DARK = {
  conjunction: '#19a9f1', // Darker blue
  trine: '#21b883',       // Darker green
  square: '#ff4949',      // Darker red
  sextile: '#f3930e',     // Darker yellow/amber
  opposition: '#db17f5'   // Darker pink/purple
} as const;

// Strength indicators (Synapsas-style)
export const STRENGTH_STYLES = {
  green: { backgroundColor: '#51bd94', color: 'white' },
  lightgreen: { backgroundColor: '#34ccff', color: 'white' },
  yellow: { backgroundColor: '#f2e356', color: 'black' },
  orange: { backgroundColor: '#ff91e9', color: 'white' },
  red: { backgroundColor: '#e74c3c', color: 'white' },
  gray: { backgroundColor: '#19181a', color: 'white' }
} as const;

// Dignity colors
export const DIGNITY_COLORS = {
  ruler: '#51bd94',
  exaltation: '#1ac6ff',
  triplicity: '#f2e356',
  term: '#ff91e9',
  face: '#ddd',
  detriment: '#ff91e9',
  fall: '#e74c3c',
  peregrine: '#19181a'
} as const;

// Confidence levels
export const CONFIDENCE_COLORS = {
  high: '#ffffff',
  medium: '#f2e356',
  low: '#ff91e9'
} as const;

// Special condition colors
export const CONDITION_COLORS = {
  cazimi: '#04baf7',
  combust: '#e74c3c',
  underSunbeams: '#ff91e9',
  fast: '#f2e356',
  slow: '#ff91e9',
  retrograde: '#19181a',
  joy: '#51bd94',
  fixedStar: '#f2e356'
} as const;

// Lunar phase colors
export const LUNAR_COLORS = {
  increasing: '#51bd94',
  decreasing: '#ff91e9',
  voidOfCourse: '#e74c3c',
  viaCombusta: '#ff91e9',
  phase: '#6bdbff'
} as const;

// Background colors for info boxes
export const INFO_BOX_COLORS = {
  primary: '#51bd94',
  secondary: '#29c9ff',
  warning: '#ff91e9',
  danger: '#e74c3c',
  success: '#51bd94',
  info: '#6bdbff',
  light: '#f0e3ff',
  neutral: '#f5f5f5',
  dark: '#19181a'
} as const;

// Helper function to get strength style
export function getStrengthStyle(color: string) {
  return STRENGTH_STYLES[color as keyof typeof STRENGTH_STYLES] || { backgroundColor: '#6b7280', color: 'white' };
}