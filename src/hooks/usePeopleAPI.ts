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
  const [isAutoAdding, setIsAutoAdding] = useState(false); // Prevent concurrent auto-add attempts
  
  
  // Computed values - CRITICAL FIX: Only find default person for current user
  const defaultPerson = people.find(p => p.isDefault && p.userId === user?.id) || null;
  const selectedPerson = selectedPersonId ? people.find(p => p.id === selectedPersonId) || null : null;
  
  // Load people from API
  const loadPeople = useCallback(async () => {
    if (!user?.id) {
      setPeople([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/people?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert date strings back to Date objects
        const convertedPeople = result.people.map((person: any) => ({
          ...person,
          createdAt: new Date(person.createdAt),
          updatedAt: new Date(person.updatedAt),
        }));
        
        setPeople(convertedPeople);
      } else {
        setError(result.error || 'Failed to load people');
        setPeople(result.people || []); // Use fallback array
      }
    } catch (err) {
      setError('Network error occurred');
      setPeople([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Add person via API
  const addPerson = useCallback(async (personData: PersonFormData): Promise<Person> => {
    console.log('🚀 addPerson called with data:', { 
      name: personData.name, 
      relationship: personData.relationship,
      userId: user?.id,
      isDefault: personData.isDefault 
    });
    
    if (!user?.id) {
      console.error('❌ addPerson failed: No user found');
      throw new Error('No user found');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const requestBody = {
        userId: user.id,
        ...personData,
      };
      
      console.log('📡 Making API call to /api/people with body:', requestBody);
      
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📡 API response received:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('📊 API result:', result);
      
      if (result.success) {
        console.log('✅ Person added successfully:', result.person?.id);
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
        
        return newPerson;
      } else {
        console.error('❌ API error:', result.error);
        throw new Error(result.error || 'Failed to add person');
      }
    } catch (err) {
      console.error('❌ addPerson catch block:', err);
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
        
      } else {
        throw new Error(result.error || 'Failed to update person');
      }
    } catch (err) {
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
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/people?personId=${personId}&userId=${user.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
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
        
      } else {
        throw new Error(result.error || 'Failed to delete person');
      }
    } catch (err) {
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
      if (!user?.id || !user.birthData || !user.username || isLoading || isAutoAdding) {
        return;
      }
      
      // CRITICAL FIX: Only run after initial people load is complete
      // This prevents the race condition where adding a person triggers loadPeople
      // which changes people.length back to 0, triggering another autoAddUser
      if (people.length === 0 && isLoading) {
        return;
      }
      
      // Validate user has proper ID and is not corrupted/cached admin data
      if (user.id.length < 10) {
        return;
      }
      
      // Check for suspicious admin data contamination
      if (user.username === 'Orbit Chill' && user.email === 'orbitandchill@gmail.com') {
        return;
      }
      
      // Validate complete birth data
      if (!user.birthData.dateOfBirth || 
          !user.birthData.timeOfBirth || 
          !user.birthData.locationOfBirth ||
          !user.birthData.coordinates?.lat || 
          !user.birthData.coordinates?.lon) {
        return;
      }
      
      
      // Check if user already exists as a person (by birth data)
      const existingUserPerson = people.find(p => 
        p.relationship === 'self' && 
        p.birthData?.dateOfBirth === user.birthData?.dateOfBirth &&
        p.birthData?.timeOfBirth === user.birthData?.timeOfBirth &&
        p.birthData?.coordinates?.lat === user.birthData?.coordinates?.lat &&
        p.birthData?.coordinates?.lon === user.birthData?.coordinates?.lon
      );
      
      if (existingUserPerson) {
        return;
      }
      
      // Wait for people to load first and check if we need to auto-add
      // CRITICAL FIX: Only auto-add if we truly have no people AND have not found existing user person
      // Additional fix: Ensure we have completed initial load to prevent race conditions
      if (people.length === 0 && !isLoading && !isAutoAdding && user?.id) {
        setIsAutoAdding(true);
        
        try {
          const userPersonData: PersonFormData = {
            name: user.username,
            relationship: 'self',
            birthData: user.birthData,
            isDefault: true,
            notes: 'Your personal birth data',
          };
          
          const result = await addPerson(userPersonData);
        } catch (error) {
          console.error('autoAddUser failed:', error);
          
          // Check if this is a constraint violation or conflict error
          if (error instanceof Error && 
              (error.message.includes('UNIQUE constraint') || 
               error.message.includes('Person with this birth data already exists') ||
               error.message.includes('409'))) {
            // Don't treat this as an error - the person already exists
            // Reload people to get the existing person
            try {
              await loadPeople();
            } catch (reloadError) {
            }
          } else {
            console.error('autoAddUser failed:', error);
          }
        } finally {
          setIsAutoAdding(false);
        }
      }
    };
    
    // Only run if we have a user and people array has been loaded (not loading)
    // CRITICAL FIX: Add debouncing to prevent rapid fire execution
    const timeoutId = setTimeout(() => {
      if (user?.id && !isLoading) {
        autoAddUser();
      }
    }, 100); // Small delay to allow state to stabilize
    
    return () => clearTimeout(timeoutId);
  }, [user?.id, user?.birthData, user?.username, people.length, isLoading, isAutoAdding, addPerson]);
  
  // CRITICAL FIX: Sync defaultPerson birth data with user birth data changes
  useEffect(() => {
    const syncDefaultPersonWithUser = async () => {
      if (!user?.id || !user.birthData || !defaultPerson || isLoading) {
        return;
      }
      
      // Check if defaultPerson birth data is different from user birth data
      const needsSync = 
        defaultPerson.birthData?.dateOfBirth !== user.birthData.dateOfBirth ||
        defaultPerson.birthData?.timeOfBirth !== user.birthData.timeOfBirth ||
        defaultPerson.birthData?.locationOfBirth !== user.birthData.locationOfBirth ||
        defaultPerson.birthData?.coordinates?.lat !== user.birthData.coordinates?.lat ||
        defaultPerson.birthData?.coordinates?.lon !== user.birthData.coordinates?.lon;
      
      if (needsSync) {
        try {
          console.log('🔄 Syncing defaultPerson birth data with user data changes');
          await updatePerson(defaultPerson.id, {
            name: defaultPerson.name, // Keep existing name
            relationship: 'self',
            birthData: user.birthData, // Update with latest user birth data
            isDefault: true,
            notes: defaultPerson.notes || 'Your personal birth data'
          });
          
          // Reload people to get updated data
          await loadPeople();
        } catch (error) {
          console.error('Failed to sync defaultPerson with user data:', error);
        }
      }
    };
    
    // Debounce to avoid excessive API calls
    const timeoutId = setTimeout(syncDefaultPersonWithUser, 500);
    return () => clearTimeout(timeoutId);
  }, [user?.id, user?.birthData, defaultPerson?.birthData, defaultPerson?.id, updatePerson, loadPeople, isLoading]);
  
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