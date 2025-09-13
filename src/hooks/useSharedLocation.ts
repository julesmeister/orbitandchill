/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
// Location analytics removed - using Google Analytics
import { approximateTimeZoneFromCoordinates } from '../utils/timeZoneHandler';

interface LocationData {
  name: string;
  coordinates: { lat: string; lon: string };
  timezone?: string;
}

interface LocationState {
  currentLocation: LocationData | null;
  isLoading: boolean;
  error?: {
    type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'not_supported' | 'unknown';
    message: string;
    canRetry: boolean;
  };
  showLocationToast: boolean;
  locationUsed?: {
    name: string;
    source: 'birth' | 'current' | 'fallback';
    coordinates: { lat: string; lon: string };
  };
}

// Helper function to get current geolocation
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
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
};

// Helper function to get location error details
const getLocationError = (error: any) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        type: 'permission_denied' as const,
        message: 'Location access denied by user',
        canRetry: true
      };
    case error.POSITION_UNAVAILABLE:
      return {
        type: 'position_unavailable' as const,
        message: 'Location information unavailable',
        canRetry: true
      };
    case error.TIMEOUT:
      return {
        type: 'timeout' as const,
        message: 'Location request timed out',
        canRetry: true
      };
    default:
      return {
        type: 'unknown' as const,
        message: error.message || 'Unknown location error',
        canRetry: true
      };
  }
};

// Reverse geocoding to get location name from coordinates
const getLocationName = async (lat: string, lon: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data.display_name) {
      // Extract city and state/country for a cleaner display
      const parts = data.display_name.split(',');
      if (parts.length >= 2) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
      }
      return data.display_name;
    }
    
    return `${lat}, ${lon}`;
  } catch (error) {
    console.warn('Failed to reverse geocode location:', error);
    return `${lat}, ${lon}`;
  }
};

/**
 * Shared location hook that provides consistent location management across the app
 * Implements location hierarchy: user current location → birth location → fallback
 */
export const useSharedLocation = () => {
  const { user } = useUserStore();
  
  const [locationState, setLocationState] = useState<LocationState>({
    currentLocation: null,
    isLoading: false,
    showLocationToast: false
  });

  // Load saved location from database when user changes
  useEffect(() => {
    const loadSavedLocation = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/location?userId=${user.id}`);
          const result = await response.json();
          
          if (result.success && result.location) {
            // Ensure timezone is included
            let timezone = result.location.timezone;
            if (!timezone && result.location.coordinates) {
              const tzResult = approximateTimeZoneFromCoordinates(
                parseFloat(result.location.coordinates.lat),
                parseFloat(result.location.coordinates.lon)
              );
              timezone = tzResult.timeZone;
            }
            
            const savedLocation: LocationData = {
              name: result.location.name,
              coordinates: result.location.coordinates,
              timezone: timezone
            };
            
            setLocationState(prev => ({
              ...prev,
              currentLocation: savedLocation
            }));
            
            // console.log('✅ Loaded saved location from database:', savedLocation.name);
          }
        } catch (error) {
          // console.warn('Failed to load saved location from database:', error);
        }
      } else {
        // Clear current location when user logs out
        setLocationState(prev => ({
          ...prev,
          currentLocation: null
        }));
      }
    };

    loadSavedLocation();
  }, [user?.id]);

  // Auto-show location toast if user has no location set and is on horary page
  useEffect(() => {
    // Only show if we have a user, no current location, no birth location, and aren't already showing the toast
    if (user?.id && 
        !locationState.currentLocation && 
        !user.birthData?.coordinates &&
        !locationState.showLocationToast &&
        typeof window !== 'undefined' && 
        window.location.pathname === '/horary') {
      
      // Add a small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setLocationState(prev => ({ ...prev, showLocationToast: true }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user?.id, user?.birthData?.coordinates, locationState.currentLocation, locationState.showLocationToast]);

  // Get the best available location following the hierarchy
  const getBestLocation = useCallback((): {
    name: string;
    source: 'birth' | 'current' | 'fallback';
    coordinates: { lat: string; lon: string };
    timezone?: string;
  } => {
    // 1. Try current location if available
    if (locationState.currentLocation) {
      return {
        name: locationState.currentLocation.name,
        source: 'current',
        coordinates: locationState.currentLocation.coordinates,
        timezone: locationState.currentLocation.timezone
      };
    }

    // 2. Try user birth location
    if (user?.birthData?.locationOfBirth && user?.birthData?.coordinates) {
      // Get timezone for birth location if not already stored
      const timezone = user.birthData.timezone || 
        approximateTimeZoneFromCoordinates(
          parseFloat(user.birthData.coordinates.lat),
          parseFloat(user.birthData.coordinates.lon)
        ).timeZone;
        
      return {
        name: user.birthData.locationOfBirth,
        source: 'birth',
        coordinates: user.birthData.coordinates,
        timezone
      };
    }

    // 3. Fallback to New York
    return {
      name: 'New York, NY',
      source: 'fallback',
      coordinates: { lat: '40.7128', lon: '-74.0060' },
      timezone: 'America/New_York'
    };
  }, [locationState.currentLocation, user?.birthData]);

  // Request location permission and get current location
  const requestLocationPermission = async (): Promise<void> => {
    try {
      setLocationState(prev => ({ ...prev, isLoading: true, error: undefined }));
      // Analytics tracking removed - Google Analytics handles this
      // trackLocationRequest();
      
      const position = await getCurrentPosition();
      
      const coordinates = {
        lat: position.coords.latitude.toString(),
        lon: position.coords.longitude.toString()
      };
      
      // Get location name
      const name = await getLocationName(coordinates.lat, coordinates.lon);
      
      // Get timezone
      const tzResult = approximateTimeZoneFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      
      const newLocation: LocationData = {
        name,
        coordinates,
        timezone: tzResult.timeZone
      };
      
      // Track successful permission grant
      // Analytics tracking removed - Google Analytics handles this
      // trackPermissionGranted(coordinates);
      
      setLocationState(prev => ({
        ...prev,
        currentLocation: newLocation,
        isLoading: false,
        error: undefined
      }));

      // Persist GPS location to database if user is logged in
      if (user?.id) {
        try {
          const response = await fetch('/api/users/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              location: {
                name: newLocation.name,
                coordinates: newLocation.coordinates
              }
            })
          });

          if (!response.ok) {
            // console.warn('Failed to save GPS location to database:', response.statusText);
          } else {
            // console.log('✅ GPS location saved to database successfully');
          }
        } catch (error) {
          // console.warn('Failed to save GPS location to database:', error);
        }
      }
      
    } catch (error) {
      const locationError = getLocationError(error);
      
      // Track the specific error type
      if (locationError.type === 'permission_denied') {
        // Analytics tracking removed - Google Analytics handles this
      // trackPermissionDenied();
      } else {
        // Analytics tracking removed - Google Analytics handles this
      // trackLocationError(locationError.type);
      }
      
      setLocationState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: locationError 
      }));
    }
  };

  // Set location manually (from LocationRequestToast)
  const setLocation = async (locationData: LocationData) => {
    // Update local state immediately
    setLocationState(prev => ({
      ...prev,
      currentLocation: locationData,
      showLocationToast: false
    }));

    // Persist to database if user is logged in
    if (user?.id) {
      try {
        const response = await fetch('/api/users/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            location: {
              name: locationData.name,
              coordinates: locationData.coordinates,
              timezone: locationData.timezone
            }
          })
        });

        if (!response.ok) {
          console.warn('Failed to save location to database:', response.statusText);
        } else {
          console.log('✅ Location saved to database successfully');
        }
      } catch (error) {
        console.warn('Failed to save location to database:', error);
      }
    }
  };

  // Show location selection toast
  const showLocationToast = () => {
    setLocationState(prev => ({ ...prev, showLocationToast: true }));
  };

  // Hide location selection toast
  const hideLocationToast = () => {
    setLocationState(prev => ({ ...prev, showLocationToast: false }));
  };

  // Clear current location (fall back to birth or default)
  const clearCurrentLocation = () => {
    setLocationState(prev => ({ ...prev, currentLocation: null }));
  };

  // Get location display info
  const getLocationDisplay = () => {
    const bestLocation = getBestLocation();
    return {
      name: bestLocation.name,
      shortName: bestLocation.name.split(',')[0],
      source: bestLocation.source,
      coordinates: bestLocation.coordinates,
      timezone: bestLocation.timezone,
      isUserSet: bestLocation.source === 'current',
      isBirthLocation: bestLocation.source === 'birth',
      isFallback: bestLocation.source === 'fallback'
    };
  };

  // Update locationUsed in state for compatibility with existing code
  useEffect(() => {
    const bestLocation = getBestLocation();
    setLocationState(prev => ({
      ...prev,
      locationUsed: bestLocation
    }));
  }, [getBestLocation]);

  return {
    // State (excluding showLocationToast to avoid naming conflict)
    currentLocation: locationState.currentLocation,
    isLoading: locationState.isLoading,
    error: locationState.error,
    locationUsed: locationState.locationUsed,
    
    // Toast visibility state
    isLocationToastVisible: locationState.showLocationToast,
    
    // Computed values
    bestLocation: getBestLocation(),
    locationDisplay: getLocationDisplay(),
    
    // Actions
    requestLocationPermission,
    setLocation,
    showLocationToast,
    hideLocationToast,
    clearCurrentLocation,
    
    // For backward compatibility with useVoidMoonStatus
    handleLocationSet: setLocation
  };
};