import { useMemo } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface UseLocationForGenerationProps {
  currentLocationData: {
    name: string;
    coordinates: {
      lat: string;
      lon: string;
    };
  } | null;
  user?: {
    birthData?: {
      coordinates?: {
        lat: string;
        lon: string;
      };
      locationOfBirth?: string;
    };
  } | null;
}

export const useLocationForGeneration = ({
  currentLocationData,
  user
}: UseLocationForGenerationProps): LocationData | null => {
  return useMemo(() => {
    // If we have manually set location data, use it
    if (currentLocationData) {
      return {
        latitude: parseFloat(currentLocationData.coordinates.lat),
        longitude: parseFloat(currentLocationData.coordinates.lon),
        locationName: currentLocationData.name
      };
    }

    // If user has birth data, use it
    if (user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
      return {
        latitude: parseFloat(user.birthData.coordinates.lat),
        longitude: parseFloat(user.birthData.coordinates.lon),
        locationName: user.birthData.locationOfBirth || 'Your Birth Location'
      };
    }

    // No location available
    return null;
  }, [currentLocationData, user?.birthData]);
};