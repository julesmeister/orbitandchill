/* eslint-disable @typescript-eslint/no-unused-vars */

// Synapsas color palette
export const synapsasColors = {
  black: '#19181a',
  purple: '#ff91e9', 
  green: '#51bd94',
  yellow: '#f2e356',
  blue: '#6bdbff',
  lightPurple: '#f0e3ff',
  lightYellow: '#fffbed', 
  lightGreen: '#e7fff6'
};

// Matrix position definitions
export const matrixPositions = {
  main: [
    { key: 'A', label: 'Reputation', description: 'Personal character and talents' },
    { key: 'B', label: 'Inspiration', description: 'Emotional nature and inner world' },
    { key: 'C', label: 'Money Block', description: 'Life purpose and destiny path' },
    { key: 'D', label: 'Biggest Obstacle', description: 'Lessons to learn in this lifetime' },
    { key: 'E', label: 'Comfort Zone', description: 'Core essence and identity' }
  ],
  ancestral: [
    { key: 'F', label: 'Dad\'s Talents', description: 'Ancestral influences and gifts' },
    { key: 'G', label: 'Mom\'s Talents', description: 'Natural abilities and skills' },
    { key: 'H', label: 'Dad\'s Karma', description: 'Lessons related to material world' },
    { key: 'I', label: 'Mom\'s Karma', description: 'Spiritual growth and evolution' }
  ],
  lifeAspects: [
    { key: 'J', label: 'Past Life Mistakes', description: 'Karmic patterns to heal' },
    { key: 'K', label: 'Income Streams', description: 'Financial abundance sources' },
    { key: 'L', label: 'Work Life Balance', description: 'Professional harmony' },
    { key: 'M', label: 'Love Ingredients', description: 'Relationship foundations' },
    { key: 'N', label: 'Past Life Income', description: 'Previous wealth patterns' },
    { key: 'O', label: 'As a Parent', description: 'Parenting qualities and gifts' }
  ],
  soulPath: [
    { key: 'P', label: 'Higher Self', description: 'Spiritual potential and wisdom' },
    { key: 'Q', label: 'Money Mindset', description: 'Past life financial beliefs' },
    { key: 'R', label: 'Life Task', description: 'Present incarnation purpose' },
    { key: 'V', label: 'Sexuality', description: 'Intimate energy and expression' }
  ],
  special: [
    { key: 'POA', label: 'Power of Ancestors', description: 'Inherited spiritual gifts and wisdom' },
    { key: 'T', label: 'Heart\'s Desire', description: 'Soul\'s deepest yearning and purpose' }
  ],
  generational: [
    { key: 'F1', label: 'Dad Line 1', description: 'Paternal heritage flow' },
    { key: 'F2', label: 'Dad Line 2', description: 'Secondary paternal gifts' },
    { key: 'G1', label: 'Mom Line 1', description: 'Maternal heritage flow' },
    { key: 'G2', label: 'Mom Line 2', description: 'Secondary maternal gifts' },
    { key: 'H1', label: 'Material 1', description: 'Primary material karma' },
    { key: 'H2', label: 'Material 2', description: 'Secondary material lessons' },
    { key: 'I1', label: 'Spiritual 1', description: 'Primary spiritual task' },
    { key: 'I2', label: 'Spiritual 2', description: 'Secondary spiritual growth' }
  ]
};

// Default matrix values
export const defaultMatrixValues: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17,
  R: 18, T: 20, V: 22, POA: 11,
  F1: 1, F2: 2, G1: 3, G2: 4, H1: 5, H2: 6, I1: 7, I2: 8
};