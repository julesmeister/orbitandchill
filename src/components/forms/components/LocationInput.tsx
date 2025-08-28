/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef, useEffect } from 'react';

interface LocationOption {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  locationQuery: string;
  locationOptions: LocationOption[];
  showLocationDropdown: boolean;
  isLoadingLocations: boolean;
  onLocationInputChange: (value: string) => void;
  onLocationSelect: (location: LocationOption) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  locationQuery,
  locationOptions,
  showLocationDropdown,
  isLoadingLocations,
  onLocationInputChange,
  onLocationSelect,
  onFocus,
  onBlur,
  required = false
}) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 border-b border-black relative z-40">
      <label className="synapsas-label mb-2 block">
        Location of Birth {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={locationInputRef}
        type="text"
        value={locationQuery}
        onChange={(e) => onLocationInputChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="e.g., New York, NY, USA"
        className="synapsas-input"
        required={required}
        autoComplete="off"
      />

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-4 right-4 bg-white border border-black z-[9998] max-h-40 overflow-y-auto mt-1"
        >
          {isLoadingLocations ? (
            <div className="p-3 text-center text-black text-sm">
              <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          ) : locationOptions.length === 0 ? (
            <div className="p-3 text-center text-gray-500 text-sm">
              No locations found
            </div>
          ) : (
            locationOptions.map((location) => (
              <button
                key={location.place_id}
                type="button"
                onClick={() => onLocationSelect(location)}
                className="group relative w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 focus:outline-none focus:bg-gray-100 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative text-sm font-medium text-black truncate">
                  {location.display_name}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;