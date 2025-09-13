/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useRef } from 'react';

interface LocationOption {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface UnifiedLocationInputProps {
  // Core props
  locationQuery: string;
  locationOptions: LocationOption[];
  showLocationDropdown: boolean;
  isLoadingLocations: boolean;
  onLocationInputChange: (value: string) => void;
  onLocationSelect: (location: LocationOption) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  // Optional props for different layouts
  compact?: boolean;
  required?: boolean;
  className?: string;
}

export const UnifiedLocationInput: React.FC<UnifiedLocationInputProps> = ({
  locationQuery,
  locationOptions,
  showLocationDropdown,
  isLoadingLocations,
  onLocationInputChange,
  onLocationSelect,
  onFocus,
  onBlur,
  compact = false,
  required = true,
  className = ''
}) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Container classes based on layout mode
  const containerClasses = compact 
    ? "p-4 border-b border-black relative"
    : "synapsas-input-group relative";

  const containerStyles = {
    zIndex: showLocationDropdown ? 1500 : 30,
    isolation: 'isolate' as const,
    transform: 'translateZ(0)'
  };

  return (
    <div 
      className={`${containerClasses} ${className}`}
      style={containerStyles}
    >
      <label className="synapsas-label mb-2 block" htmlFor="location-input">
        Location of Birth {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id="location-input"
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
        aria-describedby="location-help"
        aria-required={required ? "true" : "false"}
        aria-expanded={showLocationDropdown}
        aria-autocomplete="list"
        role="combobox"
      />
      <div id="location-help" className="sr-only">
        Enter your birth location. Start typing to see suggestions.
      </div>

      {/* Location Dropdown with improved UI */}
      {showLocationDropdown && (
        <div
          ref={dropdownRef}
          className="synapsas-location-dropdown"
          role="listbox"
          aria-label="Location suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: compact ? 0 : 0,
            right: compact ? 0 : 0,
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: 0,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            maxHeight: '15rem',
            overflowY: 'auto',
            marginTop: '0.25rem'
          }}
        >
          {isLoadingLocations ? (
            <div className="synapsas-dropdown-message" style={{
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          ) : locationOptions.length === 0 ? (
            <div className="synapsas-dropdown-message" style={{
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              No locations found
            </div>
          ) : (
            locationOptions.map((location) => (
              <button
                key={location.place_id}
                type="button"
                onClick={() => onLocationSelect(location)}
                className="synapsas-location-option-unified"
                role="option"
                aria-label={`Select location: ${location.display_name}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.paddingLeft = '1.25rem';
                  const gradient = e.currentTarget.querySelector('.hover-gradient') as HTMLElement;
                  if (gradient) {
                    gradient.style.transform = 'translateX(100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.paddingLeft = '1rem';
                  const gradient = e.currentTarget.querySelector('.hover-gradient') as HTMLElement;
                  if (gradient) {
                    gradient.style.transform = 'translateX(-100%)';
                  }
                }}
              >
                {/* Animated background gradient for visual appeal */}
                <div 
                  className="hover-gradient"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, transparent, rgba(251, 191, 36, 0.1), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.7s',
                    pointerEvents: 'none'
                  }} 
                />
                
                <div style={{
                  position: 'relative',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#19181a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
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

export default UnifiedLocationInput;