/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEventsStore } from '../store/eventsStore';
import { useUserStore } from '../store/userStore';
import { useStatusToast } from './useStatusToast';
import { useConfirmationToast } from './useConfirmationToast';
import { useEventsLimits } from './useEventsLimits';

interface UseEventActionsOptions {
  onLocationRequired: () => void;
  showConfirmation?: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'green' | 'blue';
  }) => void;
}

export const useEventActions = (options: UseEventActionsOptions) => {
  const { user } = useUserStore();
  const { 
    getAllEvents, 
    deleteEvent, 
    toggleBookmark, 
    updateEvent,
    clearGeneratedEvents,
    loadMonthEvents 
  } = useEventsStore();
  
  const { showError, showSuccess, showLoading } = useStatusToast();
  const { showConfirmation: fallbackShowConfirmation } = useConfirmationToast();
  const eventsLimits = useEventsLimits();
  
  // Use the passed showConfirmation or fall back to the hook's own
  const showConfirmation = options.showConfirmation || fallbackShowConfirmation;

  const handleDeleteEvent = async (id: string) => {
    if (!user?.id) {
      showError("No User", "Please ensure you have a valid user session before deleting events.");
      return;
    }

    // Find the event to get its title for the confirmation
    const allEvents = getAllEvents();
    const eventToDelete = allEvents.find(e => e.id === id);
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
      showError(
        "Sign In Required",
        "Please complete your profile or sign in to bookmark events. Your bookmarks will be saved and synced across devices.",
        5000
      );
      return;
    }

    // Check bookmark limits before proceeding
    const allEvents = getAllEvents();
    const event = allEvents.find(e => e.id === id);
    if (event && !event.isBookmarked && !eventsLimits.canBookmarkMore) {
      showError("Bookmark Limit Reached", "You have reached your bookmark limit. Remove some bookmarks or upgrade to premium for unlimited bookmarks.");
      return;
    }

    try {
      await toggleBookmark(id, user.id);

      // Find the event to provide specific feedback
      const allEvents = getAllEvents();
      const event = allEvents.find(e => e.id === id);
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

  const handleClearAllEvents = (currentDate: Date) => {
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
            console.log('📊 Events count after reload:', getAllEvents().length);

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

  return {
    handleDeleteEvent,
    handleToggleBookmark,
    handleRenameEvent,
    handleClearAllEvents,
  };
};