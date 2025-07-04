/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * EventCard Component
 * 
 * Reusable component for displaying individual astrological events
 * with consistent styling and countdown functionality.
 */

import React from 'react';
import { format } from 'date-fns';
import { EVENT_TYPE_COLORS, RARITY_BADGES } from '../../utils/astrological/eventData';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';

interface EventCardProps {
  event: AstrologicalEvent;
  showCountdown?: boolean;
  countdown?: string;
}

export default function EventCard({ event, showCountdown = false, countdown }: EventCardProps) {
  return (
    <div
      key={event.id}
      className="border border-black bg-white hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div 
        className="h-2" 
        style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{event.emoji}</span>
            <div>
              <h3 className="font-space-grotesk font-bold text-xl text-black">
                {event.name}
              </h3>
              <p className="font-inter text-sm text-black/60">
                {format(event.date, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <span 
            className="px-3 py-1 text-xs font-inter font-semibold text-white rounded-full"
            style={{ backgroundColor: RARITY_BADGES[event.rarity].color }}
          >
            {RARITY_BADGES[event.rarity].text}
          </span>
        </div>
        
        <p className="font-inter text-black/80 mb-4">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <p className="font-inter text-sm text-black/60">
            <strong>Impact:</strong> {event.impact}
          </p>
          
          {showCountdown && countdown && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-inter text-sm text-black/60">Time until event:</span>
              <span className="font-space-grotesk font-bold text-lg text-black">
                {countdown}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}