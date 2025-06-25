/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import { DailyAspect } from '../../hooks/useDailyAspects';
import { CalendarDay as CalendarDayType, applyFiltersToEvents, logFilteringResults } from './utils/calendarUtils';
import { AdvancedFilterState } from './EventsCalendarFilters';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  events: AstrologicalEvent[];
  filters: {
    hideChallengingDates: boolean;
    showCombosOnly: boolean;
    showHousesOnly: boolean;
    showAspectsOnly: boolean;
    showElectionalOnly: boolean;
  };
  advancedFilters: AdvancedFilterState;
  showAspects: boolean;
  generateDailyAspects: (date: Date, options?: { 
    timeOfDay?: 'morning' | 'noon' | 'evening' | 'custom';
    customHour?: number;
    showOnlyAllDay?: boolean;
  }) => DailyAspect[];
  aspectTimeOfDay: 'morning' | 'noon' | 'evening' | 'custom';
  customHour: number;
  showOnlyAllDay: boolean;
  handleEventClick: (event: AstrologicalEvent) => void;
  toggleBookmark: (eventId: string) => void;
}

export default function CalendarGrid({
  currentDate,
  events,
  filters,
  advancedFilters,
  showAspects,
  generateDailyAspects,
  aspectTimeOfDay,
  customHour,
  showOnlyAllDay,
  handleEventClick,
  toggleBookmark
}: CalendarGridProps) {
  
  const getCalendarDays = (): CalendarDayType[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDayType[] = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const eventsBeforeAdvancedFilters = events.filter(event => 
        new Date(event.date).toDateString() === currentDay.toDateString()
      ).length;

      const dayEvents = applyFiltersToEvents(
        events,
        filters,
        advancedFilters,
        currentDay.toDateString()
      );

      // Log filtering results
      logFilteringResults(
        eventsBeforeAdvancedFilters,
        dayEvents.length,
        currentDay.toDateString(),
        filters,
        advancedFilters
      );
      
      const averageScore = dayEvents.length > 0 
        ? dayEvents.reduce((sum, event) => sum + event.score, 0) / dayEvents.length 
        : 0;
        
      days.push({
        date: new Date(currentDay),
        score: averageScore,
        isCurrentMonth: currentDay.getMonth() === month,
        events: dayEvents,
        hasOptimalTiming: averageScore >= 8,
        dailyAspects: generateDailyAspects(new Date(currentDay), {
          timeOfDay: aspectTimeOfDay,
          customHour: aspectTimeOfDay === 'custom' ? customHour : undefined,
          showOnlyAllDay
        })
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="p-8">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-0 mb-6 border border-black">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className={`text-center py-4 bg-white border-black font-space-grotesk font-bold text-black ${index < 6 ? 'border-r' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-black">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            index={index}
            showAspects={showAspects}
            handleEventClick={handleEventClick}
            toggleBookmark={toggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}