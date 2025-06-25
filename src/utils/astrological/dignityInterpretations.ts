/* eslint-disable @typescript-eslint/no-unused-vars */

// Planetary dignity and debility data
export const planetaryDignities: Record<string, {
  rulership: string[];
  exaltation?: { sign: string; degree?: number };
  detriment: string[];
  fall?: { sign: string; degree?: number };
}> = {
  sun: {
    rulership: ['leo'],
    exaltation: { sign: 'aries', degree: 19 },
    detriment: ['aquarius'],
    fall: { sign: 'libra', degree: 19 }
  },
  moon: {
    rulership: ['cancer'],
    exaltation: { sign: 'taurus', degree: 3 },
    detriment: ['capricorn'],
    fall: { sign: 'scorpio', degree: 3 }
  },
  mercury: {
    rulership: ['gemini', 'virgo'],
    exaltation: { sign: 'virgo', degree: 15 },
    detriment: ['sagittarius', 'pisces'],
    fall: { sign: 'pisces', degree: 15 }
  },
  venus: {
    rulership: ['taurus', 'libra'],
    exaltation: { sign: 'pisces', degree: 27 },
    detriment: ['scorpio', 'aries'],
    fall: { sign: 'virgo', degree: 27 }
  },
  mars: {
    rulership: ['aries', 'scorpio'],
    exaltation: { sign: 'capricorn', degree: 28 },
    detriment: ['libra', 'taurus'],
    fall: { sign: 'cancer', degree: 28 }
  },
  jupiter: {
    rulership: ['sagittarius', 'pisces'],
    exaltation: { sign: 'cancer', degree: 15 },
    detriment: ['gemini', 'virgo'],
    fall: { sign: 'capricorn', degree: 15 }
  },
  saturn: {
    rulership: ['capricorn', 'aquarius'],
    exaltation: { sign: 'libra', degree: 21 },
    detriment: ['cancer', 'leo'],
    fall: { sign: 'aries', degree: 21 }
  },
  uranus: {
    rulership: ['aquarius'],
    exaltation: { sign: 'scorpio' },
    detriment: ['leo'],
    fall: { sign: 'taurus' }
  },
  neptune: {
    rulership: ['pisces'],
    exaltation: { sign: 'cancer' },
    detriment: ['virgo'],
    fall: { sign: 'capricorn' }
  },
  pluto: {
    rulership: ['scorpio'],
    exaltation: { sign: 'aries' },
    detriment: ['taurus'],
    fall: { sign: 'libra' }
  }
};

// Function to get planetary dignity status
export const getPlanetaryDignity = (planet: string, sign: string): 'rulership' | 'exaltation' | 'detriment' | 'fall' | 'neutral' => {
  const dignities = planetaryDignities[planet.toLowerCase()];
  if (!dignities) return 'neutral';

  const lowerSign = sign.toLowerCase();

  if (dignities.rulership.includes(lowerSign)) return 'rulership';
  if (dignities.exaltation?.sign === lowerSign) return 'exaltation';
  if (dignities.detriment.includes(lowerSign)) return 'detriment';
  if (dignities.fall?.sign === lowerSign) return 'fall';

  return 'neutral';
};

// Interpretations for planetary dignities
export const getDignityInterpretation = (planet: string, sign: string, dignity: string): string => {
  const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);

  const dignityInterpretations: Record<string, Record<string, string>> = {
    sun: {
      rulership: `The Sun in Leo is in its natural home, expressing leadership, creativity, and self-confidence with full strength. Your core identity shines brightly and authentically.`,
      exaltation: `The Sun is exalted in Aries, expressing pioneering spirit and courageous self-assertion. Your vital force is enhanced with dynamic initiative and leadership.`,
      detriment: `The Sun in Aquarius faces challenges in personal expression, as group consciousness may overshadow individual identity. Learning to balance collective ideals with personal needs is key.`,
      fall: `The Sun in Libra seeks identity through others, potentially diminishing personal autonomy. Finding balance between self and partnership strengthens your core expression.`
    },
    moon: {
      rulership: `The Moon in Cancer is at home, expressing nurturing, emotional depth, and intuitive understanding with natural ease. Your emotional nature flows freely and authentically.`,
      exaltation: `The Moon is exalted in Taurus, providing emotional stability and sensual contentment. Your feelings find grounding through material security and physical comfort.`,
      detriment: `The Moon in Capricorn may struggle with emotional expression, as practical concerns override feelings. Learning to honor emotions while maintaining structure is essential.`,
      fall: `The Moon in Scorpio experiences intense emotional depths that can be overwhelming. Transforming emotional intensity into healing power is your path to emotional mastery.`
    },
    mercury: {
      rulership: `Mercury in ${signName} is in its domain, expressing communication and mental agility with natural skill. Your mind operates at peak efficiency in its element.`,
      exaltation: `Mercury is exalted in Virgo, bringing exceptional analytical ability and practical intelligence. Your communication is precise, useful, and highly effective.`,
      detriment: `Mercury in ${signName} may struggle with clear communication, as abstract thinking or idealism clouds practical understanding. Grounding ideas in reality enhances mental clarity.`,
      fall: `Mercury in Pisces can blur logical thinking with intuitive impressions. Learning to bridge imagination with clear communication unlocks your mental gifts.`
    },
    venus: {
      rulership: `Venus in ${signName} expresses love, beauty, and harmony in its natural element. Relationships and aesthetic appreciation flow with grace and authenticity.`,
      exaltation: `Venus is exalted in Pisces, expressing unconditional love and artistic inspiration. Your capacity for compassion and creative beauty reaches sublime heights.`,
      detriment: `Venus in ${signName} faces challenges in relationships and values, as intensity or aggression conflicts with Venusian harmony. Finding balance between passion and peace is crucial.`,
      fall: `Venus in Virgo may over-analyze love and beauty, missing the forest for the trees. Learning to appreciate imperfection allows love to flourish naturally.`
    },
    mars: {
      rulership: `Mars in ${signName} expresses drive and assertion in its natural element. Your ability to take action and pursue desires operates with full power.`,
      exaltation: `Mars is exalted in Capricorn, channeling raw energy into disciplined achievement. Your drive combines with strategic planning for maximum effectiveness.`,
      detriment: `Mars in ${signName} struggles with direct action, as compromise or indecision weakens assertive energy. Learning to act decisively while maintaining balance is key.`,
      fall: `Mars in Cancer may act from emotional reactions rather than clear intention. Channeling protective instincts into constructive action strengthens your drive.`
    },
    jupiter: {
      rulership: `Jupiter in ${signName} expresses wisdom, growth, and expansion in its natural domain. Your philosophical understanding and optimism flow abundantly.`,
      exaltation: `Jupiter is exalted in Cancer, expressing nurturing wisdom and emotional generosity. Your ability to provide care and protection is greatly enhanced.`,
      detriment: `Jupiter in ${signName} may struggle with expansion, as detail-orientation or skepticism limits growth. Finding faith within practical limits opens new horizons.`,
      fall: `Jupiter in Capricorn must work within material limitations, potentially restricting natural optimism. Building expansion through patience creates lasting growth.`
    },
    saturn: {
      rulership: `Saturn in ${signName} expresses discipline and structure in its natural element. Your ability to create lasting foundations and achieve mastery is at its peak.`,
      exaltation: `Saturn is exalted in Libra, bringing fair judgment and balanced responsibility. Your ability to create just structures and lasting partnerships is enhanced.`,
      detriment: `Saturn in ${signName} faces challenges with structure, as emotional needs or ego conflicts with discipline. Learning to build from the heart strengthens foundations.`,
      fall: `Saturn in Aries struggles with patience and long-term planning. Learning to harness impulsive energy for sustained effort transforms limitation into achievement.`
    },
    uranus: {
      rulership: `Uranus in Aquarius expresses innovation and humanitarian vision in its natural element. Your ability to revolutionize and awaken consciousness operates freely.`,
      exaltation: `Uranus is exalted in Scorpio, bringing transformative breakthroughs and regenerative innovation. Your ability to revolutionize at deep levels is enhanced.`,
      detriment: `Uranus in Leo may struggle between individual expression and collective innovation. Balancing personal creativity with humanitarian ideals brings breakthrough.`,
      fall: `Uranus in Taurus resists change in favor of stability. Learning to innovate within material reality creates lasting revolutionary impact.`
    },
    neptune: {
      rulership: `Neptune in Pisces expresses spirituality and imagination in its natural element. Your connection to the divine and creative inspiration flows without bounds.`,
      exaltation: `Neptune is exalted in Cancer, expressing emotional intuition and psychic sensitivity. Your ability to nurture through spiritual connection is enhanced.`,
      detriment: `Neptune in Virgo may struggle with surrendering to the mystical, as analysis blocks intuition. Bridging practical service with spiritual vision brings clarity.`,
      fall: `Neptune in Capricorn must manifest dreams within material constraints. Learning to spiritualize ambition transforms limitation into transcendence.`
    },
    pluto: {
      rulership: `Pluto in Scorpio expresses transformation and regeneration in its natural element. Your ability to facilitate deep healing and rebirth operates with full power.`,
      exaltation: `Pluto is exalted in Aries, bringing pioneering transformation and courageous rebirth. Your ability to initiate profound change is at its peak.`,
      detriment: `Pluto in Taurus may resist transformation in favor of security. Learning to find power through letting go transforms possessiveness into abundance.`,
      fall: `Pluto in Libra struggles with power in relationships. Learning to transform through partnership rather than control brings true intimacy.`
    }
  };

  // Get specific interpretation or return a generic one
  const planetInterpretations = dignityInterpretations[planet.toLowerCase()];
  if (planetInterpretations && planetInterpretations[dignity]) {
    return planetInterpretations[dignity];
  }

  // Generic interpretations as fallback
  const genericInterpretations: Record<string, string> = {
    rulership: `${planetName} in ${signName} is in its ruling sign, expressing its qualities with natural strength and authenticity. This placement operates at full capacity.`,
    exaltation: `${planetName} is exalted in ${signName}, expressing its highest and most refined qualities. This placement brings out the best of this planetary energy.`,
    detriment: `${planetName} in ${signName} is in detriment, facing challenges in expressing its natural qualities. Growth comes through conscious integration of opposing energies.`,
    fall: `${planetName} in ${signName} is in fall, requiring extra effort to express its qualities effectively. This placement offers opportunities for conscious development.`,
    neutral: `${planetName} in ${signName} expresses its qualities in a balanced way, neither strengthened nor challenged by the sign placement.`
  };

  return genericInterpretations[dignity] || genericInterpretations.neutral;
};