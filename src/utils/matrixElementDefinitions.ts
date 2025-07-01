/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Centralized definitions for Matrix of Destiny elements
 * This prevents repetition of IDs, labels, and variable names across the codebase
 */

export interface MatrixElementDefinition {
  label: string;
  variableName?: string; // Only needed if different from key
  description?: string;
}

// Primary Inner Elements - key is the ID
export const MATRIX_INNER_ELEMENTS = {
  HEART_WISHES: {
    label: "Heart/Wishes",
    variableName: "earthPurpose", // Different from key
    description: "Material world purpose and desires",
  },
  POWER_OF_ANCESTORS: {
    label: "Power of Ancestors",
    variableName: "heart", // Different from key
    description: "Ancestral wisdom and inherited power",
  },
  FUTURE_CHILDREN: {
    label: "Future Children",
    variableName: "guard", // Different from key
    description: "Protective energy and legacy",
  },
  TALENT: {
    label: "Heart's Desire",
    // variableName same as key, so omitted
    description: "Natural abilities and gifts",
  },
} as const;

// Main octagram positions - key is the ID, variableName same as key so omitted
export const MATRIX_MAIN_POSITIONS = {
  A: {
    label: "Reputation",
    description: "Personal character and talents",
  },
  B: {
    label: "Inspiration",
    description: "Emotional nature and inner world",
  },
  C: {
    label: "Money Block",
    description: "Life purpose and destiny path",
  },
  D: {
    label: "Biggest Obstacle in Life",
    description: "Lessons to learn in this lifetime",
  },
  E: {
    label: "Comfort Zone",
    description: "Core essence and identity",
  },
  F: {
    label: "Dad's Talents",
    description: "Ancestral influences and gifts",
  },
  G: {
    label: "Mom's Talents",
    description: "Natural abilities and skills",
  },
  H: {
    label: "Dad's Karma",
    description: "Lessons related to material world",
  },
  I: {
    label: "Mom's Karma",
    description: "Spiritual growth and evolution",
  },
  J: {
    label: "Past Life Mistakes",
    description: "Family dynamics and heritage",
  },
} as const;

// Extended alphabet positions (K-X)
export const MATRIX_EXTENDED_POSITIONS = {
  K: {
    label: "Income Streams",
    description: "How you naturally attract and generate money",
  },
  L: {
    label: "Work Life Balance", 
    description: "How you balance career and personal life",
  },
  M: {
    label: "Ingredients for Love",
    description: "What you need to give and receive in relationships",
  },
  N: {
    label: "Past Life Income",
    description: "How past life patterns affect your money mindset",
  },
  O: {
    label: "As a Parent",
    description: "Your parenting style and family dynamics",
  },
  P: {
    label: "Higher Self",
    description: "Your spiritual purpose and highest potential",
  },
  Q: {
    label: "Past Life Money Mindset",
    description: "Inherited beliefs and patterns around money",
  },
  R: {
    label: "Present Life Task",
    description: "Your current life purpose and mission",
  },
  S: {
    label: "Relationship Passion",
    description: "How you express passion in relationships",
  },
  T: {
    label: "Self Expression",
    description: "How you show your authentic self to the world",
  },
  U: {
    label: "Intimate Connection",
    description: "Your approach to deep emotional intimacy",
  },
  V: {
    label: "Sexuality",
    description: "How you express and experience sexual energy",
  },
  W: {
    label: "Physical Magnetism",
    description: "Your physical presence and attraction energy",
  },
  X: {
    label: "Sexual Transformation",
    description: "How sexuality transforms and heals you",
  },
} as const;

// Family line extended positions
export const MATRIX_FAMILY_POSITIONS = {
  F1: {
    label: "Dad's Talents (Outer)",
    description: "Paternal talents from outer family line",
  },
  F2: {
    label: "Dad's Talents (Inner)",
    description: "Paternal talents from inner family line",
  },
  G1: {
    label: "Mom's Talents (Outer)",
    description: "Maternal talents from outer family line",
  },
  G2: {
    label: "Mom's Talents (Inner)",
    description: "Maternal talents from inner family line",
  },
  H1: {
    label: "Dad's Karma (Outer)",
    description: "Paternal karma from outer family line",
  },
  H2: {
    label: "Dad's Karma (Inner)",
    description: "Paternal karma from inner family line",
  },
  I1: {
    label: "Mom's Karma (Outer)",
    description: "Maternal karma from outer family line",
  },
  I2: {
    label: "Mom's Karma (Inner)",
    description: "Maternal karma from inner family line",
  },
} as const;

// Karmic Tail positions
export const MATRIX_KARMIC_TAIL = {
  K1: {
    label: "Paternal Karma",
    variableName: "d1", // Different from key
    description: "Inherited karmic patterns from father's line",
  },
  K2: {
    label: "Combined Karma",
    variableName: "d2", // Different from key
    description: "Synthesis of karmic energies",
  },
  K3: {
    label: "Reputation Karma",
    variableName: "d", // Different from key
    description: "Personal karmic expression",
  },
} as const;

/**
 * Get element label by ID
 */
export const getElementLabel = (elementId: string): string => {
  const element =
    MATRIX_INNER_ELEMENTS[elementId as keyof typeof MATRIX_INNER_ELEMENTS] ||
    MATRIX_MAIN_POSITIONS[elementId as keyof typeof MATRIX_MAIN_POSITIONS] ||
    MATRIX_EXTENDED_POSITIONS[elementId as keyof typeof MATRIX_EXTENDED_POSITIONS] ||
    MATRIX_FAMILY_POSITIONS[elementId as keyof typeof MATRIX_FAMILY_POSITIONS] ||
    MATRIX_KARMIC_TAIL[elementId as keyof typeof MATRIX_KARMIC_TAIL];
  return element?.label || elementId;
};

/**
 * Create a position object for mouse events using element ID
 */
export const createElementPosition = (
  elementId: string,
  x: number,
  y: number,
  number: number
) => {
  return {
    x,
    y,
    id: elementId,
    label: getElementLabel(elementId),
    type: "center" as const,
    number,
  };
};
