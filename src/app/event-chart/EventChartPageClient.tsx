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
import { ChartApiService } from '../../services/chartApiService';
import { GenerateChartRequest } from '../../types/chart';
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
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Generate chart when dependencies change
  useEffect(() => {
    if (!eventDate || !user?.id || !user?.birthData || isGenerating) return;
    
    const generateEventChart = async () => {
      setIsGenerating(true);
      
      try {
        // Create direct API request for the event chart
        const requestData: GenerateChartRequest = {
          userId: user.id,
          subjectName: `${eventTitle} - ${eventDate}`,
          dateOfBirth: eventDate,        // Use EVENT date, not user's birth date
          timeOfBirth: selectedTime,     // Use EVENT time, not user's birth time
          locationOfBirth: user.birthData!.locationOfBirth,  // Use user's location
          coordinates: user.birthData!.coordinates,          // Use user's coordinates
          chartType: 'natal',
          forceRegenerate: true         // Always force regeneration for events
        };
        
        console.log('🚀 Generating EVENT chart directly (no cache):', {
          eventDate,
          selectedTime,
          location: user.birthData?.locationOfBirth
        });
        
        // Call API directly, bypassing all chart caching systems
        const result = await ChartApiService.generateChart(requestData);
        
        if (result?.success && result?.chart) {
          // Debug: Log the actual API response structure
          console.log('🔍 API Response structure:', {
            hasChart: !!result.chart,
            chartDataType: typeof result.chart.chartData,
            chartDataLength: result.chart.chartData?.length,
            chartDataPreview: result.chart.chartData?.substring(0, 100),
            metadataType: typeof result.chart.metadata,
            metadataKeys: result.chart.metadata ? Object.keys(result.chart.metadata) : null,
            metadataContent: result.chart.metadata
          });
          
          // Transform API response to expected format for EventChartContainer
          const transformedChartData = {
            svg: result.chart.chartData, // The SVG is stored in chartData field
            metadata: {
              chartData: result.chart.metadata.chartData // Extract the actual chart data from metadata
            }
          };
          
          console.log('🔍 Transformed chart data:', {
            hasSvg: !!transformedChartData.svg,
            svgLength: transformedChartData.svg?.length,
            hasMetadata: !!transformedChartData.metadata,
            hasChartData: !!transformedChartData.metadata?.chartData,
            chartDataKeys: transformedChartData.metadata?.chartData ? Object.keys(transformedChartData.metadata.chartData) : null,
            planetsCount: transformedChartData.metadata?.chartData?.planets?.length,
            aspectsCount: transformedChartData.metadata?.chartData?.aspects?.length
          });
          
          setChartData(transformedChartData);
          clearErrorIfVisible();
          console.log('✅ Event chart generated successfully');
        } else {
          throw new Error('Invalid chart data received from API');
        }
      } catch (error) {
        console.error('❌ Event chart generation failed:', error);
        showError(
          'Event Chart Generation Failed',
          error instanceof Error ? error.message : 'Unable to generate event chart. Please try again.'
        );
        setChartData(null);
      } finally {
        setIsGenerating(false);
      }
    };

    generateEventChart();
  }, [eventDate, eventTitle, selectedTime, user?.id, user?.birthData?.locationOfBirth, user?.birthData?.coordinates?.lat, user?.birthData?.coordinates?.lon, showError, clearErrorIfVisible]);

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