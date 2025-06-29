/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Significators Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive significator assignment and natural planetary
 * rulerships for horary astrology, following traditional principles.
 */

export interface PlanetarySignificator {
  planet: string;
  isMainSignificator: boolean;
  isCoSignificator: boolean;
  housesRuled: number[];
  significatorOf: string[];
  confidence: 'high' | 'medium' | 'low';
  alternativeInterpretations?: string[];
}

export interface NaturalRulership {
  planet: string;
  qualities: string[];
  temperament: string;
  gender: string;
  sect: string; // diurnal or nocturnal
  objects: string[];
  people: string[];
  concepts: string[];
  animals: string[];
  bodyParts: string[];
  age: string;
  colors: string[];
  metals: string[];
  gems: string[];
}

export interface SignificatorAssignment {
  querent: {
    mainSignificator: string; // Lord 1
    coSignificator?: string; // Moon, if available
  };
  quesited: {
    mainSignificator: string;
    house: number;
    description: string;
  };
  otherPlanets: PlanetarySignificator[];
}

// Traditional planetary rulers for signs
export const SIGN_RULERS: { [key: string]: string } = {
  'Aries': 'Mars',
  'Taurus': 'Venus',
  'Gemini': 'Mercury',
  'Cancer': 'Moon',
  'Leo': 'Sun',
  'Virgo': 'Mercury',
  'Libra': 'Venus',
  'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn',
  'Aquarius': 'Saturn',
  'Pisces': 'Jupiter'
};

// Natural planetary rulerships based on Frawley's descriptions
export const NATURAL_RULERSHIPS: NaturalRulership[] = [
  {
    planet: 'Saturn',
    qualities: ['Cold', 'Dry', 'Old', 'Black', 'Hard', 'Heavy', 'Dead', 'Decayed', 'Restrictive', 'Solitary', 'Sad'],
    temperament: 'Cold and Dry',
    gender: 'Masculine',
    sect: 'Diurnal',
    objects: [
      'Root vegetables', 'Liquorice', 'Mildew', 'Waste products', 'Refuse', 'Lead', 'Locks',
      'Opium', 'Yew trees', 'Prisons', 'Ruins', 'Toilets', 'Sapphire', 'Lapis lazuli'
    ],
    people: [
      'Plumbers', 'Sewermen', 'Undertakers', 'Miners', 'Farm laborers', 'Gardeners',
      'Fathers (night charts)', 'Old people', 'Disciplinarians'
    ],
    concepts: [
      'Discipline', 'Agriculture', 'Time', 'Limitation', 'Structure', 'Boundaries',
      'Death', 'Decay', 'Preservation', 'Addiction', 'Barriers'
    ],
    animals: [
      'Moles', 'Dogs', 'Cats', 'Scavengers', 'Things that live under stones'
    ],
    bodyParts: [
      'Right ear', 'Bones', 'Teeth', 'Skin', 'Joints', 'Spleen'
    ],
    age: 'Old age',
    colors: ['Black', 'Dark colors'],
    metals: ['Lead'],
    gems: ['Sapphire', 'Lapis lazuli']
  },
  {
    planet: 'Jupiter',
    qualities: ['Hot', 'Moist', 'Big', 'Expansive', 'Expensive', 'Luxurious', 'Religious', 'Purple', 'Laxative', 'Generous'],
    temperament: 'Hot and Moist',
    gender: 'Masculine',
    sect: 'Diurnal',
    objects: [
      'Fruit trees', 'Rhubarb', 'Foie gras', 'Rain', 'Ivy', 'Feasts',
      'Amethyst', 'Emerald', 'Crystal', 'Tin'
    ],
    people: [
      'Rich men', 'Aristocrats', 'Judges', 'Priests', 'Teachers', 'Gurus',
      'Authority figures', 'Benefactors', 'Philosophers'
    ],
    concepts: [
      'Abundance', 'Mercy', 'Justice', 'Religion', 'Higher learning', 'Expansion',
      'Good fortune', 'Generosity', 'Wisdom', 'Law'
    ],
    animals: [
      'Big animals', 'Gentle animals', 'Animals beneficial to mankind',
      'Horses', 'Elephants', 'Whales'
    ],
    bodyParts: [
      'Left ear', 'Lungs', 'Liver', 'Blood', 'Semen'
    ],
    age: 'Mature adulthood',
    colors: ['Purple', 'Blue', 'Rich colors'],
    metals: ['Tin'],
    gems: ['Amethyst', 'Sapphire', 'Emerald', 'Crystal']
  },
  {
    planet: 'Mars',
    qualities: ['Hot', 'Dry', 'Sharp', 'Burning', 'Cutting', 'Red', 'Abrasive', 'Aggressive'],
    temperament: 'Hot and Dry',
    gender: 'Masculine',
    sect: 'Nocturnal',
    objects: [
      'Peppers', 'Garlic', 'Radishes', 'Nettles', 'Thistles', 'Iron',
      'Sharp tools', 'Weapons', 'Fire', 'Bloodstone', 'Jasper', 'Coral'
    ],
    people: [
      'Soldiers', 'Butchers', 'Tailors', 'Surgeons', 'Barbers', 'Pirates',
      'Firemen', 'Executioners', 'Cooks', 'Alchemists', 'Athletes'
    ],
    concepts: [
      'War', 'Conflict', 'Energy', 'Passion', 'Anger', 'Divorce', 'Fevers',
      'Lust', 'Competition', 'Action', 'Courage', 'Aggression'
    ],
    animals: [
      'Fierce animals', 'Fiery creatures', 'Things that bite or sting',
      'Wasps', 'Scorpions', 'Wolves', 'Hawks'
    ],
    bodyParts: [
      'Gall bladder', 'Genitals (especially male)', 'Muscles', 'Blood'
    ],
    age: 'Young adulthood',
    colors: ['Red', 'Fiery colors'],
    metals: ['Iron', 'Steel'],
    gems: ['Bloodstone', 'Jasper', 'Coral', 'Ruby']
  },
  {
    planet: 'Sun',
    qualities: ['Hot', 'Dry', 'Unique', 'Royal', 'Golden', 'Life-giving', 'Honest'],
    temperament: 'Hot and Dry',
    gender: 'Masculine',
    sect: 'Diurnal',
    objects: [
      'All food', 'Staple foods', 'Citrus fruit', 'Sunflowers', 'Marigolds',
      'Gold', 'Diamond', 'Amber', 'Palaces', 'Grand buildings'
    ],
    people: [
      'Kings', 'Rulers', 'Leaders', 'Fathers (day charts)', 'Goldsmiths',
      'Minters', 'Authority figures', 'Celebrities', 'CEOs'
    ],
    concepts: [
      'Leadership', 'Authority', 'Pride', 'Honor', 'Vitality', 'Life force',
      'Consciousness', 'Identity', 'Recognition', 'Success'
    ],
    animals: [
      'Lions (king of beasts)', 'Eagles (king of birds)', 'Roosters',
      'Noble animals', 'Animals that symbolize leadership'
    ],
    bodyParts: [
      'Heart', 'Brain (controlling principle)', 'Vital spirit', 'Eyes',
      'Right eye (males)', 'Left eye (females)'
    ],
    age: 'Prime of life',
    colors: ['Gold', 'Yellow', 'Orange', 'Bright colors'],
    metals: ['Gold'],
    gems: ['Diamond', 'Amber', 'Topaz']
  },
  {
    planet: 'Venus',
    qualities: ['Cold', 'Moist', 'Soft', 'Pretty', 'Fragrant', 'Attractive', 'Pleasant'],
    temperament: 'Cold and Moist',
    gender: 'Feminine',
    sect: 'Nocturnal',
    objects: [
      'Flowers', 'Soft fruit', 'Chocolate', 'Beds', 'Wardrobes', 'Copper',
      'Brass', 'Perfume', 'Makeup', 'Art', 'Music', 'Jewelry'
    ],
    people: [
      'Wives', 'Young women', 'Mothers (day charts)', 'Jewelers', 'Musicians',
      'Artists', 'Beauticians', 'Prostitutes', 'Drapers', 'Decorators'
    ],
    concepts: [
      'Love', 'Beauty', 'Harmony', 'Marriage', 'Treaties', 'Peace',
      'Art', 'Pleasure', 'Attraction', 'Relationships', 'Values'
    ],
    animals: [
      'Soft and cuddly animals', 'Children\'s zoo animals', 'Doves',
      'Rabbits', 'Cats', 'Beautiful animals'
    ],
    bodyParts: [
      'Kidneys', 'Sense of smell', 'Genitals (especially female)',
      'Skin', 'Throat', 'Venus'
    ],
    age: 'Youth to young adulthood',
    colors: ['Green', 'Pink', 'Soft colors'],
    metals: ['Copper', 'Brass'],
    gems: ['Cornelian', 'Azure sapphire', 'Beryl', 'Chrysolite']
  },
  {
    planet: 'Mercury',
    qualities: ['Cold', 'Dry', 'Parti-colored', 'Ambiguous', 'Dextrous', 'Tricky', 'Mixed'],
    temperament: 'Cold and Dry',
    gender: 'Mixed (adapts to other planets)',
    sect: 'Diurnal if Oriental, Nocturnal if Occidental',
    objects: [
      'Documents', 'Books', 'Papers', 'Keys', 'Computers', 'Sweet & sour sauce',
      'Cocktails', 'Pizza', 'Berries', 'Walnuts', 'Beans', 'Small numerous things'
    ],
    people: [
      'Merchants', 'Clerks', 'Accountants', 'Scribes', 'Messengers', 'Media people',
      'Doctors', 'Lawyers', 'Astrologers', 'Thieves', 'Servants', 'Tricksters'
    ],
    concepts: [
      'Communication', 'Knowledge', 'Trade', 'Variety', 'Versatility',
      'Intelligence', 'Cunning', 'Movement', 'Connection', 'Information'
    ],
    animals: [
      'Monkeys', 'Parrots', 'Puppets', 'Bees', 'Hyenas', 'Things that speak',
      'Things that resemble humans', 'Small quick animals'
    ],
    bodyParts: [
      'Tongue', 'Brain (seat of reason)', 'Arms', 'Hands', 'Fingers',
      'Nervous system'
    ],
    age: 'Childhood to adolescence',
    colors: ['Multi-colored', 'Mixed colors', 'Variegated'],
    metals: ['Mercury (quicksilver)'],
    gems: ['Agate', 'Mixed stones']
  },
  {
    planet: 'Moon',
    qualities: ['Cold', 'Moist', 'Liquid', 'Soft', 'Little flavor', 'Formless', 'White', 'New'],
    temperament: 'Cold and Moist',
    gender: 'Feminine',
    sect: 'Nocturnal',
    objects: [
      'Cabbages', 'Cucumbers', 'Melons', 'Mushrooms', 'Candles', 'Lost objects',
      'Intoxicants', 'Pearls', 'Moonstone', 'Alabaster', 'Water', 'Mirrors'
    ],
    people: [
      'Babies', 'Mothers (night charts)', 'Midwives', 'Queens (as wives)',
      'Common people', 'Tramps', 'Pilgrims', 'Sailors', 'Nurses', 'Cleaners'
    ],
    concepts: [
      'Emotions', 'Instinct', 'Change', 'Cycles', 'Memory', 'Nurturing',
      'Receptivity', 'Reflection', 'Subconscious', 'Habits', 'Home'
    ],
    animals: [
      'Water creatures', 'Fish', 'Otters', 'Frogs', 'Ducks', 'Oysters',
      'Night creatures', 'Slugs', 'Owls', 'Nocturnal animals'
    ],
    bodyParts: [
      'Breasts', 'Womb', 'Belly', 'Intestines', 'Stomach', 'Left eye (males)',
      'Right eye (females)'
    ],
    age: 'Infancy',
    colors: ['White', 'Silver', 'Pale colors'],
    metals: ['Silver'],
    gems: ['Pearl', 'Moonstone', 'Alabaster']
  }
];

// Age progression for planetary associations
export const PLANETARY_AGES = [
  { planet: 'Moon', age: 'Infancy (0-4)', description: 'Babies, new beginnings' },
  { planet: 'Mercury', age: 'Childhood (4-14)', description: 'Learning, communication' },
  { planet: 'Venus', age: 'Youth (14-22)', description: 'Beauty, first love' },
  { planet: 'Sun', age: 'Young Adult (22-41)', description: 'Prime of life, leadership' },
  { planet: 'Mars', age: 'Mature Adult (41-56)', description: 'Vigor, achievement' },
  { planet: 'Jupiter', age: 'Elder (56-68)', description: 'Wisdom, authority' },
  { planet: 'Saturn', age: 'Old Age (68+)', description: 'Experience, limitation' }
];

// Outer planets (limited use)
export const OUTER_PLANET_ASSOCIATIONS = {
  'Uranus': {
    keywords: ['Divorce', 'Disruption', 'House-moving', 'Sudden change', 'Revolution'],
    usage: 'Only when on relevant cusp or in immediate aspect with main significators'
  },
  'Neptune': {
    keywords: ['Illusion', 'Deceit', 'Confusion', 'Fraud', 'Misdirection'],
    usage: 'Only when on relevant cusp or in immediate aspect with main significators'
  },
  'Pluto': {
    keywords: ['Generally malefic', 'Destruction', 'Transformation', 'Hidden power'],
    usage: 'Only when on relevant cusp or in immediate aspect with main significators'
  }
};

// Helper functions for significator assignment

export function getSignRuler(sign: string): string {
  return SIGN_RULERS[sign] || 'Unknown';
}

export function getHouseRuler(houseCusp: { sign: string; degree: number }): string {
  return getSignRuler(houseCusp.sign);
}

export function assignQuerentSignificators(
  ascendantSign: string,
  moonPosition: { sign: string; house: number },
  questionContext: string
): { main: string; co?: string } {
  const mainSignificator = getSignRuler(ascendantSign);
  
  // Moon is co-significator unless it's the main significator of the quesited
  // This would need to be determined based on the specific question and chart
  const coSignificator = 'Moon'; // Simplified - would need context analysis
  
  return {
    main: mainSignificator,
    co: coSignificator
  };
}

export function identifyQuesitedSignificator(
  questionType: string,
  relevantHouse: number,
  houseCusps: Array<{ sign: string; degree: number }>
): string {
  if (relevantHouse >= 1 && relevantHouse <= 12 && houseCusps[relevantHouse - 1]) {
    return getSignRuler(houseCusps[relevantHouse - 1].sign);
  }
  return 'Unknown';
}

export function getNaturalRulership(planet: string): NaturalRulership | undefined {
  return NATURAL_RULERSHIPS.find(rulership => rulership.planet === planet);
}

export function searchNaturalRulerships(searchTerm: string): Array<{
  planet: string;
  category: string;
  matches: string[];
}> {
  const results: Array<{ planet: string; category: string; matches: string[] }> = [];
  const term = searchTerm.toLowerCase();
  
  NATURAL_RULERSHIPS.forEach(rulership => {
    const categories = {
      'Objects': rulership.objects,
      'People': rulership.people,
      'Concepts': rulership.concepts,
      'Animals': rulership.animals,
      'Body Parts': rulership.bodyParts,
      'Colors': rulership.colors,
      'Metals': rulership.metals,
      'Gems': rulership.gems
    };
    
    Object.entries(categories).forEach(([category, items]) => {
      const matches = items.filter(item => item.toLowerCase().includes(term));
      if (matches.length > 0) {
        results.push({
          planet: rulership.planet,
          category,
          matches
        });
      }
    });
  });
  
  return results;
}

export function analyzeUnidentifiedPlanet(
  planet: string,
  housesRuled: number[],
  aspectedPlanets: string[],
  questionContext: string
): {
  possibleMeanings: string[];
  confidence: 'high' | 'medium' | 'low';
  recommendations: string[];
} {
  const possibleMeanings: string[] = [];
  const recommendations: string[] = [];
  
  // Add meanings based on house rulerships
  housesRuled.forEach(house => {
    // This would be connected to the house meanings from the Houses module
    possibleMeanings.push(`Significator of ${house}th house matters`);
  });
  
  // Add natural meanings
  const naturalRulership = getNaturalRulership(planet);
  if (naturalRulership) {
    possibleMeanings.push(...naturalRulership.people);
    possibleMeanings.push(...naturalRulership.concepts.slice(0, 3)); // Limit for brevity
  }
  
  // Add generic "other person" meaning
  possibleMeanings.push('Some other person involved in the matter');
  
  recommendations.push('Ask querent: "Is there someone else involved in this matter?"');
  recommendations.push('Study receptions between this planet and main significators');
  recommendations.push('Choose the most concrete interpretation available');
  
  // Determine confidence based on context
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (housesRuled.length === 0) confidence = 'low';
  if (questionContext.includes('relationship') && housesRuled.includes(7)) confidence = 'high';
  
  return {
    possibleMeanings,
    confidence,
    recommendations
  };
}

export function checkMoonRole(
  moonHousesRuled: number[],
  quesitedHouse: number,
  questionType: string
): {
  role: 'co-significator' | 'main-significator' | 'neither';
  explanation: string;
} {
  // If Moon rules the quesited house, it's the main significator of the quesited
  if (moonHousesRuled.includes(quesitedHouse)) {
    return {
      role: 'main-significator',
      explanation: `Moon rules ${quesitedHouse}th house (quesited), so it signifies the matter asked about, not the querent`
    };
  }
  
  // In third-party questions, Moon stays with querent
  if (questionType.includes('third-party')) {
    return {
      role: 'co-significator',
      explanation: 'In third-party questions, Moon remains co-significator of querent'
    };
  }
  
  // Default: Moon is co-significator of querent
  return {
    role: 'co-significator',
    explanation: 'Moon is co-significator of querent, weighted towards emotions'
  };
}

export function isOuterPlanetSignificant(
  planet: 'Uranus' | 'Neptune' | 'Pluto',
  position: { house: number; degreeFromCusp: number },
  aspectsToMainSignificators: string[]
): {
  isSignificant: boolean;
  meaning?: string;
  explanation: string;
} {
  const planetData = OUTER_PLANET_ASSOCIATIONS[planet];
  
  // Check if on relevant cusp (within 2 degrees)
  const onCusp = Math.abs(position.degreeFromCusp) <= 2;
  
  // Check if in immediate aspect with main significators
  const hasMainAspects = aspectsToMainSignificators.length > 0;
  
  if (onCusp || hasMainAspects) {
    return {
      isSignificant: true,
      meaning: planetData.keywords[0], // Primary meaning
      explanation: `${planet} ${onCusp ? 'on house cusp' : 'aspecting main significators'} - ${planetData.usage}`
    };
  }
  
  return {
    isSignificant: false,
    explanation: `${planet} not prominently placed - ignore as per traditional practice`
  };
}