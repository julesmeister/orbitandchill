 
"use client";

import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { AstrologicalEvent } from '../utils/astrologicalEventDetection';
import { useAstrologicalEvents } from '../hooks/useAstrologicalEvents';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { useSharedLocation } from '../hooks/useSharedLocation';
import { useVoidMoonStatus } from '../hooks/useVoidMoonStatus';
import EventCard from './events/EventCard';
import CalendarEventItem from './events/CalendarEventItem';
import LocationRequestToast from './reusable/LocationRequestToast';
import StatusToast from './reusable/StatusToast';
import PlanetaryHours from './PlanetaryHours';

// AstrologicalEvent interface is now imported from utils

// Use centralized dictionaries and all event detection functions are now in separate modules

export default function AstrologicalEvents() {
  // Component state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'calendar' | 'planetaryHours'>('upcoming');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Location management hooks
  const { voidStatus } = useVoidMoonStatus();
  const {
    isLocationToastVisible,
    showLocationToast,
    hideLocationToast,
    requestLocationPermission,
    locationDisplay
  } = useSharedLocation();

  // Status toast state
  const [toast, setToast] = useState({
    title: '',
    message: '',
    status: 'info' as 'success' | 'error' | 'info' | 'loading',
    isVisible: false
  });

  // Toast helper functions
  const showToast = (title: string, message: string, status: 'success' | 'error' | 'info' | 'loading') => {
    setToast({ title, message, status, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Location setting with feedback
  const handleLocationSetWithFeedback = (location: any) => {
    showToast(
      'Location Updated',
      `Using ${location.name} for precise astronomical timing`,
      'success'
    );
    hideLocationToast();
  };

  // Use custom hooks for data management with location coordinates
  const locationCoordinates = locationDisplay?.coordinates ? {
    latitude: parseFloat(locationDisplay.coordinates.lat),
    longitude: parseFloat(locationDisplay.coordinates.lon)
  } : undefined;

  const {
    allEvents,
    isLoading,
    upcomingEvents,
    eventsByType,
    totalEventCount,
    mostCommonEventType,
    nextMajorEvent
  } = useAstrologicalEvents(locationCoordinates);

  // Use countdown timer hook
  const { countdowns } = useCountdownTimer(upcomingEvents, 60000);

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-20 px-[5%]">
      <div className="max-w-none mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-space-grotesk text-4xl lg:text-5xl font-bold text-black mb-4">
            Celestial Events
          </h2>
          <p className="font-open-sans text-lg text-black/80 max-w-3xl mx-auto mb-6">
            Track upcoming astrological phenomena, from eclipses and retrogrades to rare planetary alignments.
            Never miss a cosmic moment.
          </p>

          {/* Location Display */}
          <div className="flex items-center justify-center gap-2 text-sm text-black/60">
            <span>📍</span>
            <span>
              {locationDisplay ? (
                <>Times shown for <strong>{locationDisplay.name}</strong></>
              ) : (
                <>
                  Using default location -
                  <button
                    onClick={showLocationToast}
                    className="ml-1 underline hover:text-black transition-colors"
                  >
                    set your location
                  </button> for precise timing
                </>
              )}
            </span>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Primary Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 font-space-grotesk font-bold text-sm transition-colors ${activeTab === 'upcoming'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
              📅 Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 font-space-grotesk font-bold text-sm transition-colors ${activeTab === 'calendar'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
              🗓️ Calendar View
            </button>
            <button
              onClick={() => setActiveTab('planetaryHours')}
              className={`px-4 py-2 font-space-grotesk font-bold text-sm transition-colors ${activeTab === 'planetaryHours'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
              ⏰ Planetary Hours
            </button>
          </div>
        </div>

        {/* Secondary Type Filter Tabs */}
        {!isLoading && Object.keys(eventsByType).length > 0 && (
          <div className="mb-8">
            <div className="bg-white border border-black p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-black"></div>
                <span className="font-space-grotesk text-sm font-medium text-black">Filter by Event Type</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 border border-black ${selectedType === null
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-50'
                    }`}
                >
                  All Types
                </button>
                {Object.keys(eventsByType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-200 border border-black ${selectedType === type
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-50'
                      }`}
                  >
                    {(() => {
                      // Handle special cases and convert camelCase to readable text
                      let readable;
                      if (type === 'planetarySigns') {
                        readable = 'Planetary Signs';
                      } else {
                        readable = type
                          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                          .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                          .trim();
                      }
                      return `${readable} (${eventsByType[type]?.length || 0})`;
                    })()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce"></div>
              </div>
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
                Calculating Events
              </h2>
              <p className="font-open-sans text-black/70">
                Scanning 90 days of astronomical data for rare celestial phenomena...
              </p>
            </div>
          )}

          {/* Upcoming Events Tab */}
          {!isLoading && activeTab === 'upcoming' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filter events based on selectedType */}
              {(() => {
                const eventsToShow = selectedType
                  ? selectedType === 'planetarySigns'
                    ? upcomingEvents.filter(event => event.type === 'planetInSign' || event.type === 'planetSignChange')
                    : upcomingEvents.filter(event => event.type === selectedType)
                  : upcomingEvents;

                return eventsToShow.length > 0 ? (
                  eventsToShow.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showCountdown={true}
                      countdown={countdowns[event.id]}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="font-open-sans text-black/60 text-lg">
                      {selectedType
                        ? `No ${selectedType} events detected in the next 90 days.`
                        : 'No rare astronomical events detected in the next 90 days.'
                      }
                    </p>
                    <p className="font-open-sans text-black/40 text-sm mt-2">This indicates a relatively stable cosmic period.</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Calendar View Tab */}
          {!isLoading && activeTab === 'calendar' && (
            <div className="border border-black bg-white p-8">
              <div className="space-y-6">
                <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">
                  Next 30 Days
                </h3>

                {/* Timeline */}
                <div className="space-y-4">
                  {(() => {
                    const eventsToShow = selectedType
                      ? selectedType === 'planetarySigns'
                        ? upcomingEvents.filter(event => event.type === 'planetInSign' || event.type === 'planetSignChange')
                        : upcomingEvents.filter(event => event.type === selectedType)
                      : upcomingEvents;

                    return eventsToShow.length > 0 ? (
                      Array.from({ length: 30 }, (_, i) => {
                        const date = addDays(new Date(), i);
                        const dayEvents = eventsToShow.filter(event => {
                          const eventDateUTC = event.date.toISOString().split('T')[0];
                          const targetDateUTC = date.toISOString().split('T')[0];
                          
                          // For exact date matches
                          if (eventDateUTC === targetDateUTC) {
                            return true;
                          }
                          
                          // For ongoing events (retrogrades, stelliums, conjunctions), show them on current day if active
                          if (event.duration?.isOngoing && event.startDate && event.endDate) {
                            const startDateUTC = event.startDate.toISOString().split('T')[0];
                            const endDateUTC = event.endDate.toISOString().split('T')[0];
                            const today = new Date().toISOString().split('T')[0];
                            
                            // Show ongoing events on today's date (not every day in their range)
                            if (targetDateUTC === today && targetDateUTC >= startDateUTC && targetDateUTC <= endDateUTC) {
                              return true;
                            }
                            
                            // Also show when ongoing events end
                            if (targetDateUTC === endDateUTC) {
                              return true;
                            }
                          }
                          
                          return false;
                        });

                        if (dayEvents.length === 0) return null;

                        return (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-32 text-right">
                              <p className="font-space-grotesk font-bold text-black">
                                {date.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  timeZone: 'UTC'
                                })}
                              </p>
                              <p className="font-open-sans text-sm text-black/60">
                                {date.toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  timeZone: 'UTC'
                                })}
                              </p>
                            </div>
                            <div className="flex-1 space-y-2">
                              {dayEvents.map(event => (
                                <CalendarEventItem
                                  key={event.id}
                                  event={event}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <p className="font-open-sans text-black/60 text-lg">
                          {selectedType
                            ? `No ${selectedType} events detected in the next 30 days.`
                            : 'No astronomical events detected in the next 30 days.'
                          }
                        </p>
                        <p className="font-open-sans text-black/40 text-sm mt-2">This indicates a stable cosmic period with gentle planetary movements.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Planetary Hours Tab */}
          {!isLoading && activeTab === 'planetaryHours' && (
            <PlanetaryHours />
          )}
        </div>

        {/* Real-Time Cosmic Weather Report */}
        {!isLoading && (
          <div className="mt-12 border border-black bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">
              🌌 Real-Time Cosmic Weather
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Event Count</h4>
                <p className="font-open-sans text-black/80">
                  {totalEventCount} astronomical events detected in the next 90 days.
                </p>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Most Common Event</h4>
                <p className="font-open-sans text-black/80">
                  {mostCommonEventType
                    ? `${mostCommonEventType === 'planetarySigns' 
                        ? 'Planetary Signs' 
                        : mostCommonEventType
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim()
                      } events`
                    : 'Stable planetary period'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Next Major Event</h4>
                <p className="font-open-sans text-black/80">
                  {nextMajorEvent
                    ? `${nextMajorEvent.name} on ${nextMajorEvent.date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        timeZone: 'UTC'
                      })}`
                    : 'No major events approaching'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location Request Toast */}
        <LocationRequestToast
          isVisible={isLocationToastVisible}
          onHide={hideLocationToast}
          onLocationSet={handleLocationSetWithFeedback}
          onRequestPermission={async () => {
            try {
              await requestLocationPermission();
              showToast(
                'Location Detected',
                'Using your current location for precise astronomical timing',
                'success'
              );
            } catch (error) {
              showToast(
                'Location Error',
                'Unable to get your current location. Please search for your city instead.',
                'error'
              );
            }
          }}
        />

        {/* Status Toast */}
        <StatusToast
          title={toast.title}
          message={toast.message}
          status={toast.status}
          isVisible={toast.isVisible}
          onHide={hideToast}
          duration={toast.status === 'success' ? 3000 : toast.status === 'error' ? 5000 : 0}
        />
      </div>
    </section>
  );
}