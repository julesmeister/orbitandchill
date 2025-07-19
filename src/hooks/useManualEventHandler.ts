import { useCallback } from 'react';
import { useEventsCompat } from './useEventsCompat';
import type { AstrologicalEvent } from '../types/events';
import { useManualEventAnalysis } from './useManualEventAnalysis';
import { NewEvent } from './useEventForm';

interface LocationData {
  latitude: number;
  longitude: number;
  locationName: string;
  timezone?: string;
}

interface UseManualEventHandlerProps {
  locationForGeneration: LocationData | null;
  userId?: string;
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  resetForm: () => void;
  setShowAddForm: (show: boolean) => void;
}

export const useManualEventHandler = ({
  locationForGeneration,
  userId,
  showError,
  showSuccess,
  resetForm,
  setShowAddForm
}: UseManualEventHandlerProps) => {
  const { analyzeManualEvent } = useManualEventAnalysis();
  const { addEvent } = useEventsCompat();

  const handleAddEvent = useCallback(async (e: React.FormEvent, newEvent: NewEvent) => {
    e.preventDefault();
    
    if (!newEvent.title.trim() || !newEvent.date) {
      showError("Missing Information", "Please fill in at least the title and date for your event.");
      return;
    }

    try {
      // If we have location data, analyze the event astrologically
      if (locationForGeneration) {
        const { latitude, longitude } = locationForGeneration;
        
        const analyzedEvent = await analyzeManualEvent({
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time,
          description: newEvent.description,
          latitude,
          longitude,
          locationName: locationForGeneration.locationName,
          timezone: locationForGeneration.timezone
        });

        if (analyzedEvent) {
          // Add the analyzed event with astrological data
          const eventWithUserId = {
            ...analyzedEvent,
            userId: userId || '',
              isGenerated: false
          };

          await addEvent(eventWithUserId);
          
          // Scroll to events table after adding
          setTimeout(() => {
            const eventsTable = document.querySelector('[data-events-table]');
            if (eventsTable) {
              eventsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);

          showSuccess(
            "Event Added Successfully",
            `"${newEvent.title}" has been added with astrological analysis.`,
            4000
          );
        }
      } else {
        // Add basic event without astrological analysis
        const basicEvent: AstrologicalEvent = {
          id: Date.now().toString(),
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time || '',
          description: newEvent.description || '',
          score: 5, // Neutral score for manual events
          type: 'neutral',
          aspects: [],
          planetaryPositions: [],
          isBookmarked: false,
          userId: userId || '',
          isGenerated: false,
          createdAt: new Date().toISOString(),
          // Include location data when available, even for basic events
          ...(locationForGeneration ? {
            latitude: (locationForGeneration as LocationData).latitude,
            longitude: (locationForGeneration as LocationData).longitude,
            locationName: (locationForGeneration as LocationData).locationName,
            timezone: (locationForGeneration as LocationData).timezone
          } : {})
        };

        await addEvent(basicEvent);
        
        // Scroll to events table after adding
        setTimeout(() => {
          const eventsTable = document.querySelector('[data-events-table]');
          if (eventsTable) {
            eventsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);

        showSuccess(
          "Event Added Successfully",
          `"${newEvent.title}" has been added to your calendar.`,
          4000
        );
      }

      // Reset form and close
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
      showError(
        "Failed to Add Event",
        error instanceof Error ? error.message : "An unexpected error occurred while adding your event."
      );
    }
  }, [
    locationForGeneration,
    userId,
    analyzeManualEvent,
    addEvent,
    showError,
    showSuccess,
    resetForm,
    setShowAddForm
  ]);

  return {
    handleAddEvent
  };
};