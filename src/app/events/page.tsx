/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUserStore } from '../../store/userStore';
import { useEventsStore, AstrologicalEvent } from '../../store/eventsStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useOptimalTiming } from '../../hooks/useOptimalTiming';
import { useManualEventAnalysis } from '../../hooks/useManualEventAnalysis';
import { useDailyAspects } from '../../hooks/useDailyAspects';
import { useConfirmationToast } from '../../hooks/useConfirmationToast';
import { useStatusToast } from '../../hooks/useStatusToast';
import { calculatePlanetaryPositions, ASPECTS, ChartAspect, PlanetPosition } from '../../utils/natalChart';
import { calculateFilterCounts } from '../../components/events/utils/calendarUtils';
import { filterEventsByMoonSign } from '../../utils/moonElectionalFilter';

// Components
import EventsHeader from '../../components/events/EventsHeader';
import EventsCalendar from '../../components/events/EventsCalendar';
import EventsTable from '../../components/events/EventsTable';
import EventsEmptyState from '../../components/events/EventsEmptyState';
import NextBookmarkedEventCountdown from '../../components/events/NextBookmarkedEventCountdown';
import AddEventForm from '../../components/events/AddEventForm';
import EventsLeftPanel from '../../components/events/EventsLeftPanel';
import EventsRightPanel from '../../components/events/EventsRightPanel';
import ConfirmationToast from '../../components/reusable/ConfirmationToast';
import StatusToast from '../../components/reusable/StatusToast';
import LocationRequestToast from '../../components/reusable/LocationRequestToast';
import { useSharedLocation } from '../../hooks/useSharedLocation';
import { useEventsLimits } from '../../hooks/useEventsLimits';
import EventsLimitBanner from '../../components/events/EventsLimitBanner';
import { useEventStats } from '../../hooks/useEventStats';
import { useLocationForGeneration } from '../../hooks/useLocationForGeneration';
import { useEventForm } from '../../hooks/useEventForm';
import { useOptimalTimingHandler } from '../../hooks/useOptimalTimingHandler';
import { useManualEventHandler } from '../../hooks/useManualEventHandler';
import { useEventActions } from '../../hooks/useEventActions';
import { BRAND } from '../../config/brand';
import { useEventFiltering } from '../../hooks/useEventFiltering';
import { calculateChallengingEventsCount, calculateComboEventsCount } from '../../utils/eventStatistics';
import { getLocationForGeneration } from '../../utils/eventLocationUtils';
import { useEventNavigation } from '../../hooks/useEventNavigation';

// Remove duplicate interface - using from store

// Mock events moved to store

export default function EventsPage() {
  const { user, isProfileComplete } = useUserStore();

  // Use optimal timing hook
  const { isGenerating: isTimingGenerating, timingPriorities, generateOptimalTiming } = useOptimalTiming();

  // Use manual event analysis hook
  const { isAnalyzing: isAnalyzingEvent, analyzeManualEvent } = useManualEventAnalysis();

  // Use daily aspects hook
  const { generateDailyAspects } = useDailyAspects();

  // Use confirmation toast hook
  const { toast: confirmationToast, showConfirmation, hideConfirmation } = useConfirmationToast();

  // Use status toast hook
  const { toast: statusToast, showLoading, showSuccess, showError, showInfo, updateProgress, hideStatus } = useStatusToast();

  // Use shared location hook
  const {
    isLocationToastVisible,
    locationDisplay,
    requestLocationPermission,
    showLocationToast,
    hideLocationToast,
    setLocation
  } = useSharedLocation();

  // Use events limits hook
  const eventsLimits = useEventsLimits();

  // Get current location data from the shared location hook
  const currentLocationData = locationDisplay.isUserSet ? {
    name: locationDisplay.name,
    coordinates: locationDisplay.coordinates,
    timezone: locationDisplay.timezone
  } : null;

  // Note: handleToggleBookmark is defined later in the component with full logic

  // Use events store for all state management
  const {
    events,
    getAllEvents,
    showCalendar,
    currentDate,
    selectedType,
    selectedPriorities,
    showAddForm,
    showTimingOptions,
    selectedTab,
    hideChallengingDates,
    showCombosOnly,
    showAspects,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    isLoading,
    error,
    setEvents,
    loadEvents,
    loadMonthEvents,
    addEvent,
    addEventsLocal,
    updateEvent,
    deleteEvent,
    toggleBookmark,
    setShowCalendar,
    setCurrentDate,
    setSelectedType,
    setSelectedPriorities,
    togglePriority,
    setShowAddForm,
    setShowTimingOptions,
    resetForm,
    clearGeneratedEvents,
    setSelectedTab,
    setHideChallengingDates,
    setShowCombosOnly,
    setShowAspects,
    setShowHousesOnly,
    setShowAspectsOnly,
    setShowElectionalOnly,
    setError
  } = useEventsStore();

  // Get all events (including generated ones)
  const allEvents = getAllEvents();


  // Local state for form and animation
  const [isFormAnimating, setIsFormAnimating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });
  // State for view mode
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  // Note: Month-based loading now handles preventing duplicate loads via caching

  // Set document title and meta tags for SEO
  useEffect(() => {
    document.title = `Astrological Events Dashboard | ${BRAND.name}`;
  }, []);

  // Cleanup old unbookmarked generated events on initial page load - TEMPORARILY DISABLED
  useEffect(() => {
    // Cleanup disabled for debugging manual events issue
    // const cleanupOldGeneratedEvents = async () => {
    //   if (user?.id) {
    //     try {
    //       console.log('🧹 Cleaning up old unbookmarked generated events...');
    //       
    //       // Clear unbookmarked generated events from all months
    //       await clearGeneratedEvents(user.id);
    //       
    //       console.log('✅ Old generated events cleaned up successfully');
    //     } catch (error) {
    //       console.warn('⚠️ Could not clean up old generated events:', error);
    //       // Don't show error to user as this is a background cleanup
    //     }
    //   }
    // };

    // // Only run cleanup once when user is available
    // if (user?.id) {
    //   cleanupOldGeneratedEvents();
    // }
  }, [user?.id, clearGeneratedEvents]); // Only run when user changes

  
  // Stabilize currentDate to prevent infinite loops
  const stableCurrentDate = useMemo(() => currentDate, [currentDate.getTime()]);
  
  // Load events based on tab - all events for bookmarked/manual, month events for others
  useEffect(() => {
    if (user?.id) {
      if (selectedTab === 'bookmarked' || selectedTab === 'manual') {
        loadEvents(user.id, selectedTab);
      } else {
        // For 'all' and 'generated' tabs, load month events (store handles preserving generated events)
        loadMonthEvents(user.id, stableCurrentDate.getMonth(), stableCurrentDate.getFullYear());
      }
    }
  }, [user?.id, selectedTab, stableCurrentDate]);

  // Calculate event statistics
  const challengingEventsCount = calculateChallengingEventsCount(allEvents);
  const comboEventsCount = calculateComboEventsCount(allEvents);

  // Calculate advanced filter counts
  const filterCounts = useMemo(() => {
    return calculateFilterCounts(allEvents);
  }, [allEvents]);

  const filteredEvents = useEventFiltering({
    events: allEvents,
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly
  });

  // Get location for generation using utility
  const locationForGeneration = getLocationForGeneration(currentLocationData, user);

  // Use optimal timing handler hook
  const { handleGenerateOptimalTiming } = useOptimalTimingHandler({
    selectedPriorities,
    locationForGeneration,
    currentDate,
    userId: user?.id,
    showError,
    showLoading,
    showSuccess,
    updateProgress,
    showLocationToast
  });

  // Use manual event handler hook  
  const { handleAddEvent: handleAddEventFromHook } = useManualEventHandler({
    locationForGeneration,
    userId: user?.id,
    showError,
    showSuccess,
    resetForm: () => setNewEvent({ title: '', date: '', time: '', description: '' }),
    setShowAddForm
  });

  // Use event actions hook
  const { 
    handleDeleteEvent, 
    handleToggleBookmark, 
    handleRenameEvent,
    handleClearAllEvents: handleClearAllEventsFromHook
  } = useEventActions({
    onLocationRequired: showLocationToast,
    showConfirmation
  });

  // Create wrapper for manual event handler to match form structure
  const handleAddEvent = async (e: React.FormEvent) => {
    await handleAddEventFromHook(e, newEvent);
  };

  // Create wrapper for clear events to include currentDate
  const handleClearAllEvents = () => {
    handleClearAllEventsFromHook(currentDate);
  };



  // Handle month changes from calendar navigation
  const handleMonthChange = useCallback(async (month: number, year: number) => {
    if (user?.id) {
      // Only load month events if NOT viewing bookmarked/manual tabs
      if (selectedTab !== 'bookmarked' && selectedTab !== 'manual') {
        await loadMonthEvents(user.id, month, year);
      }
      // For bookmarked/manual tabs, keep showing all events
    }
  }, [user?.id, selectedTab]);



  // Use event navigation hook
  const { navigateToEventChart } = useEventNavigation();
  const handleEventClick = navigateToEventChart;



  return (
    <div className="w-screen min-h-screen bg-white">
      <main className="bg-white">
        {/* Events Limit Banner for Free Users - Hide when forms are active */}
        {!showTimingOptions && !showAddForm && (
          <section className="px-6 md:px-12 lg:px-20 py-4">
            <div className="max-w-6xl mx-auto">
              <EventsLimitBanner />
            </div>
          </section>
        )}

        {/* Main Layout - Two Panel Design */}
        <section className="px-4 md:px-8 py-8">
          <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Left Panel - Controls */}
              <EventsLeftPanel
                showTimingOptions={showTimingOptions}
                showAddForm={showAddForm}
                setShowTimingOptions={setShowTimingOptions}
                setShowAddForm={setShowAddForm}
                timingPriorities={timingPriorities}
                selectedPriorities={selectedPriorities}
                togglePriority={togglePriority}
                isTimingGenerating={isTimingGenerating}
                handleGenerateOptimalTiming={handleGenerateOptimalTiming}
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                handleAddEvent={handleAddEvent}
                isAnalyzingEvent={isAnalyzingEvent}
                selectedTab={selectedTab}
                viewMode={viewMode}
                setSelectedTab={setSelectedTab}
                setViewMode={setViewMode}
                locationDisplay={locationDisplay}
                showLocationToast={showLocationToast}
                events={allEvents}
                error={error}
                setError={setError}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
              />
              {/* Right Panel - Events Display */}
              <EventsRightPanel
                viewMode={viewMode}
                events={allEvents}
                filteredEvents={filteredEvents}
                currentDate={currentDate}
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
                handleToggleBookmark={handleToggleBookmark}
                handleClearAllEvents={handleClearAllEvents}
                handleMonthChange={handleMonthChange}
                selectedTab={selectedTab}
                selectedType={selectedType}
                setSelectedTab={setSelectedTab}
                setSelectedType={setSelectedType}
                handleDeleteEvent={handleDeleteEvent}
                handleRenameEvent={handleRenameEvent}
                setShowTimingOptions={setShowTimingOptions}
                userId={user?.id}
              />
            </div>
          </div>
        </section>

      </main>

      {/* Confirmation Toast */}
      <ConfirmationToast
        title={confirmationToast.title}
        message={confirmationToast.message}
        isVisible={confirmationToast.isVisible}
        onConfirm={confirmationToast.onConfirm}
        onCancel={hideConfirmation}
        confirmText={confirmationToast.confirmText}
        cancelText={confirmationToast.cancelText}
        confirmButtonColor={confirmationToast.confirmButtonColor}
      />

      {/* Status Toast - positioned at bottom right */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
        duration={statusToast.duration}
        showProgress={statusToast.showProgress}
        progress={statusToast.progress}
      />

      {/* Location Request Toast */}
      <LocationRequestToast
        isVisible={isLocationToastVisible}
        onHide={hideLocationToast}
        onLocationSet={(locationData) => {
          setLocation(locationData);
          showSuccess(
            'Location Set',
            `Using ${locationData.name} for astrological calculations`,
            3000
          );
        }}
        onRequestPermission={async () => {
          try {
            await requestLocationPermission();
            showSuccess(
              'Location Detected',
              `Using your current location for astrological calculations`,
              3000
            );
          } catch (error) {
            showError(
              'Location Error',
              'Unable to get your current location. Please search for your city instead.',
              5000
            );
          }
        }}
      />
    </div>
  );
}