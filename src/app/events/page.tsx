/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

// Remove duplicate interface - using from store

// Mock events moved to store

export default function EventsPage() {
  const router = useRouter();
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
    coordinates: locationDisplay.coordinates
  } : null;

  // Note: handleToggleBookmark is defined later in the component with full logic

  // Use events store for all state management
  const {
    events,
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

  // Cleanup old unbookmarked generated events on initial page load
  useEffect(() => {
    const cleanupOldGeneratedEvents = async () => {
      if (user?.id) {
        try {
          console.log('🧹 Cleaning up old unbookmarked generated events...');
          
          // Clear unbookmarked generated events from all months
          await clearGeneratedEvents(user.id);
          
          console.log('✅ Old generated events cleaned up successfully');
        } catch (error) {
          console.warn('⚠️ Could not clean up old generated events:', error);
          // Don't show error to user as this is a background cleanup
        }
      }
    };

    // Only run cleanup once when user is available
    if (user?.id) {
      cleanupOldGeneratedEvents();
    }
  }, [user?.id, clearGeneratedEvents]); // Only run when user changes

  // Load events for current month when user is available
  useEffect(() => {
    if (user?.id && !isLoading) {
      // Load events for the current month being displayed
      loadMonthEvents(user.id, currentDate.getMonth(), currentDate.getFullYear());
    }
  }, [user?.id, loadMonthEvents]); // Load when user changes

  // Reload events when tab changes to get properly filtered results
  useEffect(() => {
    if (user?.id) {
      // Load month events (but not when tab changes - tabs are just UI filters)
      loadMonthEvents(user.id, currentDate.getMonth(), currentDate.getFullYear());
    }
  }, [user?.id, loadMonthEvents, currentDate]); // Reload when user or month changes (not tab)

  // Calculate challenging events count
  const challengingEventsCount = events.filter(event => {
    const hasWarning = event.title.includes('⚠️');
    const hasLowScore = event.score < 4;
    const isChallengingType = event.type === 'challenging';
    return hasWarning || hasLowScore || isChallengingType;
  }).length;

  // Calculate combo events count (events with specific planetary combinations)
  const comboEventsCount = events.filter(event => {
    // Check if title contains the "&" symbol, which indicates a combo event
    return event.title.includes('&');
  }).length;

  // Calculate advanced filter counts
  const filterCounts = useMemo(() => {
    return calculateFilterCounts(events);
  }, [events]);

  const filteredEvents = events.filter(event => {
    // First filter by tab
    if (selectedTab === 'bookmarked' && !event.isBookmarked) return false;
    if (selectedTab === 'manual' && event.isGenerated) return false;
    if (selectedTab === 'generated' && !event.isGenerated) return false;

    // Filter by type
    if (selectedType !== 'all' && event.type !== selectedType) return false;

    // Filter out challenging dates if hide toggle is enabled
    if (hideChallengingDates) {
      // Hide events with warning symbols (challenging combos) or low scores or challenging type
      const hasWarning = event.title.includes('⚠️');
      const hasLowScore = event.score < 4;
      const isChallengingType = event.type === 'challenging';

      if (hasWarning || hasLowScore || isChallengingType) return false;
    }

    // Show only combo events if combo toggle is enabled
    if (showCombosOnly) {
      // Check if title contains the "&" symbol, which indicates a combo event
      return event.title.includes('&');
    }

    // Apply timing method filters
    if (showHousesOnly) {
      return event.timingMethod === 'houses';
    } else if (showAspectsOnly) {
      return event.timingMethod === 'aspects';
    } else if (showElectionalOnly) {
      return event.timingMethod === 'electional';
    }

    return true;
  });

  // Helper function to get location for events generation
  const getLocationForGeneration = () => {
    // If we have manually set location data, use it
    if (currentLocationData) {
      return {
        latitude: parseFloat(currentLocationData.coordinates.lat),
        longitude: parseFloat(currentLocationData.coordinates.lon),
        locationName: currentLocationData.name
      };
    }

    // If user has birth data, use it
    if (user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
      return {
        latitude: parseFloat(user.birthData.coordinates.lat),
        longitude: parseFloat(user.birthData.coordinates.lon),
        locationName: user.birthData.locationOfBirth || 'Your Birth Location'
      };
    }

    // No location available
    return null;
  };

  // Initialize hooks with proper dependencies
  const locationForGeneration = getLocationForGeneration();

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
    onLocationRequired: showLocationToast
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
      console.log(`📅 Month changed to ${month + 1}/${year}, loading events...`);
      await loadMonthEvents(user.id, month, year);
    }
  }, [user?.id, loadMonthEvents]);



  const handleEventClick = (event: AstrologicalEvent) => {
    const params = new URLSearchParams({
      date: event.date,
      time: event.time || '12:00',
      title: event.title,
      isOptimal: event.isGenerated ? 'true' : 'false',
      score: event.score.toString()
    });

    // Add time window information if available
    if (event.timeWindow) {
      params.set('startTime', event.timeWindow.startTime);
      params.set('endTime', event.timeWindow.endTime);
      params.set('duration', event.timeWindow.duration);
    }

    router.push(`/event-chart?${params.toString()}`);
  };



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
                events={events}
                error={error}
                setError={setError}
              />
              {/* Right Panel - Events Display */}
              <EventsRightPanel
                viewMode={viewMode}
                events={events}
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