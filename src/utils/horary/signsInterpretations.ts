/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Signs Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive zodiacal sign characteristics and their
 * practical applications in horary astrology, following traditional principles.
 */

export interface SignCharacteristics {
  sign: string;
  symbol: string;
  gender: 'masculine' | 'feminine';
  element: 'fire' | 'earth' | 'air' | 'water';
  mode: 'cardinal' | 'fixed' | 'mutable';
  fertility: 'fertile' | 'barren' | 'neutral';
  voice: 'mute' | 'loud' | 'half' | 'weak';
  humanity: 'humane' | 'bestial' | 'feral';
  bodyPart: string;
  isDoubleBodydied: boolean;
  isMaimed: boolean;
  qualities: string[];
  elementalQualities: string;
  vocationaApplications: string[];
  medicalSignificance: string[];
  locationClues: string[];
  weatherIndications: string[];
  behavioralTraits: string[];
}

export interface ElementCharacteristics {
  element: 'fire' | 'earth' | 'air' | 'water';
  qualities: string;
  signs: string[];
  locationTypes: string[];
  vocations: string[];
  weatherPatterns: string[];
  temperament: string;
}

export interface ModeCharacteristics {
  mode: 'cardinal' | 'fixed' | 'mutable';
  signs: string[];
  actionType: string;
  medicalNature: string;
  disputeStyle: string;
  generalBehavior: string;
  examples: string[];
}

// Complete sign characteristics based on Frawley's traditional system
export const SIGN_CHARACTERISTICS: SignCharacteristics[] = [
  {
    sign: 'Aries',
    symbol: '♈',
    gender: 'masculine',
    element: 'fire',
    mode: 'cardinal',
    fertility: 'neutral',
    voice: 'half',
    humanity: 'bestial',
    bodyPart: 'Head',
    isDoubleBodydied: false,
    isMaimed: true,
    qualities: ['Hot', 'Dry', 'Quick action', 'Leadership', 'Initiative'],
    elementalQualities: 'Hot and Dry',
    vocationaApplications: ['Military leader', 'Entrepreneur', 'Emergency responder', 'Sports competitor'],
    medicalSignificance: ['Head injuries', 'Headaches', 'Brain conditions', 'Face problems'],
    locationClues: ['High places', 'Near fire/heat', 'Battlefields', 'Athletic facilities'],
    weatherIndications: ['Hot', 'Dry winds', 'Sudden temperature changes'],
    behavioralTraits: ['Impulsive', 'Aggressive', 'Quick to act', 'Short-lived intensity']
  },
  {
    sign: 'Taurus',
    symbol: '♉',
    gender: 'feminine',
    element: 'earth',
    mode: 'fixed',
    fertility: 'neutral',
    voice: 'half',
    humanity: 'bestial',
    bodyPart: 'Neck',
    isDoubleBodydied: false,
    isMaimed: true,
    qualities: ['Cold', 'Dry', 'Stable', 'Persistent', 'Material'],
    elementalQualities: 'Cold and Dry',
    vocationaApplications: ['Farmer', 'Banker', 'Builder', 'Chef', 'Artisan'],
    medicalSignificance: ['Throat problems', 'Neck injuries', 'Thyroid conditions'],
    locationClues: ['Underground', 'Fields', 'Banks', 'Stables', 'Gardens'],
    weatherIndications: ['Stable conditions', 'Cold and dry', 'Persistent patterns'],
    behavioralTraits: ['Stubborn', 'Reliable', 'Slow to change', 'Materialistic']
  },
  {
    sign: 'Gemini',
    symbol: '♊',
    gender: 'masculine',
    element: 'air',
    mode: 'mutable',
    fertility: 'barren',
    voice: 'loud',
    humanity: 'humane',
    bodyPart: 'Hands, arms, shoulders',
    isDoubleBodydied: true,
    isMaimed: false,
    qualities: ['Hot', 'Moist', 'Dual', 'Communicative', 'Variable'],
    elementalQualities: 'Hot and Moist',
    vocationaApplications: ['Teacher', 'Writer', 'Messenger', 'Translator', 'Sales person'],
    medicalSignificance: ['Arm/hand injuries', 'Shoulder problems', 'Nervous conditions'],
    locationClues: ['High places', 'Schools', 'Communication centers', 'Markets'],
    weatherIndications: ['Windy', 'Changeable', 'Variable conditions'],
    behavioralTraits: ['Talkative', 'Unreliable', 'Dual nature', 'Quick thinking', 'Inconsistent']
  },
  {
    sign: 'Cancer',
    symbol: '♋',
    gender: 'feminine',
    element: 'water',
    mode: 'cardinal',
    fertility: 'fertile',
    voice: 'mute',
    humanity: 'humane',
    bodyPart: 'Breast',
    isDoubleBodydied: false,
    isMaimed: false,
    qualities: ['Cold', 'Moist', 'Nurturing', 'Protective', 'Emotional'],
    elementalQualities: 'Cold and Moist',
    vocationaApplications: ['Nurse', 'Mother', 'Chef', 'Caregiver', 'Historian'],
    medicalSignificance: ['Breast conditions', 'Stomach problems', 'Digestive issues'],
    locationClues: ['Near water', 'Wells', 'Rivers', 'Homes', 'Kitchens'],
    weatherIndications: ['Wet', 'Humid', 'Sudden rain showers'],
    behavioralTraits: ['Protective', 'Moody', 'Silent about feelings', 'Nurturing', 'Home-oriented']
  },
  {
    sign: 'Leo',
    symbol: '♌',
    gender: 'masculine',
    element: 'fire',
    mode: 'fixed',
    fertility: 'barren',
    voice: 'half',
    humanity: 'feral',
    bodyPart: 'Heart and ribs',
    isDoubleBodydied: false,
    isMaimed: true,
    qualities: ['Hot', 'Dry', 'Proud', 'Creative', 'Wild'],
    elementalQualities: 'Hot and Dry',
    vocationaApplications: ['Performer', 'Artist', 'Manager', 'Entertainer', 'Creative director'],
    medicalSignificance: ['Heart conditions', 'Rib injuries', 'Circulation problems'],
    locationClues: ['Theaters', 'Stages', 'Creative spaces', 'Places of entertainment'],
    weatherIndications: ['Hot', 'Dry', 'Intense heat', 'Drought conditions'],
    behavioralTraits: ['Wild beast behavior', 'Dramatic', 'Proud', 'Creative', 'Attention-seeking']
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    gender: 'feminine',
    element: 'earth',
    mode: 'mutable',
    fertility: 'barren',
    voice: 'loud',
    humanity: 'humane',
    bodyPart: 'Intestines and related organs',
    isDoubleBodydied: true,
    isMaimed: false,
    qualities: ['Cold', 'Dry', 'Analytical', 'Service-oriented', 'Perfectionist'],
    elementalQualities: 'Cold and Dry',
    vocationaApplications: ['Analyst', 'Health worker', 'Critic', 'Editor', 'Service provider'],
    medicalSignificance: ['Digestive problems', 'Intestinal issues', 'Nervous stomach'],
    locationClues: ['Hospitals', 'Service areas', 'Work places', 'Health facilities'],
    weatherIndications: ['Cool', 'Dry', 'Changeable patterns'],
    behavioralTraits: ['Critical', 'Helpful', 'Perfectionistic', 'Analytical', 'Vocal about flaws']
  },
  {
    sign: 'Libra',
    symbol: '♎',
    gender: 'masculine',
    element: 'air',
    mode: 'cardinal',
    fertility: 'neutral',
    voice: 'loud',
    humanity: 'humane',
    bodyPart: 'Urinary system, lower back',
    isDoubleBodydied: false,
    isMaimed: false,
    qualities: ['Hot', 'Moist', 'Balanced', 'Diplomatic', 'Aesthetic'],
    elementalQualities: 'Hot and Moist',
    vocationaApplications: ['Judge', 'Diplomat', 'Artist', 'Mediator', 'Fashion designer'],
    medicalSignificance: ['Kidney problems', 'Lower back pain', 'Urinary issues'],
    locationClues: ['Courts', 'Art galleries', 'Social venues', 'Partnership locations'],
    weatherIndications: ['Balanced conditions', 'Pleasant weather', 'Moderate temperatures'],
    behavioralTraits: ['Diplomatic', 'Indecisive', 'Fair-minded', 'Social', 'Harmony-seeking']
  },
  {
    sign: 'Scorpio',
    symbol: '♏',
    gender: 'feminine',
    element: 'water',
    mode: 'fixed',
    fertility: 'fertile',
    voice: 'mute',
    humanity: 'bestial',
    bodyPart: 'Genitals and anus',
    isDoubleBodydied: false,
    isMaimed: false,
    qualities: ['Cold', 'Moist', 'Intense', 'Secretive', 'Transformative'],
    elementalQualities: 'Cold and Moist',
    vocationaApplications: ['Detective', 'Surgeon', 'Researcher', 'Psychologist', 'Occultist'],
    medicalSignificance: ['Reproductive issues', 'Elimination problems', 'Sexual disorders'],
    locationClues: ['Hidden places', 'Sewers', 'Waste areas', 'Secret locations'],
    weatherIndications: ['Storms', 'Intense weather', 'Hidden moisture'],
    behavioralTraits: ['Secretive', 'Intense', 'Stubborn', 'Silent', 'All or nothing']
  },
  {
    sign: 'Sagittarius',
    symbol: '♐',
    gender: 'masculine',
    element: 'fire',
    mode: 'mutable',
    fertility: 'neutral',
    voice: 'half',
    humanity: 'bestial', // First half bestial, second half feral
    bodyPart: 'Thighs and buttocks',
    isDoubleBodydied: true,
    isMaimed: false,
    qualities: ['Hot', 'Dry', 'Philosophical', 'Adventurous', 'Wild'],
    elementalQualities: 'Hot and Dry',
    vocationaApplications: ['Teacher', 'Philosopher', 'Traveler', 'Foreign correspondent', 'Religious leader'],
    medicalSignificance: ['Hip problems', 'Thigh injuries', 'Sciatica'],
    locationClues: ['Foreign places', 'Universities', 'Religious sites', 'Travel hubs'],
    weatherIndications: ['Hot winds', 'Variable fire weather', 'Extreme conditions'],
    behavioralTraits: ['Philosophical', 'Restless', 'Truth-seeking', 'Can be wild/feral', 'Freedom-loving']
  },
  {
    sign: 'Capricorn',
    symbol: '♑',
    gender: 'feminine',
    element: 'earth',
    mode: 'cardinal',
    fertility: 'neutral',
    voice: 'weak',
    humanity: 'bestial',
    bodyPart: 'Knees',
    isDoubleBodydied: false,
    isMaimed: false,
    qualities: ['Cold', 'Dry', 'Ambitious', 'Structured', 'Authoritative'],
    elementalQualities: 'Cold and Dry',
    vocationaApplications: ['Executive', 'Government official', 'Engineer', 'Architect', 'Manager'],
    medicalSignificance: ['Knee problems', 'Joint issues', 'Bone conditions'],
    locationClues: ['Mountains', 'Government buildings', 'Corporate offices', 'High places'],
    weatherIndications: ['Cold', 'Dry', 'Harsh conditions', 'Winter weather'],
    behavioralTraits: ['Authoritative', 'Quiet', 'Ambitious', 'Structured', 'Goal-oriented']
  },
  {
    sign: 'Aquarius',
    symbol: '♒',
    gender: 'masculine',
    element: 'air',
    mode: 'fixed',
    fertility: 'neutral',
    voice: 'weak',
    humanity: 'humane',
    bodyPart: 'Calves and ankles',
    isDoubleBodydied: false,
    isMaimed: false,
    qualities: ['Hot', 'Moist', 'Independent', 'Innovative', 'Humanitarian'],
    elementalQualities: 'Hot and Moist',
    vocationaApplications: ['Innovator', 'Humanitarian', 'Scientist', 'Revolutionary', 'Group organizer'],
    medicalSignificance: ['Leg problems', 'Ankle injuries', 'Circulation issues'],
    locationClues: ['Groups', 'Organizations', 'Technology centers', 'Reform movements'],
    weatherIndications: ['Unusual weather', 'Sudden changes', 'Electrical storms'],
    behavioralTraits: ['Independent', 'Quiet but firm', 'Humanitarian', 'Unconventional', 'Group-minded']
  },
  {
    sign: 'Pisces',
    symbol: '♓',
    gender: 'feminine',
    element: 'water',
    mode: 'mutable',
    fertility: 'fertile',
    voice: 'mute',
    humanity: 'humane',
    bodyPart: 'Feet',
    isDoubleBodydied: true,
    isMaimed: true,
    qualities: ['Cold', 'Moist', 'Spiritual', 'Compassionate', 'Dreamy'],
    elementalQualities: 'Cold and Moist',
    vocationaApplications: ['Artist', 'Healer', 'Mystic', 'Social worker', 'Musician'],
    medicalSignificance: ['Foot problems', 'Lymphatic issues', 'Addiction tendencies'],
    locationClues: ['Near water', 'Spiritual places', 'Hospitals', 'Places of escape'],
    weatherIndications: ['Misty', 'Wet', 'Unclear conditions', 'Fog'],
    behavioralTraits: ['Compassionate', 'Silent', 'Dreamy', 'Changeable', 'Spiritual']
  }
];

// Elemental groupings and characteristics
export const ELEMENT_CHARACTERISTICS: ElementCharacteristics[] = [
  {
    element: 'fire',
    qualities: 'Hot and Dry',
    signs: ['Aries', 'Leo', 'Sagittarius'],
    locationTypes: ['Near heat sources', 'Kitchens', 'Furnaces', 'Athletic facilities', 'High energy places'],
    vocations: ['Chef', 'Metallurgist', 'Athlete', 'Soldier', 'Firefighter'],
    weatherPatterns: ['Hot', 'Dry', 'Drought', 'Heat waves', 'Sunny'],
    temperament: 'Energetic, active, passionate'
  },
  {
    element: 'earth',
    qualities: 'Cold and Dry',
    signs: ['Taurus', 'Virgo', 'Capricorn'],
    locationTypes: ['Underground', 'Fields', 'Mountains', 'Caves', 'Buried places'],
    vocations: ['Farmer', 'Miner', 'Builder', 'Banker', 'Gardener'],
    weatherPatterns: ['Cold', 'Dry', 'Stable', 'Clear skies', 'Drought'],
    temperament: 'Practical, stable, material-focused'
  },
  {
    element: 'air',
    qualities: 'Hot and Moist',
    signs: ['Gemini', 'Libra', 'Aquarius'],
    locationTypes: ['High places', 'Open spaces', 'Schools', 'Communication centers', 'Intellectual venues'],
    vocations: ['Teacher', 'Lawyer', 'Accountant', 'Writer', 'Communicator'],
    weatherPatterns: ['Windy', 'Changeable', 'Storms', 'Variable conditions'],
    temperament: 'Intellectual, communicative, social'
  },
  {
    element: 'water',
    qualities: 'Cold and Moist',
    signs: ['Cancer', 'Scorpio', 'Pisces'],
    locationTypes: ['Near water', 'Wells', 'Rivers', 'Oceans', 'Wet places'],
    vocations: ['Sailor', 'Fisherman', 'Nurse', 'Brewer', 'Healer'],
    weatherPatterns: ['Wet', 'Humid', 'Rain', 'Storms', 'Mist'],
    temperament: 'Emotional, intuitive, nurturing'
  }
];

// Modal groupings and characteristics  
export const MODE_CHARACTERISTICS: ModeCharacteristics[] = [
  {
    mode: 'cardinal',
    signs: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    actionType: 'Quick action that doesn\'t last',
    medicalNature: 'Acute illness (comes on quickly)',
    disputeStyle: 'Show you mean business and opponent will give in',
    generalBehavior: 'Initiative, leadership, starts things',
    examples: ['Fast start in projects', 'Acute medical conditions', 'Quick resolution of disputes']
  },
  {
    mode: 'fixed',
    signs: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    actionType: 'Slow and stable',
    medicalNature: 'Chronic illness (long-lasting)',
    disputeStyle: 'Will fight it out to the end',
    generalBehavior: 'Persistence, stubbornness, maintains things',
    examples: ['Job security', 'Long-term relationships', 'Chronic conditions', 'Enduring situations']
  },
  {
    mode: 'mutable',
    signs: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
    actionType: 'Come and go, changeable',
    medicalNature: 'Illness that comes and goes',
    disputeStyle: 'Less reliable, may change position',
    generalBehavior: 'Adaptability, flexibility, inconsistency',
    examples: ['Variable conditions', 'Part-time work', 'Changing circumstances', 'Unreliable behavior']
  }
];

// Helper functions for sign analysis

export function getSignCharacteristics(sign: string): SignCharacteristics | undefined {
  return SIGN_CHARACTERISTICS.find(s => s.sign === sign);
}

export function getSignsByElement(element: 'fire' | 'earth' | 'air' | 'water'): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.element === element).map(s => s.sign);
}

export function getSignsByMode(mode: 'cardinal' | 'fixed' | 'mutable'): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.mode === mode).map(s => s.sign);
}

export function getSignsByGender(gender: 'masculine' | 'feminine'): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.gender === gender).map(s => s.sign);
}

export function getFertileSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.fertility === 'fertile').map(s => s.sign);
}

export function getBarrenSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.fertility === 'barren').map(s => s.sign);
}

export function getDoubleBodydiedSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.isDoubleBodydied).map(s => s.sign);
}

export function getMuteSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.voice === 'mute').map(s => s.sign);
}

export function getLoudVoicedSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.voice === 'loud').map(s => s.sign);
}

export function getHumaneSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.humanity === 'humane').map(s => s.sign);
}

export function getBestialSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.humanity === 'bestial').map(s => s.sign);
}

export function getFeralSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.humanity === 'feral').map(s => s.sign);
}

export function getMaimedSigns(): string[] {
  return SIGN_CHARACTERISTICS.filter(s => s.isMaimed).map(s => s.sign);
}

export function analyzeSignForQuestion(
  sign: string, 
  questionType: string,
  context: string = ''
): {
  relevantCharacteristics: string[];
  interpretation: string;
  confidence: 'high' | 'medium' | 'low';
} {
  const signData = getSignCharacteristics(sign);
  if (!signData) {
    return {
      relevantCharacteristics: [],
      interpretation: 'Unknown sign',
      confidence: 'low'
    };
  }

  const relevantCharacteristics: string[] = [];
  let interpretation = '';
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  // Analyze based on question type
  if (questionType.includes('baby') || questionType.includes('child') || questionType.includes('pregnan')) {
    relevantCharacteristics.push(`Fertility: ${signData.fertility}`);
    if (signData.fertility === 'fertile') {
      interpretation = 'Favorable for conception and childbirth';
      confidence = 'high';
    } else if (signData.fertility === 'barren') {
      interpretation = signData.isDoubleBodydied ? 
        'Generally unfavorable, but if conception occurs, indicates multiple children' :
        'Unfavorable for conception';
      confidence = 'high';
    }
  }

  if (questionType.includes('job') || questionType.includes('career') || questionType.includes('work')) {
    relevantCharacteristics.push(`Mode: ${signData.mode}`);
    relevantCharacteristics.push(`Vocations: ${signData.vocationaApplications.slice(0, 3).join(', ')}`);
    
    if (signData.mode === 'fixed') {
      interpretation = 'Job security and stability indicated';
      confidence = 'high';
    } else if (signData.mode === 'cardinal') {
      interpretation = 'Quick changes in career, new opportunities';
    } else {
      interpretation = 'Variable work situation, possibly part-time or freelance';
    }
  }

  if (questionType.includes('health') || questionType.includes('medical') || questionType.includes('ill')) {
    relevantCharacteristics.push(`Body part: ${signData.bodyPart}`);
    relevantCharacteristics.push(`Mode: ${signData.mode}`);
    interpretation = `Related to ${signData.bodyPart}. ${
      signData.mode === 'cardinal' ? 'Acute condition' :
      signData.mode === 'fixed' ? 'Chronic condition' :
      'Condition that comes and goes'
    }`;
    confidence = 'high';
  }

  if (questionType.includes('lost') || questionType.includes('find') || questionType.includes('where')) {
    relevantCharacteristics.push(`Element: ${signData.element}`);
    relevantCharacteristics.push(`Location clues: ${signData.locationClues.slice(0, 2).join(', ')}`);
    interpretation = `Look in ${signData.locationClues[0]} or places associated with ${signData.element}`;
    confidence = 'medium';
  }

  if (questionType.includes('dispute') || questionType.includes('fight') || questionType.includes('conflict')) {
    relevantCharacteristics.push(`Mode: ${signData.mode}`);
    relevantCharacteristics.push(`Humanity: ${signData.humanity}`);
    
    const modeData = MODE_CHARACTERISTICS.find(m => m.mode === signData.mode);
    interpretation = modeData ? modeData.disputeStyle : 'Dispute behavior unclear';
    
    if (signData.humanity === 'humane') {
      interpretation += '. Will behave reasonably';
    } else if (signData.humanity === 'feral') {
      interpretation += '. May behave like a wild beast';
    } else {
      interpretation += '. May behave like an animal';
    }
    confidence = 'high';
  }

  if (questionType.includes('weather')) {
    relevantCharacteristics.push(`Element: ${signData.element}`);
    relevantCharacteristics.push(`Weather: ${signData.weatherIndications.join(', ')}`);
    interpretation = `Weather will be ${signData.weatherIndications[0]} and ${signData.elementalQualities}`;
    confidence = 'high';
  }

  // Add general behavioral traits if no specific question type matches
  if (relevantCharacteristics.length === 0) {
    relevantCharacteristics.push(`General traits: ${signData.behavioralTraits.slice(0, 3).join(', ')}`);
    interpretation = `General behavior: ${signData.behavioralTraits[0]}`;
  }

  return {
    relevantCharacteristics,
    interpretation,
    confidence
  };
}

export function searchSignCharacteristics(searchTerm: string): Array<{
  sign: string;
  category: string;
  matches: string[];
}> {
  const results: Array<{ sign: string; category: string; matches: string[] }> = [];
  const term = searchTerm.toLowerCase();
  
  SIGN_CHARACTERISTICS.forEach(signData => {
    const categories = {
      'Qualities': signData.qualities,
      'Vocations': signData.vocationaApplications,
      'Medical': signData.medicalSignificance,
      'Locations': signData.locationClues,
      'Weather': signData.weatherIndications,
      'Behavioral': signData.behavioralTraits
    };
    
    Object.entries(categories).forEach(([category, items]) => {
      const matches = items.filter(item => item.toLowerCase().includes(term));
      if (matches.length > 0) {
        results.push({
          sign: signData.sign,
          category,
          matches
        });
      }
    });
  });
  
  return results;
}

export function getElementCharacteristics(element: 'fire' | 'earth' | 'air' | 'water'): ElementCharacteristics | undefined {
  return ELEMENT_CHARACTERISTICS.find(e => e.element === element);
}

export function getModeCharacteristics(mode: 'cardinal' | 'fixed' | 'mutable'): ModeCharacteristics | undefined {
  return MODE_CHARACTERISTICS.find(m => m.mode === mode);
}