/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback, useState } from 'react';
import { Person } from '@/types/people';
import { usePeopleAPI } from '@/hooks/usePeopleAPI';
import { DuplicateDetectionService } from '@/services/duplicateDetectionService';

interface UsePersonActionsProps {
  people: Person[];
  onSelectionChange?: (personId: string | null) => void;
  onEditPerson?: (person: Person) => void;
}

interface UsePersonActionsReturn {
  isDeleting: boolean;
  duplicateWarning: string;
  handleSelectPerson: (personId: string) => void;
  handleSetDefault: (personId: string) => Promise<void>;
  handleEditPerson: (person: Person) => void;
  handleDeletePerson: (person: Person) => Promise<void>;
  checkForDuplicates: (person: Person) => void;
  clearDuplicateWarning: () => void;
}

export const usePersonActions = ({
  people,
  onSelectionChange,
  onEditPerson
}: UsePersonActionsProps): UsePersonActionsReturn => {
  const { setDefaultPerson, deletePerson } = usePeopleAPI();
  const [isDeleting, setIsDeleting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  const handleSelectPerson = useCallback((personId: string) => {
    onSelectionChange?.(personId);
  }, [onSelectionChange]);

  const handleSetDefault = useCallback(async (personId: string) => {
    try {
      await setDefaultPerson(personId);
    } catch (error) {
      console.error('Failed to set default person:', error);
    }
  }, [setDefaultPerson]);

  const handleEditPerson = useCallback((person: Person) => {
    onEditPerson?.(person);
  }, [onEditPerson]);

  const handleDeletePerson = useCallback(async (person: Person) => {
    if (!confirm(`Are you sure you want to delete "${person.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePerson(person.id);
    } catch (error) {
      console.error('Failed to delete person:', error);
      alert('Failed to delete person. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, [deletePerson]);

  const checkForDuplicates = useCallback((person: Person) => {
    if (!DuplicateDetectionService.hasCompleteBirthData(person)) {
      setDuplicateWarning('');
      return;
    }

    const duplicates = DuplicateDetectionService.findDuplicates(person, people);
    const warning = DuplicateDetectionService.getDuplicateWarningMessage(duplicates);
    setDuplicateWarning(warning);
  }, [people]);

  const clearDuplicateWarning = useCallback(() => {
    setDuplicateWarning('');
  }, []);

  return {
    isDeleting,
    duplicateWarning,
    handleSelectPerson,
    handleSetDefault,
    handleEditPerson,
    handleDeletePerson,
    checkForDuplicates,
    clearDuplicateWarning
  };
};