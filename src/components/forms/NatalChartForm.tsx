/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BirthData } from '../../types/user';
import { Person, PersonFormData } from '../../types/people';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useUserStore } from '../../store/userStore';
import { usePeopleStore } from '../../store/peopleStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useStatusToast } from '../../hooks/useStatusToast';
import { trackChartGeneration, trackUserRegistration } from '../../lib/analytics';
import StatusToast from '../reusable/StatusToast';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import LocationInput from './LocationInput';
import PersonModeFields from './PersonModeFields';
import SubmitButton from './SubmitButton';

/**
 * Form data structure extending BirthData with optional name field
 */
export interface NatalChartFormData extends BirthData {
  name: string; // Optional name field for the form
}

interface NatalChartFormProps {
  onSubmit?: (formData: NatalChartFormData) => void;
  submitText?: string;
  showSubmitButton?: boolean;
  mode?: 'user' | 'person'; // New mode prop to distinguish between updating user or managing people
  editingPerson?: Person | null; // Person being edited (for person mode)
  onPersonSaved?: (person: Person) => void; // Callback when person is saved
}

const NatalChartForm = ({
  onSubmit,
  submitText = "Save Birth Data",
  showSubmitButton = true,
  mode = 'user',
  editingPerson = null,
  onPersonSaved
}: NatalChartFormProps) => {
  // Removed excessive render logging for performance
  
  const router = useRouter();
  
  // Use selective store subscriptions to prevent unnecessary re-renders
  const user = useUserStore(state => state.user);
  const userId = useUserStore(state => state.user?.id); // Extract ID separately for stability
  const userBirthData = useUserStore(state => state.user?.birthData); // Extract birth data separately
  const userUsername = useUserStore(state => state.user?.username); // Extract username separately
  const updateBirthData = useUserStore(state => state.updateBirthData);  
  const hasStoredData = useUserStore(state => state.hasStoredData);
  const isProfileComplete = useUserStore(state => state.isProfileComplete);
  
  const addPerson = usePeopleStore(state => state.addPerson);
  const updatePerson = usePeopleStore(state => state.updatePerson);
  
  // useNatalChart is a custom hook that returns an object
  const { cachedChart, generateChart, isGenerating: isChartGenerating, hasExistingChart, isLoadingCache } = useNatalChart();
  
  // Removed store value logging for performance

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
  const [timeInput, setTimeInput] = useState({ hours: '', minutes: '', period: 'AM' });
  const [dateInput, setDateInput] = useState({ month: '', day: '', year: '' });
  const [isUserTypingTime, setIsUserTypingTime] = useState(false);
  const [isUserTypingLocation, setIsUserTypingLocation] = useState(false);
  
  // Debounced birth data update to prevent API calls on every keystroke
  const debouncedUpdateRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use status toast hook
  const { toast: statusToast, showError, showSuccess } = useStatusToast();

  // Helper functions for time conversion
  const convertTo24Hour = useCallback((hours: string, minutes: string, period: string) => {
    if (!hours || !minutes) return '';
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    // Always pad minutes to 2 digits for the final time string
    const paddedMinutes = minutes.padStart(2, '0');
    return `${hour24.toString().padStart(2, '0')}:${paddedMinutes}`;
  }, []);

  // Helper functions for date conversion
  const convertToDateString = useCallback((month: string, day: string, year: string) => {
    if (!month || !day || !year) return '';
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }, []);

  const convertFromDateString = useCallback((dateString: string) => {
    if (!dateString) return { month: '', day: '', year: '' };
    const [year, month, day] = dateString.split('-');
    return {
      month: parseInt(month).toString(),
      day: parseInt(day).toString(),
      year: year
    };
  }, []);

  const convertTo12Hour = useCallback((time24: string) => {
    if (!time24) return { hours: '', minutes: '', period: 'AM' };
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hours: hour12.toString(),
      minutes: minutes,
      period: period
    };
  }, []);

  // Debounced birth data update to prevent API calls on every keystroke
  const debouncedUpdateBirthData = useCallback((birthData: Partial<BirthData>) => {
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }
    
    debouncedUpdateRef.current = setTimeout(() => {
      updateBirthData(birthData);
    }, 1000); // Wait 1 second after user stops typing
  }, [updateBirthData]);

  // Consolidated form update handler
  const updateFormData = useCallback((updates: Partial<NatalChartFormData>) => {
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, ...updates };
      
      // Only update user birth data in user mode (debounced to prevent API spam)
      if (mode === 'user') {
        const { name: _name, ...birthData } = newFormData;
        debouncedUpdateBirthData(birthData);
      }
      
      return newFormData;
    });
  }, [mode, debouncedUpdateBirthData]);

  // Ensure anonymous user exists on mount for user mode
  useEffect(() => {
    if (mode === 'user' && !userId) {
      const ensureUser = async () => {
        const { ensureAnonymousUser } = useUserStore.getState();
        await ensureAnonymousUser();
      };
      ensureUser();
    }
  }, [mode, userId]);

  // Load saved data when user changes or when editing a person
  useEffect(() => {
    if (mode === 'user' && userBirthData) {
      setFormData({
        name: userUsername || '',
        dateOfBirth: userBirthData.dateOfBirth || '',
        timeOfBirth: userBirthData.timeOfBirth || '',
        locationOfBirth: userBirthData.locationOfBirth || '',
        coordinates: userBirthData.coordinates || { lat: '', lon: '' },
      });
      
      if (userBirthData.locationOfBirth && !isUserTypingLocation) {
        setLocationQuery(userBirthData.locationOfBirth);
      }
      if (userBirthData.timeOfBirth && !isUserTypingTime) {
        // Convert 24-hour to 12-hour inline to avoid function dependency
        const [hours, minutes] = userBirthData.timeOfBirth.split(':');
        const hour24 = parseInt(hours);
        const period = hour24 >= 12 ? 'PM' : 'AM';
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        setTimeInput({
          hours: hour12.toString(),
          minutes: minutes,
          period: period
        });
      }
      if (userBirthData.dateOfBirth) {
        // Convert date string inline to avoid function dependency
        const [year, month, day] = userBirthData.dateOfBirth.split('-');
        setDateInput({
          month: parseInt(month).toString(),
          day: parseInt(day).toString(),
          year: year
        });
      }
    } else if (mode === 'person' && editingPerson) {
      setFormData({
        name: editingPerson.name,
        dateOfBirth: editingPerson.birthData.dateOfBirth,
        timeOfBirth: editingPerson.birthData.timeOfBirth,
        locationOfBirth: editingPerson.birthData.locationOfBirth,
        coordinates: editingPerson.birthData.coordinates,
      });
      setRelationship(editingPerson.relationship);
      setNotes(editingPerson.notes || '');
      setIsDefault(editingPerson.isDefault || false);

      if (editingPerson.birthData.locationOfBirth && !isUserTypingLocation) {
        setLocationQuery(editingPerson.birthData.locationOfBirth);
      }
      if (editingPerson.birthData.timeOfBirth && !isUserTypingTime) {
        // Convert 24-hour to 12-hour inline
        const [hours, minutes] = editingPerson.birthData.timeOfBirth.split(':');
        const hour24 = parseInt(hours);
        const period = hour24 >= 12 ? 'PM' : 'AM';
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        setTimeInput({
          hours: hour12.toString(),
          minutes: minutes,
          period: period
        });
      }
      if (editingPerson.birthData.dateOfBirth) {
        // Convert date string inline
        const [year, month, day] = editingPerson.birthData.dateOfBirth.split('-');
        setDateInput({
          month: parseInt(month).toString(),
          day: parseInt(day).toString(),
          year: year
        });
      }
    } else if (mode === 'person' && !editingPerson) {
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
      setLocationQuery('');
      setTimeInput({ hours: '', minutes: '', period: 'AM' });
      setDateInput({ month: '', day: '', year: '' });
    }
  }, [userId, mode, editingPerson?.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedUpdateRef.current) {
        clearTimeout(debouncedUpdateRef.current);
      }
    };
  }, []);

  const {
    locationQuery,
    setLocationQuery,
    locationOptions,
    showLocationDropdown,
    setShowLocationDropdown,
    isLoadingLocations,
    locationInputRef,
    dropdownRef,
    handleLocationSelect: onLocationSelect,
  } = useLocationSearch((location) => {
    setIsUserTypingLocation(false); // User selected a location, so they're done typing
    
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
    
    // Immediately update birth data for location selection (no debounce)
    if (mode === 'user') {
      updateBirthData(newFormData);
    }
    
    setIsLocationFocused(false);
  });

  const handleInputChange = useCallback((field: keyof NatalChartFormData, value: string) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);

  const handleLocationInputChange = useCallback((value: string) => {
    setIsUserTypingLocation(true);
    setLocationQuery(value);
    updateFormData({ locationOfBirth: value });
    
    // Reset typing flag after user stops typing
    setTimeout(() => {
      setIsUserTypingLocation(false);
    }, 500);
  }, [updateFormData]);

  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    setIsUserTypingTime(true);
    const newTimeInput = { ...timeInput, [field]: value };
    setTimeInput(newTimeInput);

    // Only update form data if all fields are complete
    if (newTimeInput.hours && newTimeInput.minutes && newTimeInput.period && 
        newTimeInput.hours.length > 0 && newTimeInput.minutes.length >= 1) {
      const time24 = convertTo24Hour(newTimeInput.hours, newTimeInput.minutes, newTimeInput.period);
      if (time24) {
        updateFormData({ timeOfBirth: time24 });
      }
    }
    
    // Reset typing flag after user stops typing
    setTimeout(() => setIsUserTypingTime(false), 500);
  }, [timeInput, convertTo24Hour, updateFormData]);

  const handleDateInputChange = useCallback((field: 'month' | 'day' | 'year', value: string) => {
    const newDateInput = { ...dateInput, [field]: value };
    setDateInput(newDateInput);

    if (newDateInput.month && newDateInput.day && newDateInput.year) {
      const dateString = convertToDateString(newDateInput.month, newDateInput.day, newDateInput.year);
      if (dateString) {
        updateFormData({ dateOfBirth: dateString });
      }
    }
  }, [dateInput, convertToDateString, updateFormData]);

  const isFormValid = useMemo(() => {
    const baseValid = !!(formData.dateOfBirth && formData.timeOfBirth && formData.locationOfBirth &&
      formData.coordinates.lat && formData.coordinates.lon);

    if (mode === 'person') {
      return baseValid && !!formData.name.trim();
    }

    return baseValid;
  }, [formData, mode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coordinates.lat || !formData.coordinates.lon) {
      showError(
        "Location Required", 
        "Please select a location from the dropdown to ensure accurate chart calculations.",
        4000
      );
      return;
    }

    if (!isFormValid) return;

    // Clear any pending debounced updates and immediately save data
    if (debouncedUpdateRef.current) {
      clearTimeout(debouncedUpdateRef.current);
    }
    
    // Ensure latest data is saved before generating chart
    if (mode === 'user') {
      const { name: _name, ...birthData } = formData;
      await updateBirthData(birthData);
    }
    try {
      if (mode === 'person') {
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
          await updatePerson(editingPerson.id, personFormData);
          savedPerson = { ...editingPerson, ...personFormData, updatedAt: new Date() };
        } else {
          savedPerson = await addPerson(personFormData);
        }

        if (onPersonSaved) {
          onPersonSaved(savedPerson);
        }
      } else {
        if (cachedChart) {
          // Navigate immediately if chart is cached
          router.push('/chart');
          return;
        }

        // Ensure we pass the complete form data to generateChart
        const chartFormData = {
          name: formData.name || userUsername || 'Natal Chart',
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          locationOfBirth: formData.locationOfBirth,
          coordinates: formData.coordinates
        };
        
        const chartData = await generateChart(chartFormData);
        
        if (chartData) {
          // Track successful chart generation
          trackChartGeneration('natal');
          
          // Navigate immediately - no delays
          router.push('/chart');
        } else {
          showError(
            "Chart Generation Failed",
            "Unable to generate your natal chart. Please check your data and try again.",
            5000
          );
        }

        if (onSubmit) {
          await onSubmit(formData);
        }
      }
    } catch (error) {
      console.error('🚨 CATCH BLOCK - Failed to save:', error);
      console.error('🚨 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error
      });
      showError(
        "Save Failed",
        "Failed to save your data. Please check your connection and try again.",
        5000
      );
    }
  }, [
    // Only include primitive values and stable references
    mode, 
    relationship, 
    notes, 
    isDefault,
    editingPerson?.id, // Only ID, not full object
    onSubmit,
    onPersonSaved,
    // Remove: formData, isFormValid, cachedChart (accessed directly)
    // Remove: router, addPerson, updatePerson, generateChart, showError, updateBirthData (stable functions)
  ]);
  
  // handleSubmit optimized - dependencies reduced for performance

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-3 font-space-grotesk">
          {mode === 'person'
            ? editingPerson
              ? `Edit ${editingPerson.name || 'Person'}`
              : 'Add New Person'
            : 'Create Your Natal Chart'
          }
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          {mode === 'person'
            ? 'Enter birth details for this person'
            : 'Enter your birth details to discover your cosmic blueprint'
          }
          {mode === 'user' && hasStoredData && (
            <span className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Your data is automatically saved
            </span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="synapsas-input-group">
          <label className="synapsas-label">
            {mode === 'person' ? 'Name' : 'Name (Optional)'}
            {mode === 'person' && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={mode === 'person' ? "Enter person's name" : "Enter your name"}
            className="synapsas-input"
            required={mode === 'person'}
          />
        </div>

        {/* Person Mode Fields */}
        {mode === 'person' && (
          <PersonModeFields
            relationship={relationship}
            setRelationship={setRelationship}
            notes={notes}
            setNotes={setNotes}
            isDefault={isDefault}
            setIsDefault={setIsDefault}
          />
        )}

        {/* Date and Time of Birth */}
        <div className="synapsas-input-group">
          <label className="synapsas-label mb-4">
            Date & Time of Birth <span className="text-red-500">*</span>
          </label>

          {/* Date Section */}
          <div className="synapsas-datetime-section">
            <DateInput
              dateInput={dateInput}
              onDateChange={handleDateInputChange}
            />
          </div>

          {/* Time Section */}
          <div className="synapsas-datetime-section">
            <TimeInput
              timeInput={timeInput}
              onTimeChange={handleTimeInputChange}
            />
          </div>

          <div className="synapsas-helper-text">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Enter your exact birth date and time for accurate astrological calculations</span>
          </div>
        </div>

        {/* Location of Birth */}
        <LocationInput
          locationQuery={locationQuery}
          onLocationChange={handleLocationInputChange}
          isLocationFocused={isLocationFocused}
          setIsLocationFocused={setIsLocationFocused}
          locationOptions={locationOptions}
          showLocationDropdown={showLocationDropdown}
          isLoadingLocations={isLoadingLocations}
          locationInputRef={locationInputRef}
          dropdownRef={dropdownRef}
          onLocationSelect={onLocationSelect}
        />

        {/* Submit Button */}
        {showSubmitButton && (
          <SubmitButton
            isFormValid={isFormValid}
            isGenerating={isChartGenerating}
            isChartGenerating={isChartGenerating}
            cachedChart={cachedChart}
            hasExistingChart={hasExistingChart}
            isLoadingCache={isLoadingCache}
            mode={mode}
            editingPerson={editingPerson}
            submitText={submitText}
          />
        )}
      </form>

      {/* Status Toast */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={() => {}}
        duration={statusToast.duration}
      />

      {/* Styles moved to global CSS - see globals.css for .synapsas-* classes */}
    </div>
  );
};

export default NatalChartForm;