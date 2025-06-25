import React from 'react';

export interface AdvancedFilterState {
  mercuryFilter: 'direct' | 'all';
  moonPhaseFilter: 'waxing' | 'new' | 'full' | 'waning' | 'all';
  moonSignFilter: 'haircut_growth' | 'haircut_maintenance' | 'travel_flexible' | 'travel_stable' | 'creativity' | 'luck_success' | 'avoid_void' | 'all';
  dignityFilter: 'exalted' | 'no_debility' | 'all';
  maleficFilter: 'no_mars_saturn' | 'soft_aspects' | 'all';
  scoreFilter: '8_plus' | '6_plus' | 'all';
  electionalFilter: 'ready' | 'benefics_angular' | 'all';
  jupiterSectorFilter: 'current_favored' | 'avoid_saturn' | 'all';
  magicFormulaFilter: 'sun_jupiter_pluto' | 'jupiter_pluto' | 'all';
  voidMoonFilter: 'avoid_void' | 'allow_declination' | 'all';
  ingressFilter: 'three_week_window' | 'exact_ingress' | 'all';
  economicCycleFilter: 'expansion_phase' | 'consolidation_phase' | 'all';
}

export interface QuickFilter {
  key: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

export interface TimingMethod {
  key: string;
  label: string;
}

export interface AdvancedFilter {
  key: string;
  label: string;
  options: FilterOption[];
  tooltip: string;
  bgColor: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showAspects: boolean;
  showHousesOnly: boolean;
  showAspectsOnly: boolean;
  showElectionalOnly: boolean;
}

export interface FilterCounts {
  challengingEventsCount: number;
  comboEventsCount: number;
}

export interface FilterSetters {
  setHideChallengingDates: (hide: boolean) => void;
  setShowCombosOnly: (show: boolean) => void;
  setShowAspects: (show: boolean) => void;
  setShowHousesOnly: (show: boolean) => void;
  setShowAspectsOnly: (show: boolean) => void;
  setShowElectionalOnly: (show: boolean) => void;
}