/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { Person } from '../../types/people';
import { useFormData } from '../../hooks/dataHooks/useFormData';
import { useDateTimeInput } from '../../hooks/useDateTimeInput';
import { useLocationSearch } from '../../hooks/useLocationSearch';

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
    mode: 'person',
    editingPerson,
    onPersonSaved
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

  // Location search integration with initial value from form data
  const locationSearch = useLocationSearch((location) => {
    // Update location name and coordinates
    handleInputChange('locationOfBirth', location.display_name);
    handleInputChange('coordinates', {
      lat: location.lat,
      lon: location.lon
    });
  }, formData.locationOfBirth);

  // Location focus state
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
          onLocationInputChange={(value) => {
            locationSearch.setLocationQuery(value);
            handleInputChange('locationOfBirth', value);
          }}
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