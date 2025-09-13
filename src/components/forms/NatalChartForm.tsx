/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { Person } from '../../types/people';
import { useFormData } from '../../hooks/dataHooks/useFormData';
import { useDateTimeInput } from '../../hooks/useDateTimeInput';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useUserStore } from '../../store/userStore';

// Keep the NatalChartFormData type for backward compatibility
export interface NatalChartFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
}
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import UnifiedLocationInput from './UnifiedLocationInput';
import PersonModeFields from './PersonModeFields';
import SubmitButton from './SubmitButton';

interface NatalChartFormProps {
  onSubmit?: (formData: NatalChartFormData) => void;
  submitText?: string;
  showSubmitButton?: boolean;
  mode?: 'user' | 'person';
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
}

const NatalChartForm = ({
  onSubmit,
  submitText = "Save Birth Data",
  showSubmitButton = true,
  mode = 'user',
  editingPerson = null,
  onPersonSaved
}: NatalChartFormProps) => {

  // Get hasStoredData from userStore
  const { hasStoredData } = useUserStore();

  // Use the new unified form data hook with service architecture
  const {
    formData,
    relationship,
    notes,
    isDefault,
    isSaving,
    isFormValid,
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit
  } = useFormData({
    mode,
    editingPerson,
    onPersonSaved,
    onSubmit: onSubmit ? (data) => onSubmit(data as NatalChartFormData) : undefined
  });

  // Date/Time input integration
  const dateTimeInput = useDateTimeInput({
    initialDate: formData.dateOfBirth,
    initialTime: formData.timeOfBirth,
    onChange: (dateString, timeString) => {
      handleInputChange('dateOfBirth', dateString);
      handleInputChange('timeOfBirth', timeString);
    }
  });

  // Location search integration
  const locationSearch = useLocationSearch((location) => {
    handleInputChange('locationOfBirth', location.display_name);
    handleInputChange('coordinates', {
      lat: location.lat,
      lon: location.lon
    });
  });

  // Location focus state and handlers
  const [isLocationFocused, setIsLocationFocused] = React.useState(false);

  const handleLocationFocus = () => {
    setIsLocationFocused(true);
  };

  const handleLocationBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!locationSearch.dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setTimeout(() => setIsLocationFocused(false), 150);
    }
  };

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
            setRelationship={handleRelationshipChange}
            notes={notes}
            setNotes={handleNotesChange}
            isDefault={isDefault}
            setIsDefault={handleIsDefaultChange}
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
              dateInput={dateTimeInput.dateInput}
              onDateChange={dateTimeInput.handleDateChange}
            />
          </div>

          {/* Time Section */}
          <div className="synapsas-datetime-section">
            <TimeInput
              timeInput={dateTimeInput.timeInput}
              onTimeChange={dateTimeInput.handleTimeChange}
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
        <UnifiedLocationInput
          locationQuery={locationSearch.locationQuery}
          locationOptions={locationSearch.locationOptions}
          showLocationDropdown={locationSearch.showLocationDropdown && isLocationFocused}
          isLoadingLocations={locationSearch.isLoadingLocations}
          onLocationInputChange={(value) => {
            locationSearch.setLocationQuery(value);
            handleInputChange('locationOfBirth', value);
          }}
          onLocationSelect={locationSearch.handleLocationSelect}
          onFocus={handleLocationFocus}
          onBlur={handleLocationBlur}
          compact={false}
          required={true}
        />

        {/* Submit Button */}
        {showSubmitButton && (
          <SubmitButton
            isFormValid={isFormValid}
            isGenerating={isSaving}
            isChartGenerating={isSaving}
            cachedChart={null}
            hasExistingChart={false}
            isLoadingCache={false}
            mode={mode}
            editingPerson={editingPerson}
            submitText={submitText}
          />
        )}
      </form>


      {/* Styles moved to global CSS - see globals.css for .synapsas-* classes */}
    </div>
  );
};

export default NatalChartForm;