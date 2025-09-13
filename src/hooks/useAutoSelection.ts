/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { Person } from '@/types/people';

interface UseAutoSelectionProps {
  people: Person[];
  defaultPerson: Person | null;
  isLoading: boolean;
  storeSelectedPersonId: string | null;
  setSelectedPerson: (personId: string | null) => void;
  setDefaultPerson: (personId: string) => Promise<void>;
}

export const useAutoSelection = ({
  people,
  defaultPerson,
  isLoading,
  storeSelectedPersonId,
  setSelectedPerson,
  setDefaultPerson
}: UseAutoSelectionProps) => {
  // Auto-select a person if none is selected
  useEffect(() => {
    if (!isLoading && people.length > 0 && !storeSelectedPersonId) {
      // Find default person, then self person, then first person
      let personToSelect = defaultPerson;
      
      if (!personToSelect) {
        personToSelect = people.find(p => p.relationship === 'self') || people[0];
      }
      
      if (personToSelect) {
        setSelectedPerson(personToSelect.id);
        
        // If this person isn't marked as default, make them default
        if (!personToSelect.isDefault) {
          setDefaultPerson(personToSelect.id).catch(console.error);
        }
      }
    }
  }, [isLoading, people, storeSelectedPersonId, defaultPerson, setSelectedPerson, setDefaultPerson]);
};