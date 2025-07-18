/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../types/user';

interface LocationData {
  name: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  timezone?: string;
}

interface LocationForGeneration {
  latitude: number;
  longitude: number;
  locationName: string;
  timezone?: string;
}

export function getLocationForGeneration(
  currentLocationData: LocationData | null,
  user: User | null
): LocationForGeneration | null {
  // If we have manually set location data, use it
  if (currentLocationData) {
    return {
      latitude: parseFloat(currentLocationData.coordinates.lat),
      longitude: parseFloat(currentLocationData.coordinates.lon),
      locationName: currentLocationData.name,
      timezone: currentLocationData.timezone
    };
  }

  // If user has birth data, use it
  if (user?.birthData?.coordinates?.lat && user?.birthData?.coordinates?.lon) {
    return {
      latitude: parseFloat(user.birthData.coordinates.lat),
      longitude: parseFloat(user.birthData.coordinates.lon),
      locationName: user.birthData.locationOfBirth || 'Your Birth Location',
      timezone: user.birthData.timezone
    };
  }

  // No location available
  return null;
}