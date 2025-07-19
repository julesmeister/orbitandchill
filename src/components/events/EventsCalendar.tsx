/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import type { AstrologicalEvent } from '../../types/events';
import { DailyAspect } from '../../hooks/useDailyAspects';
import EventsCalendarFilters, { AdvancedFilterState } from './EventsCalendarFilters';
import CalendarHeader from './CalendarHeader';
import TimeSelectionControls from './TimeSelectionControls';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';
import { FilterCounts } from './utils/calendarUtils';

interface EventsCalendarProps {
  showCalendar: boolean;
  currentDate: Date;
  events: AstrologicalEvent[];
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showAspects: boolean;
  showHousesOnly: boolean;
  showAspectsOnly: boolean;
  showElectionalOnly: boolean;
  challengingEventsCount: number;
  comboEventsCount: number;
  filterCounts: FilterCounts;
  generateDailyAspects: (date: Date, options?: { 
    timeOfDay?: 'morning' | 'noon' | 'evening' | 'custom';
    customHour?: number;
    showOnlyAllDay?: boolean;
  }) => DailyAspect[];
  setCurrentDate: (date: Date) => void;
  setHideChallengingDates: (hide: boolean) => void;
  setShowCombosOnly: (show: boolean) => void;
  setShowAspects: (show: boolean) => void;
  setShowHousesOnly: (show: boolean) => void;
  setShowAspectsOnly: (show: boolean) => void;
  setShowElectionalOnly: (show: boolean) => void;
  handleEventClick: (event: AstrologicalEvent) => void;
  toggleBookmark: (eventId: string) => void;
  onClearAllEvents?: () => void;
  userId?: string; // Add userId for month-specific loading
  onMonthChange?: (month: number, year: number) => void; // Add callback for month changes
}

export default function EventsCalendar({
  showCalendar,
  currentDate,
  events,
  hideChallengingDates,
  showCombosOnly,
  showAspects,
  showHousesOnly,
  showAspectsOnly,
  showElectionalOnly,
  challengingEventsCount,
  comboEventsCount,
  filterCounts,
  generateDailyAspects,
  setCurrentDate,
  setHideChallengingDates,
  setShowCombosOnly,
  setShowAspects,
  setShowHousesOnly,
  setShowAspectsOnly,
  setShowElectionalOnly,
  handleEventClick,
  toggleBookmark,
  onClearAllEvents,
  userId,
  onMonthChange
}: EventsCalendarProps) {
  // Local state for time controls
  const [aspectTimeOfDay, setAspectTimeOfDay] = React.useState<'morning' | 'noon' | 'evening' | 'custom'>('noon');
  const [customHour, setCustomHour] = React.useState(12);
  const [showOnlyAllDay, setShowOnlyAllDay] = React.useState(false);
  
  // Advanced filter state managed by EventsCalendarFilters component
  // Initial state should match the defaults in useFilterState hook
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilterState>({
    mercuryFilter: 'direct', // Default to direct to filter out retrograde
    moonPhaseFilter: 'all',
    moonSignFilter: 'all',
    dignityFilter: 'all',
    maleficFilter: 'all',
    scoreFilter: 'all',
    electionalFilter: 'all',
    // New financial astrology filters
    jupiterSectorFilter: 'all',
    magicFormulaFilter: 'all',
    voidMoonFilter: 'all',
    ingressFilter: 'all',
    economicCycleFilter: 'all'
  });

  // Handle advanced filter changes from the filters component
  const handleFiltersChange = React.useCallback((filters: AdvancedFilterState) => {
    setAdvancedFilters(filters);
  }, []);

  // Handle month changes to trigger month-specific loading
  const handleDateChange = React.useCallback((newDate: Date) => {
    setCurrentDate(newDate);
    if (onMonthChange && userId) {
      onMonthChange(newDate.getMonth(), newDate.getFullYear());
    }
  }, [setCurrentDate, onMonthChange, userId]);
  
  if (!showCalendar) return null;

  // Prepare filter object for CalendarGrid
  const filters = {
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly
  };

  return (
    <div className="border border-black bg-white mb-8 relative overflow-visible">
      {/* Calendar Header */}
      <CalendarHeader 
        currentDate={currentDate}
        setCurrentDate={handleDateChange}
        onClearAllEvents={onClearAllEvents}
      />

      {/* Calendar Filters Section */}
      <EventsCalendarFilters
        hideChallengingDates={hideChallengingDates}
        showCombosOnly={showCombosOnly}
        showAspects={showAspects}
        showHousesOnly={showHousesOnly}
        showAspectsOnly={showAspectsOnly}
        showElectionalOnly={showElectionalOnly}
        challengingEventsCount={challengingEventsCount}
        comboEventsCount={comboEventsCount}
        filterCounts={filterCounts}
        setHideChallengingDates={setHideChallengingDates}
        setShowCombosOnly={setShowCombosOnly}
        setShowAspects={setShowAspects}
        setShowHousesOnly={setShowHousesOnly}
        setShowAspectsOnly={setShowAspectsOnly}
        setShowElectionalOnly={setShowElectionalOnly}
        onFiltersChange={handleFiltersChange}
        currentDate={currentDate}
      />
      
      {/* Time Selection Controls for Aspects */}
      <TimeSelectionControls
        showAspects={showAspects}
        aspectTimeOfDay={aspectTimeOfDay}
        customHour={customHour}
        showOnlyAllDay={showOnlyAllDay}
        setAspectTimeOfDay={setAspectTimeOfDay}
        setCustomHour={setCustomHour}
        setShowOnlyAllDay={setShowOnlyAllDay}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        filters={filters}
        advancedFilters={advancedFilters}
        showAspects={showAspects}
        generateDailyAspects={generateDailyAspects}
        aspectTimeOfDay={aspectTimeOfDay}
        customHour={customHour}
        showOnlyAllDay={showOnlyAllDay}
        handleEventClick={handleEventClick}
        toggleBookmark={toggleBookmark}
      />
      
      {/* Legend */}
      <CalendarLegend
        hideChallengingDates={hideChallengingDates}
        challengingEventsCount={challengingEventsCount}
        showCombosOnly={showCombosOnly}
        comboEventsCount={comboEventsCount}
      />
    </div>
  );
}