/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import { DailyAspect } from '../../hooks/useDailyAspects';
import ScoreTooltip from '../reusable/ScoreTooltip';
import { getAspectStyling } from './utils/calendarUtils';

interface AspectItemProps {
  aspect: DailyAspect;
  aspectIndex: number;
  day: Date;
}

export default function AspectItem({ aspect, aspectIndex, day }: AspectItemProps) {
  const aspectStyling = getAspectStyling(aspect);

  // Create a mock event for the aspect to use with ScoreTooltip
  const aspectAsEvent: AstrologicalEvent = {
    id: `aspect-${day.getTime()}-${aspectIndex}`,
    title: `${aspect.planets} ${aspect.aspect}`,
    description: `${aspect.interpretation}${
      aspect.isAllDay 
        ? ' (Active all day)' 
        : aspect.startTime && aspect.endTime 
        ? ` (Active ${aspect.startTime} - ${aspect.endTime})`
        : aspect.exactTime
        ? ` (Peak at ${aspect.exactTime})`
        : ''
    }`,
    date: day.toISOString().split('T')[0],
    time: aspect.exactTime || '',
    score: aspect.type === 'harmonious' ? 7 : aspect.type === 'challenging' ? 3 : 5,
    type: aspect.type === 'harmonious' ? 'benefic' : aspect.type === 'challenging' ? 'challenging' : 'neutral',
    isBookmarked: false,
    isGenerated: true,
    aspects: [`${aspect.planets} ${aspect.aspect}`],
    planetaryPositions: [`${aspect.planets} in ${aspect.aspect} aspect (${aspect.strength}% strength)`],
    timeWindow: aspect.startTime && aspect.endTime ? {
      startTime: aspect.startTime,
      endTime: aspect.endTime,
      duration: aspect.isAllDay ? 'All day' : 'Variable'
    } : undefined,
    createdAt: ''
  };

  return (
    <div key={`aspect-${aspectIndex}`} className="relative z-40">
      <ScoreTooltip 
        event={aspectAsEvent} 
        position="right" 
        simplified={true} 
        onToggleBookmark={undefined}
      >
        <div
          className={`w-full mt-2 text-xs px-2 py-1.5 font-medium transition-all duration-200 cursor-help relative flex items-center border border-black ${aspectStyling.text} ${aspectStyling.hover}`}
          style={{ backgroundColor: aspectStyling.bgColor }}
        >
          {/* Aspect type indicator - now properly centered */}
          <div className="flex-shrink-0 mr-2">
            <div className={`w-3 h-3 flex items-center justify-center text-[6px] font-bold text-white border border-black ${
              aspect.type === 'harmonious' ? 'bg-green-500' :
              aspect.type === 'challenging' ? 'bg-orange-500' :
              'bg-indigo-500'
            }`}>
              {aspect.type === 'harmonious' ? '△' : aspect.type === 'challenging' ? '□' : '○'}
            </div>
          </div>

          {/* Aspect text with time info */}
          <div className="flex-1 min-w-0">
            <div className="font-space-grotesk font-semibold truncate leading-tight text-[9px]">
              {aspect.planets} {aspect.aspect}
            </div>
            {/* Show time info if not all-day */}
            {!aspect.isAllDay && aspect.exactTime && (
              <div className="text-[8px] font-inter opacity-75 truncate">
                {aspect.startTime && aspect.endTime ? (
                  <span>{aspect.startTime} - {aspect.endTime}</span>
                ) : aspect.exactTime ? (
                  <span>Peak: {aspect.exactTime}</span>
                ) : null}
              </div>
            )}
            {/* All-day indicator */}
            {aspect.isAllDay && (
              <div className="text-[8px] font-inter opacity-75">
                All day • {aspect.strength}% strength
              </div>
            )}
          </div>
        </div>
      </ScoreTooltip>
    </div>
  );
}