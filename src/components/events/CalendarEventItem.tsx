/* eslint-disable @typescript-eslint/no-unused-vars */
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
            {event.duration && (
              <span>
                {' • '}
                {event.duration.hours && `${event.duration.hours}h`}
                {event.duration.days && `${event.duration.days}d`}
                {event.duration.weeks && `${event.duration.weeks}w`}
                {event.duration.months && `${event.duration.months}m`}
                {event.duration.years && `${event.duration.years}y`}
                {event.duration.isOngoing && ' ongoing'}
              </span>
            )}
          </p>
        </div>
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