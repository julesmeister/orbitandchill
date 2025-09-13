import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Person } from '@/types/people';

interface PeopleState {
  people: Person[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPeople: (people: Person[]) => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPeople: () => void;
  loadPeople: (userId: string) => Promise<void>;
}

export const usePeopleStore = create<PeopleState>()(
  persist(
    (set, get) => ({
      people: [],
      isLoading: false,
      error: null,

      setPeople: (people) => set({ people }),

      addPerson: (person) => set((state) => ({
        people: [...state.people, person]
      })),

      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map(person =>
          person.id === id ? { ...person, ...updates } : person
        )
      })),

      deletePerson: (id) => set((state) => ({
        people: state.people.filter(person => person.id !== id)
      })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearPeople: () => set({ people: [], error: null }),

      loadPeople: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 100));
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load people'
          });
        }
      }
    }),
    {
      name: 'people-storage',
      version: 1,
    }
  )
);