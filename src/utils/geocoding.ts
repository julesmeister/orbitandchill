/**
 * Geocoding utilities for converting location names to coordinates
 * Uses Nominatim OpenStreetMap API
 */

interface Coordinates {
  lat: string;
  lon: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: string;
}

/**
 * Geocode a location string to coordinates using Nominatim API
 * @param locationName - The location name to geocode
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeLocation(locationName: string): Promise<Coordinates | null> {
  if (!locationName || locationName.trim().length === 0) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Orbit-and-Chill-Astrology-App/1.0'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: NominatimResult[] = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      lat: result.lat,
      lon: result.lon
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Validate if coordinates are valid (not empty strings)
 * @param coordinates - Coordinates to validate
 * @returns true if coordinates are valid
 */
export function areCoordinatesValid(coordinates?: Coordinates | null): boolean {
  if (!coordinates) return false;
  if (!coordinates.lat || !coordinates.lon) return false;
  if (coordinates.lat === '' || coordinates.lon === '') return false;

  const lat = parseFloat(coordinates.lat);
  const lon = parseFloat(coordinates.lon);

  if (isNaN(lat) || isNaN(lon)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lon < -180 || lon > 180) return false;

  return true;
}

/**
 * Get coordinates from location data, geocoding if necessary
 * @param locationOfBirth - Location name
 * @param coordinates - Existing coordinates (may be empty)
 * @returns Valid coordinates or null
 */
export async function getValidCoordinates(
  locationOfBirth: string,
  coordinates?: Coordinates | null
): Promise<Coordinates | null> {
  // If we have valid coordinates, use them
  if (areCoordinatesValid(coordinates)) {
    return coordinates!;
  }

  // Otherwise, try to geocode the location
  if (locationOfBirth && locationOfBirth.trim().length > 0) {
    return await geocodeLocation(locationOfBirth);
  }

  return null;
}
