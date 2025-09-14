/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import type { AstrologicalEvent } from '../types/events';

export interface UseEventsPaginationProps {
  filteredEvents: AstrologicalEvent[];
  selectedTab: string;
  selectedType: string;
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
}

export interface UseEventsPaginationReturn {
  // State
  currentPage: number;
  itemsPerPage: number;

  // Computed
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  paginatedEvents: AstrologicalEvent[];

  // Actions
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (newItemsPerPage: number) => void;

  // Options
  itemsPerPageOptions: Array<{ value: string; label: string }>;
}

/**
 * Hook for managing events table pagination state and logic
 */
export function useEventsPagination({
  filteredEvents,
  selectedTab,
  selectedType,
  hideChallengingDates,
  showCombosOnly
}: UseEventsPaginationProps): UseEventsPaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Calculate pagination values
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get paginated events
  const paginatedEvents = useMemo(() => {
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, startIndex, endIndex]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEvents.length, selectedTab, selectedType, hideChallengingDates, showCombosOnly]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Dropdown options for items per page
  const itemsPerPageOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];

  return {
    // State
    currentPage,
    itemsPerPage,

    // Computed
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    paginatedEvents,

    // Actions
    handlePageChange,
    handleItemsPerPageChange,

    // Options
    itemsPerPageOptions
  };
}