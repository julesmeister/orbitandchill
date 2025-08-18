/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Person } from '../../../types/people';

export function usePersonFormState() {
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showEditPersonForm, setShowEditPersonForm] = useState(false);
  const [editingPersonData, setEditingPersonData] = useState<Person | null>(null);

  const openAddPersonForm = useCallback(() => {
    setShowAddPersonForm(true);
  }, []);

  const closeAddPersonForm = useCallback(() => {
    setShowAddPersonForm(false);
  }, []);

  const openEditPersonForm = useCallback((person: Person) => {
    setEditingPersonData(person);
    setShowEditPersonForm(true);
  }, []);

  const closeEditPersonForm = useCallback(() => {
    setShowEditPersonForm(false);
    setEditingPersonData(null);
  }, []);

  return {
    showAddPersonForm,
    showEditPersonForm,
    editingPersonData,
    openAddPersonForm,
    closeAddPersonForm,
    openEditPersonForm,
    closeEditPersonForm,
    setEditingPersonData,
  };
}