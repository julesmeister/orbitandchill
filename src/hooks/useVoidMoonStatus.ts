/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { generateNatalChart } from '../utils/natalChart';
import { getChartAnalysis } from '../components/horary/InteractiveHoraryChart';
import { useUserStore } from '../store/userStore';
import { getLocationAnalytics } from '../utils/locationAnalytics';

interface VoidMoonStatus {
  isVoid: boolean;
  isLoading: boolean;
  moonSign?: string;
  moonPhase?: string;
  nextSignChange?: Date;
  voidEndsIn?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  locationUsed?: {
    name: string;
    source: 'birth' | 'current' | 'fallback';
    coordinates: { lat: string; lon: string };
  };
  locationError?: {
    type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'not_supported' | 'unknown';
    message: string;
    canRetry: boolean;
  };
  showLocationToast?: boolean;
}

export const useVoidMoonStatus = () => {
  const { user } = useUserStore();
  const [voidStatus, setVoidStatus] = useState<VoidMoonStatus>({
    isVoid: false,
    isLoading: true,
    showLocationToast: false
  });

  const requestLocationPermission = async (): Promise<void> => {
    try {
      setVoidStatus(prev => ({ ...prev, isLoading: true, locationError: undefined }));
      getLocationAnalytics().trackLocationRequest();
      
      const position = await getCurrentPosition();
      
      // Track successful permission grant
      getLocationAnalytics().trackPermissionGranted({
        lat: position.coords.latitude.toString(),
        lon: position.coords.longitude.toString()
      });
      
      // Trigger a fresh check with new location
      checkVoidStatus(position);
    } catch (error) {
      const locationError = getLocationError(error);
      
      // Track the specific error type
      if (locationError.type === 'permission_denied') {
        getLocationAnalytics().trackPermissionDenied();
      } else {
        getLocationAnalytics().trackLocationError(locationError.type);
      }
      
      setVoidStatus(prev => ({ 
        ...prev, 
        isLoading: false,
        locationError 
      }));
    }
  };
  
  const checkVoidStatus = async (providedPosition?: GeolocationPosition, providedLocation?: { name: string; coordinates: { lat: string; lon: string } }) => {
    try {
      setVoidStatus(prev => ({ ...prev, isLoading: true }));
      
      // Generate chart for current moment directly without using horary store
      const now = new Date();
      const timeString = now.toTimeString().substring(0, 8); // Get HH:MM:SS
      const hourMinute = timeString.substring(0, 5); // Get HH:MM

      // Use user's location if available, otherwise fall back to current location or NY
      let locationData = {
        locationOfBirth: 'New York, NY',
        coordinates: {
          lat: '40.7128',
          lon: '-74.0060'
        }
      };

      let locationUsed: {
        name: string;
        source: 'birth' | 'current' | 'fallback';
        coordinates: { lat: string; lon: string };
      } = {
        name: 'New York, NY',
        source: 'fallback',
        coordinates: { lat: '40.7128', lon: '-74.0060' }
      };

      // First check if we have a provided location (from manual input)
      if (providedLocation) {
        locationData = {
          locationOfBirth: providedLocation.name,
          coordinates: providedLocation.coordinates
        };
        locationUsed = {
          name: providedLocation.name,
          source: 'current',
          coordinates: providedLocation.coordinates
        };
        
        // Clear any previous location error
        setVoidStatus(prev => ({ ...prev, locationError: undefined }));
      } else {
        // Try to get saved current location from database first
        let savedLocation = null;
        if (user?.id) {
          try {
            const response = await fetch(`/api/users/location?userId=${user.id}`);
            const result = await response.json();
            if (result.success && result.location) {
              savedLocation = result.location;
              // console.log('Found saved location:', savedLocation);
            }
          } catch (error) {
            // console.log('Could not fetch saved location:', error);
          }
        }

        if (savedLocation) {
          // Use saved current location
          locationData = {
            locationOfBirth: savedLocation.name,
            coordinates: savedLocation.coordinates
          };
          locationUsed = {
            name: savedLocation.name,
            source: 'current',
            coordinates: savedLocation.coordinates
          };
          
          // Clear any previous location error and location toast
          setVoidStatus(prev => ({ ...prev, locationError: undefined, showLocationToast: false }));
        } else if (user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
          // Use user's birth location
          locationData = {
            locationOfBirth: user.birthData.locationOfBirth || 'User Birth Location',
            coordinates: {
              lat: user.birthData.coordinates.lat,
              lon: user.birthData.coordinates.lon
            }
          };
          locationUsed = {
            name: user.birthData.locationOfBirth || 'Your Birth Location',
            source: 'birth',
            coordinates: user.birthData.coordinates
          };
          
          // Track birth location usage and clear location toast
          getLocationAnalytics().trackBirthLocationUsed(user.birthData.coordinates);
          setVoidStatus(prev => ({ ...prev, showLocationToast: false }));
        } else {
          // Try to get current location (use provided position if available)
          let position = providedPosition;
          try {
            if (!position) {
              position = await getCurrentPosition();
            }
            
            locationData = {
              locationOfBirth: 'Current Location',
              coordinates: {
                lat: position.coords.latitude.toString(),
                lon: position.coords.longitude.toString()
              }
            };
            locationUsed = {
              name: `Your Current Location (${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°)`,
              source: 'current',
              coordinates: {
                lat: position.coords.latitude.toString(),
                lon: position.coords.longitude.toString()
              }
            };
            
            // Clear any previous location error and location toast
            setVoidStatus(prev => ({ ...prev, locationError: undefined, showLocationToast: false }));
            
          } catch (geoError) {
            // console.log('Could not get current location, showing location toast:', geoError);
            
            // Set location error for UI to handle
            const locationError = getLocationError(geoError);
            
            // Show location toast instead of just falling back to NY
            setVoidStatus(prev => ({ 
              ...prev, 
              locationError,
              showLocationToast: true,
              isLoading: false
            }));
            
            // Track fallback usage and the error type
            getLocationAnalytics().trackFallbackUsed();
            if (locationError.type === 'permission_denied') {
              getLocationAnalytics().trackPermissionDenied();
            } else {
              getLocationAnalytics().trackLocationError(locationError.type);
            }
            
            // Return early, don't continue with fallback location
            return;
          }
        }
      }

      const chartData = await generateNatalChart({
        name: 'Void Moon Check',
        dateOfBirth: now.toISOString().split('T')[0],
        timeOfBirth: hourMinute,
        ...locationData
      });
      
      if (chartData?.metadata?.chartData) {
        // Use existing analysis function
        const analysis = getChartAnalysis(chartData.metadata.chartData, {
          id: 'void-check',
          question: 'Void moon check',
          date: now
        });
        
        
        if (analysis?.moon) {
          
          const nextSignChange = calculateNextSignChange(analysis.moon.longitude);
          
          const voidEndsIn = analysis.moon.voidOfCourse && nextSignChange ? 
            calculateTimeUntil(nextSignChange) : undefined;
          
          const newStatus = {
            isVoid: analysis.moon.voidOfCourse || false,
            isLoading: false,
            moonSign: analysis.moon.sign,
            moonPhase: analysis.moon.phase || undefined,
            nextSignChange,
            voidEndsIn,
            locationUsed
          };
          
          setVoidStatus(newStatus);
        } else {
          setVoidStatus(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setVoidStatus(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setVoidStatus(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Check void status on mount and when user changes
  useEffect(() => {
    checkVoidStatus();
  }, [user?.id]); // Only re-run when user ID changes
  
  // Separate interval effect that doesn't cause infinite loops
  useEffect(() => {
    // Check more frequently if moon is void (every 30 seconds)
    // Otherwise check every 5 minutes
    const checkInterval = voidStatus.isVoid ? 30 * 1000 : 5 * 60 * 1000;
    const interval = setInterval(() => {
      // Only update if not currently loading to prevent race conditions
      if (!voidStatus.isLoading) {
        checkVoidStatus();
      }
    }, checkInterval);
    
    return () => clearInterval(interval);
  }, [voidStatus.isVoid, voidStatus.isLoading]); // Update interval when void status changes
  
  const showLocationToast = () => {
    setVoidStatus(prev => ({ ...prev, showLocationToast: true }));
  };

  const hideLocationToast = () => {
    setVoidStatus(prev => ({ ...prev, showLocationToast: false }));
  };

  const handleLocationSet = (locationData: { name: string; coordinates: { lat: string; lon: string } }) => {
    // Update the void status calculation with new location immediately
    checkVoidStatus(undefined, locationData);
    hideLocationToast();
  };

  return { 
    voidStatus, 
    refreshVoidStatus: checkVoidStatus, 
    requestLocationPermission,
    showLocationToast,
    hideLocationToast,
    handleLocationSet
  };
};

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

// Calculate when the moon will change to the next sign
const calculateNextSignChange = (moonLongitude: number): Date => {
  
  // Moon moves approximately 13.176 degrees per day (average)
  const moonSpeed = 13.176 / 24; // degrees per hour
  
  // Calculate degrees until next sign boundary
  const currentSignBoundary = Math.floor(moonLongitude / 30) * 30;
  const nextSignBoundary = currentSignBoundary + 30;
  const degreesUntilNextSign = nextSignBoundary - moonLongitude;
  
  
  // Calculate hours until sign change
  const hoursUntilSignChange = degreesUntilNextSign / moonSpeed;

  // Add the hours to current time
  const nextSignChange = new Date();
  nextSignChange.setTime(nextSignChange.getTime() + (hoursUntilSignChange * 60 * 60 * 1000));
  
  return nextSignChange;
};

// Calculate time remaining until a future date
const calculateTimeUntil = (futureDate: Date) => {
  const now = new Date();
  const timeDiff = futureDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// Helper function to categorize geolocation errors
const getLocationError = (error: any): { type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'not_supported' | 'unknown'; message: string; canRetry: boolean } => {
  if (!error) {
    return { type: 'unknown', message: 'Unknown location error', canRetry: true };
  }

  // Handle GeolocationPositionError
  if (error.code !== undefined) {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        return {
          type: 'permission_denied',
          message: 'Location access was denied. Please enable location permissions in your browser.',
          canRetry: true
        };
      case 2: // POSITION_UNAVAILABLE
        return {
          type: 'position_unavailable',
          message: 'Your location could not be determined. Please check your device settings.',
          canRetry: true
        };
      case 3: // TIMEOUT
        return {
          type: 'timeout',
          message: 'Location request timed out. Please try again.',
          canRetry: true
        };
      default:
        return {
          type: 'unknown',
          message: 'An unknown location error occurred.',
          canRetry: true
        };
    }
  }

  // Handle browser support error
  if (error.message && error.message.includes('not supported')) {
    return {
      type: 'not_supported',
      message: 'Geolocation is not supported by your browser.',
      canRetry: false
    };
  }

  // Fallback for other errors
  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred while getting your location.',
    canRetry: true
  };
};