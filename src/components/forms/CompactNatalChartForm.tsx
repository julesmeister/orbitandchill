/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { Person } from '../../types/people';
import { useNatalChartForm } from '../../hooks/useNatalChartForm';

// Import modular components
import RelationshipSelector from './components/RelationshipSelector';
import DateInput from './components/DateInput';
import TimeInput from './components/TimeInput';
import UnifiedLocationInput from './UnifiedLocationInput';
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
  
  
  // Use the unified form hook
  const {
    formData,
    relationship,
    notes,
    isDefault,
    isLocationFocused,
    isSaving,
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
    statusToast
  } = useNatalChartForm({
    mode: 'person',
    editingPerson,
    onPersonSaved
  });

  return (
    <div className="w-full bg-white" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
      <form onSubmit={handleSubmit} className="space-y-0" style={{ overflow: 'visible' }}>
        {/* Name & Relationship Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-black relative"
          style={{ 
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
        <UnifiedLocationInput
          locationQuery={locationSearch.locationQuery}
          locationOptions={locationSearch.locationOptions}
          showLocationDropdown={locationSearch.showLocationDropdown && isLocationFocused}
          isLoadingLocations={locationSearch.isLoadingLocations}
          onLocationInputChange={locationSearch.handleLocationInputChange}
          onLocationSelect={locationSearch.handleLocationSelect}
          onFocus={handleLocationFocus}
          onBlur={handleLocationBlur}
          compact={true}
          required={true}
        />

        {/* Notes Section */}
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
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      </form>
      
      {/* Include form styles */}
      <FormStyles />
    </div>
  );
};

export default CompactNatalChartForm;