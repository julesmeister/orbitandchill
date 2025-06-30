/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Houses Interpretations - Based on John Frawley's "The Horary Textbook"
 * 
 * This module provides comprehensive house meanings and interpretations
 * for horary astrology, following traditional principles.
 */

export interface HouseInterpretation {
  houseNumber: number;
  name: string;
  primaryMeaning: string;
  keyAssociations: string[];
  physicalBody: string;
  commonQuestions: string[];
  avoidCommonMistakes: string[];
  derivedMeanings: string[];
  examples: HouseExample[];
}

export interface HouseExample {
  scenario: string;
  explanation: string;
  whyThisHouse: string;
}

export interface ChartTurningExample {
  from: string;
  to: string;
  calculation: string;
  example: string;
}

// Core house interpretations based on Frawley's teachings
export const HOUSE_INTERPRETATIONS: HouseInterpretation[] = [
  {
    houseNumber: 1,
    name: "The Querent",
    primaryMeaning: "The person asking the question and their immediate situation",
    keyAssociations: [
      "The querent's body and appearance",
      "The querent's name",
      "General situation in querent's location",
      "'Us' when asking about groups or couples",
      "The ship that I sail in (immediate vehicle)"
    ],
    physicalBody: "Head region",
    commonQuestions: [
      "Questions about the querent's health",
      "General outcome in querent's area",
      "Group questions where querent represents 'us'"
    ],
    avoidCommonMistakes: [
      "Don't use 1st for other people unless they're part of 'us'",
      "Not always the most important house - depends on question"
    ],
    derivedMeanings: [
      "In medical questions: specifically the head",
      "Weather in querent's location",
      "General circumstances 'here'"
    ],
    examples: [
      {
        scenario: "Will we have a hot summer?",
        explanation: "Use 1st house for general weather in querent's location",
        whyThisHouse: "The 1st shows the general situation 'here' where the querent is"
      },
      {
        scenario: "Will our team win the contract?",
        explanation: "When querent represents a group, use 1st for 'us'",
        whyThisHouse: "Querent identifies with and represents the whole group"
      }
    ]
  },
  {
    houseNumber: 2,
    name: "Movable Possessions",
    primaryMeaning: "Querent's movable possessions, money, and self-esteem",
    keyAssociations: [
      "Money in all forms (currency, bank accounts, stocks)",
      "Movable possessions (car, jewelry, piano)",
      "Self-esteem and self-valuing",
      "Closest advisors (lawyer, witnesses)",
      "Food and what sustains the 1st house"
    ],
    physicalBody: "Throat and what goes into it",
    commonQuestions: [
      "Will I get my money back?",
      "Is my car worth buying?",
      "Should I hire this lawyer?"
    ],
    avoidCommonMistakes: [
      "Not for immovable property (that's 4th house)",
      "Not for living things you 'own' (pets are 6th house)",
      "Piano is 2nd house (possession), not 5th (creativity)"
    ],
    derivedMeanings: [
      "Partner's esteem for the querent",
      "What financially supports the querent",
      "Legal representation and witnesses"
    ],
    examples: [
      {
        scenario: "My piano as my possession",
        explanation: "The piano is a movable possession, regardless of whether you play it",
        whyThisHouse: "It's the thing itself (possession), not its function (creativity)"
      },
      {
        scenario: "The lawyer defending me in court",
        explanation: "The lawyer is your second, your advisor in this specific case",
        whyThisHouse: "They are whispering advice in your ear, supporting you"
      }
    ]
  },
  {
    houseNumber: 3,
    name: "Daily Routine",
    primaryMeaning: "Daily journeys, siblings, and routine knowledge",
    keyAssociations: [
      "Siblings and cousins",
      "Daily round and routine journeys",
      "Elementary knowledge (the '3 Rs')",
      "Letters being sent",
      "Neighbors in daily life",
      "Elementary schools"
    ],
    physicalBody: "Arms, shoulders, and hands",
    commonQuestions: [
      "Will my sister visit?",
      "Should I take this daily commute?",
      "Will my letter arrive safely?"
    ],
    avoidCommonMistakes: [
      "Journey length isn't the key - it's whether it's routine or special",
      "Not all neighbors - only those in your daily round",
      "Expected letters are usually 9th house (3rd from 7th)"
    ],
    derivedMeanings: [
      "Knowledge needed for daily navigation",
      "Rumours and gossip",
      "Students (opposite to 9th house teacher)"
    ],
    examples: [
      {
        scenario: "Walking to corner shrine vs. office next to church",
        explanation: "Shrine visit is pilgrimage (9th), office is routine (3rd)",
        whyThisHouse: "It's the specialness, not distance, that determines the house"
      },
      {
        scenario: "Rumours about the querent",
        explanation: "Gossip and local chatter belongs to daily round",
        whyThisHouse: "3rd house governs local communication and neighborhood talk"
      }
    ]
  },
  {
    houseNumber: 4,
    name: "Foundation",
    primaryMeaning: "Father, immovable property, and the end of matters",
    keyAssociations: [
      "Father and parents in general",
      "Ancestry and family roots",
      "Immovable possessions (houses, land)",
      "Home country",
      "End of the matter (final outcome)",
      "Things underground (mines, buried treasure)"
    ],
    physicalBody: "Chest and lungs",
    commonQuestions: [
      "Will I inherit my father's house?",
      "How will this situation end?",
      "Should I buy this property?"
    ],
    avoidCommonMistakes: [
      "Holiday home abroad is still 4th house (your property)",
      "Only use 'end of matter' as last resort",
      "Don't confuse with 10th house (mother)"
    ],
    derivedMeanings: [
      "Verdict in court cases",
      "Prognosis in medical questions",
      "Roots and foundations of any matter"
    ],
    examples: [
      {
        scenario: "Holiday home in Spain",
        explanation: "Still your immovable property, regardless of location",
        whyThisHouse: "It's your property that happens to be abroad, not a foreign property"
      },
      {
        scenario: "The verdict in a trial",
        explanation: "Court trials uniquely use 4th house for final judgment",
        whyThisHouse: "4th house shows 'the end of the matter' - how things conclude"
      }
    ]
  },
  {
    houseNumber: 5,
    name: "Pleasure & Creation",
    primaryMeaning: "Children, pleasure, creativity, and places of enjoyment",
    keyAssociations: [
      "Children and pregnancy",
      "Places of pleasure (theaters, parties, taverns)",
      "Sex (emphatically not 8th house!)",
      "Creative works ('my baby')",
      "Father's money (2nd from 4th)",
      "Messengers and ambassadors"
    ],
    physicalBody: "Heart, liver, stomach, sides and back",
    commonQuestions: [
      "Will I have children?",
      "Is she pregnant?",
      "Will my book be published?"
    ],
    avoidCommonMistakes: [
      "Pregnant woman is still the woman (7th if wife), pregnancy is 5th",
      "Sexual partner is 7th house (person), sex act is 5th (function)",
      "Not 8th house for sex - that's completely wrong"
    ],
    derivedMeanings: [
      "Profit from property (father's money)",
      "Childbed is 12th house (confinement)",
      "Artistic and creative endeavors"
    ],
    examples: [
      {
        scenario: "My mistress and what I do with her",
        explanation: "The person is 7th house, the sexual activity is 5th house",
        whyThisHouse: "Distinction between the thing (person) and function (sex)"
      },
      {
        scenario: "The book I have written",
        explanation: "Creative works are considered 'my baby' - offspring of creativity",
        whyThisHouse: "5th house governs both literal children and creative 'children'"
      }
    ]
  },
  {
    houseNumber: 6,
    name: "Difficulties",
    primaryMeaning: "Illness, servants, and small animals",
    keyAssociations: [
      "Illness and hospitals",
      "Employees and servants",
      "Small animals (smaller than goats)",
      "Uncles and aunts (3rd from 4th)",
      "Subordinates at work",
      "Slings and arrows of outrageous fortune"
    ],
    physicalBody: "Lower belly, bowels, and intestines",
    commonQuestions: [
      "Will I recover from illness?",
      "Should I hire this tradesman?",
      "Where is my lost cat?"
    ],
    avoidCommonMistakes: [
      "NOT the querent's job (that's 10th house)",
      "Employees work FOR you, not work you do",
      "Modern tenants are 7th house (partners), not 6th (servants)"
    ],
    derivedMeanings: [
      "Those who serve or work for the querent",
      "Small domestic animals and pets",
      "Unpleasantness and obstacles"
    ],
    examples: [
      {
        scenario: "Should I hire this builder?",
        explanation: "Builder works for you, providing a service",
        whyThisHouse: "Anyone who works for you or serves you belongs to 6th house"
      },
      {
        scenario: "My lost cat",
        explanation: "Cats are smaller than goats, so they're 6th house animals",
        whyThisHouse: "Traditional criterion: smaller than a goat = 6th house"
      }
    ]
  },
  {
    houseNumber: 7,
    name: "Others",
    primaryMeaning: "Partners, open enemies, and other people in general",
    keyAssociations: [
      "Spouses and romantic partners",
      "Business partners",
      "Open enemies and opponents",
      "Anyone you do deals with",
      "Doctors and astrologers (when actively helping)",
      "'Any old person' - people in general"
    ],
    physicalBody: "Reproductive system and pelvis",
    commonQuestions: [
      "Will my spouse support me?",
      "Will my enemy attack?",
      "Will that celebrity get convicted?"
    ],
    avoidCommonMistakes: [
      "If judging your own chart, you can't also be 7th house",
      "Modern tenants are partners (7th), not servants (6th)",
      "Even brief relationships or desired ones are 7th house"
    ],
    derivedMeanings: [
      "Those of greatest significance AND least significance",
      "Joe Public, customers, clients",
      "People who don't fit other house categories"
    ],
    examples: [
      {
        scenario: "Will I sell my house?",
        explanation: "The central issue is the prospective buyer, not the house",
        whyThisHouse: "You're doing a deal with the buyer - they're your partner in the transaction"
      },
      {
        scenario: "Will that missing person come home?",
        explanation: "Random person who doesn't belong to specific house categories",
        whyThisHouse: "7th house covers 'any old person' when no other house applies"
      }
    ]
  },
  {
    houseNumber: 8,
    name: "Death & Others' Money",
    primaryMeaning: "Death, other people's money, and partner's resources",
    keyAssociations: [
      "Literal death (not metaphorical)",
      "Other person's money (2nd from 7th)",
      "Partner's esteem and valuation",
      "Wills and legacies (general)",
      "Fear and anguish of mind",
      "Spouse's or enemy's resources"
    ],
    physicalBody: "Organs of excretion",
    commonQuestions: [
      "Will he pay me what he owes?",
      "Does my spouse have money?",
      "Will I inherit from this person?"
    ],
    avoidCommonMistakes: [
      "NOTHING to do with sex (that's 5th house)",
      "Not metaphorical transformation - literal death only",
      "Specific inheritance questions use dead person's 2nd house"
    ],
    derivedMeanings: [
      "Resources of people you deal with",
      "What others value or esteem",
      "Fear as emotional state (not phobias - that's 12th)"
    ],
    examples: [
      {
        scenario: "Will the bookie pay out on my bet?",
        explanation: "The bookie's money that you're trying to win",
        whyThisHouse: "It's the enemy's money - 2nd house from the 7th house"
      },
      {
        scenario: "Querent's planet in 8th with no reason",
        explanation: "Shows querent is anguished about the matter",
        whyThisHouse: "8th house indicates fear and mental anguish when querent's planet is there"
      }
    ]
  },
  {
    houseNumber: 9,
    name: "Higher Pursuits",
    primaryMeaning: "Special journeys, religion, higher learning, and foreign countries",
    keyAssociations: [
      "Special journeys (pilgrimage, holidays)",
      "Religion, spirituality, and God",
      "Higher education and universities",
      "Teachers, priests, learned people",
      "Foreign countries and long travel",
      "Dreams, predictions, and prophecies"
    ],
    physicalBody: "Hips and buttocks",
    commonQuestions: [
      "Should I take this pilgrimage?",
      "Will I get into university?",
      "What does this dream mean?"
    ],
    avoidCommonMistakes: [
      "Specialness matters more than distance for journeys",
      "Monasteries are 9th (prayer), not 12th (prison)",
      "Expected letters are usually 9th (3rd from 7th)"
    ],
    derivedMeanings: [
      "Knowledge beyond daily routine needs",
      "Marriage bureau (in certain cultures)",
      "All learned people and their learning"
    ],
    examples: [
      {
        scenario: "Commute to New York vs. weekend spa 20 miles away",
        explanation: "Routine commute is 3rd house, special spa trip is 9th house",
        whyThisHouse: "9th house is about special journeys, regardless of distance"
      },
      {
        scenario: "Letter I'm expecting to receive",
        explanation: "Usually shown by 9th house as 3rd from 7th",
        whyThisHouse: "It's the other person's communication (3rd) coming to you"
      }
    ]
  },
  {
    houseNumber: 10,
    name: "Authority",
    primaryMeaning: "Kings, bosses, career, and honor",
    keyAssociations: [
      "Kings, bosses, government officials",
      "The querent's job or career",
      "Mother",
      "Honor, success, glory",
      "Judges and court system",
      "Formal marriage arrangements"
    ],
    physicalBody: "Thighs and knees",
    commonQuestions: [
      "Will I get the promotion?",
      "Will the government approve this?",
      "How is my career going?"
    ],
    avoidCommonMistakes: [
      "This IS the querent's job (unlike 6th house)",
      "Mother is 10th, father is 4th",
      "Formal marriage only, not the relationship itself"
    ],
    derivedMeanings: [
      "Any boss or authority figure",
      "Success and public recognition",
      "Official positions and formal roles"
    ],
    examples: [
      {
        scenario: "Will I win Olympic gold?",
        explanation: "Olympic gold represents ultimate honor and glory",
        whyThisHouse: "10th house governs honor, success, and public recognition"
      },
      {
        scenario: "Different perspectives on Prime Minister",
        explanation: "1st if he's asking, 10th if citizen asking, 6th if foreigner asking",
        whyThisHouse: "Same person, different house depending on relationship and context"
      }
    ]
  },
  {
    houseNumber: 11,
    name: "Support Systems",
    primaryMeaning: "Wages, hopes, true friends, and gifts from authority",
    keyAssociations: [
      "Boss's money - wages (2nd from 10th)",
      "Advisors to authority figures",
      "Gifts from kings/authority",
      "Hopes and wishes",
      "True friends (not mere acquaintances)",
      "Pennies from heaven - unexpected windfalls"
    ],
    physicalBody: "Calves and ankles",
    commonQuestions: [
      "Will I get my wages?",
      "Will I win the lottery?",
      "Will the government grant me aid?"
    ],
    avoidCommonMistakes: [
      "True friends only, not work colleagues or acquaintances",
      "Not social institutions - those depend on context",
      "Hopes can actually prevent desired outcomes"
    ],
    derivedMeanings: [
      "Money from job or authority",
      "Royal advisors and cabinet members",
      "Unexpected good fortune"
    ],
    examples: [
      {
        scenario: "Trade union - different perspectives",
        explanation: "7th (colleagues), 1st (us), 6th (servants), or 7th (enemies) depending on context",
        whyThisHouse: "Same organization, different house depending on relationship and question"
      },
      {
        scenario: "When will I marry? - hopes getting in way",
        explanation: "Lord 11 interfering shows hopes and wishes scaring away prospects",
        whyThisHouse: "11th house hopes can sometimes prevent desired outcomes"
      }
    ]
  },
  {
    houseNumber: 12,
    name: "Hidden Enemies",
    primaryMeaning: "Secret enemies, self-undoing, fears, and large animals",
    keyAssociations: [
      "Secret enemies and hidden things",
      "Self-undoing and self-sabotage",
      "Vices, sins, and moral failings",
      "Fears and phobias",
      "Prisons and confinement",
      "Large animals (larger than goats)"
    ],
    physicalBody: "Feet",
    commonQuestions: [
      "Who is spreading rumours about me?",
      "Will I overcome my phobia?",
      "Where is my lost horse?"
    ],
    avoidCommonMistakes: [
      "Secret refers to HOW they harm, not whether identity is known",
      "Monasteries are 9th (prayer), not 12th (prison)",
      "Large animals, not all animals"
    ],
    derivedMeanings: [
      "Things that undermine us",
      "Hidden aspects of situations",
      "What we imprison ourselves with"
    ],
    examples: [
      {
        scenario: "Spreading malicious rumours",
        explanation: "Even if you know who's doing it, it's secret/underhanded method",
        whyThisHouse: "12th house is about the secretive nature of the harm, not anonymity"
      },
      {
        scenario: "My lost horse",
        explanation: "Horses are larger than goats, so they belong to 12th house",
        whyThisHouse: "Traditional criterion: larger than a goat = 12th house animal"
      }
    ]
  }
];

// Chart turning calculations and examples
export const CHART_TURNING_EXAMPLES: ChartTurningExample[] = [
  {
    from: "Daughter (5th)",
    to: "Daughter's career (10th from 5th)",
    calculation: "10th from 5th = 2nd house",
    example: "How is my daughter's job going?"
  },
  {
    from: "Spouse (7th)",
    to: "Spouse's money (2nd from 7th)",
    calculation: "2nd from 7th = 8th house",
    example: "Does my partner have enough savings?"
  },
  {
    from: "Boss (10th)",
    to: "Boss's advisor (11th from 10th)",
    calculation: "11th from 10th = 8th house",
    example: "Who is influencing my boss's decisions?"
  },
  {
    from: "Enemy (7th)",
    to: "Enemy's resources (2nd from 7th)",
    calculation: "2nd from 7th = 8th house",
    example: "Can my opponent afford to keep fighting?"
  },
  {
    from: "Foreign country (9th)",
    to: "Foreign king (10th from 9th)",
    calculation: "10th from 9th = 6th house",
    example: "Will the foreign leader approve our trade deal?"
  }
];

// Helper functions for house analysis
export function getHouseInterpretation(houseNumber: number): HouseInterpretation | undefined {
  return HOUSE_INTERPRETATIONS.find(house => house.houseNumber === houseNumber);
}

export function calculateTurnedHouse(startHouse: number, targetHouse: number): number {
  // Calculate turned house: targetHouse from startHouse
  // Formula: ((startHouse - 1) + (targetHouse - 1)) % 12 + 1
  return ((startHouse - 1 + targetHouse - 1) % 12) + 1;
}

export function getContextualHouseMeaning(houseNumber: number, context: string): string {
  const house = getHouseInterpretation(houseNumber);
  if (!house) return `House ${houseNumber}`;
  
  // Return contextual meaning based on the question type
  // This could be expanded based on specific contexts
  return house.primaryMeaning;
}

export function identifyPersonHouse(relationship: string, perspective: string = 'querent'): number {
  const relationshipMap: { [key: string]: number } = {
    'self': 1,
    'querent': 1,
    'spouse': 7,
    'partner': 7,
    'wife': 7,
    'husband': 7,
    'enemy': 7,
    'opponent': 7,
    'father': 4,
    'mother': 10,
    'child': 5,
    'daughter': 5,
    'son': 5,
    'sibling': 3,
    'brother': 3,
    'sister': 3,
    'boss': 10,
    'employee': 6,
    'servant': 6,
    'friend': 11,
    'neighbor': 3,
    'teacher': 9,
    'student': 3,
    'doctor': 7,
    'lawyer': 2,
    'astrologer': 9
  };
  
  return relationshipMap[relationship.toLowerCase()] || 7; // Default to 7th for unknown persons
}

// Body parts mapping for medical questions
export const HOUSE_BODY_PARTS: { [key: number]: string } = {
  1: "Head, face, brain",
  2: "Throat, neck, voice",
  3: "Arms, shoulders, hands, lungs",
  4: "Chest, breasts, stomach",
  5: "Heart, liver, back, sides",
  6: "Lower belly, bowels, intestines",
  7: "Reproductive system, pelvis, kidneys",
  8: "Organs of excretion, genitals",
  9: "Hips, thighs, buttocks",
  10: "Knees, skin, bones",
  11: "Calves, ankles, circulation",
  12: "Feet, lymphatic system"
};

export function getBodyPartForHouse(houseNumber: number): string {
  return HOUSE_BODY_PARTS[houseNumber] || `House ${houseNumber} body area`;
}