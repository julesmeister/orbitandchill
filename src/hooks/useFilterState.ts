/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

export type FilterType = 'all' | 'benefic' | 'challenging' | 'neutral';
export type FilterSource = 'all' | 'generated' | 'manual';
export type FilterTab = 'all' | 'bookmarked' | 'manual';

interface UseFilterStateReturn {
  // Search and basic filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: FilterType;
  setSelectedType: (type: FilterType) => void;
  selectedSource: FilterSource;
  setSelectedSource: (source: FilterSource) => void;
  selectedTab: FilterTab;
  setSelectedTab: (tab: FilterTab) => void;
  
  // Advanced filters
  hideChallengingDates: boolean;
  setHideChallengingDates: (hide: boolean) => void;
  showCombosOnly: boolean;
  setShowCombosOnly: (show: boolean) => void;
  showHousesOnly: boolean;
  setShowHousesOnly: (show: boolean) => void;
  showAspectsOnly: boolean;
  setShowAspectsOnly: (show: boolean) => void;
  showElectionalOnly: boolean;
  setShowElectionalOnly: (show: boolean) => void;
  
  // Reset function
  resetFilters: () => void;
}

export function useFilterState(): UseFilterStateReturn {
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [selectedSource, setSelectedSource] = useState<FilterSource>('all');
  const [selectedTab, setSelectedTab] = useState<FilterTab>('all');
  const [hideChallengingDates, setHideChallengingDates] = useState(false);
  const [showCombosOnly, setShowCombosOnly] = useState(false);
  const [showHousesOnly, setShowHousesOnly] = useState(false);
  const [showAspectsOnly, setShowAspectsOnly] = useState(false);
  const [showElectionalOnly, setShowElectionalOnly] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSource('all');
    setSelectedTab('all');
    setHideChallengingDates(false);
    setShowCombosOnly(false);
    setShowHousesOnly(false);
    setShowAspectsOnly(false);
    setShowElectionalOnly(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedSource,
    setSelectedSource,
    selectedTab,
    setSelectedTab,
    hideChallengingDates,
    setHideChallengingDates,
    showCombosOnly,
    setShowCombosOnly,
    showHousesOnly,
    setShowHousesOnly,
    showAspectsOnly,
    setShowAspectsOnly,
    showElectionalOnly,
    setShowElectionalOnly,
    resetFilters
  };
}