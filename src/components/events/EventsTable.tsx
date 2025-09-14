"use client";

import React from 'react';
import type { AstrologicalEvent } from '../../types/events';
import TablePagination from '../reusable/TablePagination';
import RenameToast from '../reusable/RenameToast';
import { useEventsPagination } from '../../hooks/useEventsPagination';
import { useEventsRename } from '../../hooks/useEventsRename';
import { EventsTableTabs } from './modules/EventsTableTabs';
import { EventsTableHeader } from './modules/EventsTableHeader';
import { EventsTableDesktop } from './modules/EventsTableDesktop';
import { EventsTableMobile } from './modules/EventsTableMobile';

interface EventsTableProps {
  filteredEvents: AstrologicalEvent[];
  selectedTab: string;
  selectedType: string;
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  events: AstrologicalEvent[];
  currentUserId?: string; // To identify shared events
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual' | 'generated') => void;
  setSelectedType: (type: 'benefic' | 'challenging' | 'neutral' | 'all') => void;
  toggleBookmark: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  renameEvent: (eventId: string, newTitle: string) => void;
  handleEventClick: (event: AstrologicalEvent) => void;
}

export default function EventsTable({
  filteredEvents,
  selectedTab,
  selectedType,
  hideChallengingDates,
  showCombosOnly,
  events,
  currentUserId,
  setSelectedTab,
  setSelectedType,
  toggleBookmark,
  deleteEvent,
  renameEvent,
  handleEventClick
}: EventsTableProps) {
  // Use custom hooks for pagination and rename functionality
  const pagination = useEventsPagination({
    filteredEvents,
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly
  });

  const rename = useEventsRename(renameEvent);

  return (
    <div className="border border-black bg-white mb-8 relative z-0">
      <EventsTableTabs
        selectedTab={selectedTab}
        events={events}
        itemsPerPage={pagination.itemsPerPage}
        itemsPerPageOptions={pagination.itemsPerPageOptions}
        setSelectedTab={setSelectedTab}
        handleItemsPerPageChange={pagination.handleItemsPerPageChange}
      />

      <EventsTableHeader
        selectedTab={selectedTab}
        selectedType={selectedType}
        hideChallengingDates={hideChallengingDates}
        showCombosOnly={showCombosOnly}
        setSelectedType={setSelectedType}
      />

      <EventsTableDesktop
        paginatedEvents={pagination.paginatedEvents}
        selectedTab={selectedTab}
        currentUserId={currentUserId}
        toggleBookmark={toggleBookmark}
        deleteEvent={deleteEvent}
        handleRenameEvent={rename.handleRenameEvent}
        handleEventClick={handleEventClick}
      />

      <EventsTableMobile
        paginatedEvents={pagination.paginatedEvents}
        selectedTab={selectedTab}
        currentUserId={currentUserId}
        toggleBookmark={toggleBookmark}
        deleteEvent={deleteEvent}
        handleRenameEvent={rename.handleRenameEvent}
        handleEventClick={handleEventClick}
      />

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          onPageChange={pagination.handlePageChange}
          showItemsPerPageSelector={false}
          backgroundColor="#f3f4f6"
          label="events"
        />
      )}

      {/* Rename Toast */}
      <RenameToast
        isVisible={rename.renameToast.isVisible}
        currentTitle={rename.renameToast.currentTitle}
        eventId={rename.renameToast.eventId}
        onRename={rename.handleRenameSubmit}
        onCancel={rename.handleRenameCancel}
      />
    </div>
  );
}