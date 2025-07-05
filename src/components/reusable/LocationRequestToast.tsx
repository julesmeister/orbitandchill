/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { approximateTimeZoneFromCoordinates } from '@/utils/timeZoneHandler';

interface LocationRequestToastProps {
  isVisible: boolean;
  onHide: () => void;
  onLocationSet: (location: LocationData) => void;
  onRequestPermission?: () => void;
}

interface LocationData {
  name: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  timezone?: string;
}

interface LocationSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export default function LocationRequestToast({ 
  isVisible, 
  onHide,
  onLocationSet,
  onRequestPermission
}: LocationRequestToastProps) {
  const { user } = useUserStore();
  const [shouldRender, setShouldRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'failed'>('idle');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
        setGpsStatus('idle');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setShowResults(true);
      }
    } catch (error) {
      // console.error('Location search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    searchTimeout.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleLocationSelect = async (result: LocationSearchResult) => {
    // Get timezone from coordinates
    const tzResult = approximateTimeZoneFromCoordinates(
      parseFloat(result.lat), 
      parseFloat(result.lon)
    );
    
    const locationData: LocationData = {
      name: result.display_name,
      coordinates: {
        lat: result.lat,
        lon: result.lon
      },
      timezone: tzResult.timeZone
    };

    // Save location to user database
    if (user?.id) {
      try {
        const response = await fetch('/api/users/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            location: locationData
          })
        });

        const result = await response.json();
        
        if (result.success) {
          // console.log('✅ Location saved to database:', result.location);
          // console.log('✅ User ID:', user.id, 'Location name:', locationData.name);
        } else {
          // console.warn('⚠️ Failed to save location to database:', result.error);
        }
      } catch (error) {
        // console.error('❌ Failed to save location:', error);
      }
    }

    // Always proceed with setting location locally (for immediate use)
    onLocationSet(locationData);
    onHide();
  };

  const handleEnableGPS = async () => {
    setGpsStatus('requesting');
    
    try {
      // Try to request location permission directly
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 10000, enableHighAccuracy: false }
        );
      });

      // Success! Set the location and close toast
      const tzResult = approximateTimeZoneFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      
      const locationData = {
        name: `Your Current Location (${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°)`,
        coordinates: {
          lat: position.coords.latitude.toString(),
          lon: position.coords.longitude.toString()
        },
        timezone: tzResult.timeZone
      };

      handleLocationSelect({ 
        display_name: locationData.name,
        lat: locationData.coordinates.lat,
        lon: locationData.coordinates.lon,
        place_id: 'gps_location'
      });

    } catch (error) {
      // GPS failed, show the failure status and keep toast open
      // console.log('GPS location failed:', error);
      setGpsStatus('failed');
      
      // Also call the original onRequestPermission if provided (for hook integration)
      if (onRequestPermission) {
        onRequestPermission();
      }
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <div 
        className={`
          bg-white border-2 border-black shadow-lg max-w-sm pointer-events-auto
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-95'
          }
        `}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-black bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold font-space-grotesk text-black">
                Set Your Location
              </h4>
            </div>

            <button
              onClick={onHide}
              className="flex-shrink-0 text-black hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {gpsStatus === 'failed' ? (
            <div className="mb-4">
              <p className="text-sm text-black mb-2 font-open-sans">
                GPS location failed. Please search for your city below:
              </p>
              <div className="text-xs text-gray-600 font-open-sans">
                💡 Try searching "Manila" or "Philippines" for better results
              </div>
            </div>
          ) : (
            <p className="text-sm text-black mb-4 font-open-sans">
              For accurate void moon calculations, please set your location:
            </p>
          )}

          {/* GPS Enable Button */}
          {gpsStatus !== 'failed' && (
            <button
              onClick={handleEnableGPS}
              disabled={gpsStatus === 'requesting'}
              className="w-full mb-3 px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-space-grotesk font-bold border border-black"
            >
              {gpsStatus === 'requesting' ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Requesting Location...
                </span>
              ) : (
                '📍 Enable GPS Location'
              )}
            </button>
          )}

          {gpsStatus !== 'failed' && (
            <div className="text-center text-xs text-gray-500 mb-3 font-open-sans">or</div>
          )}

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for your city..."
              className="w-full px-3 py-2 border border-black bg-white text-black placeholder-gray-500 text-sm font-open-sans focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            
            {isSearching && (
              <div className="absolute right-2 top-2">
                <svg className="w-4 h-4 animate-spin text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-2 border border-black bg-white max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors font-open-sans"
                >
                  <div className="text-black truncate">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
            <div className="mt-2 p-3 text-sm text-gray-500 border border-gray-300 bg-gray-50 font-open-sans">
              No locations found. Try a different search term.
            </div>
          )}

          {/* Skip Option */}
          <button
            onClick={onHide}
            className="w-full mt-3 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors font-open-sans"
          >
            {gpsStatus === 'failed' 
              ? 'Skip and use New York as fallback' 
              : 'Skip for now (uses New York as fallback)'
            }
          </button>
        </div>
      </div>
    </div>
  );
}