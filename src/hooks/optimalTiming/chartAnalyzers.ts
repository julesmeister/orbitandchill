import { ChartAspect, PlanetPosition } from '../../utils/natalChart';
import { getPlanetaryDignity } from '../../utils/astrologicalInterpretations';
import { priorityCriteria } from './priorities';
import { electionalProhibitions } from './electionalProhibitions';
import { isRetrograde, getMoonPhase } from './astrologicalUtils';
import { detectMagicFormula } from './financialAstrologyCalculations';

// Dignity scoring multipliers
const dignityScores = {
  'rulership': 1.5,    // Strong planetary power
  'exaltation': 1.3,   // Very good planetary expression
  'neutral': 1.0,      // Baseline
  'detriment': 0.7,    // Weakened planetary power
  'fall': 0.5          // Most challenging planetary expression
};

// Magic Formula scoring bonuses - HEAVILY PRIORITIZED
const MAGIC_FORMULA_BONUSES = {
  fullFormula: 5.0,    // +5 points for full Sun-Jupiter-Pluto formula (MASSIVE bonus)
  partialFormula: 2.5, // +2.5 points for partial formula (Jupiter-Pluto + one other)
  jupiterPlanetAspect: 0.8, // +0.8 points for any Jupiter aspect in financial contexts
  plutoAspect: 0.6     // +0.6 points for any Pluto aspect (transformation power)
};

/**
 * Calculate Magic Formula bonus scoring for financial astrology
 * DISABLED: Jupiter-Pluto aspects not astronomically active in 2025
 * Next Jupiter-Pluto conjunction ~2033-2035
 */
const calculateMagicFormulaBonus = (chartData: any, priorities: string[], showDebug = false): number => {
  // Magic Formula disabled - Jupiter and Pluto are not in aspect during 2025
  // Last conjunction was 2020, next will be ~2033-2035
  // Individual planet bonuses also disabled to prevent false positives
  
  if (showDebug) {
    // Magic Formula analysis disabled - not astronomically active in 2025
  }
  
  return 0; // No Magic Formula bonus until Jupiter-Pluto aspects return
};

// Aspect-only analysis that focuses purely on planetary relationships
export const analyzeChartForAspects = (chartData: any, priorities: string[], showDebug = false): number => {
  let totalScore = 0;
  
  if (showDebug) {
    // Analyzing chart for aspects only with priority list and available aspects
  }
  
  priorities.forEach(priority => {
    const criteria = priorityCriteria[priority];
    if (!criteria) {
      if (showDebug) { /* No criteria found for priority */ }
      return;
    }
    
    let priorityScore = 0;
    if (showDebug) {
      // Analyzing priority for aspects only with favorable planets and aspects
    }
    
    // Analyze favorable aspects with dignity consideration (WEIGHTED MORE HEAVILY)
    let aspectMatches = 0;
    let challengingAspectMatches = 0;
    chartData.aspects.forEach((aspect: ChartAspect) => {
      // Handle favorable aspects
      if (criteria.favorableAspects.includes(aspect.aspect)) {
        const planet1Weight = criteria.favorablePlanets.includes(aspect.planet1) ? 
          (criteria.weight[aspect.planet1] || 1) : 0;
        const planet2Weight = criteria.favorablePlanets.includes(aspect.planet2) ? 
          (criteria.weight[aspect.planet2] || 1) : 0;
        
        if (planet1Weight > 0 && planet2Weight > 0) {
          // Find the planets in chartData to get their signs for dignity
          const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet1);
          const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet2);
          
          let dignityMultiplier = 1.0;
          if (planet1Data && planet2Data) {
            const dignity1 = getPlanetaryDignity(planet1Data.name, planet1Data.sign);
            const dignity2 = getPlanetaryDignity(planet2Data.name, planet2Data.sign);
            dignityMultiplier = (dignityScores[dignity1] + dignityScores[dignity2]) / 2;
          }
          
          // For aspects-only mode, give aspects more weight than in house mode
          const aspectBonus = 1.8; // Boost aspect importance
          const points = (planet1Weight + planet2Weight) * 0.8 * dignityMultiplier * aspectBonus;
          priorityScore += points;
          aspectMatches++;
          
          if (showDebug) {
            // Favorable aspect scored with dignity multiplier
          }
        }
      }
      
      // Handle challenging aspects (reduce score)
      if (criteria.challengingAspects.includes(aspect.aspect)) {
        const allRelevantPlanets = [...criteria.favorablePlanets, 'mars', 'saturn', 'pluto'];
        const planet1Relevant = allRelevantPlanets.includes(aspect.planet1);
        const planet2Relevant = allRelevantPlanets.includes(aspect.planet2);
        
        if (planet1Relevant || planet2Relevant) {
          // Find the planets in chartData to get their signs for dignity
          const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet1);
          const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet2);
          
          let dignityMultiplier = 1.0;
          if (planet1Data && planet2Data) {
            const dignity1 = getPlanetaryDignity(planet1Data.name, planet1Data.sign);
            const dignity2 = getPlanetaryDignity(planet2Data.name, planet2Data.sign);
            dignityMultiplier = (dignityScores[dignity1] + dignityScores[dignity2]) / 2;
          }
          
          // Apply penalty
          const baseWeight = (planet1Relevant && planet2Relevant) ? 3.0 : 1.5;
          const penalty = baseWeight * 0.8 * dignityMultiplier;
          priorityScore -= penalty;
          challengingAspectMatches++;
          
          if (showDebug) {
            // Challenging aspect penalty applied with dignity consideration
          }
        }
      }
    });
    
    if (showDebug) { /* Priority score calculated from aspects */ }
    totalScore += priorityScore;
  });
  
  // Apply Magic Formula bonus - HEAVILY PRIORITIZED
  const magicFormulaBonus = calculateMagicFormulaBonus(chartData, priorities, showDebug);
  totalScore += magicFormulaBonus;
  
  // Increase cap to accommodate Magic Formula bonuses (was 10, now 15)
  const finalScore = Math.min(totalScore, 15);
  if (showDebug) {
    // Final aspect-based score with Magic Formula bonus applied
  }
  
  return finalScore;
};

// House-based analysis (extracted for reuse)
export const analyzeChartForHouses = (chartData: any, priorities: string[], showDebug = false): number => {
  let totalScore = 0;
  
  priorities.forEach(priority => {
    const criteria = priorityCriteria[priority];
    if (!criteria) {
      if (showDebug) { /* No criteria found for priority */ }
      return;
    }
    
    let priorityScore = 0;
    if (showDebug) {
      // Analyzing priority with favorable planets and houses
    }
    
    // Analyze planetary positions in favorable houses with dignity consideration
    let houseMatches = 0;
    chartData.planets.forEach((planet: PlanetPosition) => {
      if (criteria.favorablePlanets.includes(planet.name)) {
        if (criteria.favorableHouses.includes(planet.house)) {
          const planetWeight = criteria.weight[planet.name] || 1;
          const houseWeight = criteria.weight[`house${planet.house}`] || 1;
          
          // Get planetary dignity and apply multiplier
          const dignity = getPlanetaryDignity(planet.name, planet.sign);
          const dignityMultiplier = dignityScores[dignity];
          
          const points = planetWeight * houseWeight * dignityMultiplier;
          priorityScore += points;
          houseMatches++;
          
          if (showDebug) {
            // Planet in favorable house with dignity multiplier
          }
        } else {
          if (showDebug) { /* Planet not in favorable house */ }
        }
      }
    });
    
    // Analyze favorable aspects with dignity consideration
    let aspectMatches = 0;
    let challengingAspectMatches = 0;
    chartData.aspects.forEach((aspect: ChartAspect) => {
      // Handle favorable aspects
      if (criteria.favorableAspects.includes(aspect.aspect)) {
        const planet1Weight = criteria.favorablePlanets.includes(aspect.planet1) ? 
          (criteria.weight[aspect.planet1] || 1) : 0;
        const planet2Weight = criteria.favorablePlanets.includes(aspect.planet2) ? 
          (criteria.weight[aspect.planet2] || 1) : 0;
        
        if (planet1Weight > 0 && planet2Weight > 0) {
          // Find the planets in chartData to get their signs for dignity
          const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet1);
          const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet2);
          
          let dignityMultiplier = 1.0;
          if (planet1Data && planet2Data) {
            const dignity1 = getPlanetaryDignity(planet1Data.name, planet1Data.sign);
            const dignity2 = getPlanetaryDignity(planet2Data.name, planet2Data.sign);
            // Use average dignity multiplier for aspects
            dignityMultiplier = (dignityScores[dignity1] + dignityScores[dignity2]) / 2;
          }
          
          const points = (planet1Weight + planet2Weight) * 0.5 * dignityMultiplier;
          priorityScore += points;
          aspectMatches++;
          
          if (showDebug) {
            // Favorable aspect with dignity consideration
          }
        }
      }
      
      // Handle challenging aspects (reduce score)
      if (criteria.challengingAspects.includes(aspect.aspect)) {
        const allRelevantPlanets = [...criteria.favorablePlanets, 'mars', 'saturn', 'pluto'];
        const planet1Relevant = allRelevantPlanets.includes(aspect.planet1);
        const planet2Relevant = allRelevantPlanets.includes(aspect.planet2);
        
        if (planet1Relevant || planet2Relevant) {
          // Find the planets in chartData to get their signs for dignity
          const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet1);
          const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === aspect.planet2);
          
          let dignityMultiplier = 1.0;
          if (planet1Data && planet2Data) {
            const dignity1 = getPlanetaryDignity(planet1Data.name, planet1Data.sign);
            const dignity2 = getPlanetaryDignity(planet2Data.name, planet2Data.sign);
            dignityMultiplier = (dignityScores[dignity1] + dignityScores[dignity2]) / 2;
          }
          
          // Apply penalty
          const baseWeight = (planet1Relevant && planet2Relevant) ? 3.0 : 1.5;
          const penalty = baseWeight * 0.8 * dignityMultiplier;
          priorityScore -= penalty;
          challengingAspectMatches++;
          
          if (showDebug) {
            // Challenging aspect penalty with dignity consideration
          }
        }
      }
    });
    
    // Analyze combo criteria
    let comboMatches = 0;
    if (criteria.comboCriteria) {
      criteria.comboCriteria.forEach(combo => {
        const planetsInHouse = combo.planets.filter(planetName => {
          const planet = chartData.planets.find((p: PlanetPosition) => p.name === planetName);
          return planet && planet.house === combo.house;
        });
        
        if (planetsInHouse.length === combo.planets.length) {
          let comboDignityMultiplier = 1.0;
          if (planetsInHouse.length > 0) {
            const dignitySum = planetsInHouse.reduce((sum, planetName) => {
              const planet = chartData.planets.find((p: PlanetPosition) => p.name === planetName);
              if (planet) {
                const dignity = getPlanetaryDignity(planet.name, planet.sign);
                return sum + dignityScores[dignity];
              }
              return sum;
            }, 0);
            comboDignityMultiplier = dignitySum / planetsInHouse.length;
          }
          
          const comboPoints = combo.bonus * comboDignityMultiplier;
          priorityScore += comboPoints;
          comboMatches++;
          
          if (showDebug) {
            // Combo bonus/penalty applied with dignity multiplier
          }
        }
      });
    }
    
    if (showDebug) { /* Priority score from houses, aspects, and combos */ }
    totalScore += priorityScore;
  });
  
  // Apply Magic Formula bonus - HEAVILY PRIORITIZED
  const magicFormulaBonus = calculateMagicFormulaBonus(chartData, priorities, showDebug);
  totalScore += magicFormulaBonus;
  
  // Increase cap to accommodate Magic Formula bonuses (was 10, now 15)
  const finalScore = Math.min(totalScore, 15);
  if (showDebug) {
    // Final house-based score with Magic Formula bonus applied
  }
  
  return finalScore;
};

// Enhanced electional analysis that checks prohibitions first
export const analyzeChartForElectionalTiming = (chartData: any, priorities: string[], date: Date, showDebug = false): number => {
  let baseScore = 0;
  let electionalMultiplier = 1.0;
  const prohibitionsPenalties: string[] = [];
  
  if (showDebug) {
    // Electional analysis for specific date with priority list
  }
  
  // Check UNIVERSAL electional prohibitions that apply to ALL priorities
  const universalProhibitions = [
    electionalProhibitions.mercury_retrograde,
    electionalProhibitions.mars_saturn_opposition,
    electionalProhibitions.full_moon_new_venture,
    electionalProhibitions.mars_debilitated,
    electionalProhibitions.saturn_debilitated,
    electionalProhibitions.mercury_combust
  ];
  
  // Apply universal prohibitions regardless of priority
  universalProhibitions.forEach(prohibition => {
    if (prohibition.checkFunction(chartData, date)) {
      electionalMultiplier *= prohibition.penaltyMultiplier;
      prohibitionsPenalties.push(`${prohibition.name} (${(prohibition.penaltyMultiplier * 100).toFixed(0)}%)`);
      
      if (showDebug) {
        // Electional prohibition applied with severity and penalty
      }
    }
  });
  
  // Calculate base score using regular house-based analysis (avoid recursion)
  baseScore = analyzeChartForHouses(chartData, priorities, showDebug);
  
  // Apply universal Moon phase considerations for new ventures
  const moonPhase = getMoonPhase(date);
  let moonPhaseMultiplier = 1.0;
  
  // Default moon phase multipliers for all new ventures (based on electional principles)
  const defaultMoonPhaseMultipliers = {
    'new': 1.1,              // Good for new beginnings but can be weak
    'waxing_crescent': 1.4,  // BEST - growth and increase
    'first_quarter': 1.3,    // Good - action and momentum
    'waxing_gibbous': 1.2,   // Good - still growing
    'full': 0.6,             // AVOID - culmination and crisis
    'waning_gibbous': 0.8,   // Declining - better for releasing
    'last_quarter': 0.7,     // Declining - letting go
    'waning_crescent': 0.9   // Preparation phase
  };
  
  moonPhaseMultiplier = defaultMoonPhaseMultipliers[moonPhase as keyof typeof defaultMoonPhaseMultipliers] || 1.0;
  
  if (showDebug) {
    // Moon phase analysis with traditional electional considerations
  }
  
  // Check universal favorable conditions for bonus scoring
  let conditionsBonusMultiplier = 1.0;
  
  // Mercury direct is universally beneficial (especially for communication, contracts, travel)
  const mercury = chartData.planets.find((p: PlanetPosition) => p.name === 'mercury');
  if (mercury && !isRetrograde(mercury)) {
    conditionsBonusMultiplier *= 1.2; // 20% bonus for Mercury direct
    if (showDebug) {
      // Mercury direct bonus applied
    }
  }
  
  // Check for well-dignified benefics (Jupiter and Venus)
  const jupiter = chartData.planets.find((p: PlanetPosition) => p.name === 'jupiter');
  if (jupiter) {
    const jupiterDignity = getPlanetaryDignity(jupiter.name, jupiter.sign);
    if (jupiterDignity === 'rulership' || jupiterDignity === 'exaltation') {
      conditionsBonusMultiplier *= 1.15; // 15% bonus for dignified Jupiter
      if (showDebug) {
        // Jupiter dignity bonus applied
      }
    }
  }
  
  const venus = chartData.planets.find((p: PlanetPosition) => p.name === 'venus');
  if (venus) {
    const venusDignity = getPlanetaryDignity(venus.name, venus.sign);
    if (venusDignity === 'rulership' || venusDignity === 'exaltation') {
      conditionsBonusMultiplier *= 1.1; // 10% bonus for dignified Venus
      if (showDebug) {
        // Venus dignity bonus applied
      }
    }
  }
  
  let finalScore = baseScore * electionalMultiplier * moonPhaseMultiplier * conditionsBonusMultiplier;
  
  // Apply Magic Formula bonus - HEAVILY PRIORITIZED (added after multipliers for maximum impact)
  const magicFormulaBonus = calculateMagicFormulaBonus(chartData, priorities, showDebug);
  finalScore += magicFormulaBonus;
  
  if (showDebug) {
    // Electional scoring breakdown with all multipliers and bonuses applied
  }
  
  return Math.min(finalScore, 15); // Increased cap to accommodate Magic Formula bonuses
};

export const analyzeChartForPriorities = (chartData: any, priorities: string[], showDebug = false, timingMode: 'houses' | 'aspects' | 'electional' = 'houses', testDate?: Date): number => {
  // Use electional analysis when electional mode is selected
  if (timingMode === 'electional') {
    if (!testDate) {
      console.warn('No date provided for electional analysis, falling back to current date');
      testDate = new Date();
    }
    return analyzeChartForElectionalTiming(chartData, priorities, testDate, showDebug);
  }
  
  // Use aspect-only analysis if requested
  if (timingMode === 'aspects') {
    return analyzeChartForAspects(chartData, priorities, showDebug);
  }
  
  // Use the extracted house-based analysis
  return analyzeChartForHouses(chartData, priorities, showDebug);
};