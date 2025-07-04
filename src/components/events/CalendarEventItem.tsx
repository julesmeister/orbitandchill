/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * CalendarEventItem Component
 * 
 * Compact event display component for calendar view
 */

import React from 'react';
import { RARITY_BADGES } from '../../utils/astrological/eventData';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';

interface CalendarEventItemProps {
  event: AstrologicalEvent;
}

export default function CalendarEventItem({ event }: CalendarEventItemProps) {
  return (
    <div
      key={event.id}
      className="flex items-center gap-3 p-3 border border-black bg-gray-50"
    >
      <span className="text-2xl">{event.emoji}</span>
      <div className="flex-1">
        <p className="font-space-grotesk font-semibold text-black">
          {event.name}
        </p>
        <p className="font-inter text-sm text-black/60">
          {event.type} • {RARITY_BADGES[event.rarity].text}
        </p>
      </div>
    </div>
  );
}