import { useState, useEffect, useRef } from 'react';
import { Location } from '../types';

interface UseLocationSearchReturn {
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  locationOptions: Location[];
  showLocationDropdown: boolean;
  setShowLocationDropdown: (show: boolean) => void;
  isLoadingLocations: boolean;
  locationInputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  handleLocationSelect: (location: Location) => void;
}

export const useLocationSearch = (
  onLocationSelect?: (location: Location) => void
): UseLocationSearchReturn => {
  const [locationQuery, setLocationQuery] = useState('');
  const [locationOptions, setLocationOptions] = useState<Location[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced location search
  useEffect(() => {
    const searchLocations = async () => {
      if (locationQuery.length < 3) {
        setLocationOptions([]);
        setShowLocationDropdown(false);
        return;
      }

      setIsLoadingLocations(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setLocationOptions(data);
        setShowLocationDropdown(true);
      } catch (error) {
        console.error('Error searching locations:', error);
        setLocationOptions([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: Location) => {
    setLocationQuery(location.display_name);
    setShowLocationDropdown(false);
    onLocationSelect?.(location);
  };

  return {
    locationQuery,
    setLocationQuery,
    locationOptions,
    showLocationDropdown,
    setShowLocationDropdown,
    isLoadingLocations,
    locationInputRef,
    dropdownRef,
    handleLocationSelect,
  };
};