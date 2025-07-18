import { useCallback } from 'react';
import { useEventsStore } from '../store/eventsStore';
import { useEventsLimits } from './useEventsLimits';
import { useOptimalTiming } from './useOptimalTiming';

interface LocationData {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface UseOptimalTimingHandlerProps {
  selectedPriorities: string[];
  locationForGeneration: LocationData | null;
  currentDate: Date;
  userId?: string;
  showError: (title: string, message: string) => void;
  showLoading: (title: string, message: string, persistent?: boolean) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  updateProgress: (progress: number, message: string) => void;
  showLocationToast: () => void;
}

export const useOptimalTimingHandler = ({
  selectedPriorities,
  locationForGeneration,
  currentDate,
  userId,
  showError,
  showLoading,
  showSuccess,
  updateProgress,
  showLocationToast
}: UseOptimalTimingHandlerProps) => {
  const eventsLimits = useEventsLimits();
  const { generateOptimalTiming } = useOptimalTiming();
  const { clearGeneratedEvents, addEventsLocal } = useEventsStore();

  const handleGenerateOptimalTiming = useCallback(async () => {
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
    if (!locationForGeneration) {
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
    if (userId) {
      try {
        updateProgress(8, "Clearing existing events...");
        await clearGeneratedEvents(userId, new Date(currentDate));
        updateProgress(15, "Existing events cleared...");
      } catch (clearError) {
        console.warn('Warning: Could not clear existing events:', clearError);
        updateProgress(15, "Proceeding with generation...");
        // Continue with generation even if clearing fails
      }
    }

    try {
      const { latitude, longitude, locationName } = locationForGeneration;
      
      // Generate optimal timing events with real-time callback
      let generatedEvents: any[] = [];
      
      await generateOptimalTiming({
        latitude,
        longitude,
        userId: userId || '',
        selectedPriorities,
        currentDate: currentDate,
        onProgress: updateProgress, // Pass the progress callback!
        onEventGenerated: async (newEvent) => {
          // Real-time event addition callback - local only during generation
          console.log('🎯 Real-time event generated:', newEvent.title);
          addEventsLocal([newEvent]);
          console.log('📊 Current events count after add:', useEventsStore.getState().getAllEvents().length);
        },
        onEventsGenerated: async (events) => {
          // Final batch completion callback
          generatedEvents = events;
          updateProgress(95, "Finalizing events...");
          
          // Scroll to events table after generation
          setTimeout(() => {
            const eventsTable = document.querySelector('[data-events-table]');
            if (eventsTable) {
              eventsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }
      });

      // Check if we have database errors but events were generated
      const { error: storeError } = useEventsStore.getState();
      if (storeError && generatedEvents && Array.isArray(generatedEvents) && generatedEvents.length > 0) {
        showSuccess(
          "Generated Successfully (Local Storage)",
          `Successfully generated ${generatedEvents.length} optimal timing events for ${new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Note: Database is temporarily unavailable, so events are stored locally and may not persist between sessions.`,
          8000
        );
      } else if (generatedEvents && Array.isArray(generatedEvents) && generatedEvents.length > 0) {
        showSuccess(
          "Generated Successfully",
          `Successfully generated ${generatedEvents.length} optimal timing events for ${new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
          5000
        );
      }
    } catch (error) {
      console.error('Error generating optimal timing:', error);
      showError(
        "Generation Failed",
        error instanceof Error ? error.message : "An unexpected error occurred while generating optimal timing recommendations."
      );
    }
  }, [
    eventsLimits.canGenerateEvents,
    eventsLimits.limitMessage,
    selectedPriorities,
    locationForGeneration,
    currentDate,
    userId,
    generateOptimalTiming,
    clearGeneratedEvents,
    addEventsLocal,
    showError,
    showLoading,
    showSuccess,
    updateProgress,
    showLocationToast
  ]);

  return {
    handleGenerateOptimalTiming,
    isGenerationEnabled: eventsLimits.canGenerateEvents && selectedPriorities.length > 0 && locationForGeneration
  };
};