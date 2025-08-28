/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Person, PersonFormData } from '../../types/people';
import { useCompactNatalChartForm } from '../../hooks/useCompactNatalChartForm';

// Import modular components
import PersonFormFields from './components/PersonFormFields';
import RelationshipSelector from './components/RelationshipSelector';
import DateInput from './components/DateInput';
import TimeInput from './components/TimeInput';
import LocationInput from './components/LocationInput';
import FormActions from './components/FormActions';
import FormStyles from './components/FormStyles';

interface CompactNatalChartFormProps {
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
  onCancel?: () => void;
}

const CompactNatalChartForm = ({ 
  editingPerson = null,
  onPersonSaved,
  onCancel
}: CompactNatalChartFormProps) => {
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  // Use the comprehensive form hook
  const {
    formData,
    relationship,
    notes,
    isDefault,
    isSaving,
    handleInputChange,
    handleRelationshipChange,
    handleNotesChange,
    handleIsDefaultChange,
    handleSubmit,
    handleCancel,
    dateTimeInput,
    locationSearch,
    isFormValid,
    validationErrors,
    relationshipOptions
  } = useCompactNatalChartForm({
    editingPerson,
    onPersonSaved,
    onCancel
  });

  // Handle location input changes with focus management
  const handleLocationInputChange = useCallback((value: string) => {
    locationSearch.handleLocationInputChange(value);
  }, [locationSearch]);

  const handleLocationFocus = useCallback(() => {
    setIsLocationFocused(true);
  }, []);

  const handleLocationBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Only blur if not clicking on dropdown
    if (!locationSearch.dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setTimeout(() => setIsLocationFocused(false), 150);
    }
  }, [locationSearch]);

  // The form loading is now handled by useCompactNatalChartForm hook

  // Handler functions are now provided by useCompactNatalChartForm hook

  // All handler functions and data are now managed by the hook

  // Window focus handling for location dropdown
  React.useEffect(() => {
    const handleWindowFocus = () => {
      if (isLocationFocused && !locationSearch.locationInputRef.current?.matches(':focus')) {
        setIsLocationFocused(false);
      }
    };

    const handleWindowBlur = () => {
      setIsLocationFocused(false);
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isLocationFocused, locationSearch]);

  // Form validation and submission are handled by the hook

  // Relationship icons are handled by the RelationshipSelector component

  return (
    <div className="w-full bg-white" style={{ overflow: 'visible' }}>
      <form onSubmit={handleSubmit} className="space-y-0" style={{ overflow: 'visible' }}>
        {/* Name & Relationship Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-black"
          style={{ 
            zIndex: 15000,
            isolation: 'isolate',
            transform: 'translateZ(0)',
            overflow: 'visible'
          }}
        >
          <div className="p-4 md:border-r border-black">
            <label className="synapsas-label mb-2 block">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Person's name"
              className="synapsas-input"
              required
            />
          </div>
          
          <RelationshipSelector
            relationship={relationship}
            onRelationshipChange={handleRelationshipChange}
            required
          />
        </div>

        {/* Date Section */}
        <DateInput
          dateInput={dateTimeInput.dateInput}
          onDateChange={dateTimeInput.handleDateChange}
          required
        />

        {/* Time Section */}
        <TimeInput
          timeInput={dateTimeInput.timeInput}
          onTimeChange={dateTimeInput.handleTimeChange}
          required
        />

        {/* Location Section */}
        <LocationInput
          locationQuery={locationSearch.locationQuery}
          locationOptions={locationSearch.locationOptions}
          showLocationDropdown={locationSearch.showLocationDropdown && isLocationFocused}
          isLoadingLocations={locationSearch.isLoadingLocations}
          onLocationInputChange={handleLocationInputChange}
          onLocationSelect={(location: any) => locationSearch.handleLocationSelect(location)}
          onFocus={handleLocationFocus}
          onBlur={handleLocationBlur}
          required
        />

        {/* Notes Section - Using PersonFormFields component */}
        <div className="p-4 border-b border-black">
          <label className="synapsas-label mb-2 block">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any notes about this person..."
            className="synapsas-input resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <FormActions
          isFormValid={isFormValid}
          isSaving={isSaving}
          isEditing={!!editingPerson}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </form>
      
      {/* Include form styles */}
      <FormStyles />
    </div>
  );
};

export default CompactNatalChartForm;