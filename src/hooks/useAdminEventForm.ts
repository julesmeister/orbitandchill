/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  timingMethod: 'electional' | 'aspects' | 'houses';
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  timingMethod?: 'electional' | 'aspects' | 'houses';
}

const initialFormData: EventFormData = {
  title: '',
  date: '',
  time: '12:00',
  type: 'neutral',
  description: '',
  timingMethod: 'electional'
};

export function useAdminEventForm() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingEvent(null);
    setShowCreateForm(false);
  };

  const openCreateForm = () => {
    setEditingEvent(null);
    setFormData(initialFormData);
    setShowCreateForm(true);
  };

  const openEditForm = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      timingMethod: event.timingMethod || 'electional'
    });
    setShowCreateForm(true);
  };

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    showCreateForm,
    setShowCreateForm,
    editingEvent,
    formData,
    setFormData,
    resetForm,
    openCreateForm,
    openEditForm,
    updateFormData,
  };
}