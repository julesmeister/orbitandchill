/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { generateNatalChart } from '../utils/natalChart';
import { getChartAnalysis } from '../components/horary/InteractiveHoraryChart';
import { useUserStore } from '../store/userStore';

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
}

export const useVoidMoonStatus = () => {
  const { user } = useUserStore();
  const [voidStatus, setVoidStatus] = useState<VoidMoonStatus>({
    isVoid: false,
    isLoading: true
  });
  
  const checkVoidStatus = async () => {
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

      if (user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
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
      } else {
        // Try to get current location
        try {
          const position = await getCurrentPosition();
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
        } catch (geoError) {
          console.log('Could not get current location, using NY as fallback:', geoError);
          // locationUsed already set to fallback above
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
      console.error('Error checking void moon status:', error);
      setVoidStatus(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Check void status on mount and every 5 minutes (or more frequently if void)
  useEffect(() => {
    checkVoidStatus();
    
    // Check more frequently if moon is void (every 30 seconds)
    // Otherwise check every 5 minutes
    const checkInterval = voidStatus.isVoid ? 30 * 1000 : 5 * 60 * 1000;
    const interval = setInterval(checkVoidStatus, checkInterval);
    
    return () => clearInterval(interval);
  }, [voidStatus.isVoid]);
  
  return { voidStatus, refreshVoidStatus: checkVoidStatus };
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