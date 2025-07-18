/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo } from 'react';
import { useEventsStore } from '../store/eventsStore';
import { useUserStore } from '../store/userStore';
import { useEventFiltering } from './useEventFiltering';
import { useEventActions } from './useEventActions';
import { useEventNavigation } from './useEventNavigation';
import { useEventsLimits } from './useEventsLimits';
import { useOptimalTimingHandler } from './useOptimalTimingHandler';
import { useManualEventHandler } from './useManualEventHandler';

interface EventManagerOptions {
  currentDate: Date;
  locationForGeneration?: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  showError: (title: string, message: string, duration?: number) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showLoading: (title: string, message: string, persistent?: boolean) => void;
  updateProgress: (progress: number, message: string) => void;
  showLocationToast: () => void;
  showConfirmation: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'green' | 'blue';
  }) => void;
  setShowAddForm: (show: boolean) => void;
}

/**
 * Composite hook that consolidates all event-related functionality
 * This replaces the need for multiple individual hooks in components
 */
export const useEventManager = (options: EventManagerOptions) => {
  const { user } = useUserStore();
  const {
    getAllEvents,
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    selectedPriorities,
    setSelectedTab,
    setSelectedType,
    setHideChallengingDates,
    setShowCombosOnly,
    setShowHousesOnly,
    setShowAspectsOnly,
    setShowElectionalOnly,
    togglePriority,
    loadEvents,
    loadMonthEvents,
    isLoading,
    error,
    setError
  } = useEventsStore();

  // Get all events (memoized)
  const allEvents = useMemo(() => getAllEvents(), [getAllEvents]);

  // Event filtering with statistics
  const { filteredEvents, totalEvents, visibleEvents, filterStats } = useEventFiltering({
    events: allEvents,
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    searchQuery: '', // Default empty search - can be passed as parameter if needed
  });

  // Event actions
  const eventActions = useEventActions({
    onLocationRequired: options.showLocationToast,
    showConfirmation: options.showConfirmation,
  });

  // Event navigation
  const { navigateToEventChart } = useEventNavigation();

  // Limits and permissions
  const eventsLimits = useEventsLimits();

  // Event generation
  const { handleGenerateOptimalTiming } = useOptimalTimingHandler({
    selectedPriorities,
    locationForGeneration: options.locationForGeneration || null,
    currentDate: options.currentDate,
    userId: user?.id,
    showError: options.showError,
    showLoading: options.showLoading,
    showSuccess: options.showSuccess,
    updateProgress: options.updateProgress,
    showLocationToast: options.showLocationToast,
  });

  // Manual event handling
  const { handleAddEvent } = useManualEventHandler({
    locationForGeneration: options.locationForGeneration || null,
    userId: user?.id,
    showError: options.showError,
    showSuccess: options.showSuccess,
    resetForm: () => {}, // Will be provided by component
    setShowAddForm: options.setShowAddForm,
  });

  // Tab management with lazy loading
  const handleTabChange = useCallback((tab: 'all' | 'bookmarked' | 'manual') => {
    setSelectedTab(tab);
    
    // Lazy load data when switching tabs
    if (user?.id && !isLoading) {
      if (tab === 'bookmarked' || tab === 'manual') {
        loadEvents(user.id, tab);
      } else {
        loadMonthEvents(user.id, options.currentDate.getMonth(), options.currentDate.getFullYear());
      }
    }
  }, [user?.id, isLoading, options.currentDate, loadEvents, loadMonthEvents, setSelectedTab]);

  // Event statistics
  const eventStats = useMemo(() => ({
    ...filterStats,
    totalEvents,
    visibleEvents,
    averageScore: allEvents.reduce((sum, e) => sum + e.score, 0) / allEvents.length || 0,
    highScoreEvents: allEvents.filter(e => e.score >= 8).length,
    lowScoreEvents: allEvents.filter(e => e.score < 4).length,
  }), [filterStats, totalEvents, visibleEvents, allEvents]);

  // Filter management
  const filterControls = useMemo(() => ({
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    setSelectedType,
    setHideChallengingDates,
    setShowCombosOnly,
    setShowHousesOnly,
    setShowAspectsOnly,
    setShowElectionalOnly,
  }), [
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    setSelectedType,
    setHideChallengingDates,
    setShowCombosOnly,
    setShowHousesOnly,
    setShowAspectsOnly,
    setShowElectionalOnly,
  ]);

  // Generation controls
  const generationControls = useMemo(() => ({
    selectedPriorities,
    togglePriority,
    handleGenerateOptimalTiming,
    canGenerateEvents: eventsLimits.canGenerateEvents,
    limitMessage: eventsLimits.limitMessage,
  }), [
    selectedPriorities,
    togglePriority,
    handleGenerateOptimalTiming,
    eventsLimits.canGenerateEvents,
    eventsLimits.limitMessage,
  ]);

  return {
    // Core data
    allEvents,
    filteredEvents,
    isLoading,
    error,
    setError,

    // Event statistics
    eventStats,

    // Tab management
    selectedTab,
    handleTabChange,

    // Filter controls
    filterControls,

    // Generation controls
    generationControls,

    // Event actions
    eventActions,

    // Navigation
    navigateToEventChart,

    // Manual event handling
    handleAddEvent,

    // Limits
    eventsLimits,
  };
};

// Type for the return value
export type EventManagerHook = ReturnType<typeof useEventManager>;