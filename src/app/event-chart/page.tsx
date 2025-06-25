"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '../../store/userStore';
import { useEventsStore } from '../../store/eventsStore';
import { useChartTab } from '../../store/chartStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import NatalChartDisplay from '../../components/charts/NatalChartDisplay';
import InterpretationSidebar from '../../components/charts/InterpretationSidebar';
import StatusToast from '../../components/reusable/StatusToast';
import {
  navigateTime,
  validateMinuteIncrement,
  formatTime12Hour,
  extractMinutes
} from '../../utils/timeNavigation';
import {
  createNewBookmarkedEvent,
  findExistingEvent,
  formatEventDate,
  generateEventChartName
} from '../../utils/eventUtils';
import { getDefaultTimeOptions } from '../../utils/timeOptions';
import { parseEventParams } from '../../utils/urlParams';
import { 
  buildChartParameters, 
  createChartShareData, 
  generateBirthDataForChart 
} from '../../utils/chartGeneration';
import { createLoadingContent, validateEventChartProps } from '../../utils/uiHelpers';
import EventHeader from '../../components/events/EventHeader';
import EventTimePicker from '../../components/events/EventTimePicker';

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
  const { events, toggleBookmark } = useEventsStore();
  const { activeTab } = useChartTab();
  const { generateChart, isGenerating } = useNatalChart();

  const [selectedTime, setSelectedTime] = useState(eventTime);
  const [chartData, setChartData] = useState<{ svg: string; metadata?: { chartData?: import('../../utils/natalChart').NatalChartData } } | null>(null);
  
  // Error handling state
  const [errorToast, setErrorToast] = useState({
    isVisible: false,
    title: '',
    message: ''
  });

  // Minute increment/decrement value
  const [minuteIncrement, setMinuteIncrement] = useState(5);

  // Navigate minutes with left/right controls using the increment value
  const handleNavigateMinutes = (direction: 'prev' | 'next') => {
    const newTime = navigateTime(selectedTime, minuteIncrement, direction);
    setSelectedTime(newTime);
  };

  // Update the minute increment value
  const updateMinuteIncrement = (newIncrement: string) => {
    const validIncrement = validateMinuteIncrement(newIncrement);
    if (validIncrement !== null) {
      setMinuteIncrement(validIncrement);
    }
  };

  // Get current minutes for the increment input
  const getCurrentMinutes = () => extractMinutes(selectedTime);

  // Find if this event is already in the events store  
  const existingEvent = eventDate ? findExistingEvent(events, eventDate, eventTime, eventTitle) : undefined;
  const isBookmarked = existingEvent?.isBookmarked || false;

  const handleBookmarkToggle = () => {
    if (existingEvent) {
      toggleBookmark(existingEvent.id);
    } else if (eventDate) {
      // If event doesn't exist, add it as a new bookmarked event
      const newEvent = createNewBookmarkedEvent(eventTitle, eventDate, eventTime, isOptimal, optimalScore);
      useEventsStore.getState().addEvent(newEvent);
    }
  };

  const generateEventChart = useCallback(async () => {
    if (!eventDate || !user?.birthData) return;

    try {
      const chartParams = buildChartParameters({
        eventTitle,
        eventDate,
        selectedTime,
        userBirthData: user.birthData
      });

      const chartResult = await generateChart(chartParams, true); // Force regeneration for different times
      setChartData(chartResult);
      
      // Clear any previous errors
      if (errorToast.isVisible) {
        setErrorToast({ isVisible: false, title: '', message: '' });
      }
    } catch (error) {
      console.error('Error generating event chart:', error);
      
      // Show error toast
      setErrorToast({
        isVisible: true,
        title: 'Chart Generation Failed',
        message: error instanceof Error ? error.message : 'Unable to generate chart. Please check your birth data and try again.'
      });
      
      // Clear the chart data to show the placeholder
      setChartData(null);
    }
  }, [eventDate, eventTitle, selectedTime, user?.birthData, generateChart, errorToast.isVisible]);

  // Generate chart for the event date and time
  useEffect(() => {
    generateEventChart();
  }, [generateEventChart]);

  // Validate props early
  const validation = validateEventChartProps(eventDate, user);
  if (!validation.isValid) {
    return (
      <div className="bg-white">
        {/* Hero Section with Error State */}
        <section className="px-[5%] py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
                Event Chart Unavailable
              </h1>
              <p className="font-inter text-xl text-black/80 leading-relaxed max-w-2xl mx-auto">
                {validation.error || "We couldn't generate a chart for this event. Please check your birth data settings."}
              </p>
            </div>

            {/* Visual Indicator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border border-black mb-12">
              {/* Missing Data Indicator */}
              <div 
                style={{ backgroundColor: '#ff91e9' }}
                className="p-8 text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">
                  Birth Data
                </h3>
                <p className="font-inter text-sm text-white/90">
                  Required for chart generation
                </p>
              </div>

              {/* Configuration Indicator */}
              <div 
                style={{ backgroundColor: '#f2e356' }}
                className="p-8 text-center relative border-l border-r border-black"
              >
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">
                  Profile Setup
                </h3>
                <p className="font-inter text-sm text-black/80">
                  Complete your profile
                </p>
              </div>

              {/* Action Needed Indicator */}
              <div 
                style={{ backgroundColor: '#6bdbff' }}
                className="p-8 text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">
                  Event Selection
                </h3>
                <p className="font-inter text-sm text-white/90">
                  Choose from Events calendar
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/settings" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="font-space-grotesk">Complete Profile</span>
              </Link>
              
              <Link 
                href="/events" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span className="font-space-grotesk">Browse Events</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section 
          className="px-[5%] py-16"
          style={{ backgroundColor: '#f0e3ff' }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="font-space-grotesk text-3xl font-bold text-black text-center mb-12">
              Getting Started with Event Charts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 bg-white border border-black">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                  <span className="font-space-grotesk font-bold text-lg">1</span>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                  Add Birth Data
                </h3>
                <p className="font-inter text-sm text-black/80 leading-relaxed">
                  Go to Settings and enter your birth date, time, and location for accurate chart generation.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 bg-white border border-black">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                  <span className="font-space-grotesk font-bold text-lg">2</span>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                  Find Events
                </h3>
                <p className="font-inter text-sm text-black/80 leading-relaxed">
                  Visit the Events calendar to discover optimal timing for your activities and important decisions.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 bg-white border border-black">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                  <span className="font-space-grotesk font-bold text-lg">3</span>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                  Generate Charts
                </h3>
                <p className="font-inter text-sm text-black/80 leading-relaxed">
                  Click on any event to generate a detailed astrological chart for that specific moment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
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
          <div className="bg-white border border-black p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-black">
                {createLoadingContent(validEventDate, selectedTime, formatTime12Hour).message}
              </p>
            </div>
          </div>
        ) : chartData ? (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
              {/* Main Chart */}
              <div className="lg:col-span-4 border-black lg:border-r">
                <NatalChartDisplay
                  svgContent={chartData.svg}
                  chartName={generateEventChartName(eventTitle, validEventDate, selectedTime)}
                  birthData={generateBirthDataForChart(validEventDate, selectedTime, user?.birthData)}
                  chartData={chartData.metadata?.chartData}
                  onShare={() => {
                    const shareData = createChartShareData(eventTitle, validEventDate);
                    navigator.share?.(shareData);
                  }}
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 bg-white">
                {/* Event Info */}
                <div className="p-6 border-b border-black">
                  <h4 className="font-space-grotesk text-lg font-bold text-black mb-3">
                    Event Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="font-inter text-black">
                        {formatEventDate(validEventDate)} at {formatTime12Hour(selectedTime)}
                      </span>
                    </div>
                    {isOptimal && optimalScore && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-inter text-green-600">
                          Optimal Score: {optimalScore}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interpretation Sidebar - Only show when interpretation tab is active */}
                {activeTab === 'interpretation' && (
                  <InterpretationSidebar
                    onSectionClick={(sectionId) => {
                      // Scroll to section or handle section navigation
                      const element = document.getElementById(`section-${sectionId}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="border-t border-black"
                  />
                )}
              </div>
            </div>
        ) : (
          <div className="bg-white border border-black p-12">
            <div className="text-center">
              <p className="text-black">Click a time option above to generate the chart</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Toast */}
      <StatusToast
        title={errorToast.title}
        message={errorToast.message}
        status="error"
        isVisible={errorToast.isVisible}
        onHide={() => setErrorToast({ isVisible: false, title: '', message: '' })}
        duration={6000} // Auto-hide after 6 seconds
      />
    </div>
  );
}

export default function EventChartPage() {
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