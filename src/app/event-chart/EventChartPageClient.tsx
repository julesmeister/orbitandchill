/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';

// Extend window for loop detection
declare global {
  interface Window {
    lastChartGeneration?: number;
  }
}
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useEventsStore } from '../../store/eventsStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useEventLoader } from '../../hooks/useEventLoader';
import { useEventBookmark } from '../../hooks/useEventBookmark';
import { useTimeNavigation } from '../../hooks/useTimeNavigation';
import StatusToast from '../../components/reusable/StatusToast';
import { findExistingEvent } from '../../utils/eventUtils';
import { parseEventParams } from '../../utils/urlParams';
import { buildChartParameters } from '../../utils/chartGeneration';
import { validateEventChartProps } from '../../utils/uiHelpers';
import EventHeader from '../../components/events/EventHeader';
import EventTimePicker from '../../components/events/EventTimePicker';
import EventChartContainer from '../../components/events/EventChartContainer';
import ChartLoadingDisplay from '../../components/events/ChartLoadingDisplay';
import ErrorStateDisplay from '../../components/events/ErrorStateDisplay';

function EventChartContent() {
  const searchParams = useSearchParams();
  const {
    date: eventDate,
    time: eventTime,
    title: eventTitle,
    isOptimal,
    optimalScore,
    startTime,
    endTime,
    duration
  } = parseEventParams(searchParams);

  const { user } = useUserStore();
  const { getAllEvents } = useEventsStore();
  const { generateChart, isGenerating } = useNatalChart();

  // Find if this event is already in the events store  
  const existingEvent = eventDate ? findExistingEvent(Object.values(getAllEvents()), eventDate, eventTime, eventTitle) : undefined;

  // Custom hooks
  const { errorToast, showError, hideError, clearErrorIfVisible } = useErrorToast();
  
  const { eventFromDb, loadingEvent, isBookmarked } = useEventLoader({
    eventDate,
    eventTime,
    eventTitle,
    userId: user?.id,
    existingEvent,
    allEvents: getAllEvents()
  });

  const [eventFromDbState, setEventFromDbState] = useState<any>(null);

  // Update local state when eventFromDb changes
  useEffect(() => {
    setEventFromDbState(eventFromDb);
  }, [eventFromDb]);

  const { handleBookmarkToggle } = useEventBookmark({
    userId: user?.id,
    existingEvent,
    eventFromDb: eventFromDbState,
    setEventFromDb: setEventFromDbState,
    eventDate,
    eventTime,
    eventTitle,
    isOptimal,
    optimalScore
  });

  const {
    selectedTime,
    setSelectedTime,
    minuteIncrement,
    handleNavigateMinutes,
    updateMinuteIncrement,
    getCurrentMinutes
  } = useTimeNavigation({
    initialTime: eventTime
  });

  const [chartData, setChartData] = useState<{ svg: string; metadata?: { chartData?: import('../../utils/natalChart').NatalChartData } } | null>(null);

  // Use refs to avoid function dependencies causing loops
  const generateChartRef = useRef(generateChart);
  const showErrorRef = useRef(showError);
  const clearErrorIfVisibleRef = useRef(clearErrorIfVisible);

  // Update refs when functions change
  useEffect(() => {
    generateChartRef.current = generateChart;
    showErrorRef.current = showError;
    clearErrorIfVisibleRef.current = clearErrorIfVisible;
  });

  // Generate chart for the event date and time
  useEffect(() => {
    // Add client-side loop detection
    const now = Date.now();
    const lastCall = window.lastChartGeneration || 0;
    
    if (now - lastCall < 2000) {
      console.warn('🔄 CLIENT LOOP DETECTED - Skipping chart generation', {
        timeSinceLastCall: now - lastCall,
        dependencies: { eventDate, eventTitle, selectedTime, hasBirthData: !!user?.birthData }
      });
      return;
    }
    
    if (!eventDate || !user || !user.birthData) return;
    
    window.lastChartGeneration = now;

    const executeChartGeneration = async () => {
      try {
        // TypeScript needs explicit assertion since the check is in outer scope
        if (!user.birthData) return;
        
        const chartParams = buildChartParameters({
          eventTitle,
          eventDate,
          selectedTime,
          userBirthData: user.birthData
        });

        const chartResult = await generateChartRef.current(chartParams, true); // Force regeneration for different times
        setChartData(chartResult);

        // Clear any previous errors
        clearErrorIfVisibleRef.current();
      } catch (error) {
        // Show error toast
        showErrorRef.current(
          'Chart Generation Failed',
          error instanceof Error ? error.message : 'Unable to generate chart. Please check your birth data and try again.'
        );

        // Clear the chart data to show the placeholder
        setChartData(null);
      }
    };

    executeChartGeneration();
  }, [eventDate, eventTitle, selectedTime, user, user?.birthData]);

  // Validate props early
  const validation = validateEventChartProps(eventDate, user);
  if (!validation.isValid) {
    return <ErrorStateDisplay errorMessage={validation.error || ""} />;
  }

  // At this point, validation passed, so eventDate is guaranteed to be valid
  const validEventDate = eventDate!;

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <EventHeader
            eventTitle={eventTitle}
            eventDate={validEventDate}
            selectedTime={selectedTime}
            isOptimal={isOptimal}
            optimalScore={optimalScore}
            isBookmarked={isBookmarked}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </div>

        {/* Time Picker */}
        <div className="mb-8">
          <EventTimePicker
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            minuteIncrement={minuteIncrement}
            onMinuteIncrementChange={updateMinuteIncrement}
            onNavigateMinutes={handleNavigateMinutes}
            isOptimal={isOptimal}
            eventTime={eventTime}
            startTime={startTime}
            endTime={endTime}
            duration={duration}
          />
        </div>

        {/* Chart Display */}
        {isGenerating ? (
          <ChartLoadingDisplay
            eventDate={validEventDate}
            selectedTime={selectedTime}
          />
        ) : (
          <EventChartContainer
            chartData={chartData}
            eventTitle={eventTitle}
            eventDate={validEventDate}
            selectedTime={selectedTime}
            userBirthData={user?.birthData}
          />
        )}
      </div>

      {/* Error Toast */}
      <StatusToast
        title={errorToast.title}
        message={errorToast.message}
        status="error"
        isVisible={errorToast.isVisible}
        onHide={hideError}
        duration={6000} // Auto-hide after 6 seconds
      />
    </div>
  );
}

export default function EventChartPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <EventChartContent />
    </Suspense>
  );
}