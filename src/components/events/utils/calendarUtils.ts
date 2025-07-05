import { AstrologicalEvent } from '../../../store/eventsStore';
import { AdvancedFilterState } from '../EventsCalendarFilters';
import { getMoonPhase } from '../../../hooks/optimalTiming/astrologicalUtils';

export interface CalendarDay {
  date: Date;
  score: number;
  isCurrentMonth: boolean;
  events: AstrologicalEvent[];
  hasOptimalTiming: boolean;
  dailyAspects: any[]; // DailyAspect type would be imported
}

export const getEventStyling = (event: AstrologicalEvent) => {
  if (event.title.includes('⚠️')) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#ff91e9' // Synapsas purple for warnings
    };
  } else if (event.score >= 8) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#d1fae5' // Much lighter green for high scores
    };
  } else if (event.score >= 6) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#6bdbff' // Synapsas blue for good scores
    };
  } else {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#f2e356' // Synapsas yellow for lower scores
    };
  }
};

export const getAspectStyling = (aspect: any) => {
  switch (aspect.type) {
    case 'harmonious':
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#d1fae5' // Much lighter green for harmonious aspects
      };
    case 'challenging':
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#ff91e9' // Synapsas purple for challenging aspects
      };
    default:
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#6bdbff' // Synapsas blue for neutral aspects
      };
  }
};

export const applyFiltersToEvents = (
  events: AstrologicalEvent[],
  filters: {
    hideChallengingDates: boolean;
    showCombosOnly: boolean;
    showHousesOnly: boolean;
    showAspectsOnly: boolean;
    showElectionalOnly: boolean;
  },
  advancedFilters: AdvancedFilterState,
  dateString: string
): AstrologicalEvent[] => {
  let dayEvents = events.filter(event => 
    new Date(event.date).toDateString() === dateString
  );

  // Apply challenging dates filter
  if (filters.hideChallengingDates) {
    dayEvents = dayEvents.filter(event => {
      const hasWarning = event.title.includes('⚠️');
      const hasLowScore = event.score < 4;
      const isChallengingType = event.type === 'challenging';
      return !(hasWarning || hasLowScore || isChallengingType);
    });
  }

  // Apply combo filter
  if (filters.showCombosOnly) {
    dayEvents = dayEvents.filter(event => event.title.includes('&'));
  }

  // Apply timing method filters
  if (filters.showHousesOnly) {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      return event.timingMethod === 'houses' || 
             content.includes('house') ||
             content.match(/\d+(st|nd|rd|th)\s+house/) ||
             content.match(/(jupiter|venus|mars|saturn|sun|moon|mercury)\s+(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th)/);
    });
  } else if (filters.showAspectsOnly) {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      return event.timingMethod === 'aspects' ||
             content.includes('trine') ||
             content.includes('sextile') ||
             content.includes('conjunction') ||
             content.includes('square') ||
             content.includes('opposition') ||
             content.includes('aspect');
    });
  } else if (filters.showElectionalOnly) {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      return event.timingMethod === 'electional' ||
             content.includes('electional') ||
             content.includes('traditional') ||
             (event.score >= 7 && !content.includes('house'));
    });
  }

  // Apply advanced filters
  const { 
    mercuryFilter, 
    moonPhaseFilter, 
    dignityFilter, 
    maleficFilter, 
    scoreFilter, 
    electionalFilter,
    jupiterSectorFilter,
    magicFormulaFilter,
    voidMoonFilter,
    ingressFilter,
    economicCycleFilter
  } = advancedFilters;

  // Mercury status filter - use electional data if available, fallback to date-based
  if (mercuryFilter === 'direct') {
    const beforeFilterCount = dayEvents.length;
    dayEvents = dayEvents.filter(event => {
      // Debug disabled to reduce console noise
      // if (event.date.includes('2025-08')) {
      //   console.log(`🌍 Mercury Filter Debug for ${event.date}:`, {
      //     title: event.title,
      //     hasElectionalData: !!event.electionalData,
      //     mercuryStatus: event.electionalData?.mercuryStatus,
      //     hasChartData: !!event.chartData,
      //     chartPlanets: event.chartData?.planets?.length || 0
      //   });
      // }
      
      // First, use electional data if available (preferred method)
      if (event.electionalData?.mercuryStatus) {
        const isDirectFromElectional = event.electionalData.mercuryStatus === 'direct';
        if (event.date.includes('2025-08')) {
          console.log(`🌍 Using electional data: ${event.electionalData.mercuryStatus} -> ${isDirectFromElectional ? 'KEEP' : 'FILTER OUT'}`);
        }
        return isDirectFromElectional;
      }
      
      // Fallback 1: Check content-based indicators for backward compatibility
      const content = `${event.title} ${event.description}`.toLowerCase();
      const hasRetrogradeKeywords = content.includes('retrograde') || 
                                   content.includes('mercury retrograde') ||
                                   content.includes('mercury rx') ||
                                   content.includes(' rx') || // Space before rx to avoid partial matches
                                   content.includes('r)') ||   // Alternative retrograde symbol
                                   content.includes('℞') ||    // Retrograde symbol
                                   (content.includes('⚠️') && content.includes('mercury'));
      
      // If keywords indicate retrograde, filter it out
      if (hasRetrogradeKeywords) {
        if (event.date.includes('2025-08')) {
          console.log(`🌍 Using keyword detection: found retrograde keywords -> FILTER OUT`);
        }
        return false;
      }
      
      // Fallback 2: Use Mercury status from chart data if available
      if (event.chartData?.planets) {
        const mercury = event.chartData.planets.find((planet: any) => planet.name === 'mercury');
        if (mercury) {
          const isDirectFromChart = !mercury.retrograde;
          // Debug disabled
          // if (event.date.includes('2025-08')) {
          //   console.log(`🌍 Using chart data: Mercury retrograde=${mercury.retrograde} -> ${isDirectFromChart ? 'KEEP' : 'FILTER OUT'}`);
          // }
          return isDirectFromChart;
        }
      }
      
      // Final fallback: assume direct if we can't determine status
      // Debug disabled
      // if (event.date.includes('2025-08')) {
      //   console.log(`🌍 Using fallback: assume direct -> KEEP`);
      // }
      return true;
    });
    
    // Debug disabled
    // if (beforeFilterCount !== dayEvents.length) {
    //   console.log(`🌍 Mercury filter: ${beforeFilterCount} -> ${dayEvents.length} events for ${dayString}`);
    // }
  }

  // Moon phase filter (using calculated moon phase from event date)
  if (moonPhaseFilter === 'waxing') {
    dayEvents = dayEvents.filter(event => {
      const eventDate = new Date(event.date);
      const moonPhase = getMoonPhase(eventDate);
      return isWaxingPhase(moonPhase);
    });
  } else if (moonPhaseFilter === 'new') {
    dayEvents = dayEvents.filter(event => {
      const eventDate = new Date(event.date);
      const moonPhase = getMoonPhase(eventDate);
      return moonPhase === 'new';
    });
  } else if (moonPhaseFilter === 'full') {
    dayEvents = dayEvents.filter(event => {
      const eventDate = new Date(event.date);
      const moonPhase = getMoonPhase(eventDate);
      return moonPhase === 'full';
    });
  } else if (moonPhaseFilter === 'waning') {
    dayEvents = dayEvents.filter(event => {
      const eventDate = new Date(event.date);
      const moonPhase = getMoonPhase(eventDate);
      return isWaningPhase(moonPhase);
    });
  }

  // Planetary dignity filter
  if (dignityFilter === 'exalted') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Look for exaltation keywords added by enhanced title generation
      const hasExaltation = content.includes('exalt') ||
                           (content.includes('dignified') && !content.includes('weak'));
      return hasExaltation;
    });
  } else if (dignityFilter === 'no_debility') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Filter out debilitated planets (keywords added by enhanced title generation)
      const hasDebility = content.includes('debil') ||
                         content.includes(' fall') ||
                         content.includes('weakened') ||
                         content.includes('detriment') ||
                         (content.includes('⚠️') && (content.includes('mars') || content.includes('saturn')));
      return !hasDebility;
    });
  }

  // Malefic aspects filter
  if (maleficFilter === 'no_mars_saturn') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Look for Mars-Saturn combinations or individual challenging Mars/Saturn aspects
      const hasMalefics = (content.includes('mars') && content.includes('saturn')) ||
                         content.includes('mars-saturn') ||
                         content.includes('mars & saturn') ||
                         (content.includes('⚠️') && (
                           (content.includes('mars') && (content.includes('square') || content.includes('opposition'))) ||
                           (content.includes('saturn') && (content.includes('square') || content.includes('opposition')))
                         ));
      return !hasMalefics;
    });
  } else if (maleficFilter === 'soft_aspects') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Show events that either have soft aspects OR have no challenging indicators
      const hasSoftAspects = content.includes('trine') ||
                            content.includes('sextile') ||
                            (content.includes('conjunction') && !content.includes('⚠️'));
      
      const hasChallengingAspects = content.includes('square') ||
                                   content.includes('opposition') ||
                                   content.includes('⚠️');
      
      // Include if: has soft aspects OR (no aspects mentioned AND no challenging indicators)
      return hasSoftAspects || !hasChallengingAspects;
    });
  }

  // Score range filter
  if (scoreFilter === '8_plus') {
    dayEvents = dayEvents.filter(event => event.score >= 8);
  } else if (scoreFilter === '6_plus') {
    dayEvents = dayEvents.filter(event => event.score >= 6);
  }

  // Traditional electional filter
  if (electionalFilter === 'ready') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // More flexible electional ready criteria
      const isElectionalReady = (event.score >= 6) && // Lowered from 7 to work better with score filter
                               (event.timingMethod === 'electional' ||
                                content.includes('electional') ||
                                content.includes('traditional') ||
                                (!content.includes('⚠️') && event.score >= 7)); // Keep high score threshold for non-electional
      return isElectionalReady;
    });
  } else if (electionalFilter === 'benefics_angular') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Look for benefics (Jupiter/Venus) in angular houses or with 'angular' keyword
      const hasBeneficsAngular = ((content.includes('venus') || content.includes('jupiter')) &&
                                  (content.includes('1st') || content.includes('4th') || 
                                   content.includes('7th') || content.includes('10th'))) ||
                                 content.includes('angular'); // Added by enhanced title generation
      return hasBeneficsAngular;
    });
  }

  // New financial astrology filters
  
  // Jupiter Sector Filter
  if (jupiterSectorFilter === 'current_favored') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Current Jupiter in Gemini favors transportation, communication, social media, internet
      const isJupiterFavored = content.includes('communication') ||
                              content.includes('transportation') ||
                              content.includes('social media') ||
                              content.includes('internet') ||
                              content.includes('gemini') ||
                              content.includes('air sign');
      return isJupiterFavored;
    });
  } else if (jupiterSectorFilter === 'avoid_saturn') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Saturn in Pisces opposes Virgo - avoid medical/pharma/health
      const isSaturnSector = content.includes('medical') ||
                            content.includes('pharma') ||
                            content.includes('health') ||
                            content.includes('virgo') ||
                            content.includes('pisces');
      return !isSaturnSector;
    });
  }

  // Magic Formula Filter - Disabled (Jupiter-Pluto aspects not active in 2025)
  if (magicFormulaFilter === 'sun_jupiter_pluto' || magicFormulaFilter === 'jupiter_pluto') {
    // Return empty array since Magic Formula is astronomically impossible in 2025
    dayEvents = [];
  }

  // Void Moon Filter
  if (voidMoonFilter === 'avoid_void') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Look for void of course moon indicators
      const isVoidMoon = content.includes('void') ||
                        content.includes('voc') ||
                        content.includes('no aspects');
      return !isVoidMoon;
    });
  } else if (voidMoonFilter === 'allow_declination') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Show only void moon periods with declination aspects (less problematic)
      const isVoidMoon = content.includes('void') ||
                        content.includes('voc');
      const hasDeclination = content.includes('declination') ||
                            content.includes('parallel');
      const isNotVoidMoon = !isVoidMoon;
      return isNotVoidMoon || (isVoidMoon && hasDeclination);
    });
  }

  // Ingress Filter  
  if (ingressFilter === 'three_week_window') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Look for planetary ingress timing within 3-week window
      const hasIngress = content.includes('ingress') ||
                        content.includes('enters') ||
                        content.includes('changes sign') ||
                        content.includes('3-week') ||
                        content.includes('window');
      return hasIngress;
    });
  } else if (ingressFilter === 'exact_ingress') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Exact ingress dates only
      const hasExactIngress = content.includes('exact ingress') ||
                             content.includes('enters at') ||
                             content.includes('exact');
      return hasExactIngress;
    });
  }

  // Economic Cycle Filter
  if (economicCycleFilter === 'expansion_phase') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Economic expansion phase indicators
      const isExpansion = content.includes('expansion') ||
                         content.includes('growth') ||
                         content.includes('bull market') ||
                         (content.includes('jupiter') && content.includes('trine')) ||
                         event.score >= 7; // High scores generally indicate expansion
      return isExpansion;
    });
  } else if (economicCycleFilter === 'consolidation_phase') {
    dayEvents = dayEvents.filter(event => {
      const content = `${event.title} ${event.description}`.toLowerCase();
      // Economic consolidation phase indicators
      const isConsolidation = content.includes('consolidation') ||
                             content.includes('contraction') ||
                             content.includes('bear market') ||
                             (content.includes('saturn') && content.includes('square')) ||
                             event.score <= 5; // Lower scores generally indicate consolidation
      return isConsolidation;
    });
  }

  return dayEvents;
};

export const logFilteringResults = (
  originalCount: number,
  filteredCount: number,
  dateString: string,
  filters: any,
  advancedFilters: AdvancedFilterState
) => {
  const hasActiveFilters = filters.hideChallengingDates || filters.showCombosOnly || 
                          filters.showHousesOnly || filters.showAspectsOnly || filters.showElectionalOnly ||
                          advancedFilters.mercuryFilter !== 'all' || advancedFilters.moonPhaseFilter !== 'all' || 
                          advancedFilters.dignityFilter !== 'all' || advancedFilters.maleficFilter !== 'all' || 
                          advancedFilters.scoreFilter !== 'all' || advancedFilters.electionalFilter !== 'all' ||
                          advancedFilters.jupiterSectorFilter !== 'all' || advancedFilters.magicFormulaFilter !== 'all' ||
                          advancedFilters.voidMoonFilter !== 'all' || advancedFilters.ingressFilter !== 'all' ||
                          advancedFilters.economicCycleFilter !== 'all';

  const eventsWereFiltered = filteredCount < originalCount;

  if ((hasActiveFilters || eventsWereFiltered) && originalCount > 0) {
    const activeFiltersList = [];
    if (filters.hideChallengingDates) activeFiltersList.push('Hide Challenging');
    if (filters.showCombosOnly) activeFiltersList.push('Combos Only');
    if (filters.showHousesOnly) activeFiltersList.push('Houses Only');
    if (filters.showAspectsOnly) activeFiltersList.push('Aspects Only');
    if (filters.showElectionalOnly) activeFiltersList.push('Electional Only');
    if (advancedFilters.mercuryFilter !== 'all') activeFiltersList.push(`Mercury: ${advancedFilters.mercuryFilter}`);
    if (advancedFilters.moonPhaseFilter !== 'all') activeFiltersList.push(`Moon: ${advancedFilters.moonPhaseFilter}`);
    if (advancedFilters.dignityFilter !== 'all') activeFiltersList.push(`Dignity: ${advancedFilters.dignityFilter}`);
    if (advancedFilters.maleficFilter !== 'all') activeFiltersList.push(`Malefics: ${advancedFilters.maleficFilter}`);
    if (advancedFilters.scoreFilter !== 'all') activeFiltersList.push(`Score: ${advancedFilters.scoreFilter}`);
    if (advancedFilters.electionalFilter !== 'all') activeFiltersList.push(`Traditional: ${advancedFilters.electionalFilter}`);
    if (advancedFilters.jupiterSectorFilter !== 'all') activeFiltersList.push(`Jupiter Sector: ${advancedFilters.jupiterSectorFilter}`);
    if (advancedFilters.magicFormulaFilter !== 'all') activeFiltersList.push(`Magic Formula: ${advancedFilters.magicFormulaFilter}`);
    if (advancedFilters.voidMoonFilter !== 'all') activeFiltersList.push(`Void Moon: ${advancedFilters.voidMoonFilter}`);
    if (advancedFilters.ingressFilter !== 'all') activeFiltersList.push(`Ingress: ${advancedFilters.ingressFilter}`);
    if (advancedFilters.economicCycleFilter !== 'all') activeFiltersList.push(`Economy: ${advancedFilters.economicCycleFilter}`);

    // Debug disabled to reduce console noise
    // console.log(`🔍 ${dateString} - Events: ${originalCount} → ${filteredCount} (${originalCount - filteredCount} filtered)`, {
    //   activeFilters: activeFiltersList.length > 0 ? activeFiltersList : ['Unknown filter active'],
    //   eventsWereFiltered,
    //   hasActiveFilters
    // });
  }
};

export interface FilterCounts {
  mercuryDirect: number;
  moonWaxing: number;
  moonNew: number;
  moonFull: number;
  moonWaning: number;
  dignityExalted: number;
  dignityNoDebility: number;
  maleficAvoid: number;
  maleficSoft: number;
  score8Plus: number;
  score6Plus: number;
  electionalReady: number;
  electionalAngular: number;
  jupiterFavored: number;
  jupiterAvoidSaturn: number;
  magicFormulaFull: number;
  magicFormulaPartial: number;
  voidMoonAvoid: number;
  voidMoonDeclination: number;
  ingressThreeWeek: number;
  ingressExact: number;
  economicExpansion: number;
  economicConsolidation: number;
}

// Helper function to check if a moon phase is considered "waxing"
const isWaxingPhase = (phase: string): boolean => {
  return ['waxing_crescent', 'first_quarter', 'waxing_gibbous'].includes(phase);
};

// Helper function to check if a moon phase is considered "waning"
const isWaningPhase = (phase: string): boolean => {
  return ['waning_gibbous', 'last_quarter', 'waning_crescent'].includes(phase);
};

export const calculateFilterCounts = (events: AstrologicalEvent[]): FilterCounts => {
  const mercuryDirect = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    const hasRetrograde = content.includes('retrograde') || 
                         content.includes('mercury retrograde') ||
                         content.includes('rx') ||
                         content.includes('⚠️') && content.includes('mercury');
    return !hasRetrograde;
  }).length;

  const moonWaxing = events.filter(event => {
    const eventDate = new Date(event.date);
    const moonPhase = getMoonPhase(eventDate);
    return isWaxingPhase(moonPhase);
  }).length;

  const moonNew = events.filter(event => {
    const eventDate = new Date(event.date);
    const moonPhase = getMoonPhase(eventDate);
    return moonPhase === 'new';
  }).length;

  const moonFull = events.filter(event => {
    const eventDate = new Date(event.date);
    const moonPhase = getMoonPhase(eventDate);
    return moonPhase === 'full';
  }).length;

  const moonWaning = events.filter(event => {
    const eventDate = new Date(event.date);
    const moonPhase = getMoonPhase(eventDate);
    return isWaningPhase(moonPhase);
  }).length;

  const dignityExalted = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    const hasExaltation = content.includes('exalt') ||
                         content.includes('dignified') ||
                         content.includes('strong') && (content.includes('jupiter') || content.includes('venus') || content.includes('sun'));
    return hasExaltation;
  }).length;

  const dignityNoDebility = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    const hasDebility = content.includes('detriment') || 
                       content.includes('fall') ||
                       content.includes('debilitated') ||
                       (content.includes('weak') && (content.includes('mars') || content.includes('saturn'))) ||
                       content.includes('⚠️') && (content.includes('weak') || content.includes('struggle'));
    return !hasDebility;
  }).length;

  const maleficAvoid = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // More comprehensive Mars-Saturn detection
    const hasMalefics = (content.includes('mars') && content.includes('saturn')) ||
                       content.includes('mars-saturn') ||
                       content.includes('mars & saturn') ||
                       (content.includes('⚠️') && (
                         (content.includes('mars') && (content.includes('square') || content.includes('opposition'))) ||
                         (content.includes('saturn') && (content.includes('square') || content.includes('opposition')))
                       ));
    return !hasMalefics;
  }).length;

  const maleficSoft = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Show only events with soft aspects or no aspects mentioned
    const hasSoftAspects = content.includes('trine') ||
                          content.includes('sextile') ||
                          (content.includes('conjunction') && !content.includes('⚠️'));
    
    const hasHardAspects = content.includes('square') || 
                          content.includes('opposition') ||
                          content.includes('⚠️');
    
    // Include if has soft aspects OR (no aspects mentioned AND no challenging indicators)
    return hasSoftAspects || (!hasHardAspects && !content.includes('mars') && !content.includes('saturn'));
  }).length;

  const score8Plus = events.filter(event => event.score >= 8).length;
  const score6Plus = events.filter(event => event.score >= 6).length;

  const electionalReady = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // More relaxed electional ready criteria
    const isElectionalReady = event.score >= 6 && // Lowered threshold
                             (event.timingMethod === 'electional' ||
                              content.includes('electional') ||
                              content.includes('traditional') ||
                              (!content.includes('⚠️') && event.score >= 7)); // Good score without warnings
    return isElectionalReady;
  }).length;

  const electionalAngular = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Look for benefics in angular houses or explicit angular keyword
    const hasBeneficsAngular = ((content.includes('jupiter') || content.includes('venus')) &&
                               (content.includes('1st') || content.includes('4th') || 
                                content.includes('7th') || content.includes('10th'))) ||
                               content.includes('angular'); // Added by enhanced title generation
    return hasBeneficsAngular;
  }).length;

  // New financial filter counts
  const jupiterFavored = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Current Jupiter in Gemini favors transportation, communication, social media, internet
    const isJupiterFavored = content.includes('communication') ||
                            content.includes('transportation') ||
                            content.includes('social media') ||
                            content.includes('internet') ||
                            content.includes('gemini') ||
                            content.includes('air sign');
    return isJupiterFavored;
  }).length;

  const jupiterAvoidSaturn = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Saturn in Pisces opposes Virgo - avoid medical/pharma/health
    const isSaturnSector = content.includes('medical') ||
                          content.includes('pharma') ||
                          content.includes('health') ||
                          content.includes('virgo') ||
                          content.includes('pisces');
    return !isSaturnSector;
  }).length;

  // Magic Formula filters disabled - Jupiter-Pluto aspects not active in 2025
  // Will return 0 until astronomical conditions return ~2033-2035
  const magicFormulaFull = 0;
  const magicFormulaPartial = 0;

  const voidMoonAvoid = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Look for void of course moon indicators
    const isVoidMoon = content.includes('void') ||
                      content.includes('voc') ||
                      content.includes('no aspects');
    return !isVoidMoon;
  }).length;

  const voidMoonDeclination = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Void moon but with declination aspects (less problematic)
    const isVoidMoon = content.includes('void') ||
                      content.includes('voc');
    const hasDeclination = content.includes('declination') ||
                          content.includes('parallel');
    return isVoidMoon && hasDeclination;
  }).length;

  const ingressThreeWeek = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Look for planetary ingress timing within 3-week window
    const hasIngress = content.includes('ingress') ||
                      content.includes('enters') ||
                      content.includes('changes sign');
    return hasIngress;
  }).length;

  const ingressExact = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Exact ingress dates only
    const hasExactIngress = content.includes('exact ingress') ||
                           content.includes('enters at');
    return hasExactIngress;
  }).length;

  const economicExpansion = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Economic expansion phase indicators
    const isExpansion = content.includes('expansion') ||
                       content.includes('growth') ||
                       content.includes('bull market') ||
                       (content.includes('jupiter') && content.includes('trine'));
    return isExpansion;
  }).length;

  const economicConsolidation = events.filter(event => {
    const content = `${event.title} ${event.description}`.toLowerCase();
    // Economic consolidation phase indicators
    const isConsolidation = content.includes('consolidation') ||
                           content.includes('contraction') ||
                           content.includes('bear market') ||
                           (content.includes('saturn') && content.includes('square'));
    return isConsolidation;
  }).length;

  return {
    mercuryDirect,
    moonWaxing,
    moonNew,
    moonFull,
    moonWaning,
    dignityExalted,
    dignityNoDebility,
    maleficAvoid,
    maleficSoft,
    score8Plus,
    score6Plus,
    electionalReady,
    electionalAngular,
    jupiterFavored,
    jupiterAvoidSaturn,
    magicFormulaFull,
    magicFormulaPartial,
    voidMoonAvoid,
    voidMoonDeclination,
    ingressThreeWeek,
    ingressExact,
    economicExpansion,
    economicConsolidation
  };
};