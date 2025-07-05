/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { AdvancedFilterState, FilterState, FilterSetters } from '../types/filterTypes';

interface UseFilterStateProps {
  filterState: FilterState;
  filterSetters: FilterSetters;
  onFiltersChange: (filters: AdvancedFilterState) => void;
  // Toast callback functions
  onFilterChange?: (filterName: string, filterValue: string) => void;
  onQuickFilterChange?: (filterName: string, isActive: boolean) => void;
  onReset?: () => void;
}

export function useFilterState({ 
  filterState, 
  filterSetters, 
  onFiltersChange,
  onFilterChange,
  onQuickFilterChange,
  onReset
}: UseFilterStateProps) {
  // Advanced filter state - Set more permissive defaults to show results by default
  const [mercuryFilter, setMercuryFilter] = useState<'direct' | 'all'>('direct'); // "Mercury Must Be Direct: This is the highest priority"
  const [moonPhaseFilter, setMoonPhaseFilter] = useState<'waxing' | 'new' | 'full' | 'waning' | 'all'>('all'); // Show all moon phases by default
  const [moonSignFilter, setMoonSignFilter] = useState<'haircut_growth' | 'haircut_maintenance' | 'travel_flexible' | 'travel_stable' | 'creativity' | 'luck_success' | 'avoid_void' | 'all'>('all'); // Show all moon signs by default
  const [dignityFilter, setDignityFilter] = useState<'exalted' | 'no_debility' | 'all'>('all'); // Show all dignities by default
  const [maleficFilter, setMaleficFilter] = useState<'no_mars_saturn' | 'soft_aspects' | 'all'>('all'); // Show all aspects by default
  const [scoreFilter, setScoreFilter] = useState<'8_plus' | '6_plus' | 'all'>('all'); // Show all scores by default
  const [electionalFilter, setElectionalFilter] = useState<'ready' | 'benefics_angular' | 'all'>('all'); // Show all electional events by default
  
  // New financial astrology filters
  const [jupiterSectorFilter, setJupiterSectorFilter] = useState<'current_favored' | 'avoid_saturn' | 'all'>('all'); // Show all sectors by default
  const [magicFormulaFilter, setMagicFormulaFilter] = useState<'sun_jupiter_pluto' | 'jupiter_pluto' | 'all'>('all'); // Show all events by default
  const [voidMoonFilter, setVoidMoonFilter] = useState<'avoid_void' | 'allow_declination' | 'all'>('all'); // Show all periods by default
  const [ingressFilter, setIngressFilter] = useState<'three_week_window' | 'exact_ingress' | 'all'>('all'); // Show all timing by default
  const [economicCycleFilter, setEconomicCycleFilter] = useState<'expansion_phase' | 'consolidation_phase' | 'all'>('all'); // Show all cycles by default

  // Notify parent component when advanced filters change
  useEffect(() => {
    onFiltersChange({
      mercuryFilter,
      moonPhaseFilter,
      moonSignFilter,
      dignityFilter,
      maleficFilter,
      scoreFilter,
      electionalFilter,
      jupiterSectorFilter,
      magicFormulaFilter,
      voidMoonFilter,
      ingressFilter,
      economicCycleFilter
    });
  }, [mercuryFilter, moonPhaseFilter, moonSignFilter, dignityFilter, maleficFilter, scoreFilter, electionalFilter, jupiterSectorFilter, magicFormulaFilter, voidMoonFilter, ingressFilter, economicCycleFilter, onFiltersChange]);

  // Get current filter state for utilities
  const getCurrentFilters = useCallback(() => ({
    ...filterState,
    mercuryFilter,
    moonPhaseFilter,
    moonSignFilter,
    dignityFilter,
    maleficFilter,
    scoreFilter,
    electionalFilter,
    jupiterSectorFilter,
    magicFormulaFilter,
    voidMoonFilter,
    ingressFilter,
    economicCycleFilter
  }), [filterState, mercuryFilter, moonPhaseFilter, moonSignFilter, dignityFilter, maleficFilter, scoreFilter, electionalFilter, jupiterSectorFilter, magicFormulaFilter, voidMoonFilter, ingressFilter, economicCycleFilter]);

  const getActiveFilters = useCallback(() => {
    const filters = getCurrentFilters();
    const activeList = [];
    
    if (filters.hideChallengingDates) activeList.push('Hide Challenging');
    if (filters.showCombosOnly) activeList.push('Combos Only');
    if (filters.showHousesOnly) activeList.push('Houses Only');
    if (filters.showAspectsOnly) activeList.push('Aspects Only');
    if (filters.showElectionalOnly) activeList.push('Electional Only');
    if (filters.mercuryFilter !== 'all') activeList.push(`Mercury: ${filters.mercuryFilter}`);
    if (filters.moonPhaseFilter !== 'all') activeList.push(`Moon Phase: ${filters.moonPhaseFilter}`);
    if (filters.moonSignFilter !== 'all') activeList.push(`Moon Sign: ${filters.moonSignFilter}`);
    if (filters.dignityFilter !== 'all') activeList.push(`Dignity: ${filters.dignityFilter}`);
    if (filters.maleficFilter !== 'all') activeList.push(`Malefics: ${filters.maleficFilter}`);
    if (filters.scoreFilter !== 'all') activeList.push(`Score: ${filters.scoreFilter}`);
    if (filters.electionalFilter !== 'all') activeList.push(`Traditional: ${filters.electionalFilter}`);
    if (filters.jupiterSectorFilter !== 'all') activeList.push(`Jupiter Sector: ${filters.jupiterSectorFilter}`);
    if (filters.magicFormulaFilter !== 'all') activeList.push(`Magic Formula: ${filters.magicFormulaFilter}`);
    if (filters.voidMoonFilter !== 'all') activeList.push(`Void Moon: ${filters.voidMoonFilter}`);
    if (filters.ingressFilter !== 'all') activeList.push(`Ingress: ${filters.ingressFilter}`);
    if (filters.economicCycleFilter !== 'all') activeList.push(`Economy: ${filters.economicCycleFilter}`);
    
    return activeList;
  }, [getCurrentFilters]);

  // Debug disabled to reduce console noise
  // useEffect(() => {
  //   const activeFilters = getActiveFilters();
  //   console.log('🎛️ EventsCalendarFilters state changed:', {
  //     activeFilters: activeFilters.length > 0 ? activeFilters : ['None'],
  //     allStates: getCurrentFilters()
  //   });
  // }, [filterState.hideChallengingDates, filterState.showCombosOnly, filterState.showAspects, filterState.showHousesOnly, filterState.showAspectsOnly, filterState.showElectionalOnly, mercuryFilter, moonPhaseFilter, dignityFilter, maleficFilter, scoreFilter, electionalFilter, getActiveFilters, getCurrentFilters]);

  // Reset all filters function - Reset to optimal defaults based on Electional.md
  const resetAllFilters = useCallback(() => {
    filterSetters.setHideChallengingDates(false);
    filterSetters.setShowCombosOnly(false);
    filterSetters.setShowHousesOnly(false);
    filterSetters.setShowAspectsOnly(false);
    filterSetters.setShowElectionalOnly(false);
    // Reset to permissive defaults to show results by default
    setMercuryFilter('direct'); // Keep Mercury direct as it's important
    setMoonPhaseFilter('all'); // Show all moon phases by default
    setMoonSignFilter('all'); // Show all moon signs by default
    setDignityFilter('all'); // Show all dignities by default
    setMaleficFilter('all'); // Show all aspects by default
    setScoreFilter('all'); // Show all scores by default
    setElectionalFilter('all'); // Show all electional events by default
    // Reset new financial filters
    setJupiterSectorFilter('all'); // Show all sectors by default
    setMagicFormulaFilter('all'); // Show all events by default
    setVoidMoonFilter('all'); // Show all periods by default
    setIngressFilter('all'); // Show all timing by default
    setEconomicCycleFilter('all'); // Show all cycles by default
    
    // Show reset notification
    if (onReset) {
      setTimeout(() => {
        onReset();
      }, 100);
    }
  }, [filterSetters, onReset]);

  // Quick filter handlers
  const getQuickFilterState = useCallback((key: string) => {
    switch (key) {
      case 'hideChallengingDates': return filterState.hideChallengingDates;
      case 'showCombosOnly': return filterState.showCombosOnly;
      case 'showAspects': return filterState.showAspects;
      default: return false;
    }
  }, [filterState]);

  const getQuickFilterHandler = useCallback((key: string) => {
    const originalHandler = (() => {
      switch (key) {
        case 'hideChallengingDates': return filterSetters.setHideChallengingDates;
        case 'showCombosOnly': return filterSetters.setShowCombosOnly;
        case 'showAspects': return filterSetters.setShowAspects;
        default: return () => {};
      }
    })();

    // Wrapper function that triggers toast notification
    return (newValue: boolean) => {
      originalHandler(newValue);
      
      if (onQuickFilterChange) {
        const filterNames = {
          'hideChallengingDates': 'Hide Challenging',
          'showCombosOnly': 'Combos Only',
          'showAspects': 'Show Aspects'
        };
        
        const filterName = filterNames[key as keyof typeof filterNames] || key;
        
        setTimeout(() => {
          onQuickFilterChange(filterName, newValue);
        }, 100);
      }
    };
  }, [filterSetters, onQuickFilterChange]);

  const getQuickFilterLabel = useCallback((key: string, isActive: boolean) => {
    switch (key) {
      case 'hideChallengingDates': return isActive ? 'Show' : 'Hide';
      case 'showCombosOnly': return isActive ? 'All Events' : 'Combos Only';
      case 'showAspects': return isActive ? 'Hide' : 'Show';
      default: return '';
    }
  }, []);

  // Advanced filter handlers
  const getAdvancedFilterState = useCallback((key: string) => {
    switch (key) {
      case 'mercuryFilter': return mercuryFilter;
      case 'moonPhaseFilter': return moonPhaseFilter;
      case 'moonSignFilter': return moonSignFilter;
      case 'dignityFilter': return dignityFilter;
      case 'maleficFilter': return maleficFilter;
      case 'scoreFilter': return scoreFilter;
      case 'electionalFilter': return electionalFilter;
      case 'jupiterSectorFilter': return jupiterSectorFilter;
      case 'magicFormulaFilter': return magicFormulaFilter;
      case 'voidMoonFilter': return voidMoonFilter;
      case 'ingressFilter': return ingressFilter;
      case 'economicCycleFilter': return economicCycleFilter;
      default: return 'all';
    }
  }, [mercuryFilter, moonPhaseFilter, moonSignFilter, dignityFilter, maleficFilter, scoreFilter, electionalFilter, jupiterSectorFilter, magicFormulaFilter, voidMoonFilter, ingressFilter, economicCycleFilter]);

  const setAdvancedFilterState = useCallback((key: string, value: string) => {
    // Update the filter state
    switch (key) {
      case 'mercuryFilter': setMercuryFilter(value as 'direct' | 'all'); break;
      case 'moonPhaseFilter': setMoonPhaseFilter(value as 'waxing' | 'new' | 'full' | 'waning' | 'all'); break;
      case 'moonSignFilter': setMoonSignFilter(value as 'haircut_growth' | 'haircut_maintenance' | 'travel_flexible' | 'travel_stable' | 'creativity' | 'luck_success' | 'avoid_void' | 'all'); break;
      case 'dignityFilter': setDignityFilter(value as 'exalted' | 'no_debility' | 'all'); break;
      case 'maleficFilter': setMaleficFilter(value as 'no_mars_saturn' | 'soft_aspects' | 'all'); break;
      case 'scoreFilter': setScoreFilter(value as '8_plus' | '6_plus' | 'all'); break;
      case 'electionalFilter': setElectionalFilter(value as 'ready' | 'benefics_angular' | 'all'); break;
      case 'jupiterSectorFilter': setJupiterSectorFilter(value as 'current_favored' | 'avoid_saturn' | 'all'); break;
      case 'magicFormulaFilter': setMagicFormulaFilter(value as 'sun_jupiter_pluto' | 'jupiter_pluto' | 'all'); break;
      case 'voidMoonFilter': setVoidMoonFilter(value as 'avoid_void' | 'allow_declination' | 'all'); break;
      case 'ingressFilter': setIngressFilter(value as 'three_week_window' | 'exact_ingress' | 'all'); break;
      case 'economicCycleFilter': setEconomicCycleFilter(value as 'expansion_phase' | 'consolidation_phase' | 'all'); break;
    }

    // Trigger toast notification
    if (onFilterChange) {
      const filterNames = {
        'mercuryFilter': 'Mercury',
        'moonPhaseFilter': 'Moon Phase',
        'moonSignFilter': 'Moon Sign',
        'dignityFilter': 'Dignity', 
        'maleficFilter': 'Malefics',
        'scoreFilter': 'Score',
        'electionalFilter': 'Traditional',
        'jupiterSectorFilter': 'Jupiter Sector',
        'magicFormulaFilter': 'Magic Formula',
        'voidMoonFilter': 'Void Moon',
        'ingressFilter': 'Ingress',
        'economicCycleFilter': 'Economic Cycle'
      };

      const readableValues = {
        'all': 'All',
        'direct': 'Direct Mercury',
        'waxing': 'Waxing Moon',
        'new': 'New Moon',
        'full': 'Full Moon',
        'waning': 'Waning Moon',
        'haircut_growth': 'Hair Growth',
        'haircut_maintenance': 'Hair Trim',
        'travel_flexible': 'Travel (Flexible)',
        'travel_stable': 'Travel (Stable)', 
        'creativity': 'Creative Work',
        'luck_success': 'Luck & Success',
        'avoid_void': 'Avoid Void Moon',
        'exalted': 'Exalted',
        'no_debility': 'No Debility',
        'no_mars_saturn': 'No Mars/Saturn',
        'soft_aspects': 'Soft Aspects',
        '8_plus': '8+ Score',
        '6_plus': '6+ Score',
        'ready': 'Ready',
        'benefics_angular': 'Benefics Angular',
        'current_favored': 'Favored Sectors',
        'avoid_saturn': 'Avoid Saturn Sectors',
        'sun_jupiter_pluto': 'Full Magic Formula',
        'jupiter_pluto': 'Jupiter-Pluto Only',
        'allow_declination': 'Allow with Declination',
        'three_week_window': '3-Week Window',
        'exact_ingress': 'Exact Ingress',
        'expansion_phase': 'Expansion Phase',
        'consolidation_phase': 'Consolidation Phase'
      };

      const filterName = filterNames[key as keyof typeof filterNames] || key;
      let readableValue = readableValues[value as keyof typeof readableValues] || value;
      
      // Handle "all" cases with specific messaging
      if (value === 'all') {
        readableValue = `All ${filterName}`;
      }
      
      setTimeout(() => {
        onFilterChange(filterName, readableValue);
      }, 100);
    }
  }, [onFilterChange]);

  return {
    // State
    advancedFilters: {
      mercuryFilter,
      moonPhaseFilter,
      moonSignFilter,
      dignityFilter,
      maleficFilter,
      scoreFilter,
      electionalFilter,
      jupiterSectorFilter,
      magicFormulaFilter,
      voidMoonFilter,
      ingressFilter,
      economicCycleFilter
    },
    activeFilters: getActiveFilters(),
    
    // Actions
    resetAllFilters,
    getQuickFilterState,
    getQuickFilterHandler,
    getQuickFilterLabel,
    getAdvancedFilterState,
    setAdvancedFilterState
  };
}