"use client";

import React, { useState, useMemo } from 'react';
import type { AstrologicalEvent } from '../../types/events';
import ScoreTooltip from '../reusable/ScoreTooltip';
import TablePagination from '../reusable/TablePagination';
import SynapsasDropdown from '../reusable/SynapsasDropdown';
import RenameToast from '../reusable/RenameToast';

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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Rename state
  const [renameToast, setRenameToast] = useState({
    isVisible: false,
    eventId: '',
    currentTitle: ''
  });

  // Calculate pagination
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
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

  // Rename handlers
  const handleRenameEvent = (eventId: string, currentTitle: string) => {
    setRenameToast({
      isVisible: true,
      eventId,
      currentTitle
    });
  };

  const handleRenameSubmit = (eventId: string, newTitle: string) => {
    renameEvent(eventId, newTitle);
    setRenameToast({
      isVisible: false,
      eventId: '',
      currentTitle: ''
    });
  };

  const handleRenameCancel = () => {
    setRenameToast({
      isVisible: false,
      eventId: '',
      currentTitle: ''
    });
  };

  const getEventStyling = (event: AstrologicalEvent) => {
    if (event.title.includes('⚠️')) {
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#ff91e9' // Synapsas purple for warnings/challenging
      };
    } else if (event.score >= 8) {
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#e7fff6' // Synapsas light green for high scores
      };
    } else if (event.score >= 6) {
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#6bdbff' // Synapsas blue for good scores
      };
    } else {
      return {
        bg: 'text-black',
        text: 'text-black',
        hover: 'hover:bg-gray-50',
        icon: 'text-black',
        bgColor: '#fffbed' // Synapsas light yellow for neutral/lower scores
      };
    }
  };

  return (
    <div className="border border-black bg-white mb-8 relative z-0">
      {/* Tabs */}
      <div className="border-b border-black">
        <nav className="flex items-stretch justify-between">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
                selectedTab === 'all'
                  ? 'bg-black text-white border-r'
                  : 'text-black hover:bg-gray-50 border-r'
              }`}
            >
              All Events
              <span className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'all' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {events.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('generated')}
              className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
                selectedTab === 'generated'
                  ? 'bg-black text-white border-r'
                  : 'text-black hover:bg-gray-50 border-r'
              }`}
            >
              <div className="w-3 h-3 bg-blue-500 border border-black inline-block mr-2 -mt-0.5"></div>
              Generated Events
              <span className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'generated' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {events.filter(e => e.isGenerated && !e.isBookmarked).length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('bookmarked')}
              className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 border-black ${
                selectedTab === 'bookmarked'
                  ? 'bg-black text-white border-r'
                  : 'text-black hover:bg-gray-50 border-r'
              }`}
            >
              <div className="w-3 h-3 bg-yellow-500 border border-black inline-block mr-2 -mt-0.5"></div>
              Bookmarked
              <span className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'bookmarked' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {events.filter(e => e.isBookmarked).length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab('manual')}
              className={`px-6 py-4 h-full flex items-center font-space-grotesk font-semibold transition-all duration-200 ${
                selectedTab === 'manual'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 bg-gray-500 border border-black inline-block mr-2 -mt-0.5"></div>
              Manual Events
              <span className={`ml-2 px-2 py-0.5 text-xs font-open-sans border border-black ${
                selectedTab === 'manual' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {events.filter(e => !e.isGenerated && !e.isBookmarked).length}
              </span>
            </button>
          </div>
          
          {/* Show Per Page Selector */}
          <div className="flex items-center space-x-3 px-6 py-4 border-l border-black">
            <span className="text-sm text-black font-open-sans font-medium">Show:</span>
            <div className="w-20">
              <SynapsasDropdown
                options={itemsPerPageOptions}
                value={itemsPerPage.toString()}
                onChange={(value) => handleItemsPerPageChange(parseInt(value))}
              />
            </div>
            <span className="text-sm text-black font-open-sans font-medium">per page</span>
          </div>
        </nav>
      </div>
      
      <div className="px-8 py-6 border-b border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="font-space-grotesk text-xl font-bold text-black">
                  {selectedTab === 'bookmarked' ? 'Bookmarked Events' : 
                   selectedTab === 'manual' ? 'Manual Events' : 
                   selectedTab === 'generated' ? 'Generated Events' : 'Events Overview'}
                </h2>
                <div className="w-16 h-0.5 bg-black mt-1"></div>
              </div>
            </div>
            {hideChallengingDates && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-open-sans font-semibold bg-orange-50 text-black border border-black">
                <div className="w-2 h-2 bg-orange-500 border border-black mr-2"></div>
                Challenging Hidden
              </span>
            )}
            {showCombosOnly && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-open-sans font-semibold bg-indigo-50 text-black border border-black">
                <div className="w-2 h-2 bg-indigo-500 border border-black mr-2"></div>
                Combos Only
              </span>
            )}
          </div>
          <div className="border border-black p-1 inline-flex bg-white">
            {(['all', 'benefic', 'challenging', 'neutral'] as const).map((type, index) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`inline-flex items-center justify-center px-4 py-2 font-open-sans font-medium transition-all duration-200 border-black ${
                  selectedType === type
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-gray-50'
                } ${index < 3 ? 'border-r' : ''}`}
              >
                <div className={`w-2 h-2 mr-2 border border-black ${
                  type === 'all' ? 'bg-gray-500' :
                  type === 'benefic' ? 'bg-emerald-500' :
                  type === 'challenging' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
                {type === 'all' ? 'All Types' : 
                 type === 'benefic' ? 'Favorable' :
                 type === 'challenging' ? 'Challenging' :
                 'Neutral'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <table className="min-w-full">
          <thead className="bg-white border-b border-black">
            <tr>
              <th className="px-6 py-4 text-left font-space-grotesk font-bold text-black uppercase tracking-wide border-black border-r w-2/5">Event</th>
              <th className="px-6 py-4 text-left font-space-grotesk font-bold text-black uppercase tracking-wide border-black border-r">Date & Time</th>
              <th className="px-6 py-4 text-left font-space-grotesk font-bold text-black uppercase tracking-wide border-black border-r">Type</th>
              <th className="px-6 py-4 text-left font-space-grotesk font-bold text-black uppercase tracking-wide border-black border-r">Score</th>
              <th className="px-6 py-4 text-right font-space-grotesk font-bold text-black uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {paginatedEvents.map((event) => {
              const styling = getEventStyling(event);
              
              return (
                <tr 
                  key={event.id} 
                  className="hover:bg-gray-50 transition-all duration-200 cursor-pointer relative" 
                  onClick={() => handleEventClick(event)}
                >
                  <td className="px-6 py-6 border-black border-r">
                    <div className="max-w-md">
                      <div className="flex items-start space-x-3">
                        <div 
                          className={`w-10 h-10 flex items-center justify-center flex-shrink-0 border border-black`}
                          style={{ backgroundColor: styling.bgColor }}
                        >
                          <span className="text-base">
                            {event.score >= 8 ? '✨' :
                             event.score >= 6 ? '⭐' :
                             event.score >= 4 ? '💫' :
                             '⚡'}
                          </span>
                        </div>
                        <div>
                          <div className="font-space-grotesk text-sm font-semibold text-black mb-1 flex items-center gap-2">
                            {event.title}
                            {event.isGenerated && event.userId !== currentUserId && (
                              <span 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                title="Shared optimal timing from community"
                              >
                                🌐 Shared
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <div className="font-open-sans text-xs text-black/60 leading-relaxed line-clamp-2">{event.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 border-black border-r">
                    <div className="text-xs">
                      <div className="font-space-grotesk font-semibold text-black">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      {event.time && (
                        <div className="mt-1 font-open-sans font-medium text-black/60">
                          {new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 border-black border-r">
                    <div 
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-open-sans font-medium border border-black ${styling.text} whitespace-nowrap`}
                      style={{ backgroundColor: styling.bgColor }}
                    >
                      {event.type === 'benefic' ? '✓ Favorable' : 
                       event.type === 'challenging' ? '⚠ Challenging' : 
                       '• Neutral'}
                    </div>
                  </td>
                  <td className="px-6 py-6 border-black border-r">
                    <div className="flex items-center space-x-2 relative">
                      <div className="relative z-[100]">
                        <ScoreTooltip event={event} position="left" onToggleBookmark={toggleBookmark}>
                          <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold text-white cursor-help border border-black ${
                            event.title.includes('⚠️') ? 'bg-red-500' :
                            event.score >= 8 ? 'bg-emerald-500' :
                            event.score >= 6 ? 'bg-blue-500' :
                            'bg-slate-500'
                          }`}>
                            {event.score}
                          </div>
                        </ScoreTooltip>
                      </div>
                      <div className="text-xs text-black/60 font-open-sans font-medium">/10</div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Only show bookmark button for non-manual events */}
                      {selectedTab !== 'manual' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(event.id);
                          }}
                          className={`inline-flex items-center justify-center w-8 h-8 transition-all duration-200 border border-black ${
                            event.isBookmarked
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-white text-black hover:bg-gray-50'
                          }`}
                          data-bookmarked={event.isBookmarked}
                          title={event.isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
                        >
                          <div className={`w-3 h-3 ${event.isBookmarked ? 'bg-white' : 'bg-yellow-500'} border border-black`}></div>
                        </button>
                      )}
                      
                      {/* Show rename button for bookmarked and manual events */}
                      {(selectedTab === 'bookmarked' || selectedTab === 'manual') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameEvent(event.id, event.title);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 bg-white text-black hover:bg-blue-500 hover:text-white transition-all duration-200 border border-black"
                          title="Rename event"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 bg-white text-black hover:bg-red-500 hover:text-white transition-all duration-200 border border-black"
                        title="Delete event"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          showItemsPerPageSelector={false}
          backgroundColor="#f3f4f6"
          label="events"
        />
      )}

      {/* Rename Toast */}
      <RenameToast
        isVisible={renameToast.isVisible}
        currentTitle={renameToast.currentTitle}
        eventId={renameToast.eventId}
        onRename={handleRenameSubmit}
        onCancel={handleRenameCancel}
      />
    </div>
  );
}