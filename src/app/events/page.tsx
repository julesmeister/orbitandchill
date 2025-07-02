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
import ConfirmationToast from '../../components/reusable/ConfirmationToast';
import StatusToast from '../../components/reusable/StatusToast';
import LocationRequestToast from '../../components/reusable/LocationRequestToast';
import { useSharedLocation } from '../../hooks/useSharedLocation';
import { useEventsLimits } from '../../hooks/useEventsLimits';
import EventsLimitBanner from '../../components/events/EventsLimitBanner';
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
    addEvents,
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

  // Note: Month-based loading now handles preventing duplicate loads via caching

  // Set document title and meta tags for SEO
  useEffect(() => {
    document.title = `Astrological Events Dashboard | ${BRAND.name}`;
  }, []);

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
      // Load month events with new tab filter
      loadMonthEvents(user.id, currentDate.getMonth(), currentDate.getFullYear());
    }
  }, [selectedTab, user?.id, loadMonthEvents, currentDate]); // Reload when tab or user changes

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

  // Wrapper function to use the hook's generateOptimalTiming
  const handleGenerateOptimalTiming = async () => {
    // Check if user has reached their generation limit
    if (!eventsLimits.canGenerateEvents) {
      showError("Generation Limit Reached", eventsLimits.limitMessage || "You have reached your event generation limit");
      return;
    }

    if (selectedPriorities.length === 0) {
      showError("Missing Priorities", "Please select at least one priority to generate electional recommendations.");
      return;
    }

    // Check for location (birth data or manually set location)
    const locationData = getLocationForGeneration();
    if (!locationData) {
      showError("Location Required", "Please provide your location for accurate astrological calculations. You can either complete your birth data in your profile or set your current location.");
      showLocationToast();
      return;
    }

    // Show loading status with prominent bottom-right toast IMMEDIATELY
    showLoading("Generating Optimal Times", "Preparing to calculate astrological alignments...", true);
    updateProgress(5, "Initializing...");

    // Add a small delay to ensure toast appears before async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clear existing events but keep the form open to show loading state
    if (user?.id) {
      try {
        updateProgress(8, "Clearing existing events...");
        await clearGeneratedEvents(user.id, currentDate);
        updateProgress(15, "Existing events cleared...");
      } catch (clearError) {
        console.warn('Warning: Could not clear existing events:', clearError);
        updateProgress(15, "Proceeding with generation...");
        // Continue with generation even if clearing fails
      }
    }

    try {
      const { latitude, longitude, locationName } = locationData;

      updateProgress(20, `Starting astronomical calculations for ${locationName}...`);

      await generateOptimalTiming({
        latitude,
        longitude,
        currentDate,
        selectedPriorities,
        userId: user.id, // Add userId for database saving
        onEventsGenerated: async (newEvents) => {
          updateProgress(70, `Generated ${newEvents.length} optimal timing events...`);
          updateProgress(75, "Validating event data...");
          
          // Add detailed logging for debugging the validation issue
          console.log(`📋 About to save ${newEvents.length} events to database:`, {
            eventCount: newEvents.length,
            firstEvent: newEvents[0] ? {
              userId: newEvents[0].userId,
              title: newEvents[0].title?.substring(0, 30),
              date: newEvents[0].date,
              type: newEvents[0].type,
              hasDescription: !!newEvents[0].description
            } : null,
            allEventsValid: newEvents.every(e => e.userId && e.title && e.date && e.type && e.description)
          });
          
          updateProgress(80, "Saving events to database...");
          
          try {
            await addEvents(newEvents);
            updateProgress(95, "Events saved successfully...");
            
            setShowCalendar(true);
            setSelectedPriorities([]);
            setShowTimingOptions(false);
            
            updateProgress(100, "Complete!");
            
            // Check if there's a database warning from the store
            const { error: storeError } = useEventsStore.getState();
            
            // Show appropriate success/warning message
            setTimeout(() => {
              if (storeError && storeError.includes('database is unavailable')) {
                showInfo(
                  "Events Generated (Local Only)", 
                  `Successfully generated ${newEvents.length} optimal timing events for ${new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Note: Database is temporarily unavailable, so events are stored locally and may not persist between sessions.`,
                  8000 // Show longer for important info
                );
                // Clear the store error since we've shown it to the user
                setError(null);
              } else {
                showSuccess(
                  "Generation Complete!", 
                  `Successfully generated ${newEvents.length} optimal timing events for ${new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
                  4000 // Show for 4 seconds
                );
              }
            }, 500);
          } catch (saveError) {
            console.error('Error saving events to database:', saveError);
            updateProgress(85, "Warning: Events generated but not fully saved...");
            
            // Still show partial success but with warning
            setTimeout(() => {
              showError(
                "Partial Success", 
                `Events were generated but may not be fully saved: ${saveError instanceof Error ? saveError.message : 'Unknown error'}. Events are visible locally but may disappear on refresh.`,
                8000 // Show longer for important warning
              );
            }, 500);
          }
        }
      });
    } catch (error) {
      console.error('Error in optimal timing generation:', error);
      showError(
        "Generation Failed", 
        error instanceof Error ? error.message : 'Error calculating electional recommendations. Please try again.',
        6000 // Show error longer
      );
      // Keep form open on error so user can try again
    }
  };


  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    // Check if user has reached their storage limit
    if (!eventsLimits.canAddMoreEvents) {
      showError("Storage Limit Reached", "You have reached your event storage limit. Delete some events or upgrade to premium for unlimited storage.");
      return;
    }

    console.log('🚀 Starting manual event creation:', {
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      description: newEvent.description,
      userId: user?.id
    });

    // Check for location
    const locationData = getLocationForGeneration();
    if (!locationData) {
      showError("Location Required", "Please provide your location for accurate astrological analysis. You can either complete your birth data in your profile or set your current location.");
      showLocationToast();
      return;
    }

    try {
      const { latitude, longitude } = locationData;

      const analyzedEvent = await analyzeManualEvent({
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
        latitude,
        longitude
      });

      console.log('📊 Analyzed event data:', analyzedEvent);

      // Add userId to the event before saving
      const eventWithUserId = {
        ...analyzedEvent,
        userId: user?.id || 'anonymous'
      };

      console.log('💾 Event to be saved:', {
        ...eventWithUserId,
        isGenerated: eventWithUserId.isGenerated,
        userId: eventWithUserId.userId
      });

      await addEvent(eventWithUserId);
      
      console.log('✅ Event saved successfully, now updating UI...');
      
      // Reset form and hide it
      setNewEvent({ title: '', date: '', time: '', description: '' });
      setShowAddForm(false);
      
      // Hide calendar
      setShowCalendar(false);
      
      // Switch to manual events tab to show the newly added event
      console.log('🔄 Switching to manual tab and reloading events...');
      setSelectedTab('manual');
      
      // Force reload events after a short delay to ensure database save is complete
      setTimeout(async () => {
        if (user?.id) {
          console.log('🔄 Force reloading events after manual event creation...');
          await useEventsStore.getState().loadEvents(user.id);
          console.log('📊 Events after reload:', useEventsStore.getState().events.length);
          
          // Scroll to EventsTable
          const eventsTable = document.querySelector('[data-events-table]');
          if (eventsTable) {
            eventsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Error creating event:', error);
      // Fallback to basic event if analysis fails
      const basicEvent: AstrologicalEvent = {
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time || '12:00',
        type: 'neutral',
        description: newEvent.description || 'Manual event',
        aspects: [],
        planetaryPositions: [],
        score: 5,
        isGenerated: false,
        createdAt: new Date().toISOString()
      };

      console.log('🔄 Using fallback basic event:', {
        ...basicEvent,
        isGenerated: basicEvent.isGenerated,
        userId: basicEvent.userId
      });

      await addEvent(basicEvent);
      
      console.log('✅ Fallback event saved successfully, now updating UI...');
      
      // Reset form and hide it
      setNewEvent({ title: '', date: '', time: '', description: '' });
      setShowAddForm(false);
      
      // Hide calendar
      setShowCalendar(false);
      
      // Switch to manual events tab to show the newly added event
      console.log('🔄 Switching to manual tab and reloading events...');
      setSelectedTab('manual');
      
      // Force reload events after a short delay to ensure database save is complete
      setTimeout(async () => {
        if (user?.id) {
          console.log('🔄 Force reloading events after fallback event creation...');
          await useEventsStore.getState().loadEvents(user.id);
          console.log('📊 Events after reload:', useEventsStore.getState().events.length);
          
          // Scroll to EventsTable
          const eventsTable = document.querySelector('[data-events-table]');
          if (eventsTable) {
            eventsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 500);
    }
  };

  // Wrapper functions that include userId
  const handleDeleteEvent = async (id: string) => {
    if (!user?.id) {
      showError("No User", "Please ensure you have a valid user session before deleting events.");
      return;
    }

    // Find the event to get its title for the confirmation
    const eventToDelete = events.find(e => e.id === id);
    const eventTitle = eventToDelete?.title || 'this event';

    showConfirmation({
      title: "Delete Event",
      message: `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
      confirmText: "Delete Event",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        console.log('🗑️ Deleting event:', id);
        
        // Show loading status
        showLoading("Deleting Event", "Removing event from your calendar...");
        
        try {
          await deleteEvent(id, user.id);
          console.log('✅ Event deleted successfully');
          
          // Show success message
          showSuccess(
            "Event Deleted",
            "The event has been successfully removed from your calendar.",
            3000
          );
        } catch (error) {
          console.error('❌ Error deleting event:', error);
          showError(
            "Delete Failed",
            `Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            5000
          );
        }
      }
    });
  };

  const handleToggleBookmark = async (id: string) => {
    if (!user?.id) {
      showInfo(
        "Sign In Required", 
        "Please complete your profile or sign in to bookmark events. Your bookmarks will be saved and synced across devices.",
        5000
      );
      return;
    }

    // Check bookmark limits before proceeding
    const event = events.find(e => e.id === id);
    if (event && !event.isBookmarked && !eventsLimits.canBookmarkMore) {
      showError("Bookmark Limit Reached", "You have reached your bookmark limit. Remove some bookmarks or upgrade to premium for unlimited bookmarks.");
      return;
    }
    
    try {
      await toggleBookmark(id, user.id);
      
      // Find the event to provide specific feedback
      const event = events.find(e => e.id === id);
      const eventTitle = event?.title || 'event';
      const isBookmarked = event?.isBookmarked;
      
      // Show success feedback
      showSuccess(
        isBookmarked ? "Bookmark Removed" : "Bookmark Added",
        isBookmarked 
          ? `"${eventTitle}" has been removed from your bookmarks.`
          : `"${eventTitle}" has been bookmarked. Find it in the Bookmarked tab.`,
        3000
      );
    } catch (error) {
      console.error('❌ Error toggling bookmark:', error);
      showError(
        "Bookmark Failed",
        `Unable to bookmark this event: ${error instanceof Error ? error.message : 'Please try again.'}`,
        4000
      );
    }
  };

  const handleRenameEvent = async (id: string, newTitle: string) => {
    await updateEvent(id, { title: newTitle });
  };

  // Handle month changes from calendar navigation
  const handleMonthChange = useCallback(async (month: number, year: number) => {
    if (user?.id) {
      console.log(`📅 Month changed to ${month + 1}/${year}, loading events...`);
      await loadMonthEvents(user.id, month, year);
    }
  }, [user?.id, loadMonthEvents]);

  const handleClearAllEvents = () => {
    console.log('🔄 handleClearAllEvents called, user:', user?.id);
    
    if (!user?.id) {
      console.error('❌ No user ID available for clearing events');
      showError("No User", "Please ensure you have a valid user session before clearing events.");
      return;
    }
    
    showConfirmation({
      title: "Clear Generated Events",
      message: "This will remove all AI-generated astrological events from your calendar, including those with planetary names (Jupiter, Venus, etc.) in the title. Your manually created events and bookmarked events will be preserved. This action cannot be undone.",
      confirmText: "Clear Generated Events",
      cancelText: "Cancel",
      confirmButtonColor: "red",
      onConfirm: async () => {
        console.log('🔄 Confirmation accepted, clearing events for user:', user?.id);
        
        // Show loading status
        showLoading("Clearing Events", "Removing generated events from your calendar...");
        
        if (user?.id) {
          try {
            console.log('🔄 About to call clearGeneratedEvents...');
            await clearGeneratedEvents(user.id);
            console.log('✅ clearGeneratedEvents completed successfully');
            
            // Force reload current month after clearing
            console.log('🔄 Reloading current month events after clear...');
            console.log('🔍 About to reload month events for user ID:', user.id);
            await loadMonthEvents(user.id, currentDate.getMonth(), currentDate.getFullYear());
            console.log('✅ Month events reloaded after clear');
            console.log('📊 Events count after reload:', events.length);
            
            // Show success message with more detail
            showSuccess(
              "Events Cleared Successfully", 
              "All generated astrological events have been removed from your calendar. Your manual events and bookmarks are still safe.",
              4000
            );
          } catch (error) {
            console.error('❌ clearGeneratedEvents failed:', error);
            showError(
              "Clear Failed", 
              `Failed to clear events: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
              6000
            );
          }
        }
      }
    });
  };


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
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <main className="bg-white">
        {/* Hero Section */}
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header with Location */}
            <div className="text-center mb-8">
              <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-4">
                Electional Astrology
              </h1>
              <p className="font-inter text-lg text-black/70 leading-relaxed mb-6">
                Find the most auspicious times for your important life events. Generate personalized timing recommendations based on your birth chart and current planetary conditions.
              </p>
              
              {/* Location Display */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <span>
                  {locationDisplay.source === 'current' ? '📍' : 
                   locationDisplay.source === 'birth' ? '🏠' : '🏙️'}
                </span>
                <span className="text-black/70">
                  Location: <span className="font-medium text-black">
                    {locationDisplay.shortName}
                  </span>
                </span>
                {locationDisplay.source !== 'current' && (
                  <span className="text-xs text-black/40">
                    ({locationDisplay.source === 'birth' ? 'birth' : 'default'})
                  </span>
                )}
                <button
                  onClick={showLocationToast}
                  className="ml-1 p-1 text-black/40 hover:text-black hover:bg-gray-200 rounded transition-all duration-200"
                  title="Change location"
                >
                  ⚙️
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <button
                onClick={() => {
                  setShowTimingOptions(!showTimingOptions);
                  if (!showTimingOptions) {
                    setTimeout(() => {
                      const element = document.querySelector('[data-timing-options]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                disabled={isTimingGenerating}
                className={`inline-flex items-center gap-2 px-6 py-3 font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${showTimingOptions
                    ? 'bg-transparent text-black hover:bg-black hover:text-white'
                    : 'bg-black text-white hover:shadow-lg'
                  }`}
              >
                <span>✨</span>
                {showTimingOptions ? 'Hide' : 'Generate'} Optimal Times
              </button>
              
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (!showAddForm) {
                    setTimeout(() => {
                      const element = document.querySelector('[data-add-form]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                className={`inline-flex items-center gap-2 px-6 py-3 font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 ${showAddForm
                    ? 'bg-black text-white hover:shadow-lg'
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                  }`}
              >
                <span>📅</span>
                {showAddForm ? 'Hide' : 'Add'} Manual Event
              </button>
              
              <button
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  if (!showCalendar) {
                    setTimeout(() => {
                      const element = document.querySelector('[data-calendar]');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                className={`inline-flex items-center gap-2 px-6 py-3 font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 ${showCalendar
                    ? 'bg-black text-white hover:shadow-lg'
                    : 'bg-transparent text-black hover:bg-black hover:text-white'
                  }`}
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-current animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-current animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-current animate-bounce"></div>
                    </div>
                    Loading...
                  </>
                ) : (
                  <>
                    <span>📅</span>
                    {showCalendar ? 'Hide' : 'Show'} Calendar
                  </>
                )}
              </button>
            </div>

            {/* Next Bookmarked Event Countdown */}
            <NextBookmarkedEventCountdown 
              events={events} 
              currentLocationData={locationDisplay.isUserSet ? {
                name: locationDisplay.name,
                coordinates: locationDisplay.coordinates
              } : null}
              birthLocationData={user?.birthData ? {
                name: user.birthData.locationOfBirth || 'Your Birth Location',
                coordinates: user.birthData.coordinates
              } : null}
              onEditLocation={showLocationToast}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-inter text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Events Limit Banner for Free Users */}
        <section className="px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <EventsLimitBanner />
          </div>
        </section>

        {/* Timing Options Form */}
        {showTimingOptions && (
          <section
            className="px-6 md:px-12 lg:px-20 py-8"
            style={{ backgroundColor: '#6bdbff' }}
            data-timing-options
          >
            <div>
              <div className="p-8 bg-white border border-black">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black">
                    Select Your Priorities
                  </h3>
                  <button
                    onClick={() => setShowTimingOptions(false)}
                    className="text-black hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>


                {/* Compact Priority Selection */}
                <div className="space-y-4">
                  <p className="text-sm text-black/70 font-inter">
                    Select your priorities for timing analysis (multiple selections allowed):
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {timingPriorities.map((priority) => (
                      <button
                        key={priority.id}
                        onClick={() => togglePriority(priority.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 border border-black transition-all duration-200 font-inter text-sm font-medium hover:shadow-sm ${selectedPriorities.includes(priority.id)
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-lg">{priority.icon}</span>
                        <span>{priority.label}</span>
                        {selectedPriorities.includes(priority.id) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedPriorities.length > 0 && (
                    <div className="bg-gray-50 p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">Selected priorities:</p>
                      <div className="text-sm text-gray-800 space-y-1">
                        {selectedPriorities.map(id => {
                          const priority = timingPriorities.find(p => p.id === id);
                          return priority ? (
                            <div key={id} className="flex items-center gap-2">
                              <span>{priority.icon}</span>
                              <span className="font-medium">{priority.label}:</span>
                              <span className="text-gray-600">{priority.description}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleGenerateOptimalTiming}
                    disabled={selectedPriorities.length === 0 || isTimingGenerating}
                    className="flex-1 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTimingGenerating ? (
                      <>
                        <div className="flex items-center gap-1 mr-2">
                          <div className="w-2 h-2 bg-white animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-white animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-white animate-bounce"></div>
                        </div>
                        Generating...
                      </>
                    ) : (
                      'Generate Recommendations'
                    )}
                  </button>
                  <button
                    onClick={() => setShowTimingOptions(false)}
                    disabled={isTimingGenerating}
                    className="px-6 py-3 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Add Event Form */}
        {showAddForm && (
          <section
            className="px-6 md:px-12 lg:px-20 py-8"
            style={{ backgroundColor: '#f2e356' }}
            data-add-form
          >
            <div>
              <div className="p-8 bg-white border border-black">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black">
                    Add Manual Event
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-black hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-space-grotesk font-semibold text-black mb-2">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
                        placeholder="Enter event title..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-space-grotesk font-semibold text-black mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-space-grotesk font-semibold text-black mb-2">
                        Time (Optional)
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
                      />
                    </div>
                    <div>
                      <label className="block font-space-grotesk font-semibold text-black mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isAnalyzingEvent}
                      className="flex-1 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzingEvent ? (
                        <>
                          <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        'Add Event'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}


        {/* Main Content */}
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div>
            {/* Calendar View */}
            <div data-calendar>
              <EventsCalendar
                showCalendar={showCalendar}
                currentDate={currentDate}
                events={events}
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
                userId={user?.id}
                onMonthChange={handleMonthChange}
              />
            </div>

            {/* Events Table */}
            <div data-events-table>
              <EventsTable
              filteredEvents={filteredEvents}
              selectedTab={selectedTab}
              selectedType={selectedType}
              hideChallengingDates={hideChallengingDates}
              showCombosOnly={showCombosOnly}
              events={events}
              currentUserId={user?.id}
              setSelectedTab={setSelectedTab}
              setSelectedType={setSelectedType}
              toggleBookmark={handleToggleBookmark}
              deleteEvent={handleDeleteEvent}
              renameEvent={handleRenameEvent}
              handleEventClick={handleEventClick}
              />
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <EventsEmptyState
                selectedTab={selectedTab}
                selectedType={selectedType}
                isProfileComplete={isProfileComplete}
                setShowAddForm={setShowAddForm}
                setShowTimingOptions={setShowTimingOptions}
              />
            )}
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