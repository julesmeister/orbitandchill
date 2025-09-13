import { TimingPriority, PriorityCriteria } from './types';

// Astrological timing priorities configuration
export const timingPriorities: TimingPriority[] = [
  { id: 'career', label: 'Career & Business', icon: '💼', description: 'Jupiter/Saturn aspects, 10th house, Mercury for contracts' },
  { id: 'love', label: 'Love & Romance', icon: '❤️', description: 'Venus aspects, 5th/7th house activity' },
  { id: 'creativity', label: 'Creative Projects', icon: '🎨', description: 'Neptune/Venus aspects, 5th house' },
  { id: 'money', label: 'Financial Gains', icon: '💰', description: 'Jupiter/Venus in 2nd house (wealth) or 8th house (investments)' },
  { id: 'health', label: 'Health & Wellness', icon: '🌿', description: 'Sun/Mars harmonious aspects' },
  { id: 'spiritual', label: 'Spiritual Growth', icon: '🔮', description: 'Neptune/Jupiter aspects, 12th house' },
  { id: 'communication', label: 'Important Talks', icon: '💬', description: 'Mercury aspects, 3rd house' },
  { id: 'travel', label: 'Travel & Adventure', icon: '✈️', description: 'Jupiter/Sagittarius energy, 9th house' },
  { id: 'home', label: 'Home & Family', icon: '🏠', description: 'Moon aspects, 4th house transits' },
  { id: 'learning', label: 'Education & Study', icon: '📚', description: 'Mercury/Jupiter aspects, 3rd/9th houses' }
];

// Astrological criteria for each priority
export const priorityCriteria: Record<string, PriorityCriteria> = {
  career: {
    favorablePlanets: ['jupiter', 'saturn', 'sun', 'mars', 'mercury'],
    favorableHouses: [10, 1, 6, 3], // Career, identity, work, communication
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      jupiter: 1.5, saturn: 1.2, sun: 1.2, mars: 1.0, mercury: 1.8, // Mercury important for contracts/business
      house10: 2.0, house1: 1.5, house6: 1.5, house3: 1.3
    }
  },
  love: {
    favorablePlanets: ['venus', 'moon', 'jupiter'],
    favorableHouses: [7, 5, 11], // Relationships, romance, friendships
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      venus: 2.0, moon: 1.2, jupiter: 1.2,
      house7: 2.0, house5: 1.8, house11: 1.2
    },
    comboCriteria: [
      {
        id: 'venus_jupiter_7th',
        name: 'Venus & Jupiter in 7th House',
        description: 'Perfect marriage and partnership energy',
        planets: ['venus', 'jupiter'],
        house: 7,
        bonus: 1.2
      },
      {
        id: 'venus_moon_5th',
        name: 'Venus & Moon in 5th House',
        description: 'Romance, attraction, and emotional connection',
        planets: ['venus', 'moon'],
        house: 5,
        bonus: 1.0
      },
      {
        id: 'venus_jupiter_5th',
        name: 'Venus & Jupiter in 5th House',
        description: 'Joy, romance, and abundant love',
        planets: ['venus', 'jupiter'],
        house: 5,
        bonus: 1.1,
        type: 'favorable'
      },
      {
        id: 'mars_saturn_7th',
        name: 'Mars & Saturn in 7th House',
        description: 'Relationship conflicts and commitment issues',
        planets: ['mars', 'saturn'],
        house: 7,
        bonus: -1.0,
        type: 'challenging'
      },
      {
        id: 'mars_pluto_5th',
        name: 'Mars & Pluto in 5th House',
        description: 'Intense, possibly obsessive romantic energy',
        planets: ['mars', 'pluto'],
        house: 5,
        bonus: -0.8,
        type: 'challenging'
      }
    ]
  },
  creativity: {
    favorablePlanets: ['venus', 'neptune', 'moon', 'sun'],
    favorableHouses: [5, 3, 11], // Creativity, communication, inspiration
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      venus: 1.5, neptune: 1.5, moon: 1.2, sun: 1.2,
      house5: 2.0, house3: 1.2, house11: 1.2
    }
  },
  money: {
    favorablePlanets: ['jupiter', 'venus', 'sun'],
    favorableHouses: [2, 8], // Resources, investments only
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      jupiter: 2.0, venus: 1.5, sun: 1.2,
      house2: 2.0, house8: 1.8
    },
    comboCriteria: [
      {
        id: 'jupiter_venus_2nd',
        name: 'Jupiter & Venus in 2nd House',
        description: 'Ultimate wealth combination - abundance and money together',
        planets: ['jupiter', 'venus'],
        house: 2,
        bonus: 1.5
      },
      {
        id: 'jupiter_sun_2nd',
        name: 'Jupiter & Sun in 2nd House',
        description: 'Success and abundance in personal resources',
        planets: ['jupiter', 'sun'],
        house: 2,
        bonus: 1.2
      },
      {
        id: 'venus_sun_8th',
        name: 'Venus & Sun in 8th House',
        description: 'Success in investments and shared resources',
        planets: ['venus', 'sun'],
        house: 8,
        bonus: 1.0,
        type: 'favorable'
      },
      {
        id: 'mars_saturn_2nd',
        name: 'Mars & Saturn in 2nd House',
        description: 'Financial restrictions and aggressive spending',
        planets: ['mars', 'saturn'],
        house: 2,
        bonus: -1.2,
        type: 'challenging'
      },
      {
        id: 'mars_pluto_8th',
        name: 'Mars & Pluto in 8th House',
        description: 'High-risk investment energy, financial power struggles',
        planets: ['mars', 'pluto'],
        house: 8,
        bonus: -1.5,
        type: 'challenging'
      }
    ]
  },
  health: {
    favorablePlanets: ['sun', 'mars', 'jupiter'],
    favorableHouses: [1, 6, 12], // Vitality, health, healing
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      sun: 2.0, mars: 1.2, jupiter: 1.2,
      house1: 1.8, house6: 2.0, house12: 1.2
    }
  },
  spiritual: {
    favorablePlanets: ['neptune', 'jupiter', 'moon', 'pluto'],
    favorableHouses: [12, 9, 4], // Spirituality, wisdom, inner life
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      neptune: 2.0, jupiter: 1.8, moon: 1.2, pluto: 1.2,
      house12: 2.0, house9: 1.8, house4: 1.2
    }
  },
  communication: {
    favorablePlanets: ['mercury', 'jupiter', 'venus'],
    favorableHouses: [3, 9, 11], // Communication, learning, networking
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      mercury: 2.0, jupiter: 1.2, venus: 1.2,
      house3: 2.0, house9: 1.8, house11: 1.2
    }
  },
  travel: {
    favorablePlanets: ['jupiter', 'mercury', 'sun'],
    favorableHouses: [9, 3, 12], // Travel, learning, adventure
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      jupiter: 2.0, mercury: 1.2, sun: 1.2,
      house9: 2.0, house3: 1.2, house12: 1.2
    }
  },
  home: {
    favorablePlanets: ['moon', 'venus', 'jupiter'],
    favorableHouses: [4, 2, 10], // Home, security, foundation
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      moon: 2.0, venus: 1.8, jupiter: 1.2,
      house4: 2.0, house2: 1.2, house10: 1.2
    }
  },
  learning: {
    favorablePlanets: ['mercury', 'jupiter', 'uranus'],
    favorableHouses: [3, 9, 11], // Learning, teaching, innovation
    favorableAspects: ['trine', 'sextile', 'conjunction'],
    challengingAspects: ['square', 'opposition'],
    weight: {
      mercury: 2.0, jupiter: 1.8, uranus: 1.2,
      house3: 1.8, house9: 2.0, house11: 1.2
    }
  }
};