/**
 * Reverse Geocoding Utilities
 * Convert latitude/longitude coordinates to human-readable location information
 */

export interface LocationInfo {
  country: string;
  city?: string;
  state?: string;
  county?: string;
  displayName: string;
  formattedAddress: string;
}

/**
 * Convert coordinates to location information using Nominatim API
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise<LocationInfo | null>
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationInfo | null> {
  try {
    // Use Nominatim (OpenStreetMap) reverse geocoding API
    // zoom=14 gives more detailed results (city/neighborhood level)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&extratags=1`,
      {
        headers: {
          'User-Agent': 'Luckstrology-App/1.0'
        }
      }
    );

    if (!response.ok) {
      console.warn('Reverse geocoding request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.address) {
      return null;
    }

    const address = data.address;
    
    // Debug logging to see what we're getting
    console.log('Reverse geocoding result:', {
      display_name: data.display_name,
      address: address
    });
    
    // Extract location components with more comprehensive fallbacks
    const country = address.country || 'Unknown';
    const city = address.city || 
                 address.town || 
                 address.village || 
                 address.municipality || 
                 address.suburb || 
                 address.neighbourhood || 
                 address.hamlet;
    const state = address.state || 
                  address.province || 
                  address.region;
    const county = address.county;
    
    // Create a concise display name
    const locationParts = [];
    if (city) locationParts.push(city);
    if (state && state !== city) locationParts.push(state);
    if (country) locationParts.push(country);
    
    const displayName = locationParts.join(', ');
    
    // Create a more detailed formatted address
    const addressParts = [];
    if (city) addressParts.push(city);
    if (county && county !== city) addressParts.push(county);
    if (state && state !== city && state !== county) addressParts.push(state);
    if (country) addressParts.push(country);
    
    const formattedAddress = addressParts.join(', ');

    // If we didn't get a good location name, try to parse from display_name
    let finalDisplayName = displayName || country;
    let finalCity = city;
    
    if (!city && data.display_name) {
      // Try to extract city from display_name (first meaningful part)
      const parts = data.display_name.split(',').map((p: string) => p.trim());
      if (parts.length > 0) {
        // Skip house numbers and use the first non-numeric part
        const potentialCity = parts.find((part: string) => 
          part && !(/^\d+$/.test(part)) && part.length > 2
        );
        if (potentialCity) {
          finalCity = potentialCity;
          finalDisplayName = potentialCity + (state ? `, ${state}` : '') + (country ? `, ${country}` : '');
        }
      }
    }

    console.log('Final location result:', {
      city: finalCity,
      state,
      country,
      displayName: finalDisplayName
    });

    return {
      country,
      city: finalCity,
      state,
      county,
      displayName: finalDisplayName,
      formattedAddress: formattedAddress || finalDisplayName || country
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
}

/**
 * Get a simple location description from coordinates
 * Includes fallback for when API is unavailable
 */
export function getLocationDescription(lat: number, lng: number, locationInfo: LocationInfo | null): string {
  if (locationInfo) {
    return locationInfo.displayName;
  }
  
  // Fallback to coordinate-based description
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  // Try to give rough geographic descriptions
  if (lat > 60) return `Arctic Region (${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir})`;
  if (lat < -60) return `Antarctic Region (${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir})`;
  
  // Rough continental descriptions based on longitude
  let region = 'Ocean';
  if (lng >= -170 && lng <= -30) region = 'Americas';
  else if (lng >= -30 && lng <= 70) region = 'Europe/Africa';
  else if (lng >= 70 && lng <= 180) region = 'Asia/Pacific';
  
  return `${region} (${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir})`;
}

/**
 * Cache for reverse geocoding results to avoid repeated API calls
 */
const geocodingCache = new Map<string, LocationInfo | null>();

/**
 * Cached reverse geocoding with 15 minute TTL
 */
export async function cachedReverseGeocode(lat: number, lng: number): Promise<LocationInfo | null> {
  // Round coordinates to 2 decimal places for caching (roughly 1km accuracy)
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;
  const cacheKey = `${roundedLat},${roundedLng}`;
  
  // Check cache first
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey) || null;
  }
  
  // Fetch new data
  const result = await reverseGeocode(roundedLat, roundedLng);
  
  // Cache result for 15 minutes
  geocodingCache.set(cacheKey, result);
  setTimeout(() => {
    geocodingCache.delete(cacheKey);
  }, 15 * 60 * 1000); // 15 minutes
  
  return result;
}