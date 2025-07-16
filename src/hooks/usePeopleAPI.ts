/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { Person, PersonFormData } from '../types/people';
import { useUserStore } from '../store/userStore';

interface UsePeopleAPIReturn {
  people: Person[];
  isLoading: boolean;
  error: string | null;
  selectedPersonId: string | null;
  selectedPerson: Person | null;
  defaultPerson: Person | null;
  
  // Actions
  loadPeople: () => Promise<void>;
  addPerson: (personData: PersonFormData) => Promise<Person>;
  updatePerson: (personId: string, updates: Partial<PersonFormData>) => Promise<void>;
  deletePerson: (personId: string) => Promise<void>;
  setSelectedPerson: (personId: string | null) => void;
  setDefaultPerson: (personId: string) => Promise<void>;
  
  // Utility
  getPersonById: (personId: string) => Person | null;
}

export const usePeopleAPI = (): UsePeopleAPIReturn => {
  const { user } = useUserStore();
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  
  console.log('usePeopleAPI - Hook initialized:', {
    userId: user?.id,
    username: user?.username,
    hasBirthData: !!user?.birthData,
    isLoading,
    peopleCount: people.length
  });
  
  // Computed values
  const defaultPerson = people.find(p => p.isDefault) || null;
  const selectedPerson = selectedPersonId ? people.find(p => p.id === selectedPersonId) || null : null;
  
  // Load people from API
  const loadPeople = useCallback(async () => {
    if (!user?.id) {
      console.log('UsePeopleAPI - No user ID, skipping load');
      setPeople([]);
      return;
    }
    
    console.log('UsePeopleAPI - Loading people for user:', user.id);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('UsePeopleAPI - Fetching from:', `/api/people?userId=${user.id}`);
      const response = await fetch(`/api/people?userId=${user.id}`);
      console.log('UsePeopleAPI - Response status:', response.status);
      const result = await response.json();
      
      console.log('UsePeopleAPI - Load response:', result);
      
      if (result.success) {
        // Convert date strings back to Date objects
        const convertedPeople = result.people.map((person: any) => ({
          ...person,
          createdAt: new Date(person.createdAt),
          updatedAt: new Date(person.updatedAt),
        }));
        
        setPeople(convertedPeople);
        console.log('UsePeopleAPI - People loaded successfully:', convertedPeople.length);
      } else {
        setError(result.error || 'Failed to load people');
        setPeople(result.people || []); // Use fallback array
      }
    } catch (err) {
      console.error('UsePeopleAPI - Failed to load people:', err);
      setError('Network error occurred');
      setPeople([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Add person via API
  const addPerson = useCallback(async (personData: PersonFormData): Promise<Person> => {
    if (!user?.id) {
      throw new Error('No user found');
    }
    
    console.log('UsePeopleAPI - Adding person:', personData);
    setIsLoading(true);
    setError(null);
    
    try {
      const requestBody = {
        userId: user.id,
        ...personData,
      };
      console.log('UsePeopleAPI - POST request body:', requestBody);
      
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      
      console.log('UsePeopleAPI - Add response:', result);
      
      if (result.success) {
        const newPerson = {
          ...result.person,
          createdAt: new Date(result.person.createdAt),
          updatedAt: new Date(result.person.updatedAt),
        };
        
        // Update local state
        setPeople(prev => {
          // If this is the new default, clear other defaults
          if (newPerson.isDefault) {
            return [...prev.map(p => ({ ...p, isDefault: false })), newPerson];
          }
          return [...prev, newPerson];
        });
        
        // Set as selected
        setSelectedPersonId(newPerson.id);
        
        console.log('UsePeopleAPI - Person added successfully:', newPerson);
        return newPerson;
      } else {
        throw new Error(result.error || 'Failed to add person');
      }
    } catch (err) {
      console.error('UsePeopleAPI - Failed to add person:', err);
      setError(err instanceof Error ? err.message : 'Failed to add person');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Update person via API
  const updatePerson = useCallback(async (personId: string, updates: Partial<PersonFormData>) => {
    if (!user?.id) {
      throw new Error('No user found');
    }
    
    console.log('UsePeopleAPI - Updating person:', personId, updates);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/people', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId,
          userId: user.id,
          updates,
        }),
      });
      
      const result = await response.json();
      
      console.log('UsePeopleAPI - Update response:', result);
      
      if (result.success) {
        // Update local state
        setPeople(prev => prev.map(p => {
          if (p.id === personId) {
            return {
              ...p,
              ...updates,
              updatedAt: new Date(),
            };
          }
          // If setting another person as default, clear this person's default
          if (updates.isDefault && p.isDefault && p.id !== personId) {
            return { ...p, isDefault: false };
          }
          return p;
        }));
        
        console.log('UsePeopleAPI - Person updated successfully');
      } else {
        throw new Error(result.error || 'Failed to update person');
      }
    } catch (err) {
      console.error('UsePeopleAPI - Failed to update person:', err);
      setError(err instanceof Error ? err.message : 'Failed to update person');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Delete person via API
  const deletePerson = useCallback(async (personId: string) => {
    if (!user?.id) {
      throw new Error('No user found');
    }
    
    console.log('UsePeopleAPI - Deleting person:', personId);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/people?personId=${personId}&userId=${user.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      console.log('UsePeopleAPI - Delete response:', result);
      
      if (result.success) {
        // Update local state
        setPeople(prev => {
          const filtered = prev.filter(p => p.id !== personId);
          
          // If we deleted the selected person, clear selection
          if (selectedPersonId === personId) {
            setSelectedPersonId(null);
          }
          
          return filtered;
        });
        
        console.log('UsePeopleAPI - Person deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete person');
      }
    } catch (err) {
      console.error('UsePeopleAPI - Failed to delete person:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete person');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedPersonId]);
  
  // Set default person via API
  const setDefaultPerson = useCallback(async (personId: string) => {
    await updatePerson(personId, { isDefault: true });
  }, [updatePerson]);
  
  // Utility function
  const getPersonById = useCallback((personId: string) => {
    return people.find(p => p.id === personId) || null;
  }, [people]);
  
  // Auto-load people when user changes
  useEffect(() => {
    console.log('UsePeopleAPI - useEffect for user changes:', { userId: user?.id, hasUser: !!user });
    if (user?.id) {
      loadPeople();
    } else {
      setPeople([]);
      setSelectedPersonId(null);
    }
  }, [user?.id, loadPeople]);
  
  // Auto-add user as person if they have birth data but no people exist
  useEffect(() => {
    const autoAddUser = async () => {
      console.log('UsePeopleAPI - autoAddUser check:', {
        userId: user?.id,
        hasBirthData: !!user?.birthData,
        username: user?.username,
        isLoading,
        peopleCount: people.length
      });
      
      if (!user?.id || !user.birthData || !user.username || isLoading) {
        return;
      }
      
      // Wait for people to load first
      if (people.length === 0 && !isLoading) {
        console.log('UsePeopleAPI - Auto-adding user as person');
        
        try {
          const userPersonData: PersonFormData = {
            name: user.username,
            relationship: 'self',
            birthData: user.birthData,
            isDefault: true,
            notes: 'Your personal birth data',
          };
          
          await addPerson(userPersonData);
          console.log('UsePeopleAPI - User auto-added successfully');
        } catch (error) {
          console.error('UsePeopleAPI - Failed to auto-add user:', error);
        }
      }
    };
    
    // Only run if we have a user and people array has been loaded (not loading)
    if (user?.id && !isLoading) {
      autoAddUser();
    }
  }, [user?.id, user?.birthData, user?.username, people.length, isLoading, addPerson]);
  
  return {
    people,
    isLoading,
    error,
    selectedPersonId,
    selectedPerson,
    defaultPerson,
    
    // Actions
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson,
    setSelectedPerson: setSelectedPersonId,
    setDefaultPerson,
    
    // Utility
    getPersonById,
  };
};