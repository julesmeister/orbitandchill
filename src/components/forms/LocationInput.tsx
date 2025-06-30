/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface LocationInputProps {
  locationQuery: string;
  onLocationChange: (value: string) => void;
  isLocationFocused: boolean;
  setIsLocationFocused: (focused: boolean) => void;
  locationOptions: any[];
  showLocationDropdown: boolean;
  isLoadingLocations: boolean;
  locationInputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onLocationSelect: (location: any) => void;
}

const LocationInput = React.memo(({
  locationQuery,
  onLocationChange,
  isLocationFocused,
  setIsLocationFocused,
  locationOptions,
  showLocationDropdown,
  isLoadingLocations,
  locationInputRef,
  dropdownRef,
  onLocationSelect
}: LocationInputProps) => (
  <div
    className="synapsas-input-group relative"
    style={{
      zIndex: 30,
      isolation: 'isolate',
      transform: 'translateZ(0)'
    }}
  >
    <label className="synapsas-label">
      Location of Birth <span className="text-red-500">*</span>
    </label>
    <input
      ref={locationInputRef}
      type="text"
      value={locationQuery}
      onChange={(e) => onLocationChange(e.target.value)}
      onFocus={() => setIsLocationFocused(true)}
      onBlur={() => {
        setTimeout(() => setIsLocationFocused(false), 150);
      }}
      placeholder="e.g., New York, NY, USA"
      className="synapsas-input"
      required
      autoComplete="off"
    />

    {/* Location Dropdown */}
    {showLocationDropdown && isLocationFocused && (
      <div
        ref={dropdownRef}
        className="synapsas-location-dropdown"
        style={{
          zIndex: 4999,
          transform: 'translateZ(0)',
          isolation: 'isolate',
          position: 'absolute'
        }}
      >
        {isLoadingLocations ? (
          <div className="synapsas-dropdown-message">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
            Searching...
          </div>
        ) : locationOptions.length === 0 ? (
          <div className="synapsas-dropdown-message">
            No locations found
          </div>
        ) : (
          locationOptions.map((location) => (
            <button
              key={location.place_id}
              type="button"
              onClick={() => onLocationSelect(location)}
              className="synapsas-location-option"
            >
              <div className="font-medium text-black truncate">
                {location.display_name}
              </div>
            </button>
          ))
        )}
      </div>
    )}
  </div>
));

LocationInput.displayName = 'LocationInput';

export default LocationInput;