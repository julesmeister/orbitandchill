import { ChartAspect, PlanetPosition } from '../../utils/natalChart';
import { priorityCriteria, timingPriorities } from './priorities';
import { getHouseSuffix, isRetrograde } from './astrologicalUtils';
import { getPlanetaryDignity } from '../../utils/astrologicalInterpretations';
import { detectMagicFormula } from './financialAstrologyCalculations';
import { getMoonElectionalContext } from '../../utils/moonElectionalFilter';

// Helper function to format planet name with retrograde and dignity information
const formatPlanetName = (planet: PlanetPosition): string => {
  let name = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
  
  // Add retrograde indicator
  if (isRetrograde(planet)) {
    name += ' Rx';
  }
  
  // Add dignity status for important dignities
  const dignity = getPlanetaryDignity(planet.name, planet.sign);
  if (dignity === 'exaltation') {
    name += ' exalted';
  } else if (dignity === 'rulership') {
    name += ' dignified';
  } else if (dignity === 'fall') {
    name += ' debilitated';
  } else if (dignity === 'detriment') {
    name += ' weakened';
  }
  
  return name;
};

// Helper function to check if a house is angular (1st, 4th, 7th, 10th)
const isAngularHouse = (house: number): boolean => {
  return [1, 4, 7, 10].includes(house);
};

// Generate titles focused on planetary aspects rather than house placements
export const generateAspectBasedTitle = (chartData: any, priorities: string[], description: string, eventIndex: number = 0): string => {
  // Aspect-based title generation
  
  // Find the most significant aspects for the selected priorities
  const significantAspects: Array<{aspect: ChartAspect, weight: number, priority: string}> = [];
  
  priorities.forEach(priority => {
    const criteria = priorityCriteria[priority];
    if (!criteria) return;
    
    chartData.aspects.forEach((aspect: ChartAspect) => {
      // Check if this aspect involves relevant planets
      const planet1Weight = criteria.favorablePlanets.includes(aspect.planet1) ? 
        (criteria.weight[aspect.planet1] || 1) : 0;
      const planet2Weight = criteria.favorablePlanets.includes(aspect.planet2) ? 
        (criteria.weight[aspect.planet2] || 1) : 0;
      
      if (planet1Weight > 0 && planet2Weight > 0) {
        // Check if it's a favorable aspect
        if (criteria.favorableAspects.includes(aspect.aspect)) {
          const totalWeight = planet1Weight + planet2Weight;
          significantAspects.push({
            aspect,
            weight: totalWeight,
            priority
          });
        }
        // Also check for challenging aspects to warn about
        else if (criteria.challengingAspects.includes(aspect.aspect)) {
          const totalWeight = (planet1Weight + planet2Weight) * -0.5; // Negative weight for challenging
          significantAspects.push({
            aspect,
            weight: totalWeight,
            priority
          });
        }
      }
    });
  });
  
  // Found significant aspects for analysis
  
  if (significantAspects.length > 0) {
    // Sort by weight (most significant first)
    significantAspects.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
    
    // Prioritize challenging aspects (show warnings first)
    const challengingAspects = significantAspects.filter(a => a.weight < 0);
    const favorableAspects = significantAspects.filter(a => a.weight > 0);
    
    let selectedAspect: {aspect: ChartAspect, weight: number, priority: string} | undefined;
    if (challengingAspects.length > 0) {
      // Show the most challenging aspect as a warning
      selectedAspect = challengingAspects[0];
      const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === selectedAspect!.aspect.planet1);
      const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === selectedAspect!.aspect.planet2);
      const planet1 = planet1Data ? formatPlanetName(planet1Data) : selectedAspect!.aspect.planet1.charAt(0).toUpperCase() + selectedAspect!.aspect.planet1.slice(1);
      const planet2 = planet2Data ? formatPlanetName(planet2Data) : selectedAspect!.aspect.planet2.charAt(0).toUpperCase() + selectedAspect!.aspect.planet2.slice(1);
      const aspectName = selectedAspect!.aspect.aspect.charAt(0).toUpperCase() + selectedAspect!.aspect.aspect.slice(1);
      
      // Using challenging aspect for warning
      let challengingTitle = `⚠️ ${planet1} ${aspectName} ${planet2}`;
      
      // Add Moon context to challenging aspects too
      const moonPlanet = chartData.planets.find((p: PlanetPosition) => p.name === 'moon');
      if (moonPlanet?.sign) {
        const moonContext = getMoonElectionalContext(moonPlanet.sign);
        if (moonContext) {
          challengingTitle += ` · ${moonContext}`;
        }
      }
      
      return challengingTitle;
    } else if (favorableAspects.length > 0) {
      // Use favorable aspect with some variety
      const topAspects = favorableAspects.slice(0, Math.min(3, favorableAspects.length));
      const selectionIndex = eventIndex % topAspects.length;
      selectedAspect = topAspects[selectionIndex];
      
      const planet1Data = chartData.planets.find((p: PlanetPosition) => p.name === selectedAspect!.aspect.planet1);
      const planet2Data = chartData.planets.find((p: PlanetPosition) => p.name === selectedAspect!.aspect.planet2);
      const planet1 = planet1Data ? formatPlanetName(planet1Data) : selectedAspect!.aspect.planet1.charAt(0).toUpperCase() + selectedAspect!.aspect.planet1.slice(1);
      const planet2 = planet2Data ? formatPlanetName(planet2Data) : selectedAspect!.aspect.planet2.charAt(0).toUpperCase() + selectedAspect!.aspect.planet2.slice(1);
      const aspectName = selectedAspect!.aspect.aspect.charAt(0).toUpperCase() + selectedAspect!.aspect.aspect.slice(1);
      
      // Add Moon context to favorable aspects
      let favorableTitle = `${planet1} ${aspectName} ${planet2}`;
      
      const moonPlanet = chartData.planets.find((p: PlanetPosition) => p.name === 'moon');
      if (moonPlanet?.sign) {
        const moonContext = getMoonElectionalContext(moonPlanet.sign);
        if (moonContext) {
          favorableTitle += ` · ${moonContext}`;
        }
      }
      
      // Using favorable aspect
      return favorableTitle;
    }
  }
  
  // Fallback: try to extract from description
  if (description.includes('trine') || description.includes('sextile') || description.includes('conjunction')) {
    const aspectMatch = description.match(/(\w+)\s+(trine|sextile|conjunction|square|opposition)\s+(\w+)/i);
    if (aspectMatch) {
      const planet1 = aspectMatch[1].charAt(0).toUpperCase() + aspectMatch[1].slice(1);
      const aspect = aspectMatch[2].charAt(0).toUpperCase() + aspectMatch[2].slice(1);
      const planet2 = aspectMatch[3].charAt(0).toUpperCase() + aspectMatch[3].slice(1);
      // Extracted aspect from description
      return `${planet1} ${aspect} ${planet2}`;
    }
  }
  
  // Final fallback for aspect mode
  const priorityLabels = priorities.map(p => timingPriorities.find(tp => tp.id === p)?.label).filter(Boolean);
  const fallbackTitle = priorityLabels.length > 0 ? `${priorityLabels[0]} Aspects` : 'Optimal Aspects';
  // Using fallback title for aspect mode
  return fallbackTitle;
};

export const generateAstrologicalTitle = (chartData: any, priorities: string[], description: string, eventIndex: number = 0, timingMode: 'houses' | 'aspects' | 'electional' | 'combined' = 'houses'): string => {
  // Magic Formula detection removed - Jupiter-Pluto aspects not astronomically active in 2025
  // Next Jupiter-Pluto conjunction ~2033-2035
  
  // For aspects mode, prioritize aspect-based titles
  if (timingMode === 'aspects') {
    return generateAspectBasedTitle(chartData, priorities, description, eventIndex);
  }
  // Only use combo titles for very significant combo matches (bonus >= 1.0)
  const significantComboMatches: Array<{name: string, planets: string[], house: number, priority: string, bonus: number, type?: string}> = [];
  
  priorities.forEach(priority => {
    const criteria = priorityCriteria[priority];
    if (!criteria || !criteria.comboCriteria) return;
    
    criteria.comboCriteria.forEach(combo => {
      // Check if all required planets are in the specified house
      const planetsInHouse = combo.planets.filter(planetName => {
        const planet = chartData.planets.find((p: PlanetPosition) => p.name === planetName);
        return planet && planet.house === combo.house;
      });
      
      // Only consider this a significant combo if it has substantial bonus and all planets are present
      if (planetsInHouse.length === combo.planets.length && Math.abs(combo.bonus) >= 1.0) {
        significantComboMatches.push({
          name: combo.name,
          planets: combo.planets,
          house: combo.house,
          priority: priority,
          bonus: combo.bonus,
          type: combo.type || 'favorable'
        });
      }
    });
  });
  
  // Only use combo titles for very significant matches - otherwise prefer regular placements
  if (significantComboMatches.length > 0) {
    // First check for challenging combos (to warn users)
    const challengingCombos = significantComboMatches.filter(c => c.type === 'challenging');
    if (challengingCombos.length > 0) {
      // Sort by most negative (most challenging)
      challengingCombos.sort((a, b) => a.bonus - b.bonus);
      const topChallengingCombo = challengingCombos[0];
      // Using significant challenging combo as warning
      return `⚠️ ${topChallengingCombo.name}`;
    }
    
    // Otherwise use significant favorable combos
    const favorableCombos = significantComboMatches.filter(c => c.type !== 'challenging');
    if (favorableCombos.length > 0) {
      favorableCombos.sort((a, b) => b.bonus - a.bonus);
      const topCombo = favorableCombos[0];
      // Using significant favorable combo
      return topCombo.name;
    }
  }
  
  // Find ALL significant planetary placements based on priorities
  const significantPlacements: Array<{planet: string, house: number, weight: number, priority: string}> = [];
  
  priorities.forEach(priority => {
    const criteria = priorityCriteria[priority];
    if (!criteria) return;
    
    // Find planets in favorable houses for this priority
    chartData.planets.forEach((planet: PlanetPosition) => {
      if (criteria.favorablePlanets.includes(planet.name) && criteria.favorableHouses.includes(planet.house)) {
        const planetWeight = criteria.weight[planet.name] || 1;
        const houseWeight = criteria.weight[`house${planet.house}`] || 1;
        significantPlacements.push({
          planet: planet.name,
          house: planet.house,
          weight: planetWeight * houseWeight,
          priority: priority
        });
      }
    });
  });
  
  // Analysis of placements and combo matches completed
  
  // Sort by weight but add variety by not always picking the strongest
  significantPlacements.sort((a, b) => b.weight - a.weight);
  
  if (significantPlacements.length > 0) {
    let selectedPlacement;
    
    if (significantPlacements.length >= 2) {
      // For money priority, ensure we show variety between 2nd and 8th house
      if (priorities.includes('money')) {
        const moneyPlacements = significantPlacements.filter(p => p.priority === 'money');
        const house2Placements = moneyPlacements.filter(p => p.house === 2);
        const house8Placements = moneyPlacements.filter(p => p.house === 8);
        
        // For money placements, simply alternate between 2nd and 8th house
        // based on the event index to ensure variety
        if (house2Placements.length > 0 && house8Placements.length > 0) {
          // Use index-based alternation for predictable variety
          const useHouse2 = eventIndex % 2 === 0;
          selectedPlacement = useHouse2 ? house2Placements[0] : house8Placements[0];
        } else if (house2Placements.length > 0) {
          selectedPlacement = house2Placements[0];
        } else if (house8Placements.length > 0) {
          selectedPlacement = house8Placements[0];
        } else if (moneyPlacements.length > 0) {
          selectedPlacement = moneyPlacements[0];
        } else {
          // No money placements found, fall back to any significant placement
          selectedPlacement = significantPlacements[0];
        }
      } else {
        // For other priorities, use improved variety algorithm
        const uniqueHouses = Array.from(new Set(significantPlacements.map(p => p.house)));
        const uniquePlanets = Array.from(new Set(significantPlacements.map(p => p.planet)));
        
        // Create variation based on multiple planetary factors
        const varietySeed = chartData.planets.reduce((acc: number, p: PlanetPosition, i: number) => 
          acc + (p.longitude * (i + 1)) + (p.house * 10), 0);
        
        // Select from top placements with variety preference
        const topPlacements = significantPlacements.slice(0, Math.min(5, significantPlacements.length));
        if (topPlacements.length > 0) {
          const selectionIndex = Math.floor(varietySeed) % topPlacements.length;
          selectedPlacement = topPlacements[selectionIndex];
          // Variety selection with multiple houses and planets
        } else {
          // Fallback to first significant placement
          selectedPlacement = significantPlacements[0];
          // Using fallback placement
        }
      }
    } else {
      selectedPlacement = significantPlacements[0];
    }
    
    // Safety check to ensure selectedPlacement is valid
    if (selectedPlacement && selectedPlacement.planet && selectedPlacement.house) {
      const planetData = chartData.planets.find((p: PlanetPosition) => p.name === selectedPlacement.planet);
      let planetName = selectedPlacement.planet.charAt(0).toUpperCase() + selectedPlacement.planet.slice(1);
      
      // Add enhanced formatting if planet data is available
      if (planetData) {
        planetName = formatPlanetName(planetData);
      }
      
      const houseSuffix = getHouseSuffix(selectedPlacement.house);
      let title = `${planetName} ${selectedPlacement.house}${houseSuffix}`;
      
      // Add angular indicator for benefics in angular houses (for electional filter)
      if (isAngularHouse(selectedPlacement.house) && ['jupiter', 'venus'].includes(selectedPlacement.planet)) {
        title += ' angular';
      }
      
      // Add Moon electional context to title
      const moonPlanet = chartData.planets.find((p: PlanetPosition) => p.name === 'moon');
      if (moonPlanet?.sign) {
        const moonContext = getMoonElectionalContext(moonPlanet.sign);
        if (moonContext) {
          title += ` · ${moonContext}`;
        }
      }
      
      // Final title generated
      return title;
    } else {
      // Invalid placement warning
    }
  }
  
  // Fallback: try to extract from aspects description
  if (description.includes('trine') || description.includes('sextile') || description.includes('conjunction')) {
    const aspectMatch = description.match(/(\w+)\s+(trine|sextile|conjunction)\s+(\w+)/i);
    if (aspectMatch) {
      const planet1 = aspectMatch[1].charAt(0).toUpperCase() + aspectMatch[1].slice(1);
      const aspect = aspectMatch[2];
      const planet2 = aspectMatch[3].charAt(0).toUpperCase() + aspectMatch[3].slice(1);
      return `${planet1} ${aspect} ${planet2}`;
    }
  }
  
  // Final fallback
  const priorityLabels = priorities.map(p => timingPriorities.find(tp => tp.id === p)?.label).filter(Boolean);
  return priorityLabels.length > 0 ? `${priorityLabels[0]} Timing` : 'Optimal Timing';
};