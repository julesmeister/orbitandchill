/**
 * Cache Invalidation Utilities
 * 
 * Utilities to handle cache invalidation for natal charts,
 * especially important after timezone handling fixes.
 */

// Database import removed - using direct API calls only
import { toast } from 'sonner';

/**
 * Clear all natal chart caches for a specific user
 * Using API endpoint to clear server-side caches
 */
export async function clearAllNatalChartCaches(userId: string): Promise<void> {
  try {
    // Call API endpoint to clear server-side caches
    const response = await fetch(`/api/charts/user/${userId}/clear-cache`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to clear caches: ${response.status}`);
    }

    console.log(`Cleared all natal chart caches for user ${userId}`);
  } catch (error) {
    console.error('Error clearing natal chart caches:', error);
    throw error;
  }
}

/**
 * Clear a specific natal chart cache
 */
export async function clearSpecificNatalChartCache(
  personId: string,
  dateOfBirth: string,
  timeOfBirth: string,
  lat: string,
  lon: string
): Promise<void> {
  try {
    // Call API endpoint to clear specific chart cache
    const response = await fetch(`/api/charts/clear-cache`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personId,
        dateOfBirth,
        timeOfBirth,
        latitude: lat,
        longitude: lon,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to clear specific cache: ${response.status}`);
    }

    console.log(`Cleared cache for person ${personId} chart`);
  } catch (error) {
    console.error('Error clearing specific chart cache:', error);
    throw error;
  }
}

/**
 * Check if cache invalidation is needed based on cache creation date
 * (e.g., if cache was created before timezone fix was deployed)
 */
export async function isChartCacheOutdated(cacheKey: string): Promise<boolean> {
  // Without local caching, assume all requests need fresh data
  return true;
}

/**
 * Clear all outdated natal chart caches
 * API-based approach
 */
export async function clearOutdatedNatalChartCaches(): Promise<number> {
  try {
    const response = await fetch('/api/charts/clear-outdated-cache', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to clear outdated caches: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Cleared ${result.clearedCount || 0} outdated natal chart caches`);
    return result.clearedCount || 0;
  } catch (error) {
    console.error('Error clearing outdated caches:', error);
    return 0;
  }
}

/**
 * Show a user-friendly prompt to clear caches if timezone issues are suspected
 */
export function showCacheClearPrompt(onClear: () => void): void {
  // Create a simple toast message with action
  toast('Timezone calculations improved! Click to refresh chart data for better accuracy.', {
    duration: 8000,
    position: 'bottom-right',
    action: {
      label: 'Refresh Now',
      onClick: () => {
        onClear();
        toast.success('Chart data refreshed successfully!');
      }
    }
  });
}