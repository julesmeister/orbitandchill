/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import { DailyAspect } from '../../hooks/useDailyAspects';
import { CalendarDay as CalendarDayType } from './utils/calendarUtils';
import ScoreTooltip from '../reusable/ScoreTooltip';
import EventItem from './EventItem';
import AspectItem from './AspectItem';

interface CalendarDayProps {
  day: CalendarDayType;
  index: number;
  showAspects: boolean;
  handleEventClick: (event: AstrologicalEvent) => void;
  toggleBookmark: (eventId: string) => void;
}

export default function CalendarDay({ 
  day, 
  index, 
  showAspects, 
  handleEventClick, 
  toggleBookmark 
}: CalendarDayProps) {
  const isLastRow = Math.floor(index / 7) === 5;
  const isLastColumn = (index % 7) === 6;

  // Create a day tooltip component for showing events and aspects
  const DayTooltip = ({ children }: { children: React.ReactNode }) => {
    // Don't show day tooltip if there are events (they have their own tooltips)
    if (day.events.length > 0) {
      return <>{children}</>;
    }

    // Don't show day tooltip if there are aspects (they have their own tooltips)
    if (day.dailyAspects.length > 0) {
      return <>{children}</>;
    }

    // Only show day tooltip if there are no events and no aspects
    if (day.events.length === 0 && day.dailyAspects.length === 0) {
      return <>{children}</>;
    }

    const mockEvent: AstrologicalEvent = {
      id: `day-${day.date.getTime()}`,
      title: `Daily Overview - ${day.date.toLocaleDateString()}`,
      description: '',
      date: day.date.toISOString().split('T')[0],
      time: '',
      score: day.score,
      type: day.score >= 6 ? 'benefic' : day.score >= 4 ? 'neutral' : 'challenging',
      isBookmarked: false,
      isGenerated: true,
      aspects: day.dailyAspects.map(aspect => `${aspect.planets} ${aspect.aspect}`),
      planetaryPositions: day.dailyAspects.map(aspect => `${aspect.planets} in ${aspect.aspect} aspect`),
      timeWindow: undefined,
      createdAt: ''
    };

    return (
      <ScoreTooltip 
        event={mockEvent} 
        position="top" 
        simplified={true} 
        onToggleBookmark={() => {}}
      >
        {children}
      </ScoreTooltip>
    );
  };

  return (
    <DayTooltip>
      <div
        className={`relative min-h-[120px] p-3 transition-all duration-200 hover:bg-gray-50 ${
          day.isCurrentMonth ? 'bg-white' : 'bg-gray-100'
        } ${
          !isLastRow ? 'border-b' : ''
        } ${
          !isLastColumn ? 'border-r' : ''
        } border-black`}
        style={{
          backgroundColor: day.hasOptimalTiming ? '#fafffe' : (day.isCurrentMonth ? 'white' : '#f3f4f6')
        }}
      >
        <div className={`font-inter text-sm font-bold ${
          day.isCurrentMonth ? 'text-black' : 'text-black/40'
        } ${day.hasOptimalTiming ? 'text-green-800' : ''}`}>
          {day.date.getDate()}
        </div>
        {day.hasOptimalTiming && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-black animate-pulse"></div>
        )}
        
        {/* Events */}
        {day.events.map(event => (
          <EventItem
            key={event.id}
            event={event}
            handleEventClick={handleEventClick}
            toggleBookmark={toggleBookmark}
          />
        ))}
        
        {/* Daily Aspects as Event Entries */}
        {showAspects && day.dailyAspects.map((aspect, aspectIndex) => (
          <AspectItem
            key={`aspect-${aspectIndex}`}
            aspect={aspect}
            aspectIndex={aspectIndex}
            day={day.date}
          />
        ))}
      </div>
    </DayTooltip>
  );
}