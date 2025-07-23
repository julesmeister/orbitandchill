 
/**
 * CalendarEventItem Component
 * 
 * Compact event display component for calendar view
 */

import * as React from 'react';
import { useState } from 'react';
import { RARITY_BADGES } from '../../utils/astrological/eventData';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';
import { hasEventInterpretation } from '../../utils/astrological/eventInterpretations';
import EventModal from './EventModal';
import { formatDurationBetweenDates } from '../../utils/dateFormatting';

interface CalendarEventItemProps {
  event: AstrologicalEvent;
}

export default function CalendarEventItem({ event }: CalendarEventItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if this event has detailed interpretations
  const hasInterpretation = hasEventInterpretation(event.type, event.name);
  
  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 p-3 border border-black bg-gray-50 transition-all duration-200 ${
          hasInterpretation ? 'cursor-pointer hover:bg-gray-100 hover:scale-[1.01]' : ''
        }`}
        onClick={hasInterpretation ? () => setIsModalOpen(true) : undefined}
      >
        <span className="text-2xl">{event.emoji}</span>
        <div className="flex-1">
          <p className="font-space-grotesk font-semibold text-black">
            {event.name}
          </p>
          <p className="font-open-sans text-sm text-black/60">
            {RARITY_BADGES[event.rarity].text}
            {event.startDate && event.endDate && (
              <span>
                {' • '}
                {formatDurationBetweenDates(event.startDate, event.endDate)}
                {event.duration?.isOngoing && ' ongoing'}
              </span>
            )}
          </p>
        </div>
        {event.duration?.isOngoing && (
          <>
            {/* Show "Ends" badge if this is the end date */}
            {event.endDate && 
             new Date(event.endDate).toDateString() === new Date(event.date).toDateString() && (
              <span className="px-2 py-1 text-xs bg-red-600 text-white">
                Ends Today
              </span>
            )}
            
            {/* Show "Started" badge if this is an ongoing event (not ending today) */}
            {event.startDate && 
             new Date(event.startDate).toDateString() !== new Date(event.date).toDateString() &&
             !(event.endDate && new Date(event.endDate).toDateString() === new Date(event.date).toDateString()) && (
              <span className="px-2 py-1 text-xs bg-black text-white">
                Started {new Date(event.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  timeZone: 'UTC'
                })}
              </span>
            )}
          </>
        )}
      </div>
      
      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}