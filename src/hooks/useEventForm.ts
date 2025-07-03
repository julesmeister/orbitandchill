import { useState } from 'react';

export interface NewEvent {
  title: string;
  date: string;
  time: string;
  description: string;
}

export const useEventForm = () => {
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: '',
    time: '',
    description: ''
  });

  const resetForm = () => {
    setNewEvent({
      title: '',
      date: '',
      time: '',
      description: ''
    });
  };

  const updateField = (field: keyof NewEvent, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = newEvent.title.trim() !== '' && newEvent.date !== '';

  return {
    newEvent,
    setNewEvent,
    resetForm,
    updateField,
    isFormValid
  };
};