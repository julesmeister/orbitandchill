/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventFormData } from '@/hooks/useAdminEventForm';

interface UseEventHandlersProps {
  createEvent: (data: EventFormData & { score: number }) => Promise<void>;
  updateEvent: (id: string, data: EventFormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bulkDeleteEvents: (ids: string[]) => Promise<void>;
  resetForm: () => void;
  clearSelection: () => void;
  editingEvent: any;
  formData: EventFormData;
}

interface UseEventHandlersReturn {
  handleCreateEvent: (e: React.FormEvent) => Promise<void>;
  handleUpdateEvent: (e: React.FormEvent) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleBulkDelete: (selectedEvents: string[]) => Promise<void>;
}

export function useEventHandlers({
  createEvent,
  updateEvent,
  deleteEvent,
  bulkDeleteEvents,
  resetForm,
  clearSelection,
  editingEvent,
  formData
}: UseEventHandlersProps): UseEventHandlersReturn {
  
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        score: formData.type === 'benefic' ? 8 : formData.type === 'challenging' ? 3 : 5,
      });
      
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      await updateEvent(editingEvent.id, formData);
      resetForm();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleBulkDelete = async (selectedEvents: string[]) => {
    if (selectedEvents.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) return;
    
    try {
      await bulkDeleteEvents(selectedEvents);
      clearSelection();
    } catch (error) {
      console.error('Error bulk deleting events:', error);
      alert('Failed to delete some events. Please try again.');
    }
  };

  return {
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleBulkDelete
  };
}