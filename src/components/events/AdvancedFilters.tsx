/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Tooltip from '../reusable/Tooltip';
import { ADVANCED_FILTERS } from './config/filterConfigs';
import { FilterCounts } from './utils/calendarUtils';

interface AdvancedFiltersProps {
  getAdvancedFilterState: (key: string) => string;
  setAdvancedFilterState: (key: string, value: string) => void;
  filterCounts: FilterCounts;
}

export default function AdvancedFilters({
  getAdvancedFilterState,
  setAdvancedFilterState,
  filterCounts
}: AdvancedFiltersProps) {

  // Function to get count for a specific filter option
  const getFilterOptionCount = (filterKey: string, optionValue: string): number | null => {
    // Return null for 'all' options to avoid showing counts
    if (optionValue === 'all') return null;

    switch (filterKey) {
      case 'mercuryFilter':
        return optionValue === 'direct' ? filterCounts.mercuryDirect : null;
      case 'moonPhaseFilter':
        if (optionValue === 'waxing') return filterCounts.moonWaxing;
        if (optionValue === 'new') return filterCounts.moonNew;
        if (optionValue === 'full') return filterCounts.moonFull;
        if (optionValue === 'waning') return filterCounts.moonWaning;
        return null;
      // case 'moonSignFilter':
        // Moon sign filter commented out per user request - info added to event titles instead
        // return null;
      case 'dignityFilter':
        if (optionValue === 'exalted') return filterCounts.dignityExalted;
        if (optionValue === 'no_debility') return filterCounts.dignityNoDebility;
        return null;
      case 'maleficFilter':
        if (optionValue === 'no_mars_saturn') return filterCounts.maleficAvoid;
        if (optionValue === 'soft_aspects') return filterCounts.maleficSoft;
        return null;
      case 'scoreFilter':
        if (optionValue === '8_plus') return filterCounts.score8Plus;
        if (optionValue === '6_plus') return filterCounts.score6Plus;
        return null;
      case 'electionalFilter':
        if (optionValue === 'ready') return filterCounts.electionalReady;
        if (optionValue === 'benefics_angular') return filterCounts.electionalAngular;
        return null;
      case 'jupiterSectorFilter':
        if (optionValue === 'current_favored') return filterCounts.jupiterFavored;
        if (optionValue === 'avoid_saturn') return filterCounts.jupiterAvoidSaturn;
        return null;
      case 'magicFormulaFilter':
        if (optionValue === 'sun_jupiter_pluto') return filterCounts.magicFormulaFull;
        if (optionValue === 'jupiter_pluto') return filterCounts.magicFormulaPartial;
        return null;
      case 'voidMoonFilter':
        if (optionValue === 'avoid_void') return filterCounts.voidMoonAvoid;
        if (optionValue === 'allow_declination') return filterCounts.voidMoonDeclination;
        return null;
      case 'ingressFilter':
        if (optionValue === 'three_week_window') return filterCounts.ingressThreeWeek;
        if (optionValue === 'exact_ingress') return filterCounts.ingressExact;
        return null;
      case 'economicCycleFilter':
        if (optionValue === 'expansion_phase') return filterCounts.economicExpansion;
        if (optionValue === 'consolidation_phase') return filterCounts.economicConsolidation;
        return null;
      default:
        return null;
    }
  };

  // Get custom width based on filter type and number of options
  const getFilterWidth = (filterKey: string) => {
    if (filterKey === 'moonPhaseFilter') {
      // Moon Phase has 5 options - make it wider
      return 'w-full md:w-110 lg:w-110';
    // } else if (filterKey === 'moonSignFilter') {
      // Moon sign filter commented out - info added to event titles instead
      // return 'w-full md:w-110 lg:w-115';
    } else if (filterKey === 'mercuryFilter' || filterKey === 'scoreFilter') {
      // Mercury and Score have fewer options - make them narrower
      return 'w-full md:w-55 lg:w-55';
    } else if (filterKey === 'electionalFilter') {
      return 'w-full md:w-64 lg:w-64';
    } else if (filterKey === 'maleficFilter') {
      return 'w-full md:w-70 lg:w-70';
    } else if (filterKey === 'jupiterSectorFilter') {
      // Jupiter Sector has 3 options with longer labels
      return 'w-full md:w-90 lg:w-90';
    } else if (filterKey === 'magicFormulaFilter') {
      // Magic Formula has descriptive labels
      return 'w-full md:w-85 lg:w-90';
    } else if (filterKey === 'voidMoonFilter') {
      // Void Moon has longer option labels
      return 'w-full md:w-75 lg:w-80';
    } else if (filterKey === 'ingressFilter') {
      // Ingress has shorter labels
      return 'w-full md:w-60 lg:w-65';
    } else if (filterKey === 'economicCycleFilter') {
      // Economic cycle has longer labels
      return 'w-full md:w-80 lg:w-85';
    } else {
      // Default width for other filters
      return 'w-full md:w-64 lg:w-72';
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {ADVANCED_FILTERS.map((filter) => {
        const currentValue = getAdvancedFilterState(filter.key);
        const filterWidth = getFilterWidth(filter.key);
        
        return (
          <Tooltip 
            key={filter.key}
            content={filter.tooltip}
            position="bottom"
            delay={300}
            className="w-80"
          >
            <div className={`${filterWidth} flex gap-1 items-center justify-between ${filter.bgColor} p-2 border border-black rounded`}>
              <span className="text-xs font-medium text-gray-700 px-1">{filter.label}:</span>
              <div className="flex gap-1">
                {filter.options.map((option) => {
                  const count = getFilterOptionCount(filter.key, option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        console.log(`${filter.label} ${option.label} clicked, current filter:`, currentValue);
                        setAdvancedFilterState(filter.key, option.value);
                      }}
                      className={`px-2 py-1 text-xs font-medium transition-all duration-200 rounded ${
                        currentValue === option.value
                          ? 'bg-black text-white'
                          : filter.bgColor === 'bg-amber-50'
                            ? 'bg-white text-black hover:bg-amber-100 border border-gray-300'
                            : filter.bgColor === 'bg-yellow-50'
                              ? 'bg-white text-black hover:bg-yellow-100 border border-gray-300'
                              : filter.bgColor === 'bg-purple-50'
                                ? 'bg-white text-black hover:bg-purple-100 border border-gray-300'
                                : filter.bgColor === 'bg-slate-50'
                                  ? 'bg-white text-black hover:bg-slate-100 border border-gray-300'
                                  : filter.bgColor === 'bg-green-50'
                                    ? 'bg-white text-black hover:bg-green-100 border border-gray-300'
                                    : filter.bgColor === 'bg-blue-50'
                                      ? 'bg-white text-black hover:bg-blue-100 border border-gray-300'
                                      : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {option.label}{count !== null ? ` (${count})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}