/**
 * Astrological constants and mappings
 * Translated from Python natal library const.py
 */

// Swiss Ephemeris planet constants
export const PLANETS = {
  Sun: { id: 0, symbol: '☉', name: 'Sun' },
  Moon: { id: 1, symbol: '☽', name: 'Moon' },
  Mercury: { id: 2, symbol: '☿', name: 'Mercury' },
  Venus: { id: 3, symbol: '♀', name: 'Venus' },
  Mars: { id: 4, symbol: '♂', name: 'Mars' },
  Jupiter: { id: 5, symbol: '♃', name: 'Jupiter' },
  Saturn: { id: 6, symbol: '♄', name: 'Saturn' },
  Uranus: { id: 7, symbol: '♅', name: 'Uranus' },
  Neptune: { id: 8, symbol: '♆', name: 'Neptune' },
  Pluto: { id: 9, symbol: '♇', name: 'Pluto' },
  MeanNode: { id: 10, symbol: '☊', name: 'North Node' },
  TrueNode: { id: 11, symbol: '☊', name: 'True Node' },
  MeanApog: { id: 12, symbol: '⚸', name: 'Mean Apogee' },
  OscuApog: { id: 13, symbol: '⚸', name: 'Osculating Apogee' },
  Earth: { id: 14, symbol: '⊕', name: 'Earth' },
  Chiron: { id: 15, symbol: '⚷', name: 'Chiron' },
  Pholus: { id: 16, symbol: '⚴', name: 'Pholus' },
  Ceres: { id: 17, symbol: '⚳', name: 'Ceres' },
  Pallas: { id: 18, symbol: '⚴', name: 'Pallas' },
  Juno: { id: 19, symbol: '⚵', name: 'Juno' },
  Vesta: { id: 20, symbol: '⚶', name: 'Vesta' }
} as const;

// Zodiac signs with characteristics
export const SIGNS = {
  Aries: {
    id: 0,
    symbol: '♈',
    name: 'Aries',
    element: 'Fire',
    modality: 'Cardinal',
    polarity: 'Positive',
    ruler: 'Mars',
    exaltation: 'Sun',
    detriment: 'Venus',
    fall: 'Saturn'
  },
  Taurus: {
    id: 1,
    symbol: '♉',
    name: 'Taurus',
    element: 'Earth',
    modality: 'Fixed',
    polarity: 'Negative',
    ruler: 'Venus',
    exaltation: 'Moon',
    detriment: 'Mars',
    fall: 'Uranus'
  },
  Gemini: {
    id: 2,
    symbol: '♊',
    name: 'Gemini',
    element: 'Air',
    modality: 'Mutable',
    polarity: 'Positive',
    ruler: 'Mercury',
    exaltation: 'North Node',
    detriment: 'Jupiter',
    fall: 'South Node'
  },
  Cancer: {
    id: 3,
    symbol: '♋',
    name: 'Cancer',
    element: 'Water',
    modality: 'Cardinal',
    polarity: 'Negative',
    ruler: 'Moon',
    exaltation: 'Jupiter',
    detriment: 'Saturn',
    fall: 'Mars'
  },
  Leo: {
    id: 4,
    symbol: '♌',
    name: 'Leo',
    element: 'Fire',
    modality: 'Fixed',
    polarity: 'Positive',
    ruler: 'Sun',
    exaltation: 'Pluto',
    detriment: 'Saturn',
    fall: 'Neptune'
  },
  Virgo: {
    id: 5,
    symbol: '♍',
    name: 'Virgo',
    element: 'Earth',
    modality: 'Mutable',
    polarity: 'Negative',
    ruler: 'Mercury',
    exaltation: 'Mercury',
    detriment: 'Jupiter',
    fall: 'Venus'
  },
  Libra: {
    id: 6,
    symbol: '♎',
    name: 'Libra',
    element: 'Air',
    modality: 'Cardinal',
    polarity: 'Positive',
    ruler: 'Venus',
    exaltation: 'Saturn',
    detriment: 'Mars',
    fall: 'Sun'
  },
  Scorpio: {
    id: 7,
    symbol: '♏',
    name: 'Scorpio',
    element: 'Water',
    modality: 'Fixed',
    polarity: 'Negative',
    ruler: 'Mars',
    exaltation: 'Uranus',
    detriment: 'Venus',
    fall: 'Moon'
  },
  Sagittarius: {
    id: 8,
    symbol: '♐',
    name: 'Sagittarius',
    element: 'Fire',
    modality: 'Mutable',
    polarity: 'Positive',
    ruler: 'Jupiter',
    exaltation: 'South Node',
    detriment: 'Mercury',
    fall: 'North Node'
  },
  Capricorn: {
    id: 9,
    symbol: '♑',
    name: 'Capricorn',
    element: 'Earth',
    modality: 'Cardinal',
    polarity: 'Negative',
    ruler: 'Saturn',
    exaltation: 'Mars',
    detriment: 'Moon',
    fall: 'Jupiter'
  },
  Aquarius: {
    id: 10,
    symbol: '♒',
    name: 'Aquarius',
    element: 'Air',
    modality: 'Fixed',
    polarity: 'Positive',
    ruler: 'Saturn',
    exaltation: 'Neptune',
    detriment: 'Sun',
    fall: 'Pluto'
  },
  Pisces: {
    id: 11,
    symbol: '♓',
    name: 'Pisces',
    element: 'Water',
    modality: 'Mutable',
    polarity: 'Negative',
    ruler: 'Jupiter',
    exaltation: 'Venus',
    detriment: 'Mercury',
    fall: 'Mercury'
  }
} as const;

// Aspects with standard orbs
export const ASPECTS = {
  Conjunction: {
    angle: 0,
    orb: 10,
    symbol: '☌',
    name: 'Conjunction',
    type: 'major'
  },
  Sextile: {
    angle: 60,
    orb: 6,
    symbol: '⚹',
    name: 'Sextile',
    type: 'major'
  },
  Square: {
    angle: 90,
    orb: 10,
    symbol: '□',
    name: 'Square',
    type: 'major'
  },
  Trine: {
    angle: 120,
    orb: 10,
    symbol: '△',
    name: 'Trine',
    type: 'major'
  },
  Opposition: {
    angle: 180,
    orb: 10,
    symbol: '☍',
    name: 'Opposition',
    type: 'major'
  },
  Semisextile: {
    angle: 30,
    orb: 3,
    symbol: '⚺',
    name: 'Semisextile',
    type: 'minor'
  },
  Semisquare: {
    angle: 45,
    orb: 3,
    symbol: '∠',
    name: 'Semisquare',
    type: 'minor'
  },
  Sesquiquadrate: {
    angle: 135,
    orb: 3,
    symbol: '⚼',
    name: 'Sesquiquadrate',
    type: 'minor'
  },
  Quincunx: {
    angle: 150,
    orb: 3,
    symbol: '⚻',
    name: 'Quincunx',
    type: 'minor'
  }
} as const;

// House systems
export const HOUSE_SYSTEMS = {
  Placidus: 'P',
  Koch: 'K',
  Equal: 'A',
  Campanus: 'C',
  Meridian: 'X',
  Morinus: 'M',
  Regiomontanus: 'R',
  Topocentric: 'T',
  WholeSign: 'W'
} as const;

// Chart points (Ascendant, MC, etc.)
export const CHART_POINTS = {
  Ascendant: { symbol: 'Asc', name: 'Ascendant' },
  Midheaven: { symbol: 'MC', name: 'Midheaven' },
  Descendant: { symbol: 'Dsc', name: 'Descendant' },
  Imumcoeli: { symbol: 'IC', name: 'Imum Coeli' }
} as const;

// Elements
export const ELEMENTS = {
  Fire: ['Aries', 'Leo', 'Sagittarius'],
  Earth: ['Taurus', 'Virgo', 'Capricorn'],
  Air: ['Gemini', 'Libra', 'Aquarius'],
  Water: ['Cancer', 'Scorpio', 'Pisces']
} as const;

// Modalities
export const MODALITIES = {
  Cardinal: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
  Fixed: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
  Mutable: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces']
} as const;

// Polarities
export const POLARITIES = {
  Positive: ['Aries', 'Gemini', 'Leo', 'Libra', 'Sagittarius', 'Aquarius'],
  Negative: ['Taurus', 'Cancer', 'Virgo', 'Scorpio', 'Capricorn', 'Pisces']
} as const;

// Sign names array for quick lookup
export const SIGN_NAMES = Object.keys(SIGNS) as Array<keyof typeof SIGNS>;

// Planet names array for quick lookup
export const PLANET_NAMES = Object.keys(PLANETS) as Array<keyof typeof PLANETS>;

// Aspect names array for quick lookup
export const ASPECT_NAMES = Object.keys(ASPECTS) as Array<keyof typeof ASPECTS>;

// Utility functions
export const getSignFromDegree = (degree: number): keyof typeof SIGNS => {
  const signIndex = Math.floor(degree / 30);
  return SIGN_NAMES[signIndex];
};

export const getDegreeInSign = (degree: number): number => {
  return degree % 30;
};

export const normalizeAngle = (angle: number): number => {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
};