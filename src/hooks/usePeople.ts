/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback } from 'react';
import { Person, PersonFormData, CreatePersonRequest } from '@/types/people';
import { useUserStore } from '@/store/userStore';

interface UsePeopleState {
  people: Person[];
  selectedPerson: Person | null;
  defaultPerson: Person | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePeopleActions {
  loadPeople: () => Promise<void>;
  createPerson: (personData: PersonFormData) => Promise<Person | null>;
  updatePerson: (personId: string, updates: Partial<PersonFormData>) => Promise<boolean>;
  deletePerson: (personId: string) => Promise<boolean>;
  setSelectedPerson: (personId: string | null) => void;
  setDefaultPerson: (personId: string) => Promise<boolean>;
  clearError: () => void;
  getPersonById: (personId: string) => Person | null;
}

interface UsePeopleReturn extends UsePeopleState, UsePeopleActions {}

/**
 * Modern hook for managing people via API endpoints
 * Replaces the local database approach with proper API integration
 */
export function usePeople(): UsePeopleReturn {
  const { user } = useUserStore();
  const [state, setState] = useState<UsePeopleState>({
    people: [],
    selectedPerson: null,
    defaultPerson: null,
    isLoading: false,
    error: null,
  });

  // Derived state
  const selectedPerson = state.selectedPerson;
  const defaultPerson = state.people.find(p => p.isDefault) || null;

  // Helper function to update state
  const updateState = useCallback((updates: Partial<UsePeopleState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // API call wrapper with error handling
  const apiCall = useCallback(async <T>(
    operation: () => Promise<Response>,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      const response = await operation();
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      if (successMessage) {
        console.log(successMessage);
      }
      
      return data.data || data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('API call failed:', errorMessage);
      updateState({ error: errorMessage });
      return null;
    }
  }, [updateState]);

  // Load people from API
  const loadPeople = useCallback(async () => {
    if (!user?.id) {
      updateState({ people: [], isLoading: false });
      return;
    }

    updateState({ isLoading: true, error: null });

    const result = await apiCall<Person[]>(
      () => fetch(`/api/people?userId=${user.id}`)
    );

    if (result) {
      // Keep timestamps as strings to match Person interface
      updateState({ 
        people: result, 
        isLoading: false 
      });
    } else {
      updateState({ isLoading: false });
    }
  }, [user?.id, apiCall, updateState]);

  // Create a new person
  const createPerson = useCallback(async (personData: PersonFormData): Promise<Person | null> => {
    if (!user?.id) {
      updateState({ error: 'User not authenticated' });
      return null;
    }

    updateState({ isLoading: true, error: null });

    const createRequest: CreatePersonRequest = {
      userId: user.id,
      name: personData.name,
      relationship: personData.relationship,
      birthData: personData.birthData,
      notes: personData.notes,
      isDefault: personData.isDefault
    };

    const result = await apiCall<Person>(
      () => fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createRequest)
      }),
      'Person created successfully'
    );

    if (result) {
      // Convert date strings to Date objects
      // Keep timestamps as strings to match Person interface
      const newPerson = result;

      // Update local state optimistically
      setState(prev => ({
        ...prev,
        people: newPerson.isDefault 
          ? [...prev.people.map(p => ({ ...p, isDefault: false })), newPerson]
          : [...prev.people, newPerson],
        selectedPerson: newPerson,
        isLoading: false
      }));

      return newPerson as Person;
    }

    updateState({ isLoading: false });
    return null;
  }, [user?.id, apiCall, updateState]);

  // Update existing person
  const updatePerson = useCallback(async (personId: string, updates: Partial<PersonFormData>): Promise<boolean> => {
    if (!user?.id) {
      updateState({ error: 'User not authenticated' });
      return false;
    }

    updateState({ isLoading: true, error: null });

    const result = await apiCall<Person>(
      () => fetch(`/api/people/${personId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates })
      }),
      'Person updated successfully'
    );

    if (result) {
      // Keep timestamps as strings to match Person interface
      const updatedPerson = result;

      // Update local state
      setState(prev => ({
        ...prev,
        people: prev.people.map(p => 
          p.id === personId 
            ? updatedPerson
            : (updates.isDefault ? { ...p, isDefault: false } : p)
        ),
        selectedPerson: prev.selectedPerson?.id === personId ? updatedPerson : prev.selectedPerson,
        isLoading: false
      }));

      return true;
    }

    updateState({ isLoading: false });
    return false;
  }, [user?.id, apiCall, updateState]);

  // Delete person
  const deletePerson = useCallback(async (personId: string): Promise<boolean> => {
    if (!user?.id) {
      updateState({ error: 'User not authenticated' });
      return false;
    }

    updateState({ isLoading: true, error: null });

    const success = await apiCall<boolean>(
      () => fetch(`/api/people/${personId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }),
      'Person deleted successfully'
    );

    if (success) {
      setState(prev => {
        const updatedPeople = prev.people.filter(p => p.id !== personId);
        const wasSelected = prev.selectedPerson?.id === personId;
        const wasDefault = prev.people.find(p => p.id === personId)?.isDefault;

        return {
          ...prev,
          people: updatedPeople,
          selectedPerson: wasSelected ? null : prev.selectedPerson,
          isLoading: false
        };
      });

      return true;
    }

    updateState({ isLoading: false });
    return false;
  }, [user?.id, apiCall, updateState]);

  // Set selected person
  const setSelectedPerson = useCallback((personId: string | null) => {
    const person = personId ? state.people.find(p => p.id === personId) || null : null;
    updateState({ selectedPerson: person });
  }, [state.people, updateState]);

  // Set default person
  const setDefaultPerson = useCallback(async (personId: string): Promise<boolean> => {
    const person = state.people.find(p => p.id === personId);
    if (!person) {
      updateState({ error: 'Person not found' });
      return false;
    }

    return await updatePerson(personId, { isDefault: true });
  }, [state.people, updatePerson, updateState]);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Get person by ID
  const getPersonById = useCallback((personId: string): Person | null => {
    return state.people.find(p => p.id === personId) || null;
  }, [state.people]);

  // Load people on mount and user change
  useEffect(() => {
    if (user?.id) {
      loadPeople();
    } else {
      updateState({ people: [], selectedPerson: null });
    }
  }, [user?.id, loadPeople, updateState]);

  return {
    // State
    people: state.people,
    selectedPerson,
    defaultPerson,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    loadPeople,
    createPerson,
    updatePerson,
    deletePerson,
    setSelectedPerson,
    setDefaultPerson,
    clearError,
    getPersonById,
  };
}