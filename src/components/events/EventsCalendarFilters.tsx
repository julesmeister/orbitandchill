/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AdvancedFilterState, FilterState, FilterCounts, FilterSetters } from './types/filterTypes';
import { useFilterState } from './hooks/useFilterState';
import { useFilterToast } from '../../hooks/useFilterToast';
import FilterHeader from './FilterHeader';
import QuickFilters from './QuickFilters';
import AdvancedFilters from './AdvancedFilters';
import FilterLegend from './FilterLegend';
import FilterToast from '../reusable/FilterToast';
import { FilterCounts as AdvancedFilterCounts } from './utils/calendarUtils';

// Re-export types for backward compatibility
export type { AdvancedFilterState };

interface EventsCalendarFiltersProps extends FilterState, FilterCounts, FilterSetters {
  onFiltersChange: (filters: AdvancedFilterState) => void;
  currentDate?: Date;
  filterCounts: AdvancedFilterCounts;
}

export default function EventsCalendarFilters({
  hideChallengingDates,
  showCombosOnly,
  showAspects,
  showHousesOnly,
  showAspectsOnly,
  showElectionalOnly,
  challengingEventsCount,
  comboEventsCount,
  filterCounts,
  setHideChallengingDates,
  setShowCombosOnly,
  setShowAspects,
  setShowHousesOnly,
  setShowAspectsOnly,
  setShowElectionalOnly,
  onFiltersChange,
  currentDate
}: EventsCalendarFiltersProps) {
  
  // Toast notification system with astronomical context
  const { toast, hideToast, showFilterResult, showQuickFilterResult, showResetResult } = useFilterToast(currentDate);
  
  // Prepare filter state and setters for the hook
  const filterState: FilterState = {
    hideChallengingDates,
    showCombosOnly,
    showAspects,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly
  };

  const filterSetters: FilterSetters = {
    setHideChallengingDates,
    setShowCombosOnly,
    setShowAspects,
    setShowHousesOnly,
    setShowAspectsOnly,
    setShowElectionalOnly
  };

  // Use the custom hook for state management
  const {
    activeFilters,
    resetAllFilters,
    getQuickFilterState,
    getQuickFilterHandler,
    getQuickFilterLabel,
    getAdvancedFilterState,
    setAdvancedFilterState
  } = useFilterState({
    filterState,
    filterSetters,
    onFiltersChange,
    // Toast callback functions
    onFilterChange: showFilterResult,
    onQuickFilterChange: showQuickFilterResult,
    onReset: showResetResult
  });

  return (
    <div className="border-b border-black bg-gray-50">
      <div className="px-8 py-6">
        {/* Header Section */}
        <FilterHeader 
          activeFiltersCount={activeFilters.length}
          onResetAllFilters={resetAllFilters}
        />

        {/* Filter Controls */}
        <div className="space-y-4">
          {/* Quick Filters Row */}
          <QuickFilters
            getQuickFilterState={getQuickFilterState}
            getQuickFilterHandler={getQuickFilterHandler}
            getQuickFilterLabel={getQuickFilterLabel}
          />

          {/* Advanced Filters Row */}
          <AdvancedFilters
            getAdvancedFilterState={getAdvancedFilterState}
            setAdvancedFilterState={setAdvancedFilterState}
            filterCounts={filterCounts}
          />

          {/* Legend */}
          <FilterLegend
            hideChallengingDates={hideChallengingDates}
            challengingEventsCount={challengingEventsCount}
            showCombosOnly={showCombosOnly}
            comboEventsCount={comboEventsCount}
          />
        </div>
      </div>
      
      {/* Toast Notification */}
      <FilterToast
        message={toast.message}
        isVisible={toast.isVisible}
        onHide={hideToast}
        duration={3000}
      />
    </div>
  );
}