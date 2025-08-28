/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { Person } from '../../types/people';
import { useNatalChartForm, NatalChartFormData } from '../../hooks/useNatalChartForm';
import StatusToast from '../reusable/StatusToast';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import LocationInput from './LocationInput';
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
  
  // Use the unified form hook
  const {
    formData,
    relationship,
    notes,
    isDefault,
    isLocationFocused,
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit,
    handleLocationFocus,
    handleLocationBlur,
    dateTimeInput,
    locationSearch,
    isFormValid,
    statusToast,
    cachedChart,
    isChartGenerating,
    hasExistingChart,
    isLoadingCache,
    user,
    hasStoredData,
  } = useNatalChartForm({
    mode,
    editingPerson,
    onPersonSaved,
    onSubmit,
    submitText
  });

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
        <LocationInput
          locationQuery={locationSearch.locationQuery}
          onLocationChange={locationSearch.handleLocationInputChange}
          isLocationFocused={isLocationFocused}
          setIsLocationFocused={handleLocationFocus}
          locationOptions={locationSearch.locationOptions}
          showLocationDropdown={locationSearch.showLocationDropdown}
          isLoadingLocations={locationSearch.isLoadingLocations}
          locationInputRef={locationSearch.locationInputRef}
          dropdownRef={locationSearch.dropdownRef}
          onLocationSelect={locationSearch.handleLocationSelect}
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