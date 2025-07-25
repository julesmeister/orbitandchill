import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Person, PersonFormData } from '../types/people';
import { db } from './database';

interface PeopleState {
  // State
  people: Person[];
  selectedPersonId: string | null;
  isLoading: boolean;
  error: string | null;

  // Computed values
  selectedPerson: Person | null;
  defaultPerson: Person | null;

  // Actions
  loadPeople: () => Promise<void>;
  addPerson: (personData: PersonFormData) => Promise<Person>;
  updatePerson: (personId: string, updates: Partial<PersonFormData>) => Promise<void>;
  deletePerson: (personId: string) => Promise<void>;
  setSelectedPerson: (personId: string | null) => void;
  setDefaultPerson: (personId: string) => Promise<void>;
  clearError: () => void;
  
  // Utility methods
  getPersonById: (personId: string) => Person | null;
  generatePersonId: () => string;
}

const generatePersonId = (): string => {
  return "person_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const usePeopleStore = create<PeopleState>()(
  persist(
    (set, get) => ({
      // Initial state
      people: [],
      selectedPersonId: null,
      isLoading: false,
      error: null,

      // Computed values
      get selectedPerson() {
        const state = get();
        const { people = [], selectedPersonId } = state || {};
        return selectedPersonId ? people.find(p => p.id === selectedPersonId) || null : null;
      },

      get defaultPerson() {
        const state = get();
        const { people = [] } = state || {};
        return people.find(p => p.isDefault) || null;
      },

      // Actions
      loadPeople: async () => {
        try {
          console.log('PeopleStore - loadPeople called');
          set({ isLoading: true, error: null });
          
          // Get current user from user store
          const userStore = await import('./userStore');
          const user = userStore.useUserStore.getState().user;
          
          console.log('PeopleStore - User in loadPeople:', {
            hasUser: !!user,
            userId: user?.id,
            username: user?.username,
          });
          
          if (!user) {
            console.log('PeopleStore - No user found, setting empty people array');
            set({ people: [], isLoading: false });
            return;
          }

          // Load people from database
          console.log('PeopleStore - Loading people from database for user:', user.id);
          const peopleStorage = await db.getUserPeople(user.id);
          console.log('PeopleStore - Raw people from database:', peopleStorage);
          
          const people = peopleStorage.map(storage => db.personStorageToPerson(storage));
          console.log('PeopleStore - Converted people:', people);
          
          set({ people, isLoading: false });
          console.log('PeopleStore - People loaded successfully, count:', people.length);
        } catch (error) {
          console.error('PeopleStore - Failed to load people:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load people',
            isLoading: false 
          });
        }
      },

      addPerson: async (personData: PersonFormData) => {
        try {
          console.log('PeopleStore - addPerson called with:', personData);
          set({ isLoading: true, error: null });
          
          // Get current user from user store
          const userStore = await import('./userStore');
          const user = userStore.useUserStore.getState().user;
          
          console.log('PeopleStore - User in addPerson:', {
            hasUser: !!user,
            userId: user?.id,
          });
          
          if (!user) {
            throw new Error('No user found');
          }

          const now = new Date();
          const newPerson: Person = {
            id: generatePersonId(),
            userId: user.id,
            ...personData,
            createdAt: now,
            updatedAt: now,
          };

          // If this is the first person or marked as default, make it default
          const { people } = get();
          console.log('PeopleStore - Current people before adding:', people.length);
          
          if (people.length === 0 || personData.isDefault) {
            newPerson.isDefault = true;
            console.log('PeopleStore - Making new person default');
          }

          console.log('PeopleStore - New person object:', newPerson);

          // Save to database
          const personStorage = db.personToPersonStorage(newPerson);
          console.log('PeopleStore - Person storage object:', personStorage);
          
          await db.savePerson(personStorage);
          console.log('PeopleStore - Person saved to database');

          // If this is the new default, update other people
          if (newPerson.isDefault) {
            console.log('PeopleStore - Setting as default person in database');
            await db.setDefaultPerson(user.id, newPerson.id);
          }

          // Update local state
          console.log('PeopleStore - Updating local state');
          set(state => {
            const newState = {
              people: newPerson.isDefault 
                ? [...state.people.map(p => ({ ...p, isDefault: false })), newPerson] // Clear other defaults
                : [...state.people, newPerson],
              selectedPersonId: newPerson.id,
              isLoading: false
            };
            console.log('PeopleStore - New state after adding person:', {
              peopleCount: newState.people.length,
              selectedPersonId: newState.selectedPersonId,
            });
            return newState;
          });

          console.log('PeopleStore - Person added successfully:', newPerson);
          return newPerson;
        } catch (error) {
          console.error('PeopleStore - Failed to add person:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add person',
            isLoading: false 
          });
          throw error;
        }
      },

      updatePerson: async (personId: string, updates: Partial<PersonFormData>) => {
        try {
          set({ isLoading: true, error: null });
          
          const { people } = get();
          const existingPerson = people.find(p => p.id === personId);
          
          if (!existingPerson) {
            throw new Error('Person not found');
          }

          const updatedPerson: Person = {
            ...existingPerson,
            ...updates,
            updatedAt: new Date(),
          };

          // Save to database
          const personStorage = db.personToPersonStorage(updatedPerson);
          await db.savePerson(personStorage);

          // If this person is being set as default, update database
          if (updates.isDefault && !existingPerson.isDefault) {
            await db.setDefaultPerson(existingPerson.userId, personId);
          }

          // Update local state
          set(state => ({
            people: state.people.map(p => 
              p.id === personId 
                ? updatedPerson 
                : (updates.isDefault && !existingPerson.isDefault ? { ...p, isDefault: false } : p) // Clear other defaults if setting new default
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to update person:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update person',
            isLoading: false 
          });
          throw error;
        }
      },

      deletePerson: async (personId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { people, selectedPersonId } = get();
          const personToDelete = people.find(p => p.id === personId);
          
          if (!personToDelete) {
            throw new Error('Person not found');
          }

          // Delete from database
          await db.deletePerson(personId);

          // Update local state
          const updatedPeople = people.filter(p => p.id !== personId);
          
          set({
            people: updatedPeople,
            selectedPersonId: selectedPersonId === personId ? null : selectedPersonId,
            isLoading: false
          });

          // If we deleted the default person and there are other people, make the first one default
          if (personToDelete.isDefault && updatedPeople.length > 0) {
            await get().setDefaultPerson(updatedPeople[0].id);
          }
        } catch (error) {
          console.error('Failed to delete person:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete person',
            isLoading: false 
          });
          throw error;
        }
      },

      setSelectedPerson: (personId: string | null) => {
        set({ selectedPersonId: personId });
      },

      setDefaultPerson: async (personId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { people } = get();
          const person = people.find(p => p.id === personId);
          
          if (!person) {
            throw new Error('Person not found');
          }

          // Update database
          await db.setDefaultPerson(person.userId, personId);

          // Update local state
          set(state => ({
            people: state.people.map(p => ({
              ...p,
              isDefault: p.id === personId
            })),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to set default person:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to set default person',
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility methods
      getPersonById: (personId: string) => {
        const { people } = get();
        return people.find(p => p.id === personId) || null;
      },

      generatePersonId,
    }),
    {
      name: 'people-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedPersonId: state.selectedPersonId,
        // In development, also persist people array to prevent hot reload issues
        ...(process.env.NODE_ENV === 'development' && { people: state.people }),
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          return;
        }
        
        if (state && process.env.NODE_ENV === 'development') {
          // Restore people array with proper date objects in development
          if (state.people && Array.isArray(state.people)) {
            state.people = state.people.map(person => ({
              ...person,
              createdAt: person.createdAt ? new Date(person.createdAt) : new Date(),
              updatedAt: person.updatedAt ? new Date(person.updatedAt) : new Date(),
            }));
          }
        }
      },
    }
  )
);