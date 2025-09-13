/**
 * Comprehensive astrocartography interpretations for planetary lines
 * Provides detailed meanings for planet-line combinations
 */

export interface PlanetLineInterpretation {
  planet: string;
  lineType: 'MC' | 'IC' | 'AC' | 'DC';
  title: string;
  shortDescription: string;
  detailedDescription: string;
  keywords: string[];
  influence: 'strong' | 'moderate' | 'subtle';
  lifeAreas: string[];
}

// Planet characteristics and general meanings
export const PLANET_MEANINGS = {
  sun: {
    name: 'Sun',
    symbol: '☉',
    keywords: ['identity', 'ego', 'vitality', 'leadership', 'creativity'],
    essence: 'Core self, life force, and personal identity'
  },
  moon: {
    name: 'Moon',
    symbol: '☽',
    keywords: ['emotions', 'intuition', 'home', 'family', 'nurturing'],
    essence: 'Emotional nature, instincts, and subconscious patterns'
  },
  mercury: {
    name: 'Mercury',
    symbol: '☿',
    keywords: ['communication', 'intellect', 'travel', 'learning', 'networking'],
    essence: 'Mind, communication, and intellectual pursuits'
  },
  venus: {
    name: 'Venus',
    symbol: '♀',
    keywords: ['love', 'beauty', 'relationships', 'arts', 'harmony'],
    essence: 'Love, beauty, relationships, and aesthetic appreciation'
  },
  mars: {
    name: 'Mars',
    symbol: '♂',
    keywords: ['action', 'energy', 'courage', 'passion', 'competition'],
    essence: 'Drive, ambition, physical energy, and assertiveness'
  },
  jupiter: {
    name: 'Jupiter',
    symbol: '♃',
    keywords: ['expansion', 'wisdom', 'abundance', 'philosophy', 'growth'],
    essence: 'Growth, opportunities, wisdom, and higher learning'
  },
  saturn: {
    name: 'Saturn',
    symbol: '♄',
    keywords: ['discipline', 'structure', 'responsibility', 'mastery', 'limitations'],
    essence: 'Structure, discipline, life lessons, and long-term goals'
  },
  uranus: {
    name: 'Uranus',
    symbol: '♅',
    keywords: ['innovation', 'freedom', 'rebellion', 'technology', 'awakening'],
    essence: 'Innovation, sudden changes, freedom, and awakening'
  },
  neptune: {
    name: 'Neptune',
    symbol: '♆',
    keywords: ['spirituality', 'intuition', 'dreams', 'compassion', 'illusion'],
    essence: 'Spirituality, dreams, intuition, and transcendence'
  },
  pluto: {
    name: 'Pluto',
    symbol: '♇',
    keywords: ['transformation', 'power', 'regeneration', 'depth', 'rebirth'],
    essence: 'Deep transformation, hidden power, and regeneration'
  }
};

// Line type meanings
export const LINE_TYPE_MEANINGS = {
  MC: {
    name: 'Midheaven (MC)',
    description: 'Career, reputation, public image, and life direction',
    focus: 'Professional life and public recognition'
  },
  IC: {
    name: 'Imum Coeli (IC)',
    description: 'Home, family, roots, and inner foundation',
    focus: 'Private life and emotional security'
  },
  AC: {
    name: 'Ascendant (AC)',
    description: 'Identity, appearance, first impressions, and self-expression',
    focus: 'Personal identity and how others see you'
  },
  DC: {
    name: 'Descendant (DC)',
    description: 'Relationships, partnerships, and what you attract',
    focus: 'Partnerships and interpersonal dynamics'
  }
};

// Comprehensive interpretations for each planet-line combination
export const ASTROCARTOGRAPHY_INTERPRETATIONS: PlanetLineInterpretation[] = [
  // SUN LINES
  {
    planet: 'sun',
    lineType: 'MC',
    title: 'Sun MC Line - Leadership & Recognition',
    shortDescription: 'Enhanced leadership abilities and public recognition',
    detailedDescription: 'This powerful line amplifies your natural leadership qualities and brings opportunities for public recognition. Your confidence and vitality shine brightest here, making it an excellent location for career advancement and establishing your reputation.',
    keywords: ['leadership', 'recognition', 'confidence', 'success', 'authority'],
    influence: 'strong',
    lifeAreas: ['career', 'reputation', 'leadership', 'public image']
  },
  {
    planet: 'sun',
    lineType: 'IC',
    title: 'Sun IC Line - Personal Foundation',
    shortDescription: 'Strong sense of home and personal identity',
    detailedDescription: 'This line creates a deep connection to place and strengthens your core identity. It\'s excellent for establishing roots, connecting with family, and building a solid personal foundation from which to grow.',
    keywords: ['home', 'identity', 'foundation', 'family', 'roots'],
    influence: 'strong',
    lifeAreas: ['home', 'family', 'personal growth', 'inner strength']
  },
  {
    planet: 'sun',
    lineType: 'AC',
    title: 'Sun AC Line - Radiant Presence',
    shortDescription: 'Magnetic personality and strong first impressions',
    detailedDescription: 'Your personality radiates confidence and warmth here. This line enhances your natural charisma and helps you make powerful first impressions. Great for networking and personal branding.',
    keywords: ['charisma', 'confidence', 'magnetism', 'presence', 'vitality'],
    influence: 'strong',
    lifeAreas: ['personal image', 'networking', 'self-expression', 'confidence']
  },
  {
    planet: 'sun',
    lineType: 'DC',
    title: 'Sun DC Line - Powerful Partnerships',
    shortDescription: 'Attracts confident, successful partners',
    detailedDescription: 'This line attracts partnerships with confident, successful individuals. Your relationships here tend to be dynamic and growth-oriented, with partners who enhance your own sense of purpose and identity.',
    keywords: ['partnership', 'attraction', 'confidence', 'growth', 'success'],
    influence: 'strong',
    lifeAreas: ['relationships', 'partnerships', 'marriage', 'business alliances']
  },

  // MOON LINES
  {
    planet: 'moon',
    lineType: 'MC',
    title: 'Moon MC Line - Nurturing Career',
    shortDescription: 'Emotionally fulfilling career and public nurturing role',
    detailedDescription: 'Your career here involves caring for others or working with the public in a nurturing capacity. This line is excellent for careers in healthcare, education, hospitality, or any field that serves emotional needs.',
    keywords: ['nurturing', 'caring', 'public service', 'emotional fulfillment', 'intuition'],
    influence: 'moderate',
    lifeAreas: ['career', 'public service', 'healthcare', 'education']
  },
  {
    planet: 'moon',
    lineType: 'IC',
    title: 'Moon IC Line - Emotional Home',
    shortDescription: 'Deep emotional connection to place and family',
    detailedDescription: 'This line creates the strongest possible connection to home and family. It enhances your intuitive abilities and emotional well-being, making it an ideal location for creating a nurturing home environment.',
    keywords: ['home', 'family', 'emotional security', 'intuition', 'nurturing'],
    influence: 'strong',
    lifeAreas: ['home', 'family', 'emotional well-being', 'intuition']
  },
  {
    planet: 'moon',
    lineType: 'AC',
    title: 'Moon AC Line - Intuitive Presence',
    shortDescription: 'Enhanced intuition and emotional sensitivity',
    detailedDescription: 'Your intuitive and emotional nature is highlighted here. You appear more approachable and caring to others, and your psychic sensitivity may be enhanced. Good for healing work and emotional counseling.',
    keywords: ['intuition', 'sensitivity', 'caring', 'approachable', 'psychic'],
    influence: 'moderate',
    lifeAreas: ['intuition', 'healing', 'counseling', 'emotional expression']
  },
  {
    planet: 'moon',
    lineType: 'DC',
    title: 'Moon DC Line - Nurturing Relationships',
    shortDescription: 'Emotionally supportive and caring partnerships',
    detailedDescription: 'This line attracts emotionally supportive partnerships. Your relationships here tend to be nurturing and deeply emotional, with a strong focus on creating security and comfort together.',
    keywords: ['emotional support', 'nurturing', 'security', 'caring', 'comfort'],
    influence: 'moderate',
    lifeAreas: ['relationships', 'emotional bonding', 'family creation', 'support']
  },

  // MERCURY LINES
  {
    planet: 'mercury',
    lineType: 'MC',
    title: 'Mercury MC Line - Communication Career',
    shortDescription: 'Career in communication, education, or technology',
    detailedDescription: 'This line enhances careers involving communication, writing, teaching, or technology. Your intellectual abilities are recognized and valued, making it excellent for media, education, or any field requiring quick thinking.',
    keywords: ['communication', 'writing', 'teaching', 'technology', 'networking'],
    influence: 'moderate',
    lifeAreas: ['career', 'communication', 'education', 'technology', 'media']
  },
  {
    planet: 'mercury',
    lineType: 'IC',
    title: 'Mercury IC Line - Intellectual Foundation',
    shortDescription: 'Stimulating home environment and family learning',
    detailedDescription: 'Your home becomes a center of learning and communication. This line is excellent for working from home, creating a library or study space, and fostering intellectual growth within the family.',
    keywords: ['learning', 'study', 'communication', 'intellectual growth', 'home office'],
    influence: 'moderate',
    lifeAreas: ['home learning', 'family communication', 'study', 'work from home']
  },
  {
    planet: 'mercury',
    lineType: 'AC',
    title: 'Mercury AC Line - Quick Wit & Charm',
    shortDescription: 'Enhanced communication skills and mental agility',
    detailedDescription: 'Your communication skills and mental agility are heightened here. You appear more articulate, witty, and intellectually engaging, making this excellent for networking and building professional connections.',
    keywords: ['communication', 'wit', 'articulation', 'networking', 'mental agility'],
    influence: 'moderate',
    lifeAreas: ['communication', 'networking', 'social connections', 'learning']
  },
  {
    planet: 'mercury',
    lineType: 'DC',
    title: 'Mercury DC Line - Intellectual Partnerships',
    shortDescription: 'Mentally stimulating relationships and partnerships',
    detailedDescription: 'This line attracts intellectually stimulating partnerships. Your relationships here are built on communication, shared learning, and mental compatibility. Great for creative collaborations.',
    keywords: ['intellectual compatibility', 'communication', 'learning together', 'collaboration'],
    influence: 'moderate',
    lifeAreas: ['relationships', 'intellectual partnerships', 'collaboration', 'communication']
  },

  // VENUS LINES
  {
    planet: 'venus',
    lineType: 'MC',
    title: 'Venus MC Line - Creative Success',
    shortDescription: 'Career in arts, beauty, or relationship-focused fields',
    detailedDescription: 'This line brings success in creative fields, beauty industries, or work involving relationships and harmony. Your aesthetic sense and diplomatic skills are professionally valued.',
    keywords: ['creativity', 'beauty', 'arts', 'diplomacy', 'harmony'],
    influence: 'moderate',
    lifeAreas: ['creative career', 'arts', 'beauty industry', 'diplomacy', 'design']
  },
  {
    planet: 'venus',
    lineType: 'IC',
    title: 'Venus IC Line - Beautiful Home',
    shortDescription: 'Harmonious, beautiful home environment',
    detailedDescription: 'Your home becomes a place of beauty, harmony, and comfort. This line enhances your ability to create aesthetically pleasing spaces and brings peace to your domestic life.',
    keywords: ['beauty', 'harmony', 'comfort', 'aesthetics', 'peace'],
    influence: 'moderate',
    lifeAreas: ['home decoration', 'family harmony', 'comfort', 'aesthetics']
  },
  {
    planet: 'venus',
    lineType: 'AC',
    title: 'Venus AC Line - Magnetic Charm',
    shortDescription: 'Enhanced attractiveness and social grace',
    detailedDescription: 'Your natural charm and attractiveness are amplified here. You appear more beautiful, graceful, and socially appealing, making this excellent for social situations and romantic encounters.',
    keywords: ['charm', 'attractiveness', 'grace', 'social appeal', 'beauty'],
    influence: 'moderate',
    lifeAreas: ['social life', 'romance', 'personal style', 'attractiveness']
  },
  {
    planet: 'venus',
    lineType: 'DC',
    title: 'Venus DC Line - Love & Romance',
    shortDescription: 'Enhanced romantic opportunities and harmonious relationships',
    detailedDescription: 'This is one of the most favorable lines for romance and love. It attracts beautiful, harmonious relationships and enhances your ability to create loving partnerships.',
    keywords: ['love', 'romance', 'harmony', 'beauty', 'attraction'],
    influence: 'strong',
    lifeAreas: ['romance', 'love', 'marriage', 'harmonious relationships']
  },

  // MARS LINES
  {
    planet: 'mars',
    lineType: 'MC',
    title: 'Mars MC Line - Dynamic Leadership',
    shortDescription: 'Aggressive career advancement and competitive success',
    detailedDescription: 'This line supercharges your career ambition and competitive drive. Excellent for leadership roles, entrepreneurship, or any field requiring courage and decisive action.',
    keywords: ['ambition', 'leadership', 'competition', 'courage', 'action'],
    influence: 'strong',
    lifeAreas: ['career advancement', 'leadership', 'entrepreneurship', 'competition']
  },
  {
    planet: 'mars',
    lineType: 'IC',
    title: 'Mars IC Line - Active Home Life',
    shortDescription: 'Energetic home environment and family dynamics',
    detailedDescription: 'Your home life is energized and active here. While this can bring motivation and productivity to domestic projects, it may also increase family tensions or conflicts.',
    keywords: ['energy', 'activity', 'motivation', 'tension', 'productivity'],
    influence: 'strong',
    lifeAreas: ['home projects', 'family dynamics', 'domestic energy', 'activity']
  },
  {
    planet: 'mars',
    lineType: 'AC',
    title: 'Mars AC Line - Bold Presence',
    shortDescription: 'Increased assertiveness and physical energy',
    detailedDescription: 'Your assertiveness and physical presence are amplified here. You appear more confident, energetic, and sometimes aggressive. Great for athletic pursuits and taking initiative.',
    keywords: ['assertiveness', 'confidence', 'energy', 'boldness', 'initiative'],
    influence: 'strong',
    lifeAreas: ['physical fitness', 'assertiveness', 'leadership', 'initiative']
  },
  {
    planet: 'mars',
    lineType: 'DC',
    title: 'Mars DC Line - Passionate Relationships',
    shortDescription: 'Intense, passionate partnerships with potential conflicts',
    detailedDescription: 'This line brings passionate, dynamic relationships that can be both exciting and challenging. Partnerships here tend to be intense, with both great chemistry and potential conflicts.',
    keywords: ['passion', 'intensity', 'chemistry', 'conflict', 'dynamics'],
    influence: 'strong',
    lifeAreas: ['passionate relationships', 'conflicts', 'chemistry', 'intensity']
  },

  // JUPITER LINES
  {
    planet: 'jupiter',
    lineType: 'MC',
    title: 'Jupiter MC Line - Expansion & Success',
    shortDescription: 'Career growth, opportunities, and recognition',
    detailedDescription: 'This highly beneficial line brings career expansion, opportunities, and recognition. Excellent for growth in any field, particularly education, law, publishing, or international business.',
    keywords: ['growth', 'opportunities', 'success', 'expansion', 'recognition'],
    influence: 'strong',
    lifeAreas: ['career growth', 'opportunities', 'education', 'international business']
  },
  {
    planet: 'jupiter',
    lineType: 'IC',
    title: 'Jupiter IC Line - Abundant Home',
    shortDescription: 'Prosperous, expanding home and family life',
    detailedDescription: 'This line brings abundance and growth to your home and family life. Excellent for real estate investments, family expansion, and creating a prosperous domestic foundation.',
    keywords: ['abundance', 'growth', 'prosperity', 'expansion', 'family'],
    influence: 'strong',
    lifeAreas: ['home prosperity', 'family growth', 'real estate', 'abundance']
  },
  {
    planet: 'jupiter',
    lineType: 'AC',
    title: 'Jupiter AC Line - Optimistic Presence',
    shortDescription: 'Enhanced wisdom, optimism, and good fortune',
    detailedDescription: 'Your wisdom, optimism, and natural good fortune are amplified here. People see you as knowledgeable and trustworthy, making this excellent for teaching, counseling, or advisory roles.',
    keywords: ['wisdom', 'optimism', 'good fortune', 'trustworthy', 'knowledge'],
    influence: 'strong',
    lifeAreas: ['teaching', 'counseling', 'wisdom sharing', 'good fortune']
  },
  {
    planet: 'jupiter',
    lineType: 'DC',
    title: 'Jupiter DC Line - Beneficial Partnerships',
    shortDescription: 'Fortunate, growth-oriented relationships',
    detailedDescription: 'This line attracts beneficial, growth-oriented partnerships. Your relationships here tend to be optimistic, supportive, and focused on mutual expansion and learning.',
    keywords: ['beneficial partnerships', 'growth', 'optimism', 'support', 'learning'],
    influence: 'strong',
    lifeAreas: ['beneficial relationships', 'partnership growth', 'mutual support']
  },

  // SATURN LINES
  {
    planet: 'saturn',
    lineType: 'MC',
    title: 'Saturn MC Line - Disciplined Achievement',
    shortDescription: 'Structured career growth through discipline and hard work',
    detailedDescription: 'This line brings serious, long-term career building through discipline and hard work. While challenging, it offers the potential for lasting achievement and respected authority.',
    keywords: ['discipline', 'structure', 'achievement', 'authority', 'mastery'],
    influence: 'strong',
    lifeAreas: ['career mastery', 'long-term goals', 'authority', 'discipline']
  },
  {
    planet: 'saturn',
    lineType: 'IC',
    title: 'Saturn IC Line - Solid Foundation',
    shortDescription: 'Serious approach to home and family responsibilities',
    detailedDescription: 'This line brings a serious, responsible approach to home and family. While it may feel restrictive, it helps build solid, lasting foundations and teaches important life lessons.',
    keywords: ['responsibility', 'structure', 'foundation', 'lessons', 'stability'],
    influence: 'strong',
    lifeAreas: ['home stability', 'family responsibility', 'life lessons', 'foundation']
  },
  {
    planet: 'saturn',
    lineType: 'AC',
    title: 'Saturn AC Line - Mature Presence',
    shortDescription: 'Serious, mature appearance and approach to life',
    detailedDescription: 'You appear more serious, mature, and authoritative here. While this commands respect, it may also feel restrictive or create pressure to always be responsible.',
    keywords: ['maturity', 'authority', 'seriousness', 'responsibility', 'respect'],
    influence: 'strong',
    lifeAreas: ['authority', 'maturity', 'responsibility', 'respect']
  },
  {
    planet: 'saturn',
    lineType: 'DC',
    title: 'Saturn DC Line - Committed Relationships',
    shortDescription: 'Serious, long-term partnerships with lessons to learn',
    detailedDescription: 'This line attracts serious, committed partnerships that often involve important life lessons. Relationships here tend to be stable but may require significant work and patience.',
    keywords: ['commitment', 'stability', 'lessons', 'patience', 'maturity'],
    influence: 'strong',
    lifeAreas: ['committed relationships', 'marriage', 'partnership lessons', 'stability']
  }
];

// Function to get interpretation for a specific planet-line combination
export function getAstrocartographyInterpretation(planet: string, lineType: 'MC' | 'IC' | 'AC' | 'DC'): PlanetLineInterpretation | null {
  return ASTROCARTOGRAPHY_INTERPRETATIONS.find(
    interpretation => interpretation.planet === planet.toLowerCase() && interpretation.lineType === lineType
  ) || null;
}

// Function to get planet information
export function getPlanetInfo(planet: string) {
  return PLANET_MEANINGS[planet.toLowerCase() as keyof typeof PLANET_MEANINGS] || null;
}

// Function to get line type information
export function getLineTypeInfo(lineType: 'MC' | 'IC' | 'AC' | 'DC') {
  return LINE_TYPE_MEANINGS[lineType] || null;
}

// Zodiac sign meanings for stellium interpretations
export const SIGN_MEANINGS = {
  aries: "intense pioneering energy and drive for independence",
  taurus: "strong focus on stability, material security, and sensual pleasures", 
  gemini: "heightened communication skills and intellectual curiosity",
  cancer: "deep emotional sensitivity and strong family connections",
  leo: "powerful creative expression and natural leadership abilities",
  virgo: "exceptional attention to detail and desire for perfection",
  libra: "strong emphasis on relationships, harmony, and aesthetic beauty",
  scorpio: "intense emotional depth and transformative power",
  sagittarius: "expansive worldview and philosophical nature",
  capricorn: "ambitious drive for achievement and practical leadership",
  aquarius: "innovative thinking and humanitarian ideals",
  pisces: "heightened intuition and spiritual sensitivity"
};

// House meanings for stellium interpretations
export const HOUSE_MEANINGS = {
  1: "strong focus on self-identity and personal presentation",
  2: "emphasis on values, resources, and material security", 
  3: "heightened communication and learning abilities",
  4: "deep connection to home, family, and emotional roots",
  5: "powerful creative expression and romantic nature",
  6: "strong focus on work, health, and daily routines",
  7: "emphasis on partnerships and one-on-one relationships",
  8: "intense involvement with transformation and shared resources", 
  9: "expansion through higher learning and philosophical pursuits",
  10: "strong drive for career achievement and public recognition",
  11: "emphasis on friendships, groups, and humanitarian goals",
  12: "deep spiritual inclinations and subconscious exploration"
};