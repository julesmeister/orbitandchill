/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback, useEffect } from 'react';
import { Person, PersonFormData } from '../types/people';
import { usePeopleStore } from '../store/peopleStore';
import { useDateTimeInput } from './useDateTimeInput';
import { useLocationSearch } from './useLocationSearch';

interface FormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
}

interface UseCompactNatalChartFormOptions {
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
  onCancel?: () => void;
}

interface UseCompactNatalChartFormReturn {
  // Form state
  formData: FormData;
  relationship: Person['relationship'];
  notes: string;
  isDefault: boolean;
  isSaving: boolean;
  
  // Form handlers
  handleInputChange: (field: string, value: string) => void;
  handleRelationshipChange: (value: Person['relationship']) => void;
  handleNotesChange: (value: string) => void;
  handleIsDefaultChange: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  
  // Date/Time integration
  dateTimeInput: ReturnType<typeof useDateTimeInput>;
  
  // Location integration
  locationSearch: ReturnType<typeof useLocationSearch>;
  
  // Validation
  isFormValid: boolean;
  validationErrors: string[];
  
  // Utility
  relationshipOptions: Array<{ value: Person['relationship']; label: string }>;
}

// Relationship options constant
const RELATIONSHIP_OPTIONS: Array<{ value: Person['relationship']; label: string }> = [
  { value: 'self', label: 'Self' },
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'partner', label: 'Partner' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' }
];

/**
 * Comprehensive hook for managing compact natal chart form state and logic
 */
export function useCompactNatalChartForm({
  editingPerson = null,
  onPersonSaved,
  onCancel
}: UseCompactNatalChartFormOptions): UseCompactNatalChartFormReturn {
  
  const { addPerson, updatePerson } = usePeopleStore();
  
  // Basic form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    locationOfBirth: '',
    coordinates: { lat: '', lon: '' },
  });
  
  const [relationship, setRelationship] = useState<Person['relationship']>('friend');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Date/Time input integration
  const dateTimeInput = useDateTimeInput({
    initialDate: formData.dateOfBirth,
    initialTime: formData.timeOfBirth,
    onChange: (dateString, timeString) => {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: dateString,
        timeOfBirth: timeString
      }));
    }
  });

  // Location search integration
  const locationSearch = useLocationSearch((location) => {
    setFormData(prev => ({
      ...prev,
      locationOfBirth: location.display_name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      }
    }));
  });

  // Load data when editing a person
  useEffect(() => {
    if (editingPerson) {
      console.log('Loading person for edit:', editingPerson.name);
      
      // Update form data
      const newFormData: FormData = {
        name: editingPerson.name || '',
        dateOfBirth: editingPerson.birthData?.dateOfBirth || '',
        timeOfBirth: editingPerson.birthData?.timeOfBirth || '',
        locationOfBirth: editingPerson.birthData?.locationOfBirth || '',
        coordinates: editingPerson.birthData?.coordinates || { lat: '', lon: '' },
      };
      
      setFormData(newFormData);
      setRelationship(editingPerson.relationship || 'friend');
      setNotes(editingPerson.notes || '');
      setIsDefault(editingPerson.isDefault || false);
      
      // Update location query
      if (editingPerson.birthData?.locationOfBirth) {
        locationSearch.setLocationQuery(editingPerson.birthData.locationOfBirth);
      }
      
    } else {
      console.log('Resetting form for new person');
      // Reset form for new person
      setFormData({
        name: '',
        dateOfBirth: '',
        timeOfBirth: '',
        locationOfBirth: '',
        coordinates: { lat: '', lon: '' },
      });
      setRelationship('friend');
      setNotes('');
      setIsDefault(false);
      locationSearch.setLocationQuery('');
    }
  }, [editingPerson?.id, locationSearch.setLocationQuery]);

  // Form handlers
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleRelationshipChange = useCallback((value: Person['relationship']) => {
    setRelationship(value);
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
  }, []);

  const handleIsDefaultChange = useCallback((value: boolean) => {
    setIsDefault(value);
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Validation
  const validateForm = useCallback((): string[] => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!dateTimeInput.isValidDate) {
      errors.push('Valid birth date is required');
    }
    
    if (!dateTimeInput.isValidTime) {
      errors.push('Valid birth time is required');
    }
    
    if (!formData.locationOfBirth.trim()) {
      errors.push('Birth location is required');
    }
    
    if (!formData.coordinates.lat || !formData.coordinates.lon) {
      errors.push('Please select a location from the dropdown for accurate coordinates');
    }
    
    return errors;
  }, [formData, dateTimeInput]);

  const validationErrors = validateForm();
  const isFormValid = validationErrors.length === 0;

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      console.error('Form validation failed:', validationErrors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      const personFormData: PersonFormData = {
        name: formData.name,
        relationship,
        birthData: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          locationOfBirth: formData.locationOfBirth,
          coordinates: formData.coordinates,
        },
        notes: notes || undefined,
        isDefault,
      };

      let savedPerson: Person;
      
      if (editingPerson) {
        console.log('Updating existing person:', editingPerson.id);
        await updatePerson(editingPerson.id, personFormData);
        savedPerson = { 
          ...editingPerson, 
          ...personFormData, 
          updatedAt: new Date() 
        };
      } else {
        console.log('Creating new person');
        savedPerson = await addPerson(personFormData);
      }

      console.log('Person saved successfully:', savedPerson);
      
      if (onPersonSaved) {
        onPersonSaved(savedPerson);
      }

    } catch (error) {
      console.error('Failed to save person:', error);
      // TODO: Add toast notification or error handling
    } finally {
      setIsSaving(false);
    }
  }, [
    isFormValid, 
    validationErrors,
    formData, 
    relationship, 
    notes, 
    isDefault,
    editingPerson, 
    updatePerson, 
    addPerson, 
    onPersonSaved
  ]);

  // Location input change handler
  const handleLocationInputChange = useCallback((value: string) => {
    locationSearch.setLocationQuery(value);
    setFormData(prev => ({ ...prev, locationOfBirth: value }));
  }, [locationSearch.setLocationQuery]);

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
    isSaving,
    
    // Form handlers
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit,
    handleCancel,
    
    // Integrated hooks
    dateTimeInput,
    locationSearch: enhancedLocationSearch,
    
    // Validation
    isFormValid,
    validationErrors,
    
    // Utility
    relationshipOptions: RELATIONSHIP_OPTIONS,
  };
}

/**
 * Helper hook for relationship dropdown management
 */
export function useRelationshipDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Person['relationship']>('friend');

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback((value: Person['relationship']) => {
    setSelectedValue(value);
    setIsOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    selectedValue,
    handleToggle,
    handleSelect,
    handleClose,
    setSelectedValue,
  };
}