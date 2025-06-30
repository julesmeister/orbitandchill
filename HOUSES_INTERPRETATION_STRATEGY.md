# Houses Interpretation Strategy

## Overview
This document outlines the implementation strategy for the Houses chapter from John Frawley's "The Horary Textbook". The Houses tab will be the second interpretation tab in our horary system, focusing on house meanings and chart turning methodology.

## Core Concepts from Frawley's Houses Chapter

### House System
- **Regiomontanus**: The preferred house system for horary astrology
- **Equal in Right Ascension**: Houses are 30° in Right Ascension, not Celestial Longitude
- **Intercepted Signs**: Signs contained within houses with no cusp are normal and carry no special significance
- **5-Degree Rule**: Planets within 5° before a house cusp are considered in that house (same sign required)

### House Meanings Structure

#### 1st House - The Querent
- The querent's body and immediate situation
- "Us" when asking about groups or couples
- General situation in querent's location
- Physical: Head region

#### 2nd House - Movable Possessions
- Money, bank accounts, stocks, bonds
- Self-esteem and valuation
- Closest advisors (lawyer, witnesses)
- Food and sustenance
- Physical: Throat

#### 3rd House - Daily Routine
- Siblings and cousins
- Short journeys and daily travel
- Elementary knowledge and schools
- Letters being sent
- Neighbors and local community
- Physical: Arms, shoulders, hands

#### 4th House - Foundation
- Father, parents, ancestry
- Immovable possessions (houses, property)
- Home country
- "End of the matter" (outcome)
- Underground things, mines
- Physical: Chest, lungs

#### 5th House - Pleasure & Creation
- Children and pregnancy
- Places of pleasure (taverns, theaters)
- Sex (not the 8th house!)
- Creative works ("my baby")
- Father's money (2nd from 4th)
- Messengers and ambassadors
- Physical: Heart, liver, stomach

#### 6th House - Difficulties
- Illness and hospitals
- Employees and servants
- Small animals (smaller than goats)
- Uncles and aunts (3rd from 4th)
- Not the querent's job!
- Physical: Lower belly, bowels

#### 7th House - Others
- Partners (romantic and business)
- Open enemies and opponents
- Anyone we deal with
- "Any old person" (generic people)
- Physical: Reproductive system, pelvis

#### 8th House - Death & Others' Money
- Literal death
- Other person's money (2nd from 7th)
- Partner's esteem
- Wills and legacies (general)
- Fear and anguish of mind
- Physical: Organs of excretion

#### 9th House - Higher Pursuits
- Special journeys and foreign countries
- Religion, spirituality, God
- Higher education and universities
- Teachers, priests, learned people
- Dreams, predictions, prophecies
- Physical: Hips, buttocks

#### 10th House - Authority
- Kings, bosses, government
- Honor, success, glory
- The querent's job/career
- Mother
- Formal marriage arrangements
- Physical: Thighs, knees

#### 11th House - Support Systems
- Boss's money (wages - 2nd from 10th)
- Royal advisors and aides
- Gifts from authority
- Hopes and wishes
- True friends (not mere acquaintances)
- Physical: Calves, ankles

#### 12th House - Hidden Enemies
- Secret enemies and hidden things
- Self-undoing and vices
- Fears and phobias
- Prisons and confinement
- Large animals (larger than goats)
- Physical: Feet

### Chart Turning Methodology

#### Principle
- Always count the starting house as "1"
- Example: Daughter's career = 10th from 5th = 2nd house
- The radical chart shows the querent as 1st house

#### Common Turning Examples
- My daughter's possessions: 2nd from 5th = 6th house
- My spouse's money: 2nd from 7th = 8th house
- My boss's advisor: 11th from 10th = 8th house
- Foreign king: 10th from 9th = 6th house

#### Important Distinctions
- Thing vs. Function: A piano is 2nd house (possession), not 5th house (creativity)
- Context matters: Same person can be different houses depending on the question
- Multiple perspectives: Prime Minister can be 1st (if he's asking), 10th (if we're asking about him), or 6th (if foreigner asking about him)

## Implementation Strategy

### Data Structure
```typescript
interface HouseInterpretation {
  houseNumber: number;
  primaryMeaning: string;
  keyAssociations: string[];
  physicalBody: string;
  commonQuestions: string[];
  avoidCommonMistakes: string[];
}
```

### UI Components
1. **House Wheel Visualization**: Interactive 12-house wheel
2. **House Detail Cards**: Expandable cards for each house
3. **Chart Turning Calculator**: Interactive tool for turning charts
4. **Context-Sensitive Examples**: Real-world scenarios for each house

### Key Features to Implement
1. **House Ruler Analysis**: Show planetary rulers of each house
2. **Planet-in-House Interpretations**: Meaning of planets in specific houses
3. **Chart Turning Helper**: Interactive guide for turning charts
4. **Context Disambiguation**: Help users choose correct house based on question type
5. **Physical Body Mapping**: Visual correlation between houses and body parts

### Integration with Existing System
- Connect with existing chart data from InteractiveHoraryChart
- Use house cusp positions from chartData
- Integrate with planetary position data
- Connect to question context from HoraryQuestion type

## Tab Content Sections

### 1. House Overview
- Visual house wheel with basic meanings
- Current planetary occupants of each house
- House rulers and their conditions

### 2. Detailed House Analysis
- Expandable sections for each house
- Context-specific interpretations
- Common question types for each house

### 3. Chart Turning Guide
- Interactive examples
- Step-by-step turning calculator
- Common turning scenarios

### 4. Contextual Interpretation
- Question-specific house assignments
- Person/object classification helper
- Multiple perspective examples

## Technical Notes
- Leverage existing horary calculation utilities
- Build on current chart analysis framework
- Maintain consistency with existing UI patterns
- Ensure mobile-responsive design
- Cache complex interpretations for performance