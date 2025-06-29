# Significators Interpretation Strategy

## Overview
This document outlines the implementation strategy for the Significators chapter from John Frawley's "The Horary Textbook". The Significators tab will be the third interpretation tab in our horary system, focusing on planetary assignments, rulerships, and natural associations.

## Core Concepts from Frawley's Significators Chapter

### Planetary Significators
Planets acquire meanings in two ways:
1. **Accidental Rulerships** - By the houses they rule (primary importance)
2. **Natural Associations** - Through their inherent qualities (secondary)

### House Rulership Principles

#### Basic Rule Assignment
- **Planet ruling house cusp sign = Significator of that house**
- Example: Moon rules Cancer → If 2nd cusp at 15° Cancer → Moon = Lord 2 (significator of money/possessions)
- Example: Mercury rules Virgo → If 4th cusp at 29° Virgo → Mercury = Lord 4 (significator of father/home)

#### Critical Rulership Rules
- **One ruler only** - No co-rulers (modern concept rejected)
- **Cusp sign determines** - Even at 29°59' of sign
- **Question determines meaning** - Same planet can signify different things based on context

#### Alternative Significator Methods (when main ruler occupied)
1. **Next sign ruler** - Only if concept of "next" is relevant to question
2. **Planet on cusp** - Within 2° of cusp, same sign only
3. **Almuten of house cusp** - Emergency use only (very rare)

### Special Moon Rules

#### Moon as Co-significator
- **Always co-significator of querent** (unless main significator of quesited)
- **Emotional weighting** - More connected to querent's feelings
- **Third-party questions** - Moon stays with querent, doesn't transfer to subject
- **Aspects from Moon** - Less convincing than Lord 1, need supporting testimony

#### Moon Priority System
- If Moon rules quesited house → Moon signifies quesited (not querent)
- Example: "Will I get the job?" + Moon rules 10th → Moon = job, not querent
- Quesited has prior claim on Moon's services

### Natural Planetary Rulerships

#### Saturn - Cold & Dry, Diurnal, Masculine
**Qualities**: Old, black, hard, heavy, dead, decayed, restrictive, dry, cold, solitary, sad
**Examples**:
- **Objects**: Root vegetables, liquorice, mildew, waste products, lead
- **People**: Plumbers, sewermen, undertakers, miners, farm laborers, gardeners
- **Concepts**: Discipline, prisons, ruins, toilets, locks, fathers (night charts)
- **Animals**: Moles, dogs, cats, scavengers, things under stones
- **Body**: Right ear, bones, teeth, skin, joints, spleen

#### Jupiter - Hot & Moist, Diurnal, Masculine
**Qualities**: Big, expansive, expensive, luxurious, religious, purple, laxative, generous
**Examples**:
- **Objects**: Fruit trees, rhubarb, foie gras, rain, amethyst, sapphire, emerald, tin
- **People**: Rich men, aristocrats, judges, priests, teachers, gurus
- **Concepts**: Feasts, mercy, abundance
- **Animals**: Big animals, gentle and beneficial to mankind
- **Body**: Left ear, lungs, liver, blood, semen

#### Mars - Hot & Dry, Nocturnal, Masculine
**Qualities**: Sharp, burning, cutting, red, abrasive, hot, aggressive
**Examples**:
- **Objects**: Peppers, garlic, radishes, nettles, thistles, iron, bloodstone, jasper, coral
- **People**: Soldiers, butchers, tailors, surgeons, barbers, pirates, firemen, executioners
- **Concepts**: Divorce, fevers, lust
- **Animals**: Fierce or fiery creatures, those that bite or sting
- **Body**: Gall bladder, genitals (especially male)

#### Sun - Hot & Dry, Diurnal, Masculine
**Qualities**: Unique, royal, golden, life-giving, honest
**Examples**:
- **Objects**: All food (staples), citrus fruit, sunflowers, marigolds, gold, diamond, amber
- **People**: Kings, whoever is in charge, goldsmiths, minters, fathers (day charts)
- **Concepts**: Pride, palaces, grand buildings
- **Animals**: Eagles (king of birds), lions (king of beasts)
- **Body**: Vital spirit, heart, brain, eyes (right eye in males, left in females)

#### Venus - Cold & Moist, Nocturnal, Feminine
**Qualities**: Soft, pretty, fragrant, attractive, pleasant
**Examples**:
- **Objects**: Flowers, soft fruit, chocolate, beds, wardrobes, copper, brass, cornelian
- **People**: Jewellers, musicians, fashionistas, prostitutes, drapers, decorators, wives, young women, mothers (day charts)
- **Concepts**: Kisses, marriage, treaties, fun, art, music, make-up, perfume
- **Animals**: Soft and cuddly animals (children's zoo inhabitants)
- **Body**: Kidneys, sense of smell, genitals (especially female)

#### Mercury - Cold & Dry, Mixed Gender, Diurnal if Oriental/Nocturnal if Occidental
**Qualities**: Parti-colored, ambiguous, dextrous, tricky, mixed
**Examples**:
- **Objects**: Sweet & sour sauce, cocktails, pizza, berries, currants, walnuts, beans, keys, documents, computers
- **People**: Thieves, servants, tricksters, merchants, doctors, lawyers, clerks, accountants, astrologers
- **Concepts**: Variety, earthquakes, articulation, talk, lies, knowledge
- **Animals**: Monkeys, parrots, puppets, bees, hyenas (things that speak/resemble humans)
- **Body**: Tongue, brain (seat of reason), arms, hands, fingers

#### Moon - Cold & Moist, Nocturnal, Feminine
**Qualities**: Liquid, soft, little flavor/substance, formless, white, new
**Examples**:
- **Objects**: Cabbages, cucumbers, melons, mushrooms, candles, pearls, moonstone, alabaster
- **People**: Babies, midwives, mothers (night charts), queens (as wife), common people, tramps, sailors, nurses
- **Concepts**: Lost objects, intoxicants, changeability, fickleness, novelty
- **Animals**: Water creatures (fish, otters, frogs, ducks), night creatures (slugs, owls, bushbabies)
- **Body**: Breasts, womb, belly, intestines

### Age Associations
**Rising scale**: Moon (babies) → Mercury → Venus → Sun → Mars → Jupiter → Saturn (old)
**"Seven Ages of Man"** - Traditional progression of life stages

### Outer Planets (Limited Use)
#### Uranus, Neptune, Pluto
- **Very limited significance** - Not traditional rulers
- **Use only when**: Right on relevant house cusp OR in immediate aspect with main significators
- **Uranus**: Divorce, disruption, house-moving
- **Neptune**: Illusion, deceit
- **Pluto**: Generally malefic
- **Do NOT rule signs** - Modern associations are groundless
- **Treat like fixed stars** - Ignore unless prominently placed

### Unidentified Planet Analysis

#### Caution Required
- **Biggest risk**: Writing our own stories into the chart
- **Keep imagination on short lead**
- **Consult with querent** when possible
- **Ask open questions**: "Someone else seems involved - any idea who?"

#### Identification Methods
1. **House rulership** - What does the planet rule?
2. **"Some other person"** - When house meaning irrelevant
3. **Most concrete option** - Always choose practical over abstract
4. **Reception analysis** - Study relationships with other planets for confirmation

#### Example Process
- Planet rules 9th house in relationship question
- Could be: Wife's brother (3rd from 7th), Couple's grandson (5th from 5th), Teacher, Foreign person, etc.
- **Solution**: Ask querent, study receptions, choose most concrete/relevant option

## Implementation Strategy

### Data Structures
```typescript
interface PlanetarySignificator {
  planet: string;
  isMainSignificator: boolean;
  isCoSignificator: boolean;
  housesRuled: number[];
  naturalAssociations: string[];
  currentQuestion: string;
  significatorOf: string[];
}

interface NaturalRulership {
  planet: string;
  qualities: string[];
  objects: string[];
  people: string[];
  concepts: string[];
  animals: string[];
  bodyParts: string[];
  age: string;
  temperament: string;
}
```

### UI Components
1. **Significator Assignment Panel**: Show which planets signify what
2. **Natural Rulership Reference**: Searchable database of natural associations
3. **Planet Identification Helper**: Tools for identifying unknown planets
4. **Moon Co-significator Tracker**: Special handling for Moon's dual role

### Key Features to Implement
1. **Automatic Significator Assignment**: Based on house rulerships and question context
2. **Natural Rulership Database**: Searchable reference for all planetary associations
3. **Unidentified Planet Analyzer**: Helper for determining unknown planet meanings
4. **Moon Role Tracker**: Clear indication of Moon's current significator role
5. **Context-Sensitive Suggestions**: Planet meanings based on question type

### Integration with Existing System
- Connect with house cusp calculations from chart data
- Use question context from HoraryQuestion type
- Integrate with existing planetary position data
- Cross-reference with Houses tab meanings

## Tab Content Sections

### 1. Significator Overview
- Clear display of main significators for current question
- Querent vs. Quesited assignments
- Moon's current role (co-significator or main significator)

### 2. Natural Rulerships Reference
- Searchable database by planet or object/concept
- Visual categorization by planetary qualities
- Age and temperament associations

### 3. Planet Identification Tool
- Helper for unidentified planets in chart
- House rulership analysis
- Reception-based confirmation methods

### 4. Context Analysis
- Question-specific significator suggestions
- Multiple interpretation possibilities
- Confidence levels for assignments

## Technical Notes
- Leverage existing astronomical calculations
- Build comprehensive natural rulership database
- Implement intelligent suggestion algorithms
- Maintain traditional accuracy over modern interpretations
- Provide clear visual hierarchy for significator importance