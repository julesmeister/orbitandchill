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
    label: 'Heart/Wishes',
    variableName: 'earthPurpose', // Different from key
    description: 'Material world purpose and desires'
  },
  POWER_OF_ANCESTORS: {
    label: 'Power of Ancestors',
    variableName: 'heart', // Different from key
    description: 'Ancestral wisdom and inherited power'
  },
  FUTURE_CHILDREN: {
    label: 'Future Children',
    variableName: 'guard', // Different from key
    description: 'Protective energy and legacy'
  },
  TALENT: {
    label: 'Talent',
    // variableName same as key, so omitted
    description: 'Natural abilities and gifts'
  }
} as const;

// Main octagram positions - key is the ID, variableName same as key so omitted
export const MATRIX_MAIN_POSITIONS = {
  A: {
    label: 'Day Energy',
    description: 'Personal character and talents'
  },
  B: {
    label: 'Month Energy', 
    description: 'Emotional nature and inner world'
  },
  C: {
    label: 'Year Energy',
    description: 'Life purpose and destiny path'
  },
  D: {
    label: 'Karmic Number',
    description: 'Lessons to learn in this lifetime'
  },
  E: {
    label: 'Personal Center',
    description: 'Core essence and identity'
  },
  F: {
    label: 'Past Heritage',
    description: 'Ancestral influences and gifts'
  },
  G: {
    label: 'Talents',
    description: 'Natural abilities and skills'
  },
  H: {
    label: 'Material Karma',
    description: 'Lessons related to material world'
  },
  I: {
    label: 'Spiritual Task',
    description: 'Spiritual growth and evolution'
  },
  J: {
    label: 'Family Center',
    description: 'Family dynamics and heritage'
  }
} as const;

// Karmic Tail positions
export const MATRIX_KARMIC_TAIL = {
  K1: {
    label: 'Paternal Karma',
    variableName: 'd1', // Different from key
    description: 'Inherited karmic patterns from father\'s line'
  },
  K2: {
    label: 'Combined Karma', 
    variableName: 'd2', // Different from key
    description: 'Synthesis of karmic energies'
  },
  K3: {
    label: 'Day Energy Karma',
    variableName: 'd', // Different from key
    description: 'Personal karmic expression'
  }
} as const;

/**
 * Get element label by ID
 */
export const getElementLabel = (elementId: string): string => {
  const element = MATRIX_INNER_ELEMENTS[elementId as keyof typeof MATRIX_INNER_ELEMENTS] || 
                  MATRIX_MAIN_POSITIONS[elementId as keyof typeof MATRIX_MAIN_POSITIONS] || 
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
    type: 'center' as const,
    number
  };
};