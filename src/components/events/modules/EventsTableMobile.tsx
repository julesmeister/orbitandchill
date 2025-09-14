/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { AstrologicalEvent } from '../../../types/events';
import ScoreTooltip from '../../reusable/ScoreTooltip';
import { getEventStyling, getEventIcon, getScoreBackgroundClass } from '../../../utils/events/eventStylingUtils';
import { formatEventDate, formatEventTime, getEventTypeDisplay } from '../../../utils/events/eventFormattingUtils';

export interface EventsTableMobileProps {
  paginatedEvents: AstrologicalEvent[];
  selectedTab: string;
  currentUserId?: string;
  toggleBookmark: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  handleRenameEvent: (eventId: string, currentTitle: string) => void;
  handleEventClick: (event: AstrologicalEvent) => void;
}

export function EventsTableMobile({
  paginatedEvents,
  selectedTab,
  currentUserId,
  toggleBookmark,
  deleteEvent,
  handleRenameEvent,
  handleEventClick
}: EventsTableMobileProps) {
  return (
    <div className="block md:hidden divide-y divide-black">
      {paginatedEvents.map((event) => {
        const styling = getEventStyling(event);
        const typeDisplay = getEventTypeDisplay(event.type);

        return (
          <div
            key={event.id}
            className="p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer relative"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-black"
                style={{ backgroundColor: styling.bgColor }}
              >
                <span className="text-base">
                  {getEventIcon(event.score)}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Title and Shared Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-space-grotesk text-sm font-semibold text-black leading-tight">
                      {event.title}
                    </h3>
                    {event.isGenerated && event.userId !== currentUserId && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        title="Shared optimal timing from community"
                      >
                        🌐 Shared
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <div className="relative z-[100]">
                      <ScoreTooltip event={event} position="left" onToggleBookmark={toggleBookmark}>
                        <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold text-white cursor-help border border-black ${getScoreBackgroundClass(event)}`}>
                          {event.score}
                        </div>
                      </ScoreTooltip>
                    </div>
                    <span className="text-xs text-black/60 font-open-sans font-medium">/10</span>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="font-open-sans text-xs text-black/60 leading-relaxed mb-2 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  {/* Date and Time */}
                  <div className="text-xs">
                    <div className="font-space-grotesk font-semibold text-black">
                      {formatEventDate(event.date)}
                    </div>
                    {event.time && (
                      <div className="mt-0.5 font-open-sans font-medium text-black/60">
                        {formatEventTime(event.time)}
                      </div>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div
                    className={`inline-flex items-center px-2 py-1 text-xs font-open-sans font-medium border border-black ${styling.text} whitespace-nowrap`}
                    style={{ backgroundColor: styling.bgColor }}
                  >
                    {typeDisplay.icon} {typeDisplay.text}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-1">
                  {/* Only show bookmark button for non-manual events */}
                  {selectedTab !== 'manual' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(event.id);
                      }}
                      className={`inline-flex items-center justify-center w-7 h-7 transition-all duration-200 border border-black ${
                        event.isBookmarked
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                      data-bookmarked={event.isBookmarked}
                      title={event.isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
                    >
                      <div className={`w-2.5 h-2.5 ${event.isBookmarked ? 'bg-white' : 'bg-yellow-500'} border border-black`}></div>
                    </button>
                  )}

                  {/* Show rename button for bookmarked and manual events */}
                  {(selectedTab === 'bookmarked' || selectedTab === 'manual') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameEvent(event.id, event.title);
                      }}
                      className="inline-flex items-center justify-center w-7 h-7 bg-white text-black hover:bg-blue-500 hover:text-white transition-all duration-200 border border-black"
                      title="Rename event"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent(event.id);
                    }}
                    className="inline-flex items-center justify-center w-7 h-7 bg-white text-black hover:bg-red-500 hover:text-white transition-all duration-200 border border-black"
                    title="Delete event"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}