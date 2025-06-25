/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BirthData } from '../../types/user';
import { Person, PersonFormData } from '../../types/people';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useUserStore } from '../../store/userStore';
import { usePeopleStore } from '../../store/peopleStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useStatusToast } from '../../hooks/useStatusToast';
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
  const router = useRouter();
  const { user, updateBirthData, hasStoredData, isProfileComplete } = useUserStore();
  const { addPerson, updatePerson } = usePeopleStore();
  const { cachedChart, generateChart, isGenerating: isChartGenerating } = useNatalChart();

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeInput, setTimeInput] = useState({ hours: '', minutes: '', period: 'AM' });
  const [dateInput, setDateInput] = useState({ month: '', day: '', year: '' });
  
  // Use status toast hook
  const { toast: statusToast, showError } = useStatusToast();

  // Helper functions for time conversion
  const convertTo24Hour = useCallback((hours: string, minutes: string, period: string) => {
    if (!hours || !minutes) return '';
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    const paddedMinutes = minutes.length === 1 ? minutes.padStart(2, '0') : minutes;
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

  // Consolidated form update handler
  const updateFormData = useCallback((updates: Partial<NatalChartFormData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);

    // Only update user birth data in user mode
    if (mode === 'user') {
      const { name: _name, ...birthData } = newFormData;
      updateBirthData(birthData);
    }
  }, [formData, updateBirthData, mode]);

  // Load saved data when user changes or when editing a person
  useEffect(() => {
    if (mode === 'user' && user?.birthData) {
      setFormData({
        name: user.username || '',
        dateOfBirth: user.birthData.dateOfBirth || '',
        timeOfBirth: user.birthData.timeOfBirth || '',
        locationOfBirth: user.birthData.locationOfBirth || '',
        coordinates: user.birthData.coordinates || { lat: '', lon: '' },
      });
      
      if (user.birthData.locationOfBirth) {
        setLocationQuery(user.birthData.locationOfBirth);
      }
      if (user.birthData.timeOfBirth) {
        const time12 = convertTo12Hour(user.birthData.timeOfBirth);
        setTimeInput(time12);
      }
      if (user.birthData.dateOfBirth) {
        const dateComponents = convertFromDateString(user.birthData.dateOfBirth);
        setDateInput(dateComponents);
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

      if (editingPerson.birthData.locationOfBirth) {
        setLocationQuery(editingPerson.birthData.locationOfBirth);
      }
      if (editingPerson.birthData.timeOfBirth) {
        const time12 = convertTo12Hour(editingPerson.birthData.timeOfBirth);
        setTimeInput(time12);
      }
      if (editingPerson.birthData.dateOfBirth) {
        const dateComponents = convertFromDateString(editingPerson.birthData.dateOfBirth);
        setDateInput(dateComponents);
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
  }, [user, convertTo12Hour, convertFromDateString, mode, editingPerson]);

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
    updateFormData({
      locationOfBirth: location.display_name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      }
    });
    setIsLocationFocused(false);
  });

  const handleInputChange = useCallback((field: keyof NatalChartFormData, value: string) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);

  const handleLocationInputChange = useCallback((value: string) => {
    setLocationQuery(value);
    updateFormData({ locationOfBirth: value });
  }, [setLocationQuery, updateFormData]);

  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    const newTimeInput = { ...timeInput, [field]: value };
    setTimeInput(newTimeInput);

    if (newTimeInput.hours && newTimeInput.minutes && newTimeInput.period) {
      const time24 = convertTo24Hour(newTimeInput.hours, newTimeInput.minutes, newTimeInput.period);
      if (time24) {
        updateFormData({ timeOfBirth: time24 });
      }
    }
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

    setIsGenerating(true);

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
          router.push('/chart');
          return;
        }

        const chartData = await generateChart(formData);
        
        if (chartData) {
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
      console.error('Failed to save:', error);
      showError(
        "Save Failed",
        "Failed to save your data. Please check your connection and try again.",
        5000
      );
    } finally {
      setIsGenerating(false);
    }
  }, [formData, onSubmit, isFormValid, cachedChart, router, mode, relationship, notes, isDefault, editingPerson, addPerson, updatePerson, onPersonSaved, generateChart, showError]);

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
            isGenerating={isGenerating}
            isChartGenerating={isChartGenerating}
            cachedChart={cachedChart}
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