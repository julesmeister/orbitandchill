/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import ScoreTooltip from '../reusable/ScoreTooltip';
import { getEventStyling } from './utils/calendarUtils';

interface EventItemProps {
  event: AstrologicalEvent;
  handleEventClick: (event: AstrologicalEvent) => void;
  toggleBookmark: (eventId: string) => void;
}

export default function EventItem({ event, handleEventClick, toggleBookmark }: EventItemProps) {
  const styling = getEventStyling(event);
  const isCombo = event.title.includes('&');

  return (
    <button
      key={event.id}
      onClick={() => handleEventClick(event)}
      className={`w-full mt-2 text-xs px-2 py-1.5 font-medium transition-all duration-200 cursor-pointer relative group border border-black ${styling.text} ${styling.hover}`}
      style={{ backgroundColor: styling.bgColor }}
    >
      {/* Score indicator with simplified tooltip */}
      <div className="absolute top-1 right-2 z-10">
        <ScoreTooltip event={event} position="top" simplified={true} onToggleBookmark={toggleBookmark}>
          <div className={`w-4 h-4 flex items-center justify-center text-[8px] font-bold text-white cursor-help border border-black ${
            event.title.includes('⚠️') ? 'bg-red-500' :
            event.score >= 8 ? 'bg-emerald-500' :
            event.score >= 6 ? 'bg-blue-500' :
            'bg-slate-500'
          }`}>
            {event.score}
          </div>
        </ScoreTooltip>
      </div>

      {/* Bookmark indicator */}
      {event.isBookmarked && (
        <div className="w-2 h-2 bg-yellow-500 border border-black absolute left-1.5 top-1.5"></div>
      )}

      {/* Combo indicator */}
      {isCombo && !event.isBookmarked && (
        <div className="w-2 h-2 bg-indigo-500 border border-black absolute left-1.5 top-1.5"></div>
      )}

      <div className={`text-left ${event.isBookmarked || isCombo ? 'pl-4 pr-5' : 'pr-5'}`}>
        <div className="font-space-grotesk font-semibold truncate leading-tight text-[10px]">{event.title}</div>
        {(event.timeWindow || event.time) && (
          <div className="text-[8px] mt-0.5 font-inter opacity-75">
            {event.timeWindow ? (
              // Display time window range
              `${new Date(`2000-01-01T${event.timeWindow.startTime}`).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })} - ${new Date(`2000-01-01T${event.timeWindow.endTime}`).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}`
            ) : (
              // Display single time
              new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })
            )}
          </div>
        )}
      </div>
    </button>
  );
}