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
  neutral: { bg: '#29c9ff', text: 'black' }
} as const;

// Aspect Type Colors (extracted from MajorAspectsSection - excellent contrast combinations)
// These provide better readability than the existing OUTCOME_COLORS
// Usage: getAspectTypeStyle('harmonious').badge for badges, .background for containers
export const ASPECT_TYPE_COLORS = {
  harmonious: {
    badge: 'bg-green-100 text-green-700 border-black',
    dot: 'bg-green-400',
    background: '#dcfce7', // green-100 - perfect for favorable outcomes
    text: '#15803d'        // green-700 - excellent contrast
  },
  challenging: {
    badge: 'bg-red-100 text-red-700 border-black', 
    dot: 'bg-red-400',
    background: '#fee2e2', // red-100 - perfect for challenging outcomes
    text: '#dc2626'        // red-700 - excellent contrast
  },
  neutral: {
    badge: 'bg-blue-100 text-blue-700 border-black',
    dot: 'bg-blue-400', 
    background: '#dbeafe', // blue-100 - perfect for neutral outcomes
    text: '#2563eb'        // blue-700 - excellent contrast
  },
  high: {
    badge: 'bg-emerald-100 text-emerald-700 border-black',
    dot: 'bg-emerald-400',
    background: '#d1fae5', // emerald-100 - perfect for high relevance
    text: '#047857'        // emerald-700 - excellent contrast
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700 border-black',
    dot: 'bg-amber-400',
    background: '#fef3c7', // amber-100 - perfect for medium relevance
    text: '#b45309'        // amber-700 - excellent contrast
  },
  low: {
    badge: 'bg-gray-100 text-gray-700 border-black',
    dot: 'bg-gray-400',
    background: '#f3f4f6', // gray-100 - perfect for low relevance
    text: '#374151'        // gray-700 - excellent contrast
  }
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
  opposition: '#db17f5',  // Darker pink/purple
  quincunx: '#9c27b0'     // Purple - adjustment
} as const;

// Strength indicators (Synapsas-style)
export const STRENGTH_STYLES = {
  green: { backgroundColor: '#51bd94', color: 'white' },
  lightgreen: { backgroundColor: '#34ccff', color: 'black' },
  yellow: { backgroundColor: '#f2e356', color: 'black' },
  orange: { backgroundColor: '#ff91e9', color: 'white' },
  red: { backgroundColor: '#e74c3c', color: 'white' },
  gray: { backgroundColor: '#19181a', color: 'white' }
} as const;

// Dignity colors
export const DIGNITY_COLORS = {
  ruler: "#51bd94",
  exaltation: "#04baf7",
  triplicity: "#f2e356",
  term: "#ff91e9",
  face: "#ddd",
  detriment: "#ff91e9",
  fall: "#e74c3c",
  peregrine: "#19181a",
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

// Helper function to get aspect type colors
export function getAspectTypeStyle(type: 'harmonious' | 'challenging' | 'neutral' | 'high' | 'medium' | 'low') {
  return ASPECT_TYPE_COLORS[type] || ASPECT_TYPE_COLORS.neutral;
}

// Helper function to get strength assessment colors (used in both Essential and Accidental Dignity tabs)
export function getStrengthAssessmentStyle(strengthLabel: string) {
  const styles = {
    backgroundColor: 
      strengthLabel === 'Very Strong' ? getAspectTypeStyle('high').background :
      strengthLabel === 'Strong' ? getAspectTypeStyle('harmonious').background :
      strengthLabel === 'Moderate' ? getAspectTypeStyle('medium').background :
      strengthLabel === 'Weak' ? getAspectTypeStyle('low').background :
      strengthLabel === 'Very Weak' ? getAspectTypeStyle('challenging').background :
      getAspectTypeStyle('neutral').background,
    color:
      strengthLabel === 'Very Strong' ? getAspectTypeStyle('high').text :
      strengthLabel === 'Strong' ? getAspectTypeStyle('harmonious').text :
      strengthLabel === 'Moderate' ? getAspectTypeStyle('medium').text :
      strengthLabel === 'Weak' ? getAspectTypeStyle('low').text :
      strengthLabel === 'Very Weak' ? getAspectTypeStyle('challenging').text :
      getAspectTypeStyle('neutral').text
  };
  
  return styles;
}

// Helper function to get dignity badge style (using centralized color system)
export function getDignityBadgeStyle(dignityType: string) {
  const lowerType = dignityType.toLowerCase();
  
  switch (lowerType) {
    case 'ruler':
      return {
        backgroundColor: getAspectTypeStyle('harmonious').background,
        textColor: getAspectTypeStyle('harmonious').text
      };
    case 'exaltation':
      return {
        backgroundColor: getAspectTypeStyle('high').background,
        textColor: getAspectTypeStyle('high').text
      };
    case 'triplicity':
      return {
        backgroundColor: getAspectTypeStyle('medium').background,
        textColor: getAspectTypeStyle('medium').text
      };
    case 'term':
      return {
        backgroundColor: getAspectTypeStyle('neutral').background,
        textColor: getAspectTypeStyle('neutral').text
      };
    case 'face':
      return {
        backgroundColor: getAspectTypeStyle('low').background,
        textColor: getAspectTypeStyle('low').text
      };
    case 'detriment':
      return {
        backgroundColor: getAspectTypeStyle('challenging').background,
        textColor: getAspectTypeStyle('challenging').text
      };
    case 'fall':
      return {
        backgroundColor: getAspectTypeStyle('challenging').background,
        textColor: getAspectTypeStyle('challenging').text
      };
    case 'peregrine':
      return {
        backgroundColor: getAspectTypeStyle('low').background,
        textColor: getAspectTypeStyle('low').text
      };
    default:
      return {
        backgroundColor: getAspectTypeStyle('neutral').background,
        textColor: getAspectTypeStyle('neutral').text
      };
  }
}