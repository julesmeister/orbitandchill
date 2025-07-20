/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import { DailyAspect } from '../../hooks/useDailyAspects';
import { FilterCounts } from './utils/calendarUtils';
import EventsCalendar from './EventsCalendar';
import EventsTable from './EventsTable';

interface EventsRightPanelProps {
  // View mode
  viewMode: 'calendar' | 'list';
  
  // Events data
  events: AstrologicalEvent[];
  filteredEvents: AstrologicalEvent[];
  
  // Calendar props
  currentDate: Date;
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
  
  // Calendar handlers
  setCurrentDate: (date: Date) => void;
  setHideChallengingDates: (hide: boolean) => void;
  setShowCombosOnly: (show: boolean) => void;
  setShowAspects: (show: boolean) => void;
  setShowHousesOnly: (show: boolean) => void;
  setShowAspectsOnly: (show: boolean) => void;
  setShowElectionalOnly: (show: boolean) => void;
  handleEventClick: (event: AstrologicalEvent) => void;
  handleToggleBookmark: (eventId: string) => void;
  handleClearAllEvents: () => void;
  handleMonthChange: (month: number, year: number) => void;
  
  // Table props
  selectedTab: string;
  selectedType: string;
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual' | 'generated') => void;
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => void;
  handleDeleteEvent: (id: string) => void;
  handleRenameEvent: (id: string, newTitle: string) => void;
  setShowTimingOptions: (show: boolean) => void;
  
  // User data
  userId?: string;
}

export default function EventsRightPanel({
  viewMode,
  events,
  filteredEvents,
  currentDate,
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
  handleToggleBookmark,
  handleClearAllEvents,
  handleMonthChange,
  selectedTab,
  selectedType,
  setSelectedTab,
  setSelectedType,
  handleDeleteEvent,
  handleRenameEvent,
  setShowTimingOptions,
  userId
}: EventsRightPanelProps) {
  return (
    <div className="xl:col-span-3">
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div data-calendar>
          <EventsCalendar
            showCalendar={true}
            currentDate={currentDate}
            events={filteredEvents}
            hideChallengingDates={hideChallengingDates}
            showCombosOnly={showCombosOnly}
            showAspects={showAspects}
            showHousesOnly={showHousesOnly}
            showAspectsOnly={showAspectsOnly}
            showElectionalOnly={showElectionalOnly}
            challengingEventsCount={challengingEventsCount}
            comboEventsCount={comboEventsCount}
            filterCounts={filterCounts}
            generateDailyAspects={generateDailyAspects}
            setCurrentDate={setCurrentDate}
            setHideChallengingDates={setHideChallengingDates}
            setShowCombosOnly={setShowCombosOnly}
            setShowAspects={setShowAspects}
            setShowHousesOnly={setShowHousesOnly}
            setShowAspectsOnly={setShowAspectsOnly}
            setShowElectionalOnly={setShowElectionalOnly}
            handleEventClick={handleEventClick}
            toggleBookmark={handleToggleBookmark}
            onClearAllEvents={handleClearAllEvents}
            userId={userId}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}

      {/* List View - Default */}
      {viewMode === 'list' && (
        <div data-events-table>
          <EventsTable
            filteredEvents={filteredEvents}
            selectedTab={selectedTab}
            selectedType={selectedType}
            hideChallengingDates={hideChallengingDates}
            showCombosOnly={showCombosOnly}
            events={events}
            currentUserId={userId}
            setSelectedTab={setSelectedTab}
            setSelectedType={setSelectedType}
            toggleBookmark={handleToggleBookmark}
            deleteEvent={handleDeleteEvent}
            renameEvent={handleRenameEvent}
            handleEventClick={handleEventClick}
          />
        </div>
      )}

      {/* Empty State for Generated Events */}
      {events.filter(e => e.isGenerated).length === 0 && viewMode === 'list' && (
        <div className="bg-white border border-black p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-2">
              No Generated Events Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Click "Generate Optimal Times" in the left panel to create astrological recommendations based on your priorities.
            </p>
            <button
              onClick={() => setShowTimingOptions(true)}
              className="px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5"
            >
              Generate Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}