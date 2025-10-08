/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BirthData } from '../../types/user';
import { Person, PersonFormData } from '../../types/people';
import { useUserStore } from '../../store/userStore';
import { usePeopleAPI } from '../usePeopleAPI';
import { useStatusToast } from '../useStatusToast';

export interface FormDataOptions {
  mode?: 'user' | 'person';
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
  onSubmit?: (formData: any) => void;
}

export interface NatalChartFormData extends BirthData {
  name: string;
}

interface UseFormDataReturn {
  // Form state
  formData: NatalChartFormData;
  relationship: Person['relationship'];
  notes: string;
  isDefault: boolean;
  isSaving: boolean;

  // Form handlers
  handleInputChange: (field: keyof NatalChartFormData, value: string | { lat: string; lon: string }) => void;
  handleRelationshipChange: (value: Person['relationship']) => void;
  handleNotesChange: (value: string) => void;
  handleIsDefaultChange: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // Validation
  isFormValid: boolean;
}

/**
 * Unified form data hook for both NatalChartForm and CompactNatalChartForm
 * Uses direct API calls only (no IndexedDB/Dexie)
 */
export function useFormData({
  mode = 'user',
  editingPerson = null,
  onPersonSaved,
  onSubmit
}: FormDataOptions): UseFormDataReturn {

  const router = useRouter();
  const { user, updateBirthData, hasStoredData } = useUserStore();
  const { people, addPerson, updatePerson, loadPeople } = usePeopleAPI();
  const { showError, showSuccess } = useStatusToast();

  // Form state
  const [formData, setFormData] = useState<NatalChartFormData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    locationOfBirth: '',
    coordinates: { lat: '', lon: '' },
  });

  const [relationship, setRelationship] = useState<Person['relationship']>('self');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced update ref
  const debouncedUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserDataInitializedRef = useRef(false);

  // Debounced birth data update for user mode
  const debouncedUpdateBirthData = useCallback((birthData: Partial<BirthData>) => {
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }

    debouncedUpdateRef.current = setTimeout(() => {
      updateBirthData(birthData);
    }, 1000);
  }, [updateBirthData]);

  // Consolidated form update handler
  const updateFormData = useCallback((updates: Partial<NatalChartFormData>) => {
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, ...updates };

      // Only update user birth data in user mode (debounced)
      if (mode === 'user') {
        const { name: _name, ...birthData } = newFormData;
        debouncedUpdateBirthData(birthData);
      }

      return newFormData;
    });
  }, [mode, debouncedUpdateBirthData]);

  // Load saved data when user changes or editing person
  const hasInitializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (mode === 'user' && user?.birthData && !hasUserDataInitializedRef.current) {
      const newFormData = {
        name: user.username || '',
        dateOfBirth: user.birthData.dateOfBirth || '',
        timeOfBirth: user.birthData.timeOfBirth || '',
        locationOfBirth: user.birthData.locationOfBirth || '',
        coordinates: user.birthData.coordinates || { lat: '', lon: '' },
      };

      setFormData(newFormData);
      hasUserDataInitializedRef.current = true;
    } else if (mode === 'person' && editingPerson) {
      // Only initialize if this is a different person or first time
      if (hasInitializedRef.current !== editingPerson.id) {
        const newFormData = {
          name: editingPerson.name,
          dateOfBirth: editingPerson.birthData.dateOfBirth,
          timeOfBirth: editingPerson.birthData.timeOfBirth,
          locationOfBirth: editingPerson.birthData.locationOfBirth,
          coordinates: editingPerson.birthData.coordinates,
        };

        setFormData(newFormData);
        setRelationship(editingPerson.relationship);
        setNotes(editingPerson.notes || '');
        setIsDefault(Boolean(editingPerson.isDefault)); // Ensure proper boolean conversion

        hasInitializedRef.current = editingPerson.id;
      }
    } else if (mode === 'person' && !editingPerson) {
      // Reset for new person
      setFormData({
        name: '',
        dateOfBirth: '',
        timeOfBirth: '',
        locationOfBirth: '',
        coordinates: { lat: '', lon: '' },
      });
      setRelationship('self');
      setNotes('');
      setIsDefault(false);
      hasInitializedRef.current = null;
    }
  }, [user?.id, mode, editingPerson?.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedUpdateRef.current) {
        clearTimeout(debouncedUpdateRef.current);
      }
    };
  }, []);

  // Form handlers
  const handleInputChange = useCallback((field: keyof NatalChartFormData, value: string | { lat: string; lon: string }) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);

  const handleRelationshipChange = useCallback((value: Person['relationship']) => {
    setRelationship(value);
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
  }, []);

  const handleIsDefaultChange = useCallback((value: boolean) => {
    setIsDefault(value);
  }, []);

  // Form validation
  const isFormValid = useCallback(() => {
    const baseValid = !!(formData.dateOfBirth && formData.timeOfBirth && formData.locationOfBirth &&
      formData.coordinates.lat && formData.coordinates.lon);

    if (mode === 'person') {
      return baseValid && !!formData.name.trim();
    }

    return baseValid;
  }, [formData, mode])();

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear pending updates FIRST to ensure debounced saves complete
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }

    // Validate coordinates
    if (!formData.coordinates?.lat || !formData.coordinates?.lon ||
        formData.coordinates.lat === '' || formData.coordinates.lon === '') {
      showError(
        "Location Required",
        "Please select a location from the dropdown to ensure accurate chart calculations.",
        4000
      );
      return;
    }

    if (!isFormValid) {
      return;
    }

    setIsSaving(true);

    try {
      if (mode === 'person') {
        // Handle person mode
        const { name, ...birthData } = formData;
        const personFormData: PersonFormData = {
          name,
          relationship,
          birthData,
          notes: notes || undefined,
          isDefault: Boolean(isDefault) // Ensure it's always a proper boolean
        };

        let savedPerson: Person;
        if (editingPerson) {
          try {
            await updatePerson(editingPerson.id, personFormData);
            savedPerson = { ...editingPerson, ...personFormData, updatedAt: new Date() };
          } catch (error) {
            console.log('Update failed, creating new person instead');
            savedPerson = await addPerson(personFormData);
          }
        } else {
          savedPerson = await addPerson(personFormData);
        }

        // If this person represents the user ('self'), sync data to user store
        if (savedPerson.relationship === 'self') {
          const { name: _name, ...birthData } = formData;
          await updateBirthData(birthData);
        }


        // Reload people data
        try {
          await loadPeople();
        } catch (reloadError) {
          console.warn('Failed to reload people after save:', reloadError);
        }

        if (onPersonSaved) {
          onPersonSaved(savedPerson);
        }
      } else {
        // User mode - save data SYNCHRONOUSLY (no debouncing on submit)
        const { name: _name, ...birthData } = formData;

        // Save immediately, not debounced
        await updateBirthData(birthData);

        if (onSubmit) {
          onSubmit(formData);
        } else {
          // Default behavior: navigate to chart page
          router.push('/chart');
        }
      }
    } catch (error) {
      console.error('useFormData: Failed to save:', error);
      showError(
        "Save Failed",
        "Failed to save your data. Please check your connection and try again.",
        5000
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    formData, isFormValid, mode, relationship, notes, isDefault,
    editingPerson, addPerson, updatePerson, onPersonSaved,
    router, showError, onSubmit, user?.id, updateBirthData
  ]);

  return {
    // Form state
    formData,
    relationship,
    notes,
    isDefault,
    isSaving,

    // Form handlers
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit,

    // Validation
    isFormValid,
  };
}