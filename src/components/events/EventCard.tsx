/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * EventCard Component
 * 
 * Reusable component for displaying individual astrological events
 * with consistent styling and countdown functionality.
 */

import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { EVENT_TYPE_COLORS, RARITY_BADGES } from '../../utils/astrological/eventData';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';
import { hasEventInterpretation } from '../../utils/astrological/eventInterpretations';
import EventModal from './EventModal';

interface EventCardProps {
  event: AstrologicalEvent;
  showCountdown?: boolean;
  countdown?: string;
}

export default function EventCard({ event, showCountdown = false, countdown }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if event is in the past (but not for ongoing transits)
  const now = new Date();
  const isPastEvent = event.type !== 'planetInSign' && 
                     event.date < now && 
                     Math.abs(event.date.getTime() - now.getTime()) > 60000; // More than 1 minute ago
  
  // Check if this event has detailed interpretations
  const hasInterpretation = hasEventInterpretation(event.type, event.name);
  
  return (
    <div className="relative">
      <div
        className={`border border-black bg-white transition-all duration-300 overflow-hidden ${
          hasInterpretation ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : 'hover:shadow-lg'
        }`}
        onClick={hasInterpretation ? () => setIsModalOpen(true) : undefined}
      >
        <div 
          className="h-2" 
          style={{ backgroundColor: isPastEvent ? '#6b7280' : EVENT_TYPE_COLORS[event.type] }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{event.emoji}</span>
              <div>
                <h3 className="font-space-grotesk font-bold text-xl text-black">
                  {event.name}
                </h3>
                <p className="font-open-sans text-sm text-black/60">
                  {event.type === 'planetInSign' && event.startDate 
                    ? format(event.startDate, 'EEEE, MMMM d, yyyy') 
                    : format(event.date, 'EEEE, MMMM d, yyyy')
                  }
                </p>
              </div>
            </div>
            <span 
              className="px-3 py-1 text-xs font-open-sans font-semibold text-white rounded-full"
              style={{ backgroundColor: RARITY_BADGES[event.rarity].color }}
            >
              {RARITY_BADGES[event.rarity].text}
            </span>
          </div>
          
          <p className="font-open-sans text-black/80 mb-4">
            {event.description}
          </p>
          
          <div className="space-y-2">
            <p className="font-open-sans text-sm text-black/60">
              <strong>Impact:</strong> {event.impact}
            </p>
            
            {showCountdown && countdown && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                {/* Only show countdown for non-ongoing events */}
                {event.type !== 'planetInSign' && (
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm text-black/60">Time until event:</span>
                    <span className="font-space-grotesk font-bold text-lg text-black">
                      {countdown}
                    </span>
                  </div>
                )}
                
                {/* Show duration information */}
                {event.duration && (
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm text-black/60">Duration:</span>
                    <span className="font-space-grotesk font-semibold text-sm text-black/80">
                      {event.duration.hours && `${event.duration.hours}h`}
                      {event.duration.days && `${event.duration.days}d`}
                      {event.duration.weeks && `${event.duration.weeks}w`}
                      {event.duration.months && `${event.duration.months}m`}
                      {event.duration.years && `${event.duration.years}y`}
                      {event.duration.isOngoing && ' (ongoing)'}
                    </span>
                  </div>
                )}
                
                {/* Show end date if available */}
                {event.endDate && (
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm text-black/60">Ends:</span>
                    <span className="font-open-sans text-sm text-black/80">
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const endYear = event.endDate.getFullYear();
                        
                        // If end date is this year, don't show year
                        if (endYear === currentYear) {
                          return format(event.endDate, 'MMM d, h:mm a');
                        }
                        // If end date is next year, show year
                        else {
                          return format(event.endDate, 'MMM d, yyyy');
                        }
                      })()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
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