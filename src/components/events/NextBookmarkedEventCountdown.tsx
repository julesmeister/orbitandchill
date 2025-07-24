"use client";

import React, { useState, useEffect } from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';

interface NextBookmarkedEventCountdownProps {
  events: AstrologicalEvent[];
  currentLocationData?: { name: string; coordinates: { lat: string; lon: string } } | null;
  birthLocationData?: { name: string; coordinates: { lat: string; lon: string } } | null;
  onEditLocation?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function NextBookmarkedEventCountdown({ 
  events, 
  currentLocationData, 
  birthLocationData, 
  onEditLocation 
}: NextBookmarkedEventCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [nextEvent, setNextEvent] = useState<AstrologicalEvent | null>(null);

  // Find the closest bookmarked event in the future
  const findNextBookmarkedEvent = (): AstrologicalEvent | null => {
    const now = new Date();
    
    // Filter bookmarked events that are in the future
    const futureBookmarkedEvents = events.filter(event => {
      if (!event.isBookmarked) return false;
      
      // Create event date
      const eventDateTime = new Date(event.date);
      if (event.time) {
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
      } else {
        // If no time specified, set to end of day to give full day
        eventDateTime.setHours(23, 59, 59, 999);
      }
      
      return eventDateTime > now;
    });
    
    if (futureBookmarkedEvents.length === 0) return null;
    
    // Sort by date and return the closest one
    return futureBookmarkedEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (a.time) {
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        dateA.setHours(hoursA, minutesA, 0, 0);
      }
      
      if (b.time) {
        const [hoursB, minutesB] = b.time.split(':').map(Number);
        dateB.setHours(hoursB, minutesB, 0, 0);
      }
      
      return dateA.getTime() - dateB.getTime();
    })[0];
  };

  // Calculate time remaining
  const calculateTimeRemaining = (targetEvent: AstrologicalEvent): TimeRemaining => {
    const now = new Date();
    const eventDateTime = new Date(targetEvent.date);
    
    if (targetEvent.time) {
      const [hours, minutes] = targetEvent.time.split(':').map(Number);
      eventDateTime.setHours(hours, minutes, 0, 0);
    } else {
      // If no time specified, set to start of day
      eventDateTime.setHours(0, 0, 0, 0);
    }
    
    const difference = eventDateTime.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const nextBookmarkedEvent = findNextBookmarkedEvent();
      setNextEvent(nextBookmarkedEvent);
      
      if (nextBookmarkedEvent) {
        const remaining = calculateTimeRemaining(nextBookmarkedEvent);
        setTimeRemaining(remaining);
      } else {
        setTimeRemaining(null);
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [events]);

  // Don't render if no upcoming bookmarked events
  if (!nextEvent || !timeRemaining) {
    return null;
  }

  const formatTimeUnit = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const getEventTypeIcon = (event: AstrologicalEvent) => {
    if (event.type === 'benefic') return '✨';
    if (event.type === 'challenging') return '⚠️';
    return '📅';
  };

  const getTimeDisplay = () => {
    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${formatTimeUnit(days, 'day')}, ${formatTimeUnit(hours, 'hour')}`;
    } else if (hours > 0) {
      return `${formatTimeUnit(hours, 'hour')}, ${formatTimeUnit(minutes, 'minute')}`;
    } else if (minutes > 0) {
      return `${formatTimeUnit(minutes, 'minute')}, ${formatTimeUnit(seconds, 'second')}`;
    } else {
      return `${formatTimeUnit(seconds, 'second')}`;
    }
  };

  return (
    <div className="border border-black p-4" style={{ backgroundColor: '#f0e3ff' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getEventTypeIcon(nextEvent)}</span>
        <span className="text-xs font-semibold text-black uppercase tracking-wider">
          Next Event
        </span>
      </div>
      
      <div className="text-left">
        <h4 className="font-space-grotesk font-medium text-black text-sm mb-1">
          {nextEvent.title}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-black/70">
          <span>⏰</span>
          <span className="font-open-sans">
            in <span className="font-medium text-black">{getTimeDisplay()}</span>
          </span>
        </div>
        
        {nextEvent.time && (
          <div className="flex items-center gap-2 text-xs text-black/60 mt-1">
            <span>📅</span>
            <span className="font-open-sans">
              {new Date(nextEvent.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })} at {nextEvent.time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}