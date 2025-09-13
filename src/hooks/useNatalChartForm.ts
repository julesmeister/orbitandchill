/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BirthData } from '../types/user';
import { Person, PersonFormData } from '../types/people';
import { useLocationSearch } from './useLocationSearch';
import { useUserStore } from '../store/userStore';
import { usePeopleStore } from '../store/peopleStore';
import { db } from '../store/database';
import { useNatalChart } from './useNatalChart';
import { useStatusToast } from './useStatusToast';
import { useDateTimeInput } from './useDateTimeInput';
import { trackChartGeneration } from '../lib/analytics';

export interface NatalChartFormData extends BirthData {
  name: string;
}

interface UseNatalChartFormOptions {
  mode?: 'user' | 'person';
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
  onSubmit?: (formData: NatalChartFormData) => void;
  submitText?: string;
}

interface UseNatalChartFormReturn {
  // Form state
  formData: NatalChartFormData;
  relationship: Person['relationship'];
  notes: string;
  isDefault: boolean;
  isLocationFocused: boolean;
  isSaving: boolean;
  
  // Form handlers
  handleInputChange: (field: keyof NatalChartFormData, value: string) => void;
  handleRelationshipChange: (value: Person['relationship']) => void;
  handleNotesChange: (value: string) => void;
  handleIsDefaultChange: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleLocationFocus: () => void;
  handleLocationBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  // Date/Time integration
  dateTimeInput: ReturnType<typeof useDateTimeInput>;
  
  // Location integration
  locationSearch: ReturnType<typeof useLocationSearch>;
  
  // Validation
  isFormValid: boolean;
  
  // UI state
  statusToast: ReturnType<typeof useStatusToast>['toast'];
  showError: ReturnType<typeof useStatusToast>['showError'];
  showSuccess: ReturnType<typeof useStatusToast>['showSuccess'];
  
  // Chart state (for user mode)
  cachedChart: ReturnType<typeof useNatalChart>['cachedChart'];
  isChartGenerating: boolean;
  hasExistingChart: boolean;
  isLoadingCache: boolean;
  
  // Store integration
  user: any;
  hasStoredData: boolean;
  isProfileComplete: boolean;
}

/**
 * Unified hook for both NatalChartForm and CompactNatalChartForm
 * Handles all form logic, validation, and data management
 */
export function useNatalChartForm({
  mode = 'user',
  editingPerson = null,
  onPersonSaved,
  onSubmit,
  submitText = 'Save Birth Data'
}: UseNatalChartFormOptions): UseNatalChartFormReturn {
  
  const router = useRouter();
  const { user, updateBirthData, hasStoredData, isProfileComplete } = useUserStore();
  const { people, addPerson, updatePerson, loadPeople } = usePeopleStore();
  const { cachedChart, generateChart, isGenerating: isChartGenerating, hasExistingChart, isLoadingCache } = useNatalChart();
  
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
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isUserTypingTime, setIsUserTypingTime] = useState(false);
  const [isUserTypingLocation, setIsUserTypingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Debounced update ref
  const debouncedUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserDataInitializedRef = useRef(false);
  
  // Status toast hook
  const { toast: statusToast, showError, showSuccess } = useStatusToast();
  
  // Date/Time input integration
  const dateTimeInput = useDateTimeInput({
    initialDate: formData.dateOfBirth,
    initialTime: formData.timeOfBirth,
    onChange: (dateString, timeString) => {
      updateFormData({
        dateOfBirth: dateString,
        timeOfBirth: timeString
      });
    }
  });
  
  // Debounced birth data update
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
  
  // Location search integration
  const locationSearch = useLocationSearch((location) => {
    setIsUserTypingLocation(false);
    
    // Clear any pending debounced update
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }
    
    const newFormData = {
      locationOfBirth: location.display_name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      }
    };
    
    setFormData(prevFormData => ({ ...prevFormData, ...newFormData }));
    
    // Immediately update birth data for location selection
    if (mode === 'user') {
      updateBirthData(newFormData);
    }
    
    setIsLocationFocused(false);
  });
  
  // Load people when editing a person to ensure they exist in store
  useEffect(() => {
    if (mode === 'person' && editingPerson && people.length === 0) {
      const loadAndWait = async () => {
        await loadPeople();
      };
      loadAndWait();
    }
  }, [mode, editingPerson?.id]); // Only depend on editingPerson.id to prevent loops

  // Ensure anonymous user exists on mount for user mode
  useEffect(() => {
    if (mode === 'user' && !user?.id) {
      const ensureUser = async () => {
        const { ensureAnonymousUser } = useUserStore.getState();
        await ensureAnonymousUser();
      };
      ensureUser();
    }
  }, [mode]);

  // Load saved data when user changes or editing person (with ref to track if already initialized)
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
      
      if (user.birthData.locationOfBirth) {
        locationSearch.setLocationQuery(user.birthData.locationOfBirth);
      }
      
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
        setIsDefault(editingPerson.isDefault || false);
        
        if (editingPerson.birthData.locationOfBirth) {
          locationSearch.setLocationQuery(editingPerson.birthData.locationOfBirth);
        }
        
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
      locationSearch.setLocationQuery('');
      hasInitializedRef.current = null; // Reset initialization tracking
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
  const handleInputChange = useCallback((field: keyof NatalChartFormData, value: string) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);
  
  const handleLocationInputChange = useCallback((value: string) => {
    setIsUserTypingLocation(true);
    locationSearch.setLocationQuery(value);
    updateFormData({ locationOfBirth: value });
    
    // Reset initialization flag when user starts typing to prevent reverting
    if (mode === 'user') {
      hasUserDataInitializedRef.current = true;
    }
    
    setTimeout(() => {
      setIsUserTypingLocation(false);
    }, 500);
  }, [updateFormData, locationSearch.setLocationQuery, mode]);
  
  const handleRelationshipChange = useCallback((value: Person['relationship']) => {
    setRelationship(value);
  }, []);
  
  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
  }, []);
  
  const handleIsDefaultChange = useCallback((value: boolean) => {
    setIsDefault(value);
  }, []);
  
  const handleLocationFocus = useCallback(() => {
    setIsLocationFocused(true);
  }, []);
  
  const handleLocationBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (!locationSearch.dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setTimeout(() => setIsLocationFocused(false), 150);
    }
  }, [locationSearch]);
  
  // Form validation
  const isFormValid = useCallback(() => {
    const baseValid = !!(formData.dateOfBirth && formData.timeOfBirth && formData.locationOfBirth &&
      formData.coordinates.lat && formData.coordinates.lon);
    
    if (mode === 'person') {
      return baseValid && !!formData.name.trim();
    }
    
    return baseValid;
  }, [formData, mode])();
  
  // Simple function to save data before navigation
  const saveDataIfNeeded = useCallback(async () => {
    if (mode === 'user') {
      const { name: _name, ...birthData } = formData;
      await updateBirthData(birthData);
    }
  }, [mode, formData, updateBirthData]);

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Form submission started!', { mode, userId: user?.id });
    
    if (!formData.coordinates.lat || !formData.coordinates.lon) {
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
    
    // Clear pending updates
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }
    
    try {
      if (mode === 'person') {
        // Handle person mode
        const { name, ...birthData } = formData;
        const personFormData: PersonFormData = {
          name,
          relationship,
          birthData,
          notes: notes || undefined,
          isDefault
        };
        
        let savedPerson: Person;
        if (editingPerson) {
          await loadPeople();
          const { people: freshPeople } = usePeopleStore.getState();
          const personExistsInStore = freshPeople.some(p => p.id === editingPerson.id);
          
          if (personExistsInStore) {
            try {
              await updatePerson(editingPerson.id, personFormData);
              savedPerson = { ...editingPerson, ...personFormData, updatedAt: new Date() };
            } catch (error) {
              savedPerson = await addPerson(personFormData);
            }
          } else {
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
        
        if (onPersonSaved) {
          onPersonSaved(savedPerson);
        }
      } else {
        // USER MODE - DIRECT NAVIGATION
        console.log('🚀 User mode: Saving data and navigating directly to chart');
        
        // Save user data quickly
        await saveDataIfNeeded();
        
        // Navigate immediately - let chart page handle everything else
        console.log('✅ Navigating to chart page immediately');
        setIsSaving(false);
        router.push('/chart');
        return;
      }
    } catch (error) {
      console.error('Failed to save:', error);
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
    router, showError, saveDataIfNeeded, user?.id
  ]);
  
  // Enhanced location search with form integration
  const enhancedLocationSearch = {
    ...locationSearch,
    handleLocationInputChange,
  };
  
  return {
    // Form state
    formData,
    relationship,
    notes,
    isDefault,
    isLocationFocused,
    isSaving,
    
    // Form handlers
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit,
    handleLocationFocus,
    handleLocationBlur,
    
    // Integrated hooks
    dateTimeInput,
    locationSearch: enhancedLocationSearch,
    
    // Validation
    isFormValid,
    
    // UI state
    statusToast,
    showError,
    showSuccess,
    
    // Chart state
    cachedChart,
    isChartGenerating,
    hasExistingChart,
    isLoadingCache,
    
    // Store state
    user,
    hasStoredData,
    isProfileComplete,
  };
}